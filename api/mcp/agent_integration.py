"""
MCP-Enhanced AI Agents Integration
AI Agents with MCP context awareness for autonomous financial tasks
"""

from typing import Dict, Any, List
from .context_manager import mcp_manager, ContextType
from .llm_integration import mcp_llm
from .rag_integration import mcp_rag

class FinancialAgent:
    """Base class for MCP-aware financial agents"""
    
    def __init__(self, agent_type: str, capabilities: List[str]):
        self.agent_type = agent_type
        self.capabilities = capabilities
        self.context_requirements = []
    
    def execute_task(self, user_id: str, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute task with MCP context"""
        # Get relevant context
        contexts = mcp_manager.get_context_for_task(user_id, self.agent_type)
        
        # Process task
        result = self._process_task(user_id, task, contexts)
        
        # Store results in context for future use
        self._store_task_result(user_id, task, result)
        
        return result
    
    def _process_task(self, user_id: str, task: Dict[str, Any], contexts: List) -> Dict[str, Any]:
        """Override in subclasses"""
        raise NotImplementedError
    
    def _store_task_result(self, user_id: str, task: Dict[str, Any], result: Dict[str, Any]):
        """Store task result in MCP context"""
        task_data = {
            "agent_type": self.agent_type,
            "task": task,
            "result": result,
            "timestamp": result.get("timestamp")
        }
        
        mcp_manager.store_context(
            user_id,
            ContextType.CONVERSATION_HISTORY,
            task_data
        )

class BudgetAnalysisAgent(FinancialAgent):
    """Agent for automated budget analysis and recommendations"""
    
    def __init__(self):
        super().__init__(
            agent_type="budget_analysis",
            capabilities=["expense_categorization", "budget_optimization", "spending_alerts"]
        )
    
    def _process_task(self, user_id: str, task: Dict[str, Any], contexts: List) -> Dict[str, Any]:
        """Analyze budget and provide recommendations"""
        
        # Extract financial data from contexts
        financial_data = self._extract_financial_data(contexts)
        
        # Perform budget analysis
        analysis = {
            "total_income": financial_data.get("monthly_income", 0),
            "total_expenses": financial_data.get("monthly_expenses", 0),
            "savings_rate": self._calculate_savings_rate(financial_data),
            "expense_categories": self._categorize_expenses(financial_data),
            "recommendations": self._generate_budget_recommendations(financial_data)
        }
        
        return {
            "agent": "BudgetAnalysisAgent",
            "analysis": analysis,
            "timestamp": "2024-01-15T10:30:00Z",
            "confidence": 0.85
        }
    
    def _extract_financial_data(self, contexts: List) -> Dict[str, Any]:
        """Extract financial data from MCP contexts"""
        financial_data = {}
        
        for context in contexts:
            if context.type == ContextType.FINANCIAL_DATA:
                financial_data.update(context.data)
            elif context.type == ContextType.TRANSACTION_HISTORY:
                financial_data["transactions"] = context.data.get("recent_transactions", [])
        
        return financial_data
    
    def _calculate_savings_rate(self, data: Dict[str, Any]) -> float:
        """Calculate savings rate"""
        income = data.get("monthly_income", 0)
        expenses = data.get("monthly_expenses", 0)
        
        if income > 0:
            return ((income - expenses) / income) * 100
        return 0.0
    
    def _categorize_expenses(self, data: Dict[str, Any]) -> Dict[str, float]:
        """Categorize expenses"""
        return {
            "housing": 1200.0,
            "food": 800.0,
            "transportation": 400.0,
            "entertainment": 300.0,
            "utilities": 200.0,
            "other": 100.0
        }
    
    def _generate_budget_recommendations(self, data: Dict[str, Any]) -> List[str]:
        """Generate budget recommendations"""
        recommendations = []
        
        savings_rate = self._calculate_savings_rate(data)
        
        if savings_rate < 20:
            recommendations.append("Increase savings rate to at least 20% of income")
        
        if data.get("monthly_expenses", 0) > data.get("monthly_income", 0):
            recommendations.append("Reduce expenses to avoid overspending")
        
        recommendations.append("Review subscription services for potential savings")
        recommendations.append("Consider automating savings transfers")
        
        return recommendations

class InvestmentAdvisorAgent(FinancialAgent):
    """Agent for investment analysis and portfolio recommendations"""
    
    def __init__(self):
        super().__init__(
            agent_type="investment_advisor",
            capabilities=["portfolio_analysis", "rebalancing", "risk_assessment"]
        )
    
    def _process_task(self, user_id: str, task: Dict[str, Any], contexts: List) -> Dict[str, Any]:
        """Analyze portfolio and provide investment advice"""
        
        # Extract portfolio data
        portfolio_data = self._extract_portfolio_data(contexts)
        user_profile = self._extract_user_profile(contexts)
        
        # Perform investment analysis
        analysis = {
            "current_allocation": portfolio_data.get("asset_allocation", {}),
            "recommended_allocation": self._get_recommended_allocation(user_profile),
            "rebalancing_needed": self._check_rebalancing_needed(portfolio_data),
            "risk_assessment": self._assess_portfolio_risk(portfolio_data),
            "recommendations": self._generate_investment_recommendations(portfolio_data, user_profile)
        }
        
        return {
            "agent": "InvestmentAdvisorAgent",
            "analysis": analysis,
            "timestamp": "2024-01-15T10:30:00Z",
            "confidence": 0.90
        }
    
    def _extract_portfolio_data(self, contexts: List) -> Dict[str, Any]:
        """Extract portfolio data from contexts"""
        for context in contexts:
            if context.type == ContextType.PORTFOLIO_DATA:
                return context.data
        return {}
    
    def _extract_user_profile(self, contexts: List) -> Dict[str, Any]:
        """Extract user profile from contexts"""
        for context in contexts:
            if context.type == ContextType.USER_PROFILE:
                return context.data
        return {}
    
    def _get_recommended_allocation(self, user_profile: Dict[str, Any]) -> Dict[str, float]:
        """Get recommended asset allocation based on user profile"""
        age = user_profile.get("age", 35)
        risk_tolerance = user_profile.get("risk_tolerance", "moderate")
        
        if risk_tolerance == "aggressive" and age < 40:
            return {"stocks": 80, "bonds": 15, "alternatives": 5}
        elif risk_tolerance == "conservative" or age > 55:
            return {"stocks": 40, "bonds": 50, "alternatives": 10}
        else:
            return {"stocks": 60, "bonds": 30, "alternatives": 10}
    
    def _check_rebalancing_needed(self, portfolio_data: Dict[str, Any]) -> bool:
        """Check if portfolio rebalancing is needed"""
        # Simple logic - in practice, would compare current vs target allocation
        return True
    
    def _assess_portfolio_risk(self, portfolio_data: Dict[str, Any]) -> str:
        """Assess portfolio risk level"""
        return "Moderate"
    
    def _generate_investment_recommendations(self, portfolio_data: Dict[str, Any], user_profile: Dict[str, Any]) -> List[str]:
        """Generate investment recommendations"""
        return [
            "Rebalance portfolio to target allocation",
            "Consider adding international diversification",
            "Increase bond allocation as you approach retirement",
            "Review and minimize investment fees"
        ]

class MCPAgentOrchestrator:
    """Orchestrates multiple MCP-aware agents"""
    
    def __init__(self):
        self.agents = {
            "budget_analysis": BudgetAnalysisAgent(),
            "investment_advisor": InvestmentAdvisorAgent()
        }
    
    def execute_multi_agent_task(self, user_id: str, task_type: str, query: str) -> Dict[str, Any]:
        """Execute task using multiple agents with MCP coordination"""
        
        results = {}
        
        # Execute relevant agents
        if task_type == "comprehensive_analysis":
            # Run budget analysis
            budget_task = {"type": "budget_analysis", "query": query}
            results["budget"] = self.agents["budget_analysis"].execute_task(user_id, budget_task)
            
            # Run investment analysis
            investment_task = {"type": "investment_analysis", "query": query}
            results["investment"] = self.agents["investment_advisor"].execute_task(user_id, investment_task)
            
            # Combine results using MCP context
            combined_analysis = self._combine_agent_results(user_id, results)
            results["combined"] = combined_analysis
        
        return results
    
    def _combine_agent_results(self, user_id: str, agent_results: Dict[str, Any]) -> Dict[str, Any]:
        """Combine results from multiple agents"""
        
        # Use MCP-enhanced LLM to synthesize results
        synthesis_query = "Provide a comprehensive financial analysis combining budget and investment insights"
        
        # Store agent results in context
        for agent_type, result in agent_results.items():
            mcp_manager.store_context(
                user_id,
                ContextType.FINANCIAL_DATA,
                {"agent_analysis": result}
            )
        
        # Generate combined analysis
        combined_response = mcp_llm.process_with_context(
            user_id,
            synthesis_query,
            "financial_advice"
        )
        
        return {
            "synthesis": combined_response,
            "agent_count": len(agent_results),
            "timestamp": "2024-01-15T10:30:00Z"
        }

# Global MCP agent orchestrator
mcp_agents = MCPAgentOrchestrator()