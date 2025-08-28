"""
MCP API Routes - Expose MCP functionality via REST endpoints
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .context_manager import mcp_manager, ContextType
from .llm_integration import mcp_llm
from .rag_integration import mcp_rag
from .agent_integration import mcp_agents

mcp_bp = Blueprint('mcp', __name__, url_prefix='/api/mcp')

@mcp_bp.route('/context/store', methods=['POST'])
@jwt_required()
def store_context():
    """Store context data for user"""
    user_id = str(get_jwt_identity())
    data = request.get_json()
    
    try:
        context_type = ContextType(data.get('type'))
        context_data = data.get('data', {})
        
        context_id = mcp_manager.store_context(user_id, context_type, context_data)
        
        return jsonify({
            "context_id": context_id,
            "message": "Context stored successfully"
        }), 201
        
    except ValueError as e:
        return jsonify({"error": f"Invalid context type: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mcp_bp.route('/llm/chat', methods=['POST'])
@jwt_required()
def mcp_enhanced_chat():
    """Chat with MCP-enhanced LLM"""
    user_id = str(get_jwt_identity())
    data = request.get_json()
    
    query = data.get('message', '')
    task_type = data.get('task_type', 'financial_advice')
    
    if not query:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        # Store user query in context
        mcp_manager.store_context(
            user_id,
            ContextType.CONVERSATION_HISTORY,
            {"user_query": query, "timestamp": "2024-01-15T10:30:00Z"}
        )
        
        # Process with MCP-enhanced LLM
        response = mcp_llm.process_with_context(user_id, query, task_type)
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mcp_bp.route('/llm/support-chat', methods=['POST'])
@jwt_required()
def mcp_support_chat():
    """Chat with MCP-enhanced LLM for support"""
    user_id = str(get_jwt_identity())
    data = request.get_json()
    
    query = data.get('message', '')
    task_type = 'support_chat'  # Specific task type for support
    
    if not query:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        # Store user query in context
        mcp_manager.store_context(
            user_id,
            ContextType.CONVERSATION_HISTORY,
            {"user_query": query, "timestamp": "2024-01-15T10:30:00Z"}
        )
        
        # Process with MCP-enhanced LLM
        response = mcp_llm.process_with_context(user_id, query, task_type)
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mcp_bp.route('/rag/query', methods=['POST'])
@jwt_required()
def mcp_enhanced_rag():
    """Query with MCP-enhanced RAG"""
    user_id = str(get_jwt_identity())
    data = request.get_json()
    
    query = data.get('query', '')
    task_type = data.get('task_type', 'financial_advice')
    
    if not query:
        return jsonify({"error": "Query is required"}), 400
    
    try:
        response = mcp_rag.retrieve_with_context(user_id, query, task_type)
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mcp_bp.route('/agents/execute', methods=['POST'])
@jwt_required()
def execute_agent_task():
    """Execute task with MCP-aware agents"""
    user_id = str(get_jwt_identity())
    data = request.get_json()
    
    task_type = data.get('task_type', 'comprehensive_analysis')
    query = data.get('query', '')
    
    try:
        response = mcp_agents.execute_multi_agent_task(user_id, task_type, query)
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mcp_bp.route('/context/user/<user_id>', methods=['GET'])
@jwt_required()
def get_user_context():
    """Get user's context summary"""
    current_user_id = str(get_jwt_identity())
    
    # Only allow users to access their own context
    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    try:
        user_contexts = mcp_manager.user_sessions.get(user_id, [])
        context_summary = []
        
        for context_id in user_contexts[-10:]:  # Last 10 contexts
            if context_id in mcp_manager.context_store:
                context = mcp_manager.context_store[context_id]
                context_summary.append({
                    "id": context.id,
                    "type": context.type.value,
                    "timestamp": context.timestamp,
                    "relevance_score": context.relevance_score
                })
        
        return jsonify({
            "user_id": user_id,
            "total_contexts": len(user_contexts),
            "recent_contexts": context_summary
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mcp_bp.route('/health', methods=['GET'])
def mcp_health():
    """MCP system health check"""
    try:
        total_contexts = len(mcp_manager.context_store)
        active_users = len(mcp_manager.user_sessions)
        
        return jsonify({
            "status": "healthy",
            "total_contexts": total_contexts,
            "active_users": active_users,
            "components": {
                "context_manager": "operational",
                "llm_integration": "operational",
                "rag_integration": "operational",
                "agent_orchestrator": "operational"
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

# Auto-populate context helper
@mcp_bp.route('/context/auto-populate', methods=['POST'])
@jwt_required()
def auto_populate_context():
    """Auto-populate user context from existing data"""
    user_id = str(get_jwt_identity())
    
    try:
        # Mock user profile data (replace with actual DB queries)
        user_profile = {
            "username": "john_doe",
            "age": 35,
            "risk_tolerance": "moderate",
            "investment_goals": "retirement",
            "monthly_income": 8000
        }
        
        financial_data = {
            "total_assets": 150000,
            "total_liabilities": 50000,
            "net_worth": 100000,
            "savings_rate": 25.0,
            "emergency_fund": 24000
        }
        
        portfolio_data = {
            "total_value": 75000,
            "asset_allocation": {"stocks": 70, "bonds": 25, "cash": 5},
            "ytd_return": 8.5,
            "risk_score": "moderate"
        }
        
        # Store contexts
        contexts_created = []
        
        contexts_created.append(
            mcp_manager.store_context(user_id, ContextType.USER_PROFILE, user_profile)
        )
        
        contexts_created.append(
            mcp_manager.store_context(user_id, ContextType.FINANCIAL_DATA, financial_data)
        )
        
        contexts_created.append(
            mcp_manager.store_context(user_id, ContextType.PORTFOLIO_DATA, portfolio_data)
        )
        
        return jsonify({
            "message": "Context auto-populated successfully",
            "contexts_created": len(contexts_created),
            "context_ids": contexts_created
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500