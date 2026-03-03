"""Basic smoke tests for the ingestion service."""

from unittest.mock import MagicMock

import pytest

import app.services.ingestion as ingestion_module
from app.services.ingestion import IngestionService


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


def test_ingestion_service_init(monkeypatch):
    """The service should expose a vector store dependency."""
    store = MagicMock()
    monkeypatch.setattr(ingestion_module, "VectorStore", MagicMock(return_value=store))
    service = IngestionService()

    assert service.vector_store is store
