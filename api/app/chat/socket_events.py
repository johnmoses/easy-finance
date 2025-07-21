from flask_jwt_extended import decode_token
from flask_socketio import emit, join_room, leave_room
from app.extensions import socketio, db
from app.chat.models import ChatMessage
from datetime import datetime
from app.llm.model import get_llm
from app.llm.prompts import build_prompt

@socketio.on("join")
def on_join(data):
    token = data.get("token")
    room = data.get("room")
    if not token or not room:
        emit("error", {"msg": "Token and room required"})
        return
    try:
        user_id = decode_token(token)["sub"]
    except Exception:
        emit("error", {"msg": "Invalid token"})
        return
    join_room(room)
    emit("status", {"msg": f"User {user_id} joined the room."}, room=room)

@socketio.on("leave")
def on_leave(data):
    token = data.get("token")
    room = data.get("room")
    if not token or not room:
        emit("error", {"msg": "Token and room required"})
        return
    try:
        user_id = decode_token(token)["sub"]
    except Exception:
        emit("error", {"msg": "Invalid token"})
        return
    leave_room(room)
    emit("status", {"msg": f"User {user_id} left the room."}, room=room)

@socketio.on("send_message")
def on_message(data):
    token = data.get("token")
    room = data.get("room")
    message_text = data.get("message")
    if not token or not room or not message_text:
        emit("error", {"msg": "Token, room and message required"})
        return
    try:
        user_id = decode_token(token)["sub"]
    except Exception:
        emit("error", {"msg": "Invalid token"})
        return
    # Save message to DB (persist chat history)
    msg = ChatMessage(message=message_text, user_id=user_id, timestamp=datetime.utcnow())
    db.session.add(msg)
    db.session.commit()
    # Optionally generate a bot response here via LLM if desired
    # For now just broadcast message to room
    emit("receive_message", {
        "user_id": user_id, "message": message_text, "timestamp": msg.timestamp.isoformat()
    }, room=room)
