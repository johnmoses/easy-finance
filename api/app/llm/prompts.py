from app.llm.intents import is_finance_intent

finance_prompt_template = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
You are a highly knowledgeable finance chatbot specialized in providing accurate stock prices, price comparisons, financial data, and investment advice. Use trustworthy sources and be clear and concise.

### Input:
{user_input}

### Response:
"""

general_prompt_template = """<s>[INST] <<SYS>>
You are a helpful assistant who answers user queries accurately and respectfully.
<</SYS>>

{user_input} [/INST]
"""

def build_prompt(user_input: str) -> str:
    if is_finance_intent(user_input):
        return finance_prompt_template.format(user_input=user_input)
    else:
        return general_prompt_template.format(user_input=user_input)
