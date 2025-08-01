import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-key")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///db.sqlite3")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)     # 7 days
    JWT_TOKEN_LOCATION = ['headers']

    MILVUS_DB_PATH = os.environ.get("MILVUS_DB_PATH", "./milvus_rag.db")
    MILVUS_COLLECTION = os.environ.get("MILVUS_COLLECTION", "sure_health_collection")
    MILVUS_DIMENSION = int(os.environ.get("MILVUS_DIMENSION", "384"))
    EMBED_MODEL_NAME = os.environ.get("EMBED_MODEL_NAME", "all-MiniLM-L6-v2")
    LLAMA_MODEL_PATH = os.environ.get("LLAMA_MODEL_PATH", "/Users/johnmoses/.cache/lm-studio/models/MaziyarPanahi/Meta-Llama-3-8B-Instruct-GGUF/Meta-Llama-3-8B-Instruct.Q4_K_M.gguf")
