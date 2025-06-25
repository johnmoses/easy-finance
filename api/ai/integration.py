from transformers import pipeline
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
# from ai.vector_db import VectorDB

# vector_db = VectorDB()

# # Ingest documents (run once)
# financial_documents = [
#     "Transaction rules: no transfers over $10,000 without approval.",
#     "Fraud patterns: multiple small transactions within short time.",
#     "Financial regulations: KYC required for all accounts.",
# ]
# vector_db.ingest_documents(financial_documents)

# # Retrieve context for RAG
# context = vector_db.retrieve_financial_context(query="financial regulations", k=3)
# print(context)


class AIProcessor:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("gpt2-medium")
        self.model = AutoModelForCausalLM.from_pretrained("gpt2-medium")
        self.model.eval()
        if torch.cuda.is_available():
            self.model.to("cuda")
        self.generator = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            device=0 if torch.cuda.is_available() else -1,
        )

    def generate_response(self, query, context):
        prompt = (
            f"Use the following context to answer the question.\n"
            f"Context: {context}\n"
            f"Question: {query}\n"
            f"Answer:"
        )
        # Truncate prompt if too long
        max_prompt_length = 512
        if len(prompt) > max_prompt_length:
            prompt = prompt[:max_prompt_length]

        outputs = self.generator(
            prompt,
            max_length=150,
            temperature=0.7,
            top_k=50,
            top_p=0.95,
            do_sample=True,
            num_return_sequences=1,
            pad_token_id=self.tokenizer.eos_token_id,
        )
        generated_text = outputs[0]["generated_text"]
        answer = generated_text[len(prompt) :].strip()
        return answer
