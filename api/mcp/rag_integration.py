"""
MCP-Enhanced RAG Integration
Combines MCP context with RAG retrieval for enhanced responses
"""

from typing import List, Dict, Any
from .context_manager import mcp_manager, ContextType

class MCPEnhancedRAG:
    """RAG system with MCP context integration"""
    
    def __init__(self):
        # Mock knowledge base (replace with actual vector DB)
        self.knowledge_base = {
            "investment_strategies": [
                "Dollar-cost averaging reduces market timing risk",
                "Diversification across asset classes minimizes portfolio risk",
                "Index funds offer low-cost broad market exposure"
            ],
            "budgeting_tips": [
                "The 50/30/20 rule: 50% needs, 30% wants, 20% savings",
                "Track expenses for 30 days to identify spending patterns",
                "Automate savings to ensure consistent wealth building"
            ],
            "debt_management": [
                "Pay off high-interest debt first (avalanche method)",
                "Consider debt consolidation for multiple high-rate debts",
                "Maintain minimum payments while focusing on highest rate debt"
            ]
        }
    
    def retrieve_with_context(self, user_id: str, query: str, task_type: str = "financial_advice") -> Dict[str, Any]:
        """Retrieve relevant information using both RAG and MCP context"""
        
        # Get MCP context
        mcp_contexts = mcp_manager.get_context_for_task(user_id, task_type)
        
        # Retrieve from knowledge base
        relevant_docs = self._retrieve_documents(query)
        
        # Combine MCP context with RAG results
        combined_context = self._combine_contexts(mcp_contexts, relevant_docs, query)
        
        # Generate enhanced response
        response = self._generate_rag_response(combined_context, query)
        
        return {
            "response": response,
            "mcp_contexts_used": len(mcp_contexts),
            "documents_retrieved": len(relevant_docs),
            "combined_context": combined_context
        }
    
    def _retrieve_documents(self, query: str) -> List[str]:
        """Retrieve relevant documents from knowledge base"""
        query_lower = query.lower()
        relevant_docs = []
        
        # Simple keyword matching (replace with vector similarity)
        for category, docs in self.knowledge_base.items():
            for doc in docs:
                if any(word in doc.lower() for word in query_lower.split()):
                    relevant_docs.append(doc)
        
        return relevant_docs[:5]  # Limit to top 5
    
    def _combine_contexts(self, mcp_contexts: List, rag_docs: List[str], query: str) -> str:
        """Combine MCP context with RAG documents"""
        
        combined = "## Personal Financial Context:\n"
        if mcp_contexts:
            combined += mcp_manager.format_context_for_llm(mcp_contexts)
        else:
            combined += "No personal context available.\n"
        
        combined += "\n## Relevant Financial Knowledge:\n"
        for i, doc in enumerate(rag_docs, 1):
            combined += f"{i}. {doc}\n"
        
        if not rag_docs:
            combined += "No relevant documents found.\n"
        
        return combined
    
    def _generate_rag_response(self, context: str, query: str) -> str:
        """Generate response using combined context"""
        
        # Mock response generation (replace with actual LLM)
        if "investment" in query.lower():
            return f"""Based on your personal financial situation and best practices:

**Personalized Recommendation:**
Given your current portfolio and risk tolerance, consider implementing a diversified investment strategy.

**General Best Practices:**
- Dollar-cost averaging can help reduce timing risk
- Maintain proper asset allocation based on your age and goals
- Consider low-cost index funds for core holdings

**Next Steps:**
1. Review your current asset allocation
2. Rebalance if needed to match target allocation
3. Set up automatic investments to maintain consistency"""
        
        elif "budget" in query.lower():
            return f"""Based on your spending patterns and financial goals:

**Your Current Situation:**
Your transaction history shows opportunities for optimization in discretionary spending.

**Recommended Approach:**
- Apply the 50/30/20 rule to your current income
- Focus on tracking expenses in your highest spending categories
- Automate savings to ensure consistent progress toward goals

**Action Items:**
1. Set up automatic transfers to savings
2. Review and optimize recurring subscriptions
3. Track spending for 30 days to identify patterns"""
        
        else:
            return f"""Based on your financial profile and established best practices:

**Personalized Analysis:**
Your current financial health appears stable with room for optimization.

**Key Recommendations:**
1. Continue building emergency fund (target: 6 months expenses)
2. Maximize tax-advantaged retirement contributions
3. Consider diversifying investment portfolio
4. Review insurance coverage annually

**Next Steps:**
Schedule a quarterly financial review to track progress and adjust strategies as needed."""

# Global MCP-enhanced RAG instance
mcp_rag = MCPEnhancedRAG()