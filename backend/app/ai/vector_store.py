"""
Vector Store Service for RAG

This module provides a vector store implementation using Firebase Vector Search
for efficient similarity search and retrieval of document embeddings.
"""

import json
import logging
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
from app.ai.base_service import BaseAIService
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.config import settings
from firebase_admin import firestore
from google.cloud import aiplatform
from pydantic import Field

logger = logging.getLogger(__name__)

# Type aliases
DocumentId = str
Embedding = List[float]


@dataclass
class VectorDocument:
    """A document with its vector embedding and metadata."""

    id: str
    content: str
    embedding: Embedding
    metadata: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class VectorStore(BaseAIService):
    """Vector store for document embeddings using Firebase Vector Search.

    This service handles:
    - Storing document embeddings
    - Similarity search
    - Document retrieval by ID
    - Metadata filtering
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize the vector store.

        Args:
            config: Configuration dictionary with optional keys:
                - collection_name: Firestore collection name (default: 'vector_store')
                - index_endpoint: Vertex AI index endpoint ID
                - dimension: Dimension of the embeddings (default: 384)
                - batch_size: Batch size for operations (default: 100)
        """
        super().__init__(config or {})
        self.collection_name = self.config.get("collection_name", "vector_store")
        self.index_endpoint = self.config.get("index_endpoint")
        self.dimension = self.config.get("dimension", 384)
        self.batch_size = self.config.get("batch_size", 100)

        # Initialize clients
        self._firestore_client = None
        self._vertex_client = None

        if self.is_enabled:
            self._initialize_clients()

    def _initialize_clients(self) -> None:
        """Initialize Firestore and Vertex AI clients."""
        try:
            # Initialize Firestore
            from firebase_admin import firestore

            self._firestore_client = firestore.client()

            # Initialize Vertex AI
            if self.index_endpoint and settings.GOOGLE_CLOUD_PROJECT:
                aiplatform.init(
                    project=settings.GOOGLE_CLOUD_PROJECT,
                    location=settings.GOOGLE_CLOUD_REGION,
                )
                self._vertex_client = aiplatform.MatchingEngineIndexEndpoint(
                    index_endpoint_name=self.index_endpoint
                )

            self.is_initialized = True
            logger.info("Vector store initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize vector store: {str(e)}")
            self.is_initialized = False

    async def add_documents(
        self,
        documents: List[Dict[str, Any]],
        embeddings: List[Embedding],
        batch_size: Optional[int] = None,
    ) -> List[str]:
        """Add documents with embeddings to the vector store.

        Args:
            documents: List of document dictionaries with 'content' and 'metadata'
            embeddings: List of embeddings corresponding to the documents
            batch_size: Optional batch size for Firestore writes

        Returns:
            List of document IDs
        """
        if not self.is_available():
            raise AIError(
                "Vector store is not available", error_type=AIErrorType.SERVICE_UNAVAILABLE
            )

        if len(documents) != len(embeddings):
            raise ValueError("Number of documents must match number of embeddings")

        batch_size = batch_size or self.batch_size
        doc_ids = []

        try:
            # Process in batches
            for i in range(0, len(documents), batch_size):
                batch_docs = documents[i : i + batch_size]
                batch_embeddings = embeddings[i : i + batch_size]

                # Add to Firestore
                batch = self._firestore_client.batch()
                batch_doc_ids = []

                for doc, embedding in zip(batch_docs, batch_embeddings):
                    doc_id = doc.get("id") or self._generate_doc_id()
                    doc_ref = self._firestore_client.collection(self.collection_name).document(
                        doc_id
                    )

                    # Prepare document data
                    doc_data = {
                        "content": doc["content"],
                        "embedding": embedding,
                        "metadata": doc.get("metadata", {}),
                        "created_at": firestore.SERVER_TIMESTAMP,
                        "updated_at": firestore.SERVER_TIMESTAMP,
                    }

                    # Add to batch
                    batch.set(doc_ref, doc_data)
                    batch_doc_ids.append(doc_id)

                # Commit batch
                batch.commit()
                doc_ids.extend(batch_doc_ids)

                # Add to Vertex AI vector index if configured
                if self._vertex_client and self.index_endpoint:
                    self._add_to_vector_index(batch_doc_ids, batch_embeddings)

            return doc_ids

        except Exception as e:
            logger.error(f"Failed to add documents: {str(e)}")
            raise AIError(
                f"Failed to add documents: {str(e)}", error_type=AIErrorType.VECTOR_STORE_ERROR
            )

    async def similarity_search(
        self, query_embedding: Embedding, k: int = 5, filters: Optional[Dict[str, Any]] = None
    ) -> List[Tuple[Dict[str, Any], float]]:
        """Search for similar documents using vector similarity.

        Args:
            query_embedding: The query embedding vector
            k: Number of results to return
            filters: Optional filters to apply to the search

        Returns:
            List of (document, score) tuples, sorted by relevance
        """
        if not self.is_available():
            raise AIError(
                "Vector store is not available", error_type=AIErrorType.SERVICE_UNAVAILABLE
            )

        try:
            # Use Vertex AI vector search if available
            if self._vertex_client:
                return await self._vertex_similarity_search(query_embedding, k, filters)

            # Fall back to Firestore similarity search
            return await self._firestore_similarity_search(query_embedding, k, filters)

        except Exception as e:
            logger.error(f"Similarity search failed: {str(e)}")
            raise AIError(
                f"Similarity search failed: {str(e)}", error_type=AIErrorType.VECTOR_SEARCH_ERROR
            )

    async def get_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Get a document by ID.

        Args:
            doc_id: The document ID

        Returns:
            The document data, or None if not found
        """
        if not self.is_available():
            raise AIError(
                "Vector store is not available", error_type=AIErrorType.SERVICE_UNAVAILABLE
            )

        try:
            doc_ref = self._firestore_client.collection(self.collection_name).document(doc_id)
            doc = doc_ref.get()

            if not doc.exists:
                return None

            return self._format_document(doc_id, doc.to_dict())

        except Exception as e:
            logger.error(f"Failed to get document {doc_id}: {str(e)}")
            return None

    async def delete_documents(self, doc_ids: List[str]) -> bool:
        """Delete documents by ID.

        Args:
            doc_ids: List of document IDs to delete

        Returns:
            True if successful, False otherwise
        """
        if not self.is_available():
            raise AIError(
                "Vector store is not available", error_type=AIErrorType.SERVICE_UNAVAILABLE
            )

        try:
            # Delete from Firestore
            batch = self._firestore_client.batch()

            for doc_id in doc_ids:
                doc_ref = self._firestore_client.collection(self.collection_name).document(doc_id)
                batch.delete(doc_ref)

            batch.commit()

            # TODO: Delete from Vertex AI index if configured

            return True

        except Exception as e:
            logger.error(f"Failed to delete documents: {str(e)}")
            return False

    async def _vertex_similarity_search(
        self, query_embedding: Embedding, k: int, filters: Optional[Dict[str, Any]]
    ) -> List[Tuple[Dict[str, Any], float]]:
        """Perform similarity search using Vertex AI Vector Search."""
        if not self._vertex_client:
            raise AIError("Vertex AI client not initialized")

        try:
            # Convert filters to Vertex AI filter format if needed
            filter_str = json.dumps(filters) if filters else None

            # Perform the search
            response = self._vertex_client.match(
                deployed_index_id="default_index",
                queries=[query_embedding],
                num_neighbors=k,
                filter=filter_str,
            )

            # Process results
            results = []
            for match in response[0]:
                doc_id = match.id
                doc_data = await self.get_document(doc_id)

                if doc_data:
                    score = 1.0 - match.distance  # Convert distance to similarity score
                    results.append((doc_data, score))

            return sorted(results, key=lambda x: x[1], reverse=True)

        except Exception as e:
            logger.error(f"Vertex AI similarity search failed: {str(e)}")
            # Fall back to Firestore if Vertex AI search fails
            return await self._firestore_similarity_search(query_embedding, k, filters)

    async def _firestore_similarity_search(
        self, query_embedding: Embedding, k: int, filters: Optional[Dict[str, Any]]
    ) -> List[Tuple[Dict[str, Any], float]]:
        """Fallback similarity search using Firestore."""
        logger.warning("Using Firestore similarity search - performance may be limited")

        try:
            # Build the query
            query = self._firestore_client.collection(self.collection_name)

            # Apply filters if provided
            if filters:
                for key, value in filters.items():
                    if isinstance(value, (list, tuple)):
                        query = query.where(f"metadata.{key}", "in", value)
                    else:
                        query = query.where(f"metadata.{key}", "==", value)

            # Execute the query
            docs = query.stream()

            # Calculate similarity scores
            results = []
            for doc in docs:
                doc_data = doc.to_dict()
                if "embedding" not in doc_data:
                    continue

                # Calculate cosine similarity
                doc_embedding = doc_data["embedding"]
                similarity = self._cosine_similarity(query_embedding, doc_embedding)

                # Format the document
                formatted_doc = self._format_document(doc.id, doc_data)
                results.append((formatted_doc, similarity))

            # Sort by score and return top k
            results.sort(key=lambda x: x[1], reverse=True)
            return results[:k]

        except Exception as e:
            logger.error(f"Firestore similarity search failed: {str(e)}")
            raise

    def _add_to_vector_index(self, doc_ids: List[str], embeddings: List[Embedding]) -> None:
        """Add documents to the Vertex AI vector index."""
        if not self._vertex_client:
            return

        try:
            # Convert to Vertex AI format
            vectors = []
            for doc_id, embedding in zip(doc_ids, embeddings):
                vectors.append(
                    aiplatform.IndexDatapoint(datapoint_id=doc_id, feature_vector=embedding)
                )

            # Upsert to the index
            self._vertex_client.upsert_datapoints(vectors=vectors)

        except Exception as e:
            logger.error(f"Failed to add to vector index: {str(e)}")
            # Continue even if vector index update fails

    @staticmethod
    def _cosine_similarity(a: List[float], b: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        a_norm = np.linalg.norm(a)
        b_norm = np.linalg.norm(b)

        if a_norm == 0 or b_norm == 0:
            return 0.0

        return np.dot(a, b) / (a_norm * b_norm)

    @staticmethod
    def _format_document(doc_id: str, doc_data: Dict[str, Any]) -> Dict[str, Any]:
        """Format a Firestore document for the API response."""
        return {
            "id": doc_id,
            "content": doc_data.get("content", ""),
            "metadata": doc_data.get("metadata", {}),
            "created_at": doc_data.get("created_at"),
            "updated_at": doc_data.get("updated_at"),
        }

    @staticmethod
    def _generate_doc_id() -> str:
        """Generate a unique document ID."""
        import uuid

        return f"doc_{uuid.uuid4().hex}"
