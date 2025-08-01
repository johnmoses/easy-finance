from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_marshmallow import Marshmallow
from llama_cpp import Llama
from pymilvus import MilvusClient
from sentence_transformers import SentenceTransformer
import pathlib
import logging

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
jwt_blacklist = set() # In-memory blacklist for JTI (for single-instance dev/testing)
socketio = SocketIO(cors_allowed_origins="*") # Consider specifying async_mode="eventlet" if using eventlet
ma = Marshmallow()

# Global instances for Llama, Embedding Model, and Milvus Client
llama_model = None
embed_model = None
_milvus_client = None

db_path = "./milvus_finance.db"
collection_name = "finance_documents"
embedding_dim = 384

def init_llama_model(model_path: str, n_ctx: int = 4096, n_gpu_layers: int = 0, verbose: bool = False):
    """
    Initializes the global Llama model instance.
    Raises RuntimeError if initialization fails.
    """
    global llama_model
    if llama_model is None:
        try:
            llama_model = Llama(
                model_path=model_path,
                n_ctx=n_ctx,
                n_gpu_layers=n_gpu_layers,
                verbose=verbose,
            )
            logging.info(f"Llama model loaded from {model_path} with context {n_ctx}")
        except Exception as e:
            logging.error(f"Failed to load Llama model from {model_path}: {e}")
            raise RuntimeError(f"Error loading Llama model: {e}")
    return llama_model

def init_embed_model(model_name: str = "all-MiniLM-L6-v2"):
    """
    Initializes and returns the global SentenceTransformer embedding model.
    Raises RuntimeError if initialization fails.
    """
    global embed_model
    if embed_model is None:
        try:
            embed_model = SentenceTransformer(model_name)
            logging.info(f"Embedding model '{model_name}' loaded successfully.")
        except Exception as e:
            logging.error(f"Failed to load embedding model '{model_name}': {e}")
            raise RuntimeError(f"Error loading embedding model: {e}")
    return embed_model

def init_milvus_client(db_path=db_path, collection=collection_name, dim=embedding_dim):
    """
    Initialize and return the global MilvusClient singleton.
    Only creates the collection if it does not exist.
    """
    global _milvus_client
    if _milvus_client is None:
        # Ensure directory exists
        pathlib.Path(db_path).parent.mkdir(parents=True, exist_ok=True)

        _milvus_client = MilvusClient(db_path)

        try:
            _milvus_client.create_collection(
                collection_name=collection,
                dimension=dim,
            )
        except Exception as e:
            # Ignore error if collection already exists
            if "already exists" not in str(e).lower():
                raise e

    return _milvus_client

def get_milvus_client():
    """
    Return the initialized MilvusClient instance.
    Raises RuntimeError if not initialized.
    """
    global _milvus_client
    if _milvus_client is None:
        raise RuntimeError(
            "Milvus client not initialized. "
            "Did you forget to call init_milvus_client() in your app factory?"
        )
    return _milvus_client

def insert_documents(docs: list, collection_name: str = None):
    """
    Insert documents into Milvus collection.
    docs: List of dict where each dict should have keys: 'id' (optional), 'text', 'subject' (optional).
          Vectors will be generated from 'text' using embed_model.
    """
    client = get_milvus_client()
    current_collection = collection_name if collection_name else client.collection_name # Use passed name or default

    if embed_model is None:
        raise ValueError("Embedding model not initialized. Call init_embed_model() first.")

    data_to_insert = []
    for doc in docs:
        if 'text' not in doc:
            raise ValueError("Document must contain 'text' field for embedding.")
        
        doc_vector = embed_model.encode(doc['text']).tolist() # Convert numpy array to list
        
        new_doc = {
            "text": doc['text'],
            "subject": doc.get('subject', 'finance'), # Default to finance category
            "vector": doc_vector
        }
        # Only add 'id' if it's explicitly provided and not None, otherwise Milvus auto-generates
        if 'id' in doc and doc['id'] is not None:
            new_doc["id"] = doc['id']
            
        data_to_insert.append(new_doc)

    logging.info(f"Inserting {len(data_to_insert)} documents into Milvus collection '{current_collection}'.")
    return client.insert(collection_name=current_collection, data=data_to_insert)

def search_vectors(query_embedding: list, top_k=5, filter_expr=None):
    """
    Search similar vectors.
    query_embedding: a single vector (list of floats) representing the query.
    filter_expr: string filter expression, e.g. "subject == 'investment'"
    """
    global _milvus_client
    if _milvus_client is None:
        raise ValueError("Milvus client not initialized")

    return _milvus_client.search(
        collection_name=collection_name,
        data=[query_embedding], # MilvusClient.search expects a list of query vectors
        filter=filter_expr,
        limit=top_k,
        output_fields=["text", "subject", "id"]
    )

def query_documents(filter_expr: str = None, collection_name: str = None):
    """
    Query documents by filter expression (no vector similarity).
    """
    client = get_milvus_client()
    current_collection = collection_name if collection_name else client.collection_name # Use passed name or default

    logging.info(f"Querying Milvus collection '{current_collection}' with filter='{filter_expr}'")
    return client.query(
        collection_name=current_collection,
        filter=filter_expr,
        output_fields=["text", "subject", "id"]
    )

def delete_documents(filter_expr: str, collection_name: str = None):
    """
    Delete documents matching filter expression.
    Filter expression is required for safety.
    """
    client = get_milvus_client()
    current_collection = collection_name if collection_name else client.collection_name # Use passed name or default

    if not filter_expr:
        raise ValueError("A filter expression is required to delete documents for safety.")
        
    logging.info(f"Deleting documents from Milvus collection '{current_collection}' with filter='{filter_expr}'")
    return client.delete(
        collection_name=current_collection,
        filter=filter_expr,
    )

def get_rag_context(query: str, top_k: int = 5) -> str:
    """
    Generates a RAG context string from the Milvus vector database based on a query.
    """
    if embed_model is None:
        raise RuntimeError("Embedding model is not initialized. Call init_embed_model() first.")
    
    # Ensure Milvus client is initialized before attempting to use it
    try:
        get_milvus_client() 
    except RuntimeError as e:
        logging.error(f"Milvus client not initialized for RAG context: {e}")
        raise

    embedding = embed_model.encode(query).tolist()
    results = search_vectors(embedding, top_k=top_k)

    if not results or len(results) == 0 or not results[0]:
        logging.warning(f"No relevant context found for query: '{query}'")
        return ""

    # Each 'result' is a list of hits for one query (since we pass data=[query_embedding])
    # Each 'hit' in results[0] has an 'entity' attribute (dict)
    contexts = [
        hit.entity.get('text', '') 
        for hit in results[0] 
        if hit.entity and 'text' in hit.entity
    ]
    
    # Concatenate contexts, using double newline for better readability
    logging.info(f"Found {len(contexts)} contexts for query: '{query}'")
    return "\n\n".join(contexts)

