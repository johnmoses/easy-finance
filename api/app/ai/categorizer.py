from app.extensions import llama_model
import logging

def auto_categorize_transaction(description: str) -> str:
    """Auto-categorize transaction using LLM"""
    if not llama_model:
        return fallback_categorize(description)
    
    categories = [
        'food', 'transport', 'entertainment', 'utilities', 'healthcare',
        'shopping', 'education', 'travel', 'insurance', 'investment',
        'salary', 'freelance', 'business', 'other'
    ]
    
    prompt = f"""Categorize this financial transaction into one of these categories: {', '.join(categories)}

Transaction description: "{description}"

Return only the category name, nothing else."""
    
    try:
        response = llama_model(prompt, max_tokens=10, temperature=0.1)
        category = response['choices'][0]['text'].strip().lower()
        
        if category in categories:
            return category
        return fallback_categorize(description)
    except Exception as e:
        logging.error(f"LLM categorization failed: {e}")
        return fallback_categorize(description)

def fallback_categorize(description: str) -> str:
    """Fallback rule-based categorization"""
    desc_lower = description.lower()
    
    if any(word in desc_lower for word in ['restaurant', 'food', 'grocery', 'cafe', 'pizza']):
        return 'food'
    elif any(word in desc_lower for word in ['uber', 'taxi', 'gas', 'fuel', 'parking']):
        return 'transport'
    elif any(word in desc_lower for word in ['movie', 'netflix', 'spotify', 'game']):
        return 'entertainment'
    elif any(word in desc_lower for word in ['electric', 'water', 'internet', 'phone']):
        return 'utilities'
    elif any(word in desc_lower for word in ['amazon', 'store', 'shop', 'purchase']):
        return 'shopping'
    elif any(word in desc_lower for word in ['salary', 'payroll', 'wage']):
        return 'salary'
    else:
        return 'other'