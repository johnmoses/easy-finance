from flask import Blueprint, request, jsonify
from app.llm.prompts import build_prompt
from app.llm.model import generate_response
from app.extensions import get_milvus_client, collection_name
from sentence_transformers import SentenceTransformer

chat_bp = Blueprint("chat", __name__)

# Initialize embedding once
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(text: str):
    return embedding_model.encode([text])[0].tolist()

def search_similar_documents(query_vector, top_k=5):
    client = get_milvus_client()
    results = client.search(
        collection_name=collection_name,
        data=[query_vector],
        limit=top_k,
        output_fields=["text"],
    )
    return [hit.entity["text"] for hit in results[0]]

def build_augmented_prompt(user_message, retrieved_docs):
    context = "\n---\n".join(retrieved_docs)
    prompt = f"Context:\n{context}\n\nUser query:\n{user_message}\n\nAnswer:"
    return prompt

@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    query_vector = embed_text(user_message)
    retrieved_docs = search_similar_documents(query_vector)

    context = "\n---\n".join(retrieved_docs)
    prompt = f"Context:\n{context}\n\nUser query:\n{user_message}\n\nAnswer:"
    answer = generate_response(prompt)

    return jsonify({"response": answer})