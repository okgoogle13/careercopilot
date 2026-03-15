"""Unit tests for the SQLAlchemy-backed job store."""

import asyncio
import sys
from types import ModuleType, SimpleNamespace
from unittest.mock import MagicMock

import pytest

core_module = sys.modules.setdefault("app.core", ModuleType("app.core"))
core_module.__path__ = getattr(core_module, "__path__", [])
database_module = sys.modules.setdefault("app.core.database", ModuleType("app.core.database"))
database_module.get_db = getattr(database_module, "get_db", lambda: None)
core_module.database = database_module

models_module = sys.modules.setdefault("app.models", ModuleType("app.models"))
models_module.__path__ = getattr(models_module, "__path__", [])
models_database_module = sys.modules.setdefault(
    "app.models.database", ModuleType("app.models.database")
)
models_database_module.Job = getattr(models_database_module, "Job", object)
models_module.database = models_database_module

import app.services.job_store as job_store_module
from app.services.job_store import SQLAlchemyJobStore, get_job_store


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


class _FakeColumn:
    """Minimal SQLAlchemy-like column stub for query expressions."""

    def __eq__(self, other):
        return ("eq", other)

    def desc(self):
        return "desc"


class _FakeJob:
    """Simple Job replacement used to capture constructor data."""

    user_id = _FakeColumn()
    created_at = _FakeColumn()
    id = _FakeColumn()

    def __init__(self, **kwargs):
        self.id = "job-123"
        self.job_metadata = kwargs.get("job_metadata", {})
        for key, value in kwargs.items():
            setattr(self, key, value)

    def to_dict(self):
        return {
            "id": self.id,
            "title": getattr(self, "title", None),
            "metadata": self.job_metadata,
        }


@pytest.fixture
def mock_db():
    """Provide a mocked SQLAlchemy session."""
    return MagicMock()


@pytest.fixture(autouse=True)
def fake_job_model(monkeypatch):
    """Replace the heavy SQLAlchemy model with a lightweight test double."""
    monkeypatch.setattr(job_store_module, "Job", _FakeJob)


@pytest.fixture
def job_store(mock_db):
    """Build a store around the mocked DB session."""
    return SQLAlchemyJobStore(db=mock_db)


def test_add_job_requires_user_id(job_store):
    """Jobs without an owning user should be rejected."""
    with pytest.raises(ValueError, match="user_id is required"):
        asyncio.run(job_store.add_job({"title": "Case Manager"}))


def test_add_job_populates_defaults_and_persists(job_store, mock_db):
    """New jobs should be mapped to the model, committed, and refreshed."""
    job_data = {
        "user_id": "user-1",
        "metadata": {"source": "seek"},
        "posted_date": "2026-03-01T12:00:00",
    }
    job_id = asyncio.run(job_store.add_job(job_data))

    created_job = mock_db.add.call_args.args[0]
    assert job_id == "job-123"
    assert created_job.title == "Unknown Title"
    assert created_job.company == "Unknown Company"
    assert job_data["date_clipped"]
    assert created_job.posted_date.isoformat() == "2026-03-01T12:00:00"
    assert created_job.job_metadata == {"source": "seek"}
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once_with(created_job)


def test_get_all_jobs_filters_and_limits_results(job_store, mock_db):
    """The store should apply user filtering, ordering, and limits."""
    query = MagicMock()
    filtered = MagicMock()
    ordered = MagicMock()
    limited = MagicMock()
    mock_db.query.return_value = query
    query.filter.return_value = filtered
    filtered.order_by.return_value = ordered
    ordered.limit.return_value = limited

    first = MagicMock()
    first.to_dict.return_value = {"id": "1"}
    second = MagicMock()
    second.to_dict.return_value = {"id": "2"}
    limited.all.return_value = [first, second]

    result = asyncio.run(job_store.get_all_jobs(user_id="user-1", limit=2))

    assert result == [{"id": "1"}, {"id": "2"}]
    query.filter.assert_called_once()
    filtered.order_by.assert_called_once()
    ordered.limit.assert_called_once_with(2)


def test_get_job_returns_serialized_record_or_none(job_store, mock_db):
    """Lookups should serialize the job when found and return None otherwise."""
    query = MagicMock()
    filtered = MagicMock()
    mock_db.query.return_value = query
    query.filter.return_value = filtered
    record = MagicMock()
    record.to_dict.return_value = {"id": "job-1"}
    filtered.first.return_value = record

    assert asyncio.run(job_store.get_job("job-1")) == {"id": "job-1"}

    filtered.first.return_value = None
    assert asyncio.run(job_store.get_job("missing")) is None


def test_update_job_applies_known_fields_and_metadata(job_store, mock_db):
    """Known fields should be updated and metadata should map to job_metadata."""
    query = MagicMock()
    filtered = MagicMock()
    mock_db.query.return_value = query
    query.filter.return_value = filtered
    record = SimpleNamespace(title="Old title", job_metadata={"old": True})
    filtered.first.return_value = record

    result = asyncio.run(
        job_store.update_job(
            "job-1",
            {"title": "New title", "metadata": {"fresh": True}, "unknown_field": "ignored"},
        )
    )

    assert result is True
    assert record.title == "New title"
    assert record.job_metadata == {"fresh": True}
    assert not hasattr(record, "unknown_field")
    mock_db.commit.assert_called_once()


def test_update_job_returns_false_when_record_missing(job_store, mock_db):
    """Missing jobs should not trigger commits."""
    query = MagicMock()
    filtered = MagicMock()
    mock_db.query.return_value = query
    query.filter.return_value = filtered
    filtered.first.return_value = None

    assert asyncio.run(job_store.update_job("missing", {"title": "No-op"})) is False
    mock_db.commit.assert_not_called()


def test_delete_job_removes_existing_record(job_store, mock_db):
    """Delete should remove the row and commit the transaction."""
    query = MagicMock()
    filtered = MagicMock()
    mock_db.query.return_value = query
    query.filter.return_value = filtered
    record = MagicMock()
    filtered.first.return_value = record

    assert asyncio.run(job_store.delete_job("job-1")) is True
    mock_db.delete.assert_called_once_with(record)
    mock_db.commit.assert_called_once()


def test_delete_job_returns_false_when_record_missing(job_store, mock_db):
    """Delete should return False when no job matches the id."""
    query = MagicMock()
    filtered = MagicMock()
    mock_db.query.return_value = query
    query.filter.return_value = filtered
    filtered.first.return_value = None

    assert asyncio.run(job_store.delete_job("missing")) is False
    mock_db.delete.assert_not_called()


def test_get_job_store_wraps_session(mock_db):
    """The FastAPI dependency helper should return a configured store."""
    store = get_job_store(db=mock_db)

    assert isinstance(store, SQLAlchemyJobStore)
    assert store.db is mock_db
