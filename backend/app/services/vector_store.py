from typing import Literal

from google.cloud.firestore_v1.base_vector_query import DistanceMeasure
from google.cloud.firestore_v1.vector import Vector
from pydantic import BaseModel

from app.core.firebase import get_firestore
from app.core.google_genai_compat import get_configured_google_generativeai
from app.core.secure_config import settings


class CareerArtifact(BaseModel):
    content: str
    source_type: Literal["resume", "cover_letter", "ksc_response"]
    source_filename: str
    derived_skills: list[str] = []
    date: str = ""


class VectorStore:
    """
    Manages the Firestore vector store for the user's career artifacts.
    Uses Google Gemini text-embedding-004 for embeddings and Firestore for storage.
    """

    def __init__(self):
        self.embedding_model = "models/text-embedding-004"
        self.collection_name = "document_embeddings"

    def _generate_embeddings(self, texts: list[str]) -> list[list[float]]:
        """Generates embeddings using Gemini API."""
        if not texts:
            return []
        genai = get_configured_google_generativeai(settings.GEMINI_API_KEY)
        if not genai:
            raise RuntimeError("Google Generative AI library not installed")

        results = genai.embed_content(
            model=self.embedding_model, content=texts, task_type="retrieval_document"
        )
        return results["embedding"]

    def _generate_query_embedding(self, text: str) -> list[float]:
        """Generates embedding for a single query."""
        genai = get_configured_google_generativeai(settings.GEMINI_API_KEY)
        if not genai:
            raise RuntimeError("Google Generative AI library not installed")
        result = genai.embed_content(
            model=self.embedding_model, content=text, task_type="retrieval_query"
        )
        return result["embedding"]

    def add_artifact(self, artifact: CareerArtifact, user_id: str = "legacy_user"):
        """Adds a single artifact to the vector store."""
        embedding_vector = self._generate_embeddings([artifact.content])[0]

        # Metadata for filtering
        metadata = {
            "source_type": artifact.source_type,
            "source_filename": artifact.source_filename,
            "date": artifact.date,
            "skills": artifact.derived_skills,
        }

        db = get_firestore()
        col = db.collection(self.collection_name)

        doc_ref = col.document()
        doc_ref.set(
            {
                "user_id": user_id,
                "content": artifact.content,
                "embedding": Vector(embedding_vector),
                "metadata_json": metadata,
            }
        )

        print(f"DEBUG: Added artifact {artifact.source_filename} to Firestore VectorStore.")

    def query_similar(
        self,
        query: str,
        n_results: int = 3,
        filter_source: str | None = None,
        user_id: str = "legacy_user",
    ) -> list[dict]:
        """Queries the vector store for similar artifacts."""
        query_embedding = self._generate_query_embedding(query)

        db = get_firestore()
        col = db.collection(self.collection_name)

        # Base query to filter by user_id
        base_query = col.where("user_id", "==", user_id)

        if filter_source:
            # Firestore nested filtering
            base_query = base_query.where("metadata_json.source_type", "==", filter_source)

        # Vector search
        vector_query = base_query.find_nearest(
            vector_field="embedding",
            query_vector=Vector(query_embedding),
            distance_measure=DistanceMeasure.COSINE,
            limit=n_results,
            distance_result_field="distance",
        )

        docs = vector_query.stream()

        output = []
        for doc in docs:
            doc_data = doc.to_dict()
            output.append(
                {
                    "id": doc.id,
                    "content": doc_data.get("content", ""),
                    "metadata": doc_data.get("metadata_json", {}),
                    "distance": doc_data.get("distance", 0.0),
                }
            )

        return output

    def clear_database(self, user_id: str = "legacy_user"):
        """Clears data for a user."""
        db = get_firestore()
        docs = db.collection(self.collection_name).where("user_id", "==", user_id).stream()
        for doc in docs:
            doc.reference.delete()
