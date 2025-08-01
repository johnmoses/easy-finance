from app.extensions import llama_model
from typing import Optional
from flask import current_app
import logging

class BaseAgent:
    def __init__(self, system_prompt: str, max_tokens: int = 512, temperature: float = 0.7):
        self.system_prompt = system_prompt.strip()
        self.max_tokens = max_tokens
        self.temperature = temperature

    def build_prompt(self, user_query: str, context: Optional[str] = None) -> str:
        prompt_parts = [self.system_prompt]
        
        if context:
            prompt_parts.append(f"\nRelevant Information:\n{context.strip()}")
        
        prompt_parts.append(f"\nUser Question: {user_query.strip()}")
        prompt_parts.append("\nResponse:")
        
        return "\n".join(prompt_parts)

    def answer(self, user_query: str, context: Optional[str] = None) -> str:
        if not llama_model:
            return self.fallback_response(user_query)
        
        prompt = self.build_prompt(user_query, context)
        
        try:
            response = llama_model(
                prompt,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                stop=["\n\nUser:", "\n\nQuestion:", "\n\nContext:"]
            )
            
            if response and 'choices' in response and len(response['choices']) > 0:
                return response['choices'][0]['text'].strip()
            else:
                return self.fallback_response(user_query)
                
        except Exception as e:
            current_app.logger.error(f"LLM error in {self.__class__.__name__}: {e}")
            return self.fallback_response(user_query)
    
    def fallback_response(self, user_query: str) -> str:
        return "I'm here to help with your financial questions. Could you please provide more details?"


class AccountAgent(BaseAgent):
    def __init__(self, max_tokens=512):
        system_prompt = (
            "You are a personal finance assistant specializing in account management. "
            "Help users with checking accounts, savings accounts, credit cards, and account balances. "
            "Provide clear, actionable advice on account optimization and management."
        )
        super().__init__(system_prompt=system_prompt, max_tokens=max_tokens)
    
    def fallback_response(self, user_query: str) -> str:
        return "I can help you manage your accounts, check balances, and optimize your banking setup. What would you like to know?"


class InvestmentAgent(BaseAgent):
    def __init__(self, max_tokens=512):
        system_prompt = (
            "You are an investment advisor assistant. Provide guidance on stocks, bonds, ETFs, crypto, "
            "portfolio diversification, risk management, and investment strategies. "
            "Always remind users that this is educational information, not financial advice."
        )
        super().__init__(system_prompt=system_prompt, max_tokens=max_tokens)
    
    def fallback_response(self, user_query: str) -> str:
        return "I can help with investment strategies, portfolio analysis, and market insights. What investment topic interests you?"


class BudgetAgent(BaseAgent):
    def __init__(self, max_tokens=512):
        system_prompt = (
            "You are a budgeting and expense management expert. Help users create budgets, "
            "track expenses, identify spending patterns, and optimize their financial planning. "
            "Provide practical, actionable budgeting advice."
        )
        super().__init__(system_prompt=system_prompt, max_tokens=max_tokens)
    
    def fallback_response(self, user_query: str) -> str:
        return "I can help you create budgets, track expenses, and improve your spending habits. What budgeting challenge can I assist with?"


class CryptoAgent(BaseAgent):
    def __init__(self, max_tokens=512):
        system_prompt = (
            "You are a cryptocurrency and DeFi specialist. Provide guidance on crypto investments, "
            "DeFi protocols, yield farming, NFTs, and blockchain technology. "
            "Emphasize risk management and security best practices in crypto."
        )
        super().__init__(system_prompt=system_prompt, max_tokens=max_tokens)
    
    def fallback_response(self, user_query: str) -> str:
        return "I can help with cryptocurrency, DeFi strategies, and blockchain investments. What crypto topic would you like to explore?"


class LendingAgent(BaseAgent):
    def __init__(self, max_tokens=512):
        system_prompt = (
            "You are a lending and credit specialist. Help users understand loans, mortgages, "
            "credit scores, debt management, and borrowing strategies. "
            "Provide guidance on improving creditworthiness and managing debt responsibly."
        )
        super().__init__(system_prompt=system_prompt, max_tokens=max_tokens)
    
    def fallback_response(self, user_query: str) -> str:
        return "I can help with loans, credit management, and debt strategies. What lending topic can I assist you with?"


class FallbackAgent(BaseAgent):
    def __init__(self, max_tokens=512):
        system_prompt = (
            "You are EasyFinance AI Assistant, a comprehensive personal finance advisor. "
            "Help users with all aspects of personal finance including budgeting, investing, "
            "banking, crypto, and financial planning. Provide clear, practical, and actionable advice."
        )
        super().__init__(system_prompt=system_prompt, max_tokens=max_tokens)
    
    def fallback_response(self, user_query: str) -> str:
        return "I'm your EasyFinance AI Assistant. I can help with budgeting, investments, crypto, loans, and all your financial needs. How can I assist you today?"


# Instantiate finance-specific agents for reuse
AGENTS = {
    "account": AccountAgent(),
    "investment": InvestmentAgent(),
    "billing": BudgetAgent(),  # Maps to budget management
    "lending": LendingAgent(),
    "crypto": CryptoAgent(),
    "fallback": FallbackAgent(),
}
