"""Basic smoke tests for the ingestion service."""

import sys
from dataclasses import dataclass, field
from types import ModuleType

import pytest

vector_store_module = sys.modules.setdefault(
    "app.services.vector_store", ModuleType("app.services.vector_store")
)


@dataclass
class _CareerArtifact:
    """Minimal artifact model for import compatibility."""

    content: str
    source_type: str
    source_filename: str
    derived_skills: list[str] = field(default_factory=list)
    date: str = ""


class _VectorStore:
    """Minimal vector-store placeholder."""

    def add_artifact(self, artifact, user_id="legacy_user"):
        return None


vector_store_module.CareerArtifact = getattr(vector_store_module, "CareerArtifact", _CareerArtifact)
vector_store_module.VectorStore = getattr(vector_store_module, "VectorStore", _VectorStore)

from app.services.ingestion import IngestionService


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


def test_ingestion_service_init():
    """The service should expose a vector store dependency."""
    service = IngestionService()

    assert service.vector_store is not None
