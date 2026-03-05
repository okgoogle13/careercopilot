"""
Tests for ingestion routers.
"""

from unittest.mock import MagicMock, patch

import pytest
from fastapi import Depends, HTTPException
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core import dependencies
from app.core.config import settings
from app.main import app
from app.models import User
from app.routers import ingestion_routers
from app.schemas import IngestionResponse, IngestionSchema


# Mock database session
@pytest.fixture
def mock_db_session():
    """Mock database session."""
    session = MagicMock(spec=Session)
    return session


# Mock current user
@pytest.fixture
def mock_current_user(monkeypatch):
    """Mock authenticated user."""

    def mock_get_current_user():
        return User(id="test", email="test@example.com")

    from app.core import dependencies

    monkeypatch.setattr(dependencies, "get_current_user", mock_get_current_user)


# Create a test client
client = TestClient(app)


class TestIngestionCreate:
    """Tests for creating ingestion data."""

    @pytest.fixture
    def mock_create_ingestion(self, mock_db_session):
        """Mock the create_ingestion function."""
        with patch("app.routers.ingestion_routers.create_ingestion") as mock:
            mock.return_value = IngestionResponse(id=1, data={"test": "data"})
            mock.return_value.model_dump = lambda: {"id": 1, "data": {"test": "data"}}
            return mock

    def test_create_ingestion_success(self, mock_current_user, mock_create_ingestion):
        """Test successful ingestion creation."""
        data = {"key1": "value1", "key2": 123}
        response = client.post("/ingestion/", json=data)
        assert response.status_code == 201
        assert response.json() == {"id": 1, "data": {"test": "data"}}
        mock_create_ingestion.assert_called_once()

    def test_create_ingestion_validation_error(self, mock_current_user):
        """Test ingestion creation with invalid data."""
        data = {"key1": "value1"}  # Missing key2
        response = client.post("/ingestion/", json=data)
        assert response.status_code == 422
        assert "key2" in str(response.json())

    def test_create_ingestion_unauthorized(self, monkeypatch):
        """Test ingestion creation without authentication."""
        monkeypatch.setattr(dependencies, "get_current_user", lambda: None)
        data = {"key1": "value1", "key2": 123}
        response = client.post("/ingestion/", json=data)
        assert response.status_code == 401


class TestIngestionRead:
    """Tests for reading ingestion data."""

    @pytest.fixture
    def mock_get_ingestion(self, mock_db_session):
        """Mock the get_ingestion function."""
        with patch("app.routers.ingestion_routers.get_ingestion") as mock:
            mock.return_value = IngestionResponse(id=1, data={"test": "data"})
            mock.return_value.model_dump = lambda: {"id": 1, "data": {"test": "data"}}
            return mock

    def test_read_ingestion_success(self, mock_current_user, mock_get_ingestion):
        """Test successful ingestion retrieval."""
        response = client.get("/ingestion/1")
        assert response.status_code == 200
        assert response.json() == {"id": 1, "data": {"test": "data"}}
        mock_get_ingestion.assert_called_once_with(1)

    def test_read_ingestion_not_found(self, mock_current_user):
        """Test ingestion retrieval with non-existent ID."""
        with patch("app.routers.ingestion_routers.get_ingestion") as mock:
            mock.side_effect = HTTPException(status_code=404, detail="Ingestion not found")
        response = client.get("/ingestion/999")
        assert response.status_code == 404
        assert response.json() == {"detail": "Ingestion not found"}

    def test_read_ingestion_unauthorized(self, monkeypatch):
        """Test ingestion retrieval without authentication."""
        monkeypatch.setattr(dependencies, "get_current_user", lambda: None)
        response = client.get("/ingestion/1")
        assert response.status_code == 401


class TestIngestionUpdate:
    """Tests for updating ingestion data."""

    @pytest.fixture
    def mock_update_ingestion(self, mock_db_session):
        """Mock the update_ingestion function."""
        with patch("app.routers.ingestion_routers.update_ingestion") as mock:
            mock.return_value = IngestionResponse(id=1, data={"updated": "data"})
            mock.return_value.model_dump = lambda: {"id": 1, "data": {"updated": "data"}}
            return mock

    def test_update_ingestion_success(self, mock_current_user, mock_update_ingestion):
        """Test successful ingestion update."""
        data = {"key1": "new_value", "key2": 456}
        response = client.put("/ingestion/1", json=data)
        assert response.status_code == 200
        assert response.json() == {"id": 1, "data": {"updated": "data"}}
        mock_update_ingestion.assert_called_once_with(1, data)

    def test_update_ingestion_not_found(self, mock_current_user):
        """Test ingestion update with non-existent ID."""
        with patch("app.routers.ingestion_routers.update_ingestion") as mock:
            mock.side_effect = HTTPException(status_code=404, detail="Ingestion not found")
        response = client.put("/ingestion/999", json={"key1": "value"})
        assert response.status_code == 404
        assert response.json() == {"detail": "Ingestion not found"}

    def test_update_ingestion_unauthorized(self, monkeypatch):
        """Test ingestion update without authentication."""
        monkeypatch.setattr(dependencies, "get_current_user", lambda: None)
        data = {"key1": "value"}
        response = client.put("/ingestion/1", json=data)
        assert response.status_code == 401


class TestIngestionDelete:
    """Tests for deleting ingestion data."""

    @pytest.fixture
    def mock_delete_ingestion(self, mock_db_session):
        """Mock the delete_ingestion function."""
        with patch("app.routers.ingestion_routers.delete_ingestion") as mock:
            mock.return_value = True
            return mock

    def test_delete_ingestion_success(self, mock_current_user, mock_delete_ingestion):
        """Test successful ingestion deletion."""
        response = client.delete("/ingestion/1")
        assert response.status_code == 200
        assert response.json() == {"message": "Ingestion deleted successfully"}
        mock_delete_ingestion.assert_called_once_with(1)

    def test_delete_ingestion_not_found(self, mock_current_user):
        """Test ingestion deletion with non-existent ID."""
        with patch("app.routers.ingestion_routers.delete_ingestion") as mock:
            mock.side_effect = HTTPException(status_code=404, detail="Ingestion not found")
        response = client.delete("/ingestion/999")
        assert response.status_code == 404
        assert response.json() == {"detail": "Ingestion not found"}

    def test_delete_ingestion_unauthorized(self, monkeypatch):
        """Test ingestion deletion without authentication."""
        monkeypatch.setattr(dependencies, "get_current_user", lambda: None)
        response = client.delete("/ingestion/1")
        assert response.status_code == 401
