import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer


class VectorDB:
    def __init__(self):
        self.client = chromadb.Client(
            Settings(chroma_db_impl="duckdb+parquet", persist_directory=".chromadb")
        )
        self.collection_name = "financial_docs"
        # Create or get collection
        if self.collection_name in [c.name for c in self.client.list_collections()]:
            self.collection = self.client.get_collection(self.collection_name)
        else:
            self.collection = self.client.create_collection(self.collection_name)

        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def ingest_documents(self, documents):
        # documents: list of strings
        embeddings = self.model.encode(documents).tolist()
        # Insert documents with IDs
        ids = [str(i) for i in range(len(documents))]
        self.collection.add(documents=documents, embeddings=embeddings, ids=ids)

    def retrieve_financial_context(self, query="financial patterns", k=3):
        query_embedding = self.model.encode([query]).tolist()
        results = self.collection.query(query_embeddings=query_embedding, n_results=k)
        # results['documents'] is a list of lists of matched documents
        matched_docs = results["documents"][0] if results["documents"] else []
        return (
            "\n".join(matched_docs) if matched_docs else "No financial data available."
        )
