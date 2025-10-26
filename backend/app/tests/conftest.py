from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.core.dependencies import get_current_user
from app.main import app


@pytest.fixture
def mock_db():
    """Fixture to mock the Firestore database client."""
    return MagicMock()


@pytest.fixture
def mock_get_current_user():
    """Fixture to mock the get_current_user dependency."""
    return lambda: {"uid": "test_user_id"}


@pytest.fixture
def client(monkeypatch, mock_db, mock_get_current_user):
    """Sync test client for the app with mocked dependencies."""
    # monkeypatch.setattr(db, "db", mock_db)  # TODO: Fix db import
    app.dependency_overrides[get_current_user] = mock_get_current_user

    with TestClient(app) as tc:
        yield tc

    app.dependency_overrides.clear()
