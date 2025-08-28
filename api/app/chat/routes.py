from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.chat.models import ChatRoom, ChatMessage, ChatParticipant
from app.chat.schemas import (
    ChatRoomSchema, ChatMessageSchema
)
from app.extensions import db
from datetime import datetime
from app.auth.models import User
import logging
from app.extensions import init_embed_model, search_vectors
from app.agents.orchestrator import supervisor_agent
from app.billing.decorators import feature_required
from mcp.llm_integration import mcp_llm
from mcp.context_manager import mcp_manager, ContextType

logger = logging.getLogger(__name__)


chat_bp = Blueprint('chat', __name__)

chat_room_schema = ChatRoomSchema()
chat_rooms_schema = ChatRoomSchema(many=True)
chat_message_schema = ChatMessageSchema()
chat_messages_schema = ChatMessageSchema(many=True)


def get_or_create_finance_assistant():
    assistant = User.query.filter_by(username="finance_assistant").first()
    if assistant:
        return assistant

    assistant = User(username="finance_assistant", role="assistant", email="assistant@easyfinance.com")
    assistant.set_password("secure_assistant_password")
    try:
        db.session.add(assistant)
        db.session.commit()
    except Exception:
        db.session.rollback()
        assistant = User.query.filter_by(username="finance_assistant").first()
        if not assistant:
            raise
    return assistant

# --- Chat Room Endpoints ---

@chat_bp.route('/rooms', methods=['POST'])
@jwt_required()
def create_room():
    data = request.get_json() or {}
    errors = chat_room_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    current_user_id = get_jwt_identity()
    existing = ChatRoom.query.filter_by(name=data['name']).first()
    if existing:
        return jsonify({'msg': 'Room already exists.'}), 409
    room = ChatRoom(name=data['name'])
    db.session.add(room)
    db.session.commit()

    # Add creator as participant
    participant = ChatParticipant(room_id=room.id, user_id=current_user_id)
    db.session.add(participant)
    db.session.commit()
    room_data = chat_room_schema.dump(room)

    return jsonify(room_data), 201

@chat_bp.route('/rooms', methods=['GET'])
@jwt_required()
def list_rooms():
    rooms = ChatRoom.query.all()
    rooms_data = chat_rooms_schema.dump(rooms)
    return jsonify(rooms_data)

@chat_bp.route('/rooms/<int:room_id>/participants', methods=['POST'])
@jwt_required()
def join_room(room_id):
    current_user_id = get_jwt_identity()
    room = ChatRoom.query.get(room_id)
    if not room:
        return jsonify({'msg': 'Room not found.'}), 404
    existent = ChatParticipant.query.filter_by(room_id=room_id, user_id=current_user_id).first()
    if existent:
        return jsonify({'msg': 'Already a participant.'}), 409
    participant = ChatParticipant(room_id=room_id, user_id=current_user_id)
    db.session.add(participant)
    db.session.commit()
    return jsonify({'msg': 'Joined room successfully.'}), 200

# --- Chat Message Endpoints ---

@chat_bp.route('/rooms/<int:room_id>/messages', methods=['POST'])
@jwt_required()
def send_message(room_id):
    data = request.get_json() or {}
    current_user_id = get_jwt_identity()

    message_data = {
        'room_id': room_id,
        'sender_id': current_user_id,
        'content': data.get('content'),
        'role': data.get('role', 'other'),
        'is_ai': data.get('is_ai', False),
        'message_type': data.get('message_type', 'text'),
        'status': data.get('status', 'sent'),
    }

    errors = chat_message_schema.validate(message_data)
    if errors:
        return jsonify(errors), 400

    msg = ChatMessage(**message_data)
    db.session.add(msg)
    db.session.commit()
    msg_data = chat_message_schema.dump(msg)
    return jsonify(msg_data), 201

@chat_bp.route('/rooms/<int:room_id>/messages', methods=['GET'])
@jwt_required()
def get_room_messages(room_id):
    messages = ChatMessage.query.filter_by(room_id=room_id).order_by(ChatMessage.timestamp.asc()).all()
    messages_data = chat_messages_schema.dump(messages)
    return jsonify(messages_data)


