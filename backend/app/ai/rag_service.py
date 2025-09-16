"""
Retrieval-Augmented Generation (RAG) Service

This module provides RAG capabilities using:
- Sentence Transformers for embeddings
- Firebase Vector Search for retrieval
- Integration with existing AI services
"""

import json
import logging
from typing import Any, Dict, List, Optional

from google.cloud import aiplatform
from pydantic import BaseModel

# Conditionally import SentenceTransformer to handle dependency issues
try:
    from sentence_transformers import SentenceTransformer

    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False

    # Create a dummy class if the library is not available
    class SentenceTransformer:
        def __init__(self, model_name: str):
            logger.warning(
                "'sentence-transformers' is not installed. Local embedding and search will be disabled."
            )

        def encode(self, *args, **kwargs):
            raise NotImplementedError(
                "'sentence-transformers' is not installed. Cannot generate embeddings."
            )


from app.ai.base_service import BaseAIService
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.config import settings

logger = logging.getLogger(__name__)


class SearchResult(BaseModel):
    """Model for search results from vector database."""

    id: str
    content: str
    metadata: Dict[str, Any]
    score: float


class RAGService(BaseAIService):
    """Service for Retrieval-Augmented Generation.

    Handles document indexing, retrieval, and context augmentation.
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize the RAG service.

        Args:
            config: Configuration dictionary with optional keys:
                - model_name: Name of the embedding model to use
                - index_endpoint: GCP endpoint for vector search
                - dimension: Dimension of the embeddings
                - batch_size: Batch size for processing documents
        """
        super().__init__(config or {})
        self.embedding_model = None
        self.index_endpoint = None
        self.local_embeddings_enabled = SENTENCE_TRANSFORMERS_AVAILABLE
        self.dimension = self.config.get("dimension", 384)  # Default for all-MiniLM-L6-v2
        self.batch_size = self.config.get("batch_size", 32)

        if self.is_enabled:
            self._initialize_rag_service()

    def _initialize_rag_service(self) -> None:
        """Initialize RAG service components."""
        try:
            # Initialize embedding model only if available
            if self.local_embeddings_enabled:
                model_name = self.config.get("model_name", "all-MiniLM-L6-v2")
                self.embedding_model = SentenceTransformer(model_name)
            else:
                logger.warning(
                    "SentenceTransformer not available. Local embedding features disabled."
                )

            # Initialize Vertex AI
            if not settings.GOOGLE_APPLICATION_CREDENTIALS:
                logger.warning("GOOGLE_APPLICATION_CREDENTIALS not set, RAG will be limited")
                self.is_initialized = False
                return

            # Initialize AI Platform
            aiplatform.init(
                project=settings.GOOGLE_CLOUD_PROJECT,
                location=settings.GOOGLE_CLOUD_REGION,
            )

            self.index_endpoint = self.config.get("index_endpoint")
            if not self.index_endpoint:
                logger.warning(
                    "No vector search index endpoint configured - RAG will use local similarity search only"
                )

            self.is_initialized = True
            logger.info("RAG service initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize RAG service: {str(e)}")
            self.is_initialized = False

    async def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts.

        Args:
            texts: List of text strings to embed

        Returns:
            List of embedding vectors
        """
        if not self.is_available() or not self.local_embeddings_enabled:
            raise AIError(
                "RAG service or embedding model is not available",
                error_type=AIErrorType.SERVICE_UNAVAILABLE,
            )

        try:
            # Process in batches to avoid OOM
            embeddings = []
            for i in range(0, len(texts), self.batch_size):
                batch = texts[i : i + self.batch_size]
                batch_embeddings = self.embedding_model.encode(
                    batch,
                    convert_to_numpy=True,
                    show_progress_bar=False,
                    normalize_embeddings=True,
                )
                embeddings.extend(batch_embeddings.tolist())

            return embeddings

        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            raise AIError(
                f"Failed to generate embeddings: {str(e)}",
                error_type=AIErrorType.EMBEDDING_ERROR,
            )

    async def search_similar(
        self, query: str, top_k: int = 5, filters: Optional[Dict[str, Any]] = None
    ) -> List[SearchResult]:
        """Search for similar content using vector similarity.

        Args:
            query: The search query
            top_k: Number of results to return
            filters: Optional filters to apply to the search

        Returns:
            List of search results with scores
        """
        if not self.is_available() or not self.index_endpoint:
            # Fallback to local similarity search if no index endpoint
            return await self._local_similarity_search(query, top_k, filters)

        try:
            # Generate query embedding
            query_embedding = (await self.get_embeddings([query]))[0]

            # Query the vector index
            client = aiplatform.MatchingEngineIndexEndpoint(index_endpoint_name=self.index_endpoint)

            # Execute the search
            response = client.match(
                deployed_index_id="default_index",
                queries=[query_embedding],
                num_neighbors=top_k,
                filter=json.dumps(filters) if filters else None,
            )

            # Process and return results
            results = []
            for match in response[0]:
                result = SearchResult(
                    id=match.id,
                    content=match.datapoint.datapoint_id,
                    metadata=json.loads(match.datapoint.feature_vector),
                    score=1.0 - match.distance,  # Convert distance to similarity score
                )
                results.append(result)

            return results

        except Exception as e:
            logger.error(f"Vector search failed: {str(e)}")
            # Fall back to local search if remote search fails
            return await self._local_similarity_search(query, top_k, filters)

    async def _local_similarity_search(
        self, query: str, top_k: int = 5, filters: Optional[Dict[str, Any]] = None
    ) -> List[SearchResult]:
        """Local fallback for similarity search using FAISS.

        This is a simplified version that would need to be implemented
        with a local vector store in a production environment.
        """
        logger.warning("Using local similarity search - results may be limited")

        # In a real implementation, you would use a local vector store here
        # For now, return an empty list as a placeholder
        return []

    async def augment_prompt(
        self, prompt: str, context_keywords: List[str], max_context_length: int = 2000
    ) -> str:
        """Augment a prompt with relevant context from the knowledge base.

        Args:
            prompt: The original prompt
            context_keywords: List of keywords to use for retrieval
            max_context_length: Maximum length of the context to include

        Returns:
            Augmented prompt with relevant context
        """
        if not self.is_available():
            return prompt

        try:
            # Search for relevant context
            query = " ".join(context_keywords) if context_keywords else prompt
            results = await self.search_similar(query, top_k=3)

            if not results:
                return prompt

            # Build context from search results
            context_parts = []
            total_length = 0

            for result in results:
                # Truncate if needed to respect max length
                available_length = max_context_length - total_length - len("\n\n")
                if available_length <= 0:
                    break

                content = result.content
                if len(content) > available_length:
                    content = content[: available_length - 3] + "..."

                context_parts.append(f"- {content}")
                total_length += len(content) + 2  # +2 for "- "

            if not context_parts:
                return prompt

            # Combine context with original prompt
            context = "\n".join(context_parts)
            augmented_prompt = f"""Use the following context to inform your response:
{context}

---

{prompt}"""

            return augmented_prompt

        except Exception as e:
            logger.error(f"Error augmenting prompt: {str(e)}")
            return prompt
