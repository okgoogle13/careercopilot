"""
Comprehensive tests for the SQLAlchemyJobStore class.
"""

from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.database import Job
from app.services.job_store import SQLAlchemyJobStore, get_job_store


# Mock User model for testing purposes
class User:
    def __init__(self, id, email):
        self.id = id
        self.email = email


@pytest.fixture
def mock_db():
    """
    Fixture to create a mock database session.
    """
    db_mock = MagicMock(spec=Session)
    yield db_mock


@pytest.fixture
def mock_current_user(monkeypatch):
    """Mock authenticated user."""

    def mock_get_current_user():
        return User(id="test", email="test@example.com")

    from app.core import dependencies

    monkeypatch.setattr(dependencies, "get_current_user", mock_get_current_user)


@pytest.fixture
def client(mock_db):
    """
    Fixture to create a test client with a mocked database.
    """
    app = pytest.importnodes(["app.main"]).app  # Import the FastAPI app
    app.dependency_overrides[get_db] = lambda: mock_db
    client = TestClient(app)
    return client


class TestSQLAlchemyJobStoreAddJob:
    @pytest.mark.asyncio
    async def test_add_job_success(self, mock_db):
        """Test adding a job successfully."""
        job_data = {
            "user_id": "test_user",
            "title": "Test Job",
            "company": "Test Company",
            "posted_date": datetime.utcnow().isoformat(),
        }
        job_store = SQLAlchemyJobStore(mock_db)
        job_id = await job_store.add_job(job_data)
        assert job_id is not None
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
        mock_db.refresh.assert_called_once()

    @pytest.mark.asyncio
    async def test_add_job_missing_user_id(self, mock_db):
        """Test adding a job without user_id."""
        job_data = {"title": "Test Job", "company": "Test Company"}
        job_store = SQLAlchemyJobStore(mock_db)
        with pytest.raises(ValueError):
            await job_store.add_job(job_data)

    @pytest.mark.asyncio
    async def test_add_job_with_default_values(self, mock_db):
        """Test adding a job with default values."""
        job_data = {"user_id": "test_user"}
        job_store = SQLAlchemyJobStore(mock_db)
        job_id = await job_store.add_job(job_data)
        assert job_id is not None
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
        mock_db.refresh.assert_called_once()


class TestSQLAlchemyJobStoreGetAllJobs:
    @pytest.mark.asyncio
    async def test_get_all_jobs_no_user_id(self, mock_db):
        """Test getting all jobs without user_id."""
        jobs = [
            Job(id="1", user_id="user1", title="Job 1"),
            Job(id="2", user_id="user2", title="Job 2"),
        ]
        mock_db.query.return_mock.all.return_value = jobs
        job_store = SQLAlchemyJobStore(mock_db)
        result = await job_store.get_all_jobs()
        assert len(result) == 2
        assert result[0]["id"] == "1"
        assert result[1]["id"] == "2"

    @pytest.mark.asyncio
    async def test_get_all_jobs_with_user_id(self, mock_db):
        """Test getting all jobs with user_id."""
        jobs = [
            Job(id="1", user_id="test", title="Job 1"),
            Job(id="2", user_id="test", title="Job 2"),
        ]
        mock_db.query.return_mock.filter.return_value.all.return_value = jobs
        job_store = SQLAlchemyJobStore(mock_db)
        result = await job_store.get_all_jobs(user_id="test")
        assert len(result) == 2
        assert result[0]["id"] == "1"
        assert result[1]["id"] == "2"

    @pytest.mark.asyncio
    async def test_get_all_jobs_with_limit(self, mock_db):
        """Test getting all jobs with a limit."""
        jobs = [
            Job(id="1", user_id="test", title="Job 1"),
            Job(id="2", user_id="test", title="Job 2"),
            Job(id="3", user_id="test", title="Job 3"),
        ]
        mock_db.query.return_mock.limit.return_value.all.return_value = jobs[:2]
        job_store = SQLAlchemyJobStore(mock_db)
        result = await job_store.get_all_jobs(limit=2)
        assert len(result) == 2
        assert result[0]["id"] == "1"
        assert result[1]["id"] == "2"