@chat_bp.route("/rooms/<int:room_id>/post_message", methods=["POST"])
@jwt_required()
@feature_required('ai_chat')
def post_message_and_get_bot_reply(room_id):
    if not request.is_json:
        return jsonify({"error": "Invalid JSON."}), 400

    data = request.get_json()
    content = data.get("content")
    role = data.get("role")

    if role not in ["user", "advisor", "admin"]:
        return jsonify({"error": "Invalid role"}), 400
    if not content:
        return jsonify({"error": "Message content is required"}), 400

    room = ChatRoom.query.get(room_id)
    if not room:
        return jsonify({"error": "Chat room not found"}), 404

    user_id = get_jwt_identity()

    # Save user message to DB
    try:
        user_msg = ChatMessage(
            room_id=room_id,
            sender_id=user_id,
            content=content,
            role=role,
            timestamp=datetime.utcnow(),
        )
        db.session.add(user_msg)
        db.session.commit()
    except Exception as e:
        current_app.logger.error(f"Failed to save user message: {e}", exc_info=True)
        db.session.rollback()
        return jsonify({"error": "Failed to save message"}), 500

    # Gather recent conversation messages for context
    recent_msgs = ChatMessage.query.filter_by(room_id=room_id).order_by(ChatMessage.timestamp.desc()).limit(20).all()
    recent_msgs.reverse()

    conversation_context = {
        "user": "\n".join(m.content for m in recent_msgs if m.role == "user"),
        "advisor": "\n".join(m.content for m in recent_msgs if m.role == "advisor"),
        "admin": "\n".join(m.content for m in recent_msgs if m.role == "admin"),
        "assistant": "\n".join(m.content for m in recent_msgs if m.role == "assistant"),
    }
    context_text = "\n\n".join(f"{role} messages:\n{msgs}" for role, msgs in conversation_context.items() if msgs)

    # Retrieve RAG context
    try:
        embedding_model = init_embed_model()
        embedding_vector = embedding_model.encode(content).tolist()
        docs = search_vectors(embedding_vector, top_k=5)
        rag_context = "\n".join(r['text'] for r in docs[0]) if docs and docs[0] else "No additional context available."
    except Exception as e:
        current_app.logger.error(f"RAG retrieval failed: {e}", exc_info=True)
        rag_context = "No additional context available."

    combined_context = f"{context_text}\n\nRelevant Documents:\n{rag_context}"

    try:
        llm_response = supervisor_agent(content, combined_context)

        chunks = []
        for chunk in llm_response:
            if chunk:
                current_app.logger.debug(f"Streaming token: {chunk}")
                chunks.append(chunk)
        bot_reply_text = ''.join(chunks).strip()
    except Exception as e:
        current_app.logger.error(f"LLM generation failed: {e}", exc_info=True)
        bot_reply_text = "Sorry, I couldn't process your financial query at the moment."

    if not bot_reply_text:
        bot_reply_text = "I'm here to help you with your financial questions and planning."

    # Save bot reply
    try:
        assistant = get_or_create_finance_assistant()
        bot_msg = ChatMessage(
            room_id=room_id,
            sender_id=assistant.id,
            content=bot_reply_text,
            role="assistant",
            timestamp=datetime.utcnow(),
        )
        db.session.add(bot_msg)
        db.session.commit()
    except Exception as e:
        current_app.logger.error(f"Failed to save bot message: {e}", exc_info=True)
        db.session.rollback()

    messages = ChatMessage.query.filter_by(room_id=room_id).order_by(ChatMessage.timestamp.asc()).all()
    conversation = chat_messages_schema.dump(messages)

    current_app.logger.info(f"Sending bot reply to client: {repr(bot_reply_text)}")

    return jsonify({
        "bot_reply": bot_reply_text,
        "conversation": conversation,
    })

@chat_bp.route('/support-chat', methods=['POST'])
@jwt_required()
def support_chat():
    """Chat with MCP-enhanced LLM for support"""
    user_id = str(get_jwt_identity())
    data = request.get_json()
    
    query = data.get('message', '')
    task_type = 'support_chat'
    
    if not query:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        mcp_manager.store_context(
            user_id,
            ContextType.CONVERSATION_HISTORY,
            {"user_query": query, "timestamp": "2024-01-15T10:30:00Z"}
        )
        
        response = mcp_llm.process_with_context(user_id, query, task_type)
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/ai-chat', methods=['POST'])
@jwt_required()
def ai_chat():
    """Chat with MCP-enhanced LLM for general financial advice"""
    user_id = str(get_jwt_identity())
    data = request.get_json()
    
    query = data.get('message', '')
    task_type = 'financial_advice'
    
    if not query:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        mcp_manager.store_context(
            user_id,
            ContextType.CONVERSATION_HISTORY,
            {"user_query": query, "timestamp": "2024-01-15T10:30:00Z"}
        )
        
        response = mcp_llm.process_with_context(user_id, query, task_type)
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
