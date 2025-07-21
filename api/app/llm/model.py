from app.extensions import init_llama_model

MODEL_PATH = "/Users/johnmoses/.cache/lm-studio/models/MaziyarPanahi/Meta-Llama-3-8B-Instruct-GGUF/Meta-Llama-3-8B-Instruct.Q4_K_M.gguf"

def get_llm():
    return init_llama_model(MODEL_PATH)

def generate_response(prompt: str, max_tokens=512, temperature=0.7, top_p=0.9, stop_tokens=None):
    model = get_llm()
    response = model(
        prompt,
        max_tokens=max_tokens,
        temperature=temperature,
        top_p=top_p,
        stop=stop_tokens or ["###", "</s>", "[/INST]"],
    )
    return response["choices"][0]["text"].strip()
