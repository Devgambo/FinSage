import chromadb
from typing import List, Dict, Optional, Union


class VectorStore:
    def __init__(self, collection_name: str = "finchat_docs", folder_path: str = "../database"):
        self.client = chromadb.PersistentClient(path=folder_path)
        self.collection = self.client.get_or_create_collection(name=collection_name)

    def save_documents(
            self,
            documents: List[str],
            metadatas: List[Dict],
            ids: List[str],
            embeddings: Optional[List[List[float]]] = None
    ):
        """Save documents to ChromaDB.

        Args:
            documents: List of document texts.
            metadatas: List of metadata dicts (must include 'role_access').
            ids: List of document IDs.
            embeddings: Optional precomputed embeddings (from EmbeddingService).
        """
        if embeddings is None:
            self.collection.add(documents=documents, metadatas=metadatas, ids=ids)
        else:
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids,
                embeddings=embeddings
            )

    def delete_documents(
            self,
            ids: Optional[List[str]] = None,
            where: Optional[Dict] = None
    ):
        """Delete documents by ID or metadata filter.

        Args:
            ids: List of document IDs to delete.
            where: Metadata filter (e.g., {'role_access': {'$contains': 'finance'}}).
        """
        if ids is not None:
            self.collection.delete(ids=ids)
        if where is not None:
            self.collection.delete(where=where)

    def query(
            self,
            query_embeddings: List[List[float]],
            n_results: int = 5,
            where: Optional[Dict] = None
    ) -> Dict:
        """Query the database with embeddings and optional metadata filter.

        Args:
            query_embeddings: List of query embeddings (from EmbeddingService).
            n_results: Number of results to return.
            where: Metadata filter (e.g., {'role_access': {'$contains': 'finance'}}).
        Returns:
            Dict with 'documents', 'metadatas', 'ids', 'distances'.
        """
        return self.collection.query(
            query_embeddings=query_embeddings,
            n_results=n_results,
            where=where
        )

    def get_all(self, where: Optional[Dict] = None) -> Dict:
        """Get all documents (optionally filtered by metadata).

        Args:
            where: Metadata filter (e.g., {'role_access': {'$contains': 'finance'}}).
        Returns:
            Dict with 'documents', 'metadatas', 'ids'.
        """
        return self.collection.get(where=where)
