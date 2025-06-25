import torch
from transformers import AutoModelForCausalLM, AutoTokenizer


class FinancialAgent:
    def __init__(self):
        model_name = "gpt2-medium"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
        self.model.eval()
        if torch.cuda.is_available():
            self.model.to("cuda")

    def analyze_portfolio(self, chain):
        transactions = [tx for block in chain for tx in block["transactions"]]
        prompt = (
            f"Analyze the following transaction history and provide portfolio insights and recommendations:\n{transactions}\n"
            "Insights:"
        )
        inputs = self.tokenizer.encode(prompt, return_tensors="pt")
        if torch.cuda.is_available():
            inputs = inputs.to("cuda")
        outputs = self.model.generate(
            inputs, max_length=200, do_sample=True, temperature=0.7
        )
        text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return text[len(prompt) :].strip()
