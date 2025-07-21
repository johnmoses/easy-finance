from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from llama_cpp import Llama
from pymilvus import MilvusClient
import pathlib

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
socketio = SocketIO()
ma = Marshmallow()

llama_model = None

db_path = "./milvus_demo.db"
collection_name = "demo_collection"
embedding_dim = 384

# Global variables (initialized as None)
_milvus_client = None

def init_llama_model(model_path, n_ctx=4096, n_gpu_layers=0):
    global llama_model
    if llama_model is None:
        llama_model = Llama(
            model_path=model_path,
            n_ctx=n_ctx,
            n_gpu_layers=n_gpu_layers,
        )
    return llama_model


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

def insert_documents(docs: list):
    """
    Insert documents into Milvus collection.
    docs: List of dict where each dict should have keys: 'id', 'vector', 'text', 'subject'
    """
    global milvus_client
    if not milvus_client:
        raise ValueError("Milvus client not initialized")
    return milvus_client.insert(collection_name=collection_name, data=docs)

def search_vectors(query_vectors, top_k=5, filter_expr=None):
    """
    Search similar vectors.
    query_vectors: list of vectors (list of floats).
    filter_expr: string filter expression, e.g. "subject == 'history'"
    """
    global milvus_client
    if not milvus_client:
        raise ValueError("Milvus client not initialized")

    return milvus_client.search(
        collection_name=collection_name,
        data=query_vectors,
        filter=filter_expr,
        limit=top_k,
        output_fields=["text", "subject"]
    )

def query_documents(filter_expr=None):
    """
    Query documents by filter expression (no vector similarity).
    """
    global milvus_client
    if not milvus_client:
        raise ValueError("Milvus client not initialized")

    return milvus_client.query(
        collection_name=collection_name,
        filter=filter_expr,
        output_fields=["text", "subject"]
    )

def delete_documents(filter_expr=None):
    """
    Delete documents matching filter expression.
    """
    global milvus_client
    if not milvus_client:
        raise ValueError("Milvus client not initialized")

    return milvus_client.delete(
        collection_name=collection_name,
        filter=filter_expr,
    )
