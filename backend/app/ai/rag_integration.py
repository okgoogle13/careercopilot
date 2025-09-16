"""
RAG Integration Service

This module provides a high-level interface for RAG functionality,
combining document processing, vector storage, and retrieval.
"""

import logging
from typing import Any, Dict, List, Optional, Tuple

from app.ai.document_processor import DocumentProcessor
from app.ai.rag_service import RAGService
from app.ai.vector_store import vector_store  # Import the singleton instance
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.config import settings

logger = logging.getLogger(__name__)


class RAGIntegration:
    """Orchestrates RAG functionality across components."""

    def __init__(self):
        """Initialize the RAG integration service."""
        self.document_processor = DocumentProcessor(
            {
                "chunk_size": settings.rag_chunk_size,
                "chunk_overlap": settings.rag_chunk_overlap,
            }
        )

        # Use the imported singleton vector_store instance
        self.vector_store = vector_store

        self.rag_service = RAGService(
            {
                "model_name": settings.embedding_model,
                "index_endpoint": settings.vertex_ai_index_endpoint,
            }
        )

    async def process_and_index_document(
        self,
        file_path: str,
        metadata: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None,
    ) -> List[str]:
        """Process a document and add it to the vector store.

        Args:
            file_path: Path to the document file
            metadata: Additional metadata for the document
            user_id: Optional user ID for access control

        Returns:
            List of document chunk IDs
        """
        if metadata is None:
            metadata = {}

        if user_id:
            metadata["user_id"] = user_id

        try:
            # Process the document into chunks
            chunks = await self.document_processor.process_document(
                file_path=file_path, metadata=metadata
            )

            if not chunks:
                raise AIError(
                    "No content could be extracted from the document",
                    error_type=AIErrorType.DOCUMENT_PROCESSING_ERROR,
                )

            # Generate embeddings for the chunks
            chunk_texts = [chunk.text for chunk in chunks]
            embeddings = await self.rag_service.get_embeddings(chunk_texts)

            # Prepare documents for indexing
            documents = []
            for chunk, embedding in zip(chunks, embeddings):
                doc_metadata = chunk.metadata.copy()
                doc_metadata.update(
                    {
                        "content_type": "text_chunk",
                        "source": metadata.get("source", "upload"),
                        "chunk_number": chunk.chunk_number,
                        "page_number": chunk.page_number,
                    }
                )

                documents.append(
                    {
                        "id": f"{metadata.get('doc_id', '')}_chunk{chunk.chunk_number}",
                        "content": chunk.text,
                        "metadata": doc_metadata,
                    }
                )

            # Add to vector store using add_vectors
            doc_ids = []
            if embeddings and documents:
                await self.vector_store.add_vectors(vectors=embeddings, metadatas=documents)
                doc_ids = [doc["id"] for doc in documents]  # Assuming IDs are in metadata

            logger.info(f"Indexed {len(doc_ids)} document chunks")
            return doc_ids

        except Exception as e:
            logger.error(f"Failed to process and index document: {str(e)}")
            if not isinstance(e, AIError):
                raise AIError(
                    f"Document processing failed: {str(e)}",
                    error_type=AIErrorType.PROCESSING_ERROR,
                ) from e
            raise

    async def query_rag(
        self,
        query: str,
        user_id: Optional[str] = None,
        top_k: int = 5,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Tuple[List[Dict[str, Any]], str]:
        """Query the RAG system and get relevant context.

        Args:
            query: The search query
            user_id: Optional user ID for access control
            top_k: Number of results to return
            filters: Additional filters for the search

        Returns:
            Tuple of (search_results, augmented_query)
        """
        if filters is None:
            filters = {}

        try:
            # Apply user filter if user_id is provided
            if user_id:
                filters["user_id"] = user_id

            # Get query embedding
            query_embedding = await self.rag_service.get_embeddings([query])
            if not query_embedding:
                raise AIError(
                    "Failed to generate query embedding",
                    error_type=AIErrorType.EMBEDDING_ERROR,
                )

            # Search for similar documents using search_vectors
            # Pass query_embedding[0] as search_vectors expects a single vector
            search_results_raw = await self.vector_store.search_vectors(
                query_vector=query_embedding[0], k=top_k
            )

            # Format results to match RAGQueryResponse expectation
            search_results = []
            for res in search_results_raw:
                metadata = res["metadata"]
                # Apply filters here if user_id is present and not handled by vector store
                if user_id and metadata.get("user_id") != user_id:
                    continue
                search_results.append((metadata, res["distance"]))  # (doc, score)

            # Extract relevant context
            context = "\n\n".join(
                f"[Source: {doc.get('source', 'unknown')}]\n{doc['content']}"
                for doc, _ in search_results
            )

            # Augment the query with context
            augmented_query = f"""Context information is below.
            ---------------------
            {context}
            ---------------------
            Given the context information and not prior knowledge, answer the query.
            Query: {query}"""

            return search_results, augmented_query

        except Exception as e:
            logger.error(f"RAG query failed: {str(e)}")
            if not isinstance(e, AIError):
                raise AIError(
                    f"Query processing failed: {str(e)}",
                    error_type=AIErrorType.QUERY_ERROR,
                ) from e
            raise

    async def delete_documents(self, doc_ids: List[str], user_id: Optional[str] = None) -> bool:
        """Delete documents from the vector store.

        Args:
            doc_ids: List of document IDs to delete
            user_id: Optional user ID for access control

        Returns:
            True if successful, False otherwise
        """
        if not doc_ids:
            return True

        try:
            # Apply user filter if user_id is provided
            if user_id:
                # Verify user owns these documents before deleting
                for doc_id in doc_ids:
                    doc = await self.vector_store.get_document(doc_id)
                    if not doc or doc.get("metadata", {}).get("user_id") != user_id:
                        logger.warning(f"User {user_id} not authorized to delete document {doc_id}")
                        return False

            # Delete the documents
            return await self.vector_store.delete_documents(doc_ids)

        except Exception as e:
            logger.error(f"Failed to delete documents: {str(e)}")
            return False


# Global instance for easy import
rag_integration = RAGIntegration()
