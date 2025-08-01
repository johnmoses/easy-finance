"""
MCP-Enhanced LLM Integration
Integrates MCP context management with LLM processing
"""

from typing import Dict, Any, Optional
from .context_manager import mcp_manager, ContextType

class MCPEnhancedLLM:
    """LLM with MCP context integration"""
    
    def __init__(self):
        self.system_prompts = {
            "financial_advisor": """You are a professional financial advisor AI assistant. 
Use the provided context to give personalized, accurate financial advice. 
Always consider the user's risk tolerance, goals, and current financial situation.""",
            
            "transaction_analyzer": """You are a financial transaction analysis expert.
Analyze the provided transaction data to identify patterns, categorize expenses, 
and provide insights about spending habits.""",
            
            "investment_advisor": """You are an investment advisory AI. 
Use the portfolio and market context to provide investment recommendations 
tailored to the user's profile and goals."""
        }
    
    def process_with_context(self, user_id: str, query: str, task_type: str = "financial_advice") -> Dict[str, Any]:
        """Process query with MCP-managed context"""
        
        # Get relevant context from MCP
        contexts = mcp_manager.get_context_for_task(user_id, task_type)
        formatted_context = mcp_manager.format_context_for_llm(contexts)
        
        # Build enhanced prompt
        system_prompt = self.system_prompts.get(task_type, self.system_prompts["financial_advisor"])
        
        enhanced_prompt = f"""
{system_prompt}

## Context Information:
{formatted_context}

## User Query:
{query}

Please provide a helpful, personalized response based on the context provided.
"""
        
        # Simulate LLM processing (replace with actual LLM call)
        response = self._generate_response(enhanced_prompt, task_type)
        
        # Store conversation in context for future reference
        conversation_data = {
            "query": query,
            "response": response,
            "task_type": task_type
        }
        
        mcp_manager.store_context(
            user_id, 
            ContextType.CONVERSATION_HISTORY, 
            conversation_data
        )
        
        return {
            "response": response,
            "context_used": len(contexts),
            "task_type": task_type
        }
    
    def _generate_response(self, prompt: str, task_type: str) -> str:
        """Generate LLM response (mock implementation)"""
        
        if "investment" in task_type.lower():
            return """Based on your portfolio and risk profile, I recommend:
1. Diversifying across asset classes (60% stocks, 30% bonds, 10% alternatives)
2. Consider low-cost index funds for core holdings
3. Rebalance quarterly to maintain target allocation
4. Keep 3-6 months expenses in emergency fund before investing more"""
        
        elif "transaction" in task_type.lower():
            return """Your spending analysis shows:
1. Largest category: Food & Dining (32% of expenses)
2. Opportunity: Reduce subscription services by $150/month
3. Trend: Spending increased 15% vs last month
4. Recommendation: Set up automatic savings of 20% of income"""
        
        else:
            return """Based on your financial profile:
1. You're on track with your savings goals
2. Consider increasing emergency fund to 6 months expenses
3. Your debt-to-income ratio is healthy at 15%
4. Explore tax-advantaged retirement accounts for additional savings"""

# Global MCP-enhanced LLM instance
mcp_llm = MCPEnhancedLLM()