class TestSQLAlchemyJobStoreGetJob:
    @pytest.mark.asyncio
    async def test_get_job_success(self, mock_db):
        """Test getting a job successfully."""
        job = Job(id="1", user_id="test", title="Test Job")
        mock_db.query.return_mock.filter.return_value.first.return_value = job
        job_store = SQLAlchemyJobStore(mock_db)
        result = await job_store.get_job("1")
        assert result["id"] == "1"
        assert result["title"] == "Test Job"

    @pytest.mark.asyncio
    async def test_get_job_not_found(self, mock_db):
        """Test getting a job that does not exist."""
        mock_db.query.return_mock.filter.return_value.first.return_value = None
        job_store = SQLAlchemyJobStore(mock_db)
        result = await job_store.get_job("999")
        assert result is None


class TestSQLAlchemyJobStoreUpdateJob:
    @pytest.mark.asyncio
    async def test_update_job_success(self, mock_db):
        """Test updating a job successfully."""
        job = Job(id="1", user_id="test", title="Old Title")
        mock_db.query.return_mock.filter.return_value.first.return_value = job
        job_store = SQLAlchemyJobStore(mock_db)
        updates = {"title": "New Title"}
        result = await job_store.update_job("1", updates)
        assert result is True
        assert job.title == "New Title"
        mock_db.commit.assert_called_once()

    @pytest.mark.asyncio
    async def test_update_job_not_found(self, mock_db):
        """Test updating a job that does not exist."""
        mock_db.query.return_mock.filter.return_value.first.return_value = None
        job_store = SQLAlchemyJobStore(mock_db)
        updates = {"title": "New Title"}
        result = await job_store.update_job("999", updates)
        assert result is False

    @pytest.mark.asyncio
    async def test_update_job_metadata(self, mock_db):
        """Test updating job metadata."""
        job = Job(id="1", user_id="test", title="Old Title", job_metadata={})
        mock_db.query.return_mock.filter.return_value.first.return_value = job
        job_store = SQLAlchemyJobStore(mock_db)
        updates = {"metadata": {"key": "value"}}
        result = await job_store.update_job("1", updates)
        assert result is True
        assert job.job_metadata == {"key": "value"}
        mock_db.commit.assert_called_once()


class TestSQLAlchemyJobStoreDeleteJob:
    @pytest.mark.asyncio
    async def test_delete_job_success(self, mock_db):
        """Test deleting a job successfully."""
        job = Job(id="1", user_id="test", title="Test Job")
        mock_db.query.return_mock.filter.return_value.first.return_value = job
        job_store = SQLAlchemyJobStore(mock_db)
        result = await job_store.delete_job("1")
        assert result is True
        mock_db.delete.assert_called_once()
        mock_db.commit.assert_called_once()

    @pytest.mark.asyncio
    async def test_delete_job_not_found(self, mock_db):
        """Test deleting a job that does not exist."""
        mock_db.query.return_mock.filter.return_value.first.return_value = None
        job_store = SQLAlchemyJobStore(mock_db)
        result = await job_store.delete_job("999")
        assert result is False


class TestSQLAlchemyJobStoreStats:
    @pytest.mark.asyncio
    async def test_get_stats(self, mock_db):
        """Test getting job store stats."""
        jobs = [
            Job(id="1", user_id="test", title="Job 1"),
            Job(id="2", user_id="test", title="Job 2"),
        ]
        mock_db.query.return_mock.count.return_value = 2
        job_store = SQLAlchemyJobStore(mock_db)
        stats = await job_store.get_stats()
        assert stats["mode"] == "postgresql"
        assert stats["count"] == 2
