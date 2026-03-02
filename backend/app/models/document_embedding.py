from sqlalchemy import JSON, Column, ForeignKey, String

try:
    from pgvector.sqlalchemy import Vector
except ImportError:  # pragma: no cover - optional dependency in test/CI
    Vector = None
from app.models.database import Base, BaseMixin

class DocumentEmbedding(Base, BaseMixin):
    """
    Stores document embeddings for vector search.
    Replaces local ChromaDB.
    """
    __tablename__ = "document_embeddings"
    __table_args__ = {"extend_existing": True}

    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    content = Column(String, nullable=False)
    # Use JSON for embedding storage in SQLite/fallback, Vector in Postgres
    if Vector:
        embedding = Column(JSON().with_variant(Vector(768), "postgresql"))
    else:
        embedding = Column(JSON)
    metadata_json = Column(JSON, default=dict)

    # Optional: Add HNSW index in migration (handled via raw SQL usually)
