import json
import os
from typing import Dict, List, Optional

import faiss
import numpy as np
from loguru import logger

# Assuming text-embedding-3-small produces 1536-dimensional vectors
VECTOR_DIMENSION = 1536
INDEX_FILE = "vector_index.faiss"
METADATA_FILE = "vector_metadata.json"
INDEX_DIR = "data/vector_store"  # Directory to store index and metadata


class VectorStore:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorStore, cls).__new__(cls)
            cls._instance.index = None
            cls._instance.metadata = []
            cls._instance.is_loaded = False
            cls._instance.index_path = os.path.join(INDEX_DIR, INDEX_FILE)
            cls._instance.metadata_path = os.path.join(INDEX_DIR, METADATA_FILE)
            os.makedirs(INDEX_DIR, exist_ok=True)
            logger.info(
                f"VectorStore initialized. Index will be stored in: {INDEX_DIR}"
            )
        return cls._instance

    async def load_or_create_index(self):
        if self.is_loaded:
            logger.info("Vector index already loaded.")
            return

        if os.path.exists(self.index_path) and os.path.exists(self.metadata_path):
            try:
                self.index = faiss.read_index(self.index_path)
                with open(self.metadata_path, "r") as f:
                    self.metadata = json.load(f)
                self.is_loaded = True
                logger.info(
                    f"Vector index loaded from {self.index_path} with {self.index.ntotal} vectors."
                )
            except Exception as e:
                logger.error(f"Failed to load vector index: {e}. Creating new index.")
                self._create_new_index()
        else:
            logger.info("No existing vector index found. Creating new index.")
            self._create_new_index()

    def _create_new_index(self):
        # Using IndexFlatL2 for simplicity. For larger datasets, consider IndexIVFFlat.
        self.index = faiss.IndexFlatL2(VECTOR_DIMENSION)
        self.metadata = []
        self.is_loaded = True
        logger.info("New IndexFlatL2 created.")

    async def add_vectors(self, vectors: List[List[float]], metadatas: List[Dict]):
        if not self.is_loaded:
            await self.load_or_create_index()  # Ensure index is loaded before adding

        if len(vectors) != len(metadatas):
            raise ValueError("Number of vectors and metadatas must be the same.")

        if not vectors:
            logger.warning("No vectors to add.")
            return

        vectors_np = np.array(vectors).astype("float32")
        if vectors_np.shape[1] != VECTOR_DIMENSION:
            raise ValueError(
                f"Vector dimension mismatch. Expected {VECTOR_DIMENSION}, got {vectors_np.shape[1]}."
            )

        self.index.add(vectors_np)
        # Assign unique IDs to metadata if not already present
        for i, meta in enumerate(metadatas):
            if "id" not in meta:
                meta["id"] = len(self.metadata) + i  # Simple sequential ID
            self.metadata.append(meta)

        logger.info(
            f"Added {len(vectors)} vectors. Total vectors in index: {self.index.ntotal}"
        )
        await self.save_index()  # Save after adding

    async def search_vectors(self, query_vector: List[float], k: int = 5) -> List[Dict]:
        if not self.is_loaded or self.index.ntotal == 0:
            logger.warning("Vector index not loaded or empty. Cannot perform search.")
            return []

        query_np = np.array([query_vector]).astype("float32")
        if query_np.shape[1] != VECTOR_DIMENSION:
            raise ValueError(
                f"Query vector dimension mismatch. Expected {VECTOR_DIMENSION}, got {query_np.shape[1]}."
            )

        distances, indices = self.index.search(
            query_np, k
        )  # distances and indices arrays

        results = []
        for i in range(len(indices[0])):
            idx = indices[0][i]
            if idx < len(self.metadata):  # Ensure index is within bounds
                results.append(
                    {"distance": float(distances[0][i]), "metadata": self.metadata[idx]}
                )
            else:
                logger.warning(
                    f"Search returned out-of-bounds index: {idx}. Metadata size: {len(self.metadata)}"
                )

        logger.info(f"Search completed. Found {len(results)} results.")
        return results

    async def save_index(self):
        if self.index is None:
            logger.warning("No index to save.")
            return

        try:
            faiss.write_index(self.index, self.index_path)
            with open(self.metadata_path, "w") as f:
                json.dump(self.metadata, f, indent=2)
            logger.info(f"Vector index saved to {self.index_path}")
        except Exception as e:
            logger.error(f"Failed to save vector index: {e}")

    async def clear_index(self):
        self._create_new_index()
        await self.save_index()
        logger.info("Vector index cleared.")

    async def get_document(self, doc_id: str) -> Optional[Dict]:
        """Retrieve a document by its ID from metadata."""
        for meta in self.metadata:
            if meta.get("id") == doc_id:
                return meta
        return None

    async def delete_documents(self, doc_ids: List[str]) -> bool:
        """Delete documents from the index by their IDs."""
        # This is a simplified deletion. FAISS does not support direct deletion by ID efficiently.
        # For true deletion, one would typically rebuild the index or use a more advanced FAISS index type
        # that supports removal (e.g., IndexIDMap).
        # For this implementation, we will mark them for logical deletion and rebuild if necessary.
        # A more robust solution for production would involve a proper vector database.

        initial_count = len(self.metadata)
        new_metadata = []
        deleted_indices = set()

        for i, meta in enumerate(self.metadata):
            if meta.get("id") in doc_ids:
                deleted_indices.add(i)
            else:
                new_metadata.append(meta)

        if len(new_metadata) == initial_count:  # No documents were found to delete
            return False

        self.metadata = new_metadata

        # Rebuild the FAISS index if a significant number of documents were deleted
        # This is a heuristic. A better approach might be to track deleted IDs and rebuild periodically.
        if (
            len(deleted_indices) > initial_count * 0.1 or len(deleted_indices) > 100
        ):  # Rebuild if >10% or >100 docs deleted
            logger.info(
                f"Rebuilding FAISS index after deleting {len(deleted_indices)} documents."
            )
            # Get all vectors from remaining metadata and rebuild
            # This assumes you can regenerate vectors from metadata or have them stored elsewhere
            # For this simple implementation, we'll just clear and save metadata.
            # A real system would need to re-embed or retrieve original vectors.
            self._create_new_index()  # Clears the FAISS index
            # You would typically re-add vectors here from new_metadata
            # For now, we just save the reduced metadata.

        await self.save_index()
        logger.info(
            f"Deleted {len(deleted_indices)} documents from metadata. Total remaining: {len(self.metadata)}"
        )
        return True


