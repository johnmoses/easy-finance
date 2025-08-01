"""
Model Context Protocol (MCP) Implementation for EasyFinance
Manages context flow between LLMs, RAG, and AI Agents
"""

import json
import time
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum

class ContextType(Enum):
    USER_PROFILE = "user_profile"
    FINANCIAL_DATA = "financial_data"
    TRANSACTION_HISTORY = "transaction_history"
    PORTFOLIO_DATA = "portfolio_data"
    MARKET_DATA = "market_data"
    CONVERSATION_HISTORY = "conversation_history"

@dataclass
class ContextItem:
    id: str
    type: ContextType
    data: Dict[str, Any]
    timestamp: float
    relevance_score: float = 0.0
    expires_at: Optional[float] = None

class MCPContextManager:
    """MCP Context Manager - Central hub for context orchestration"""
    
    def __init__(self):
        self.context_store: Dict[str, ContextItem] = {}
        self.user_sessions: Dict[str, List[str]] = {}
        self.context_rules: Dict[str, Any] = {
            "financial_advice": {
                "required": [ContextType.USER_PROFILE, ContextType.FINANCIAL_DATA],
                "optional": [ContextType.PORTFOLIO_DATA, ContextType.MARKET_DATA],
                "max_context_items": 10
            },
            "transaction_analysis": {
                "required": [ContextType.TRANSACTION_HISTORY],
                "optional": [ContextType.USER_PROFILE],
                "max_context_items": 20
            }
        }
    
    def store_context(self, user_id: str, context_type: ContextType, data: Dict[str, Any]) -> str:
        """Store context item"""
        context_id = f"{user_id}_{context_type.value}_{int(time.time())}"
        
        context_item = ContextItem(
            id=context_id,
            type=context_type,
            data=data,
            timestamp=time.time()
        )
        
        self.context_store[context_id] = context_item
        
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = []
        self.user_sessions[user_id].append(context_id)
        
        return context_id
    
    def get_context_for_task(self, user_id: str, task_type: str) -> List[ContextItem]:
        """Retrieve relevant context for a specific task"""
        if task_type not in self.context_rules:
            return []
        
        rules = self.context_rules[task_type]
        user_context_ids = self.user_sessions.get(user_id, [])
        
        user_contexts = [
            self.context_store[ctx_id] 
            for ctx_id in user_context_ids 
            if ctx_id in self.context_store
        ]
        
        required_contexts = [
            ctx for ctx in user_contexts 
            if ctx.type in rules["required"]
        ]
        
        optional_contexts = [
            ctx for ctx in user_contexts 
            if ctx.type in rules["optional"]
        ]
        
        all_contexts = required_contexts + optional_contexts
        all_contexts.sort(key=lambda x: x.timestamp, reverse=True)
        
        max_items = rules.get("max_context_items", 10)
        return all_contexts[:max_items]
    
    def format_context_for_llm(self, contexts: List[ContextItem]) -> str:
        """Format context for LLM consumption"""
        if not contexts:
            return "No relevant context available."
        
        formatted_sections = []
        
        for context in contexts:
            section = f"## {context.type.value.replace('_', ' ').title()}\n"
            section += json.dumps(context.data, indent=2)
            formatted_sections.append(section)
        
        return "\n\n".join(formatted_sections)

# Global MCP instance
mcp_manager = MCPContextManager()