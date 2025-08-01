from flask import current_app
from app.agents.multi_agents import AGENTS
from typing import Dict, List, Tuple
import re

# Enhanced intent classification with weighted scoring
INTENT_KEYWORDS = {
    "account": {
        "primary": ["balance", "account", "checking", "savings", "deposit", "withdraw"],
        "secondary": ["transaction", "transfer", "bank", "atm", "card"]
    },
    "investment": {
        "primary": ["invest", "portfolio", "stock", "shares", "dividend", "etf"],
        "secondary": ["trading", "market", "buy", "sell", "profit", "loss"]
    },
    "crypto": {
        "primary": ["crypto", "bitcoin", "ethereum", "defi", "nft", "blockchain"],
        "secondary": ["btc", "eth", "wallet", "mining", "yield", "staking"]
    },
    "billing": {
        "primary": ["budget", "expense", "spending", "cost", "bill"],
        "secondary": ["payment", "invoice", "receipt", "category", "track"]
    },
    "lending": {
        "primary": ["loan", "credit", "mortgage", "debt", "borrow"],
        "secondary": ["interest", "rate", "payment", "refinance", "score"]
    }
}

def calculate_intent_score(user_query: str, intent: str) -> float:
    """Calculate confidence score for an intent based on keyword matching"""
    lower_query = user_query.lower()
    keywords = INTENT_KEYWORDS.get(intent, {"primary": [], "secondary": []})
    
    score = 0.0
    
    # Primary keywords have higher weight
    for keyword in keywords["primary"]:
        if keyword in lower_query:
            score += 2.0
    
    # Secondary keywords have lower weight
    for keyword in keywords["secondary"]:
        if keyword in lower_query:
            score += 1.0
    
    return score

def classify_intent(user_query: str) -> str:
    """Enhanced intent classification with confidence scoring"""
    if not user_query or len(user_query.strip()) == 0:
        return "fallback"
    
    # Calculate scores for all intents
    intent_scores = {}
    for intent in INTENT_KEYWORDS.keys():
        intent_scores[intent] = calculate_intent_score(user_query, intent)
    
    # Find the intent with highest score
    best_intent = max(intent_scores, key=intent_scores.get)
    best_score = intent_scores[best_intent]
    
    # If no strong match found, use fallback
    if best_score < 1.0:
        return "fallback"
    
    # Special handling for crypto vs investment overlap
    if best_intent == "investment" and intent_scores.get("crypto", 0) > 0:
        crypto_indicators = ["bitcoin", "btc", "ethereum", "eth", "crypto", "defi", "nft"]
        if any(indicator in user_query.lower() for indicator in crypto_indicators):
            return "crypto"
    
    return best_intent

def get_context_summary(context: str) -> str:
    """Extract key information from context for better agent responses"""
    if not context:
        return ""
    
    # Extract key financial metrics if present
    summary_parts = []
    
    # Look for account balances
    balance_pattern = r'balance["\s]*:?["\s]*\$?([\d,]+\.?\d*)'
    balances = re.findall(balance_pattern, context.lower())
    if balances:
        summary_parts.append(f"Account balances: ${', $'.join(balances)}")
    
    # Look for transaction amounts
    amount_pattern = r'amount["\s]*:?["\s]*\$?([\d,]+\.?\d*)'
    amounts = re.findall(amount_pattern, context.lower())
    if amounts:
        summary_parts.append(f"Recent transactions: ${', $'.join(amounts[:3])}")
    
    # Limit context length for better processing
    if len(context) > 1000:
        context = context[:1000] + "..."
    
    if summary_parts:
        return f"Key Info: {'; '.join(summary_parts)}\n\nFull Context: {context}"
    
    return context

def supervisor_agent(user_query: str, context: str = "") -> str:
    """Enhanced supervisor agent with better routing and context handling"""
    try:
        # Classify user intent
        intent = classify_intent(user_query)
        current_app.logger.info(f"Query: '{user_query[:50]}...' -> Intent: {intent}")
        
        # Get appropriate agent
        agent = AGENTS.get(intent, AGENTS["fallback"])
        
        # Process context for better responses
        processed_context = get_context_summary(context)
        
        # Generate response
        response = agent.answer(user_query, processed_context)
        
        # Log successful interaction
        current_app.logger.info(f"Agent {intent} responded successfully")
        
        return response
        
    except Exception as e:
        current_app.logger.error(f"Supervisor agent error: {e}", exc_info=True)
        return "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question."

def get_available_agents() -> Dict[str, str]:
    """Return available agents and their descriptions"""
    return {
        "account": "Account management, balances, transactions",
        "investment": "Stock investments, portfolio management", 
        "crypto": "Cryptocurrency, DeFi, blockchain investments",
        "billing": "Budgeting, expense tracking, financial planning",
        "lending": "Loans, credit, debt management",
        "fallback": "General financial assistance"
    }

def route_to_specific_agent(agent_name: str, user_query: str, context: str = "") -> str:
    """Directly route to a specific agent (useful for testing or explicit routing)"""
    if agent_name not in AGENTS:
        return f"Agent '{agent_name}' not found. Available agents: {list(AGENTS.keys())}"
    
    agent = AGENTS[agent_name]
    processed_context = get_context_summary(context)
    
    try:
        return agent.answer(user_query, processed_context)
    except Exception as e:
        current_app.logger.error(f"Direct routing to {agent_name} failed: {e}")
        return f"Error processing request with {agent_name} agent. Please try again."
