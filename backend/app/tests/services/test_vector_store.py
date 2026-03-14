"""Unit tests for the VectorStore service."""

from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest

import app.services.vector_store as vector_store_module
from app.services.vector_store import CareerArtifact, VectorStore


class _FakeColumn:
    def __init__(self, label: str):
        self.label = label

    def __eq__(self, other):
        return (self.label, other)

    def as_string(self):
        return self

    def __getitem__(self, key):
        return _FakeColumn(f"{self.label}.{key}")


class _FakeEmbeddingColumn(_FakeColumn):
    def cosine_distance(self, value):
        return ("cosine_distance", value)


class FakeDocumentEmbedding:
    embedding = _FakeEmbeddingColumn("embedding")
    metadata_json = _FakeColumn("metadata_json")
    user_id = _FakeColumn("user_id")

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)


class _FakeStatement:
    def __init__(self):
        self.filters = []
        self.limit_value = None
        self.order_by_value = None

    def order_by(self, value):
        self.order_by_value = value
        return self

    def limit(self, value):
        self.limit_value = value
        return self

    def filter(self, value):
        self.filters.append(value)
        return self


@pytest.fixture
def vector_store():
    """Fixture that initializes the vector store."""
    return VectorStore()


@pytest.fixture
def sample_artifact():
    """Fixture that returns a sample career artifact."""
    return CareerArtifact(
        content="Experience in Python and React development.",
        source_type="resume",
        source_filename="resume_v1.pdf",
        date="2026-03-03",
    )


@pytest.fixture
def mock_genai(monkeypatch):
    """Mock the Google Generative AI module via get_configured_google_generativeai."""
    mock_genai_module = SimpleNamespace()
    mock_embed = MagicMock(
        side_effect=lambda **kwargs: {
            "embedding": (
                [[0.1, 0.2, 0.3]] if isinstance(kwargs["content"], list) else [0.1, 0.2, 0.3]
            )
        }
    )
    mock_genai_module.embed_content = mock_embed
    monkeypatch.setattr(
        "app.services.vector_store.get_configured_google_generativeai",
        lambda _key: mock_genai_module,
    )
    return mock_embed


def test_generate_embeddings(vector_store, mock_genai):
    """Test generating embeddings for text."""
    embeddings = vector_store._generate_embeddings(["some text"])
    assert embeddings == [[0.1, 0.2, 0.3]]
    mock_genai.assert_called_once()


def test_generate_embeddings_returns_empty_list_for_empty_input(vector_store):
    """Test the empty-input fast path."""
    assert vector_store._generate_embeddings([]) == []


def test_generate_query_embedding(vector_store, mock_genai):
    """Test generating an embedding for a query."""
    embedding = vector_store._generate_query_embedding("query text")
    assert embedding == [0.1, 0.2, 0.3]


def test_generate_query_embedding_raises_without_genai(vector_store, monkeypatch):
    """Test query embedding error handling when the optional dependency is missing."""
    monkeypatch.setattr(
        "app.services.vector_store.get_configured_google_generativeai",
        lambda _key: None,
    )

    with pytest.raises(RuntimeError, match="Google Generative AI library not installed"):
        vector_store._generate_query_embedding("query text")


def test_add_artifact(vector_store, sample_artifact, mock_genai):
    """Test adding an artifact to the vector store."""
    with (
        patch("app.services.vector_store.get_db_session") as mock_get_db,
        patch("app.services.vector_store.DocumentEmbedding", FakeDocumentEmbedding),
    ):
        mock_session = MagicMock()
        mock_get_db.return_value.__enter__.return_value = mock_session

        vector_store.add_artifact(sample_artifact, user_id="test-user")

        # Verify db.add was called
        mock_session.add.assert_called_once()
        added_doc = mock_session.add.call_args[0][0]
        assert isinstance(added_doc, FakeDocumentEmbedding)
        assert added_doc.user_id == "test-user"
        assert added_doc.content == sample_artifact.content


def test_query_similar_basic(vector_store, mock_genai):
    """Test querying the vector store for similar artifacts."""
    with (
        patch("app.services.vector_store.get_db_session") as mock_get_db,
        patch("app.services.vector_store.DocumentEmbedding", FakeDocumentEmbedding),
        patch("app.services.vector_store.select") as mock_select,
    ):
        mock_session = MagicMock()
        mock_get_db.return_value.__enter__.return_value = mock_session
        statement = _FakeStatement()
        mock_select.return_value = statement

        # Setup mock results from DB
        mock_scalars = MagicMock()
        mock_session.execute.return_value.scalars.return_value = mock_scalars
        mock_result_doc = SimpleNamespace(
            id=1, user_id="test-user", content="Found text", metadata_json={"source_type": "resume"}
        )
        mock_scalars.all.return_value = [mock_result_doc]

        results = vector_store.query_similar("search query", n_results=5, user_id="test-user")

        assert len(results) == 1
        assert results[0]["content"] == "Found text"
        assert results[0]["id"] == 1
        assert results[0]["metadata"] == {"source_type": "resume"}
        assert results[0]["distance"] == 0.0
        assert statement.limit_value == 5


def test_query_similar_with_filter(vector_store, mock_genai):
    """Test querying similar artifacts with filtering by source type."""
    with (
        patch("app.services.vector_store.get_db_session") as mock_get_db,
        patch("app.services.vector_store.DocumentEmbedding", FakeDocumentEmbedding),
        patch("app.services.vector_store.select") as mock_select,
    ):
        mock_session = MagicMock()
        mock_get_db.return_value.__enter__.return_value = mock_session
        statement = _FakeStatement()
        mock_select.return_value = statement

        mock_scalars = MagicMock()
        mock_session.execute.return_value.scalars.return_value = mock_scalars
        mock_scalars.all.return_value = []

        results = vector_store.query_similar("query", filter_source="resume", user_id="test-user")
        assert results == []
        assert len(statement.filters) == 2


def test_clear_database(vector_store):
    """Test clearing the database for a user."""
    with (
        patch("app.services.vector_store.get_db_session") as mock_get_db,
        patch("app.services.vector_store.DocumentEmbedding", FakeDocumentEmbedding),
    ):
        mock_session = MagicMock()
        mock_get_db.return_value.__enter__.return_value = mock_session

        vector_store.clear_database(user_id="test-user")

        # Verify delete was called
        mock_query = mock_session.query.return_value
        mock_filter = mock_query.filter.return_value
        mock_filter.delete.assert_called_once()
