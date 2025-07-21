finance_keywords = {
    "stock", "price", "compare", "share", "market",
    "portfolio", "investment", "financial", "equity",
    "dividend", "bond", "crypto", "currency"
}

def is_finance_intent(text: str) -> bool:
    lowered = text.lower()
    return any(word in lowered for word in finance_keywords)