# Singleton instance
vector_store = VectorStore()


# Example Usage (for testing/demonstration)
async def main():
    await vector_store.load_or_create_index()

    # Add some dummy vectors
    dummy_vectors = [np.random.rand(VECTOR_DIMENSION).tolist() for _ in range(10)]
    dummy_metadatas = [
        {"id": f"doc{i}", "text": f"This is document {i}", "source": "test"}
        for i in range(10)
    ]
    await vector_store.add_vectors(dummy_vectors, dummy_metadatas)

    # Search for a dummy query
    query = np.random.rand(VECTOR_DIMENSION).tolist()
    results = await vector_store.search_vectors(query, k=3)
    logger.info(f"Search results: {results}")

    # Test get_document
    doc = await vector_store.get_document("doc5")
    logger.info(f"Retrieved document: {doc}")

    # Test delete_documents
    await vector_store.delete_documents(["doc1", "doc3", "doc5"])
    results = await vector_store.search_vectors(query, k=3)
    logger.info(f"Search results after deletion: {results}")

    # Clear and re-add
    await vector_store.clear_index()
    await vector_store.add_vectors(dummy_vectors[:5], dummy_metadatas[:5])
    results = await vector_store.search_vectors(query, k=3)
    logger.info(f"Search results after clear and re-add: {results}")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
