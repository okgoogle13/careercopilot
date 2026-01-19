import os
from typing import List, Dict, Optional, Literal
from pydantic import BaseModel
from dotenv import load_dotenv
try:
    import google.generativeai as genai
except ImportError:  # pragma: no cover - optional dependency in test/CI
    genai = None
from sqlalchemy import select
from app.core.database import get_db_session
from app.models.document_embedding import DocumentEmbedding

load_dotenv()

# Configure Google AI for Embeddings
if genai:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class CareerArtifact(BaseModel):
    content: str
    source_type: Literal["resume", "cover_letter", "ksc_response"]
    source_filename: str
    derived_skills: List[str] = []
    date: str = ""

class VectorStore:
    """
    Manages the Supabase vector store for the user's career artifacts.
    Uses Google Gemini text-embedding-004 for embeddings and pgvector for storage.
    """

    def __init__(self):
        # Connection managed via app.core.database
        self.embedding_model = "models/text-embedding-004"

    def _generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generates embeddings using Gemini API."""
        if not texts:
            return []
        if not genai:
            raise RuntimeError("Google Generative AI library not installed")
        
        results = genai.embed_content(
            model=self.embedding_model,
            content=texts,
            task_type="retrieval_document"
        )
        return results['embedding']

    def _generate_query_embedding(self, text: str) -> List[float]:
        """Generates embedding for a single query."""
        if not genai:
            raise RuntimeError("Google Generative AI library not installed")
        result = genai.embed_content(
            model=self.embedding_model,
            content=text,
            task_type="retrieval_query"
        )
        return result['embedding']

    def add_artifact(self, artifact: CareerArtifact, user_id: str = "legacy_user"):
        """Adds a single artifact to the vector store."""
        embedding_vector = self._generate_embeddings([artifact.content])[0]
        
        # Metadata for filtering
        metadata = {
            "source_type": artifact.source_type,
            "source_filename": artifact.source_filename,
            "date": artifact.date,
            "skills": artifact.derived_skills
        }
        
        with get_db_session() as db:
            doc = DocumentEmbedding(
                user_id=user_id,
                content=artifact.content,
                embedding=embedding_vector,
                metadata_json=metadata
            )
            db.add(doc)
            # Commit handled by context manager
            
        print(f"DEBUG: Added artifact {artifact.source_filename} to Supabase VectorStore.")

    def query_similar(self, query: str, n_results: int = 3, filter_source: Optional[str] = None, user_id: str = "legacy_user") -> List[Dict]:
        """Queries the vector store for similar artifacts."""
        query_embedding = self._generate_query_embedding(query)
        
        with get_db_session() as db:
            # Cosine distance operator is <=>
            stmt = select(DocumentEmbedding).order_by(
                DocumentEmbedding.embedding.cosine_distance(query_embedding)
            ).limit(n_results)
            
            if filter_source:
                # Generic JSON filtering
                stmt = stmt.filter(DocumentEmbedding.metadata_json['source_type'].as_string() == filter_source)
            
            if user_id:
                stmt = stmt.filter(DocumentEmbedding.user_id == user_id)

            results = db.execute(stmt).scalars().all()
            
            output = []
            for doc in results:
                output.append({
                    "id": doc.id,
                    "content": doc.content,
                    "metadata": doc.metadata_json,
                    "distance": 0.0 # Distance calculation requires modification to select clause to return it
                })
            
            return output

    def clear_database(self, user_id: str = "legacy_user"):
        """Clears data for a user."""
        with get_db_session() as db:
            db.query(DocumentEmbedding).filter(DocumentEmbedding.user_id == user_id).delete()
