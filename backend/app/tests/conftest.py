from unittest.mock import MagicMock

import pytest
from app.core.dependencies import get_current_user
from app.main import app
from httpx import AsyncClient


@pytest.fixture
def mock_db():
    """Fixture to mock the Firestore database client."""
    return MagicMock()


@pytest.fixture
def mock_get_current_user():
    """Fixture to mock the get_current_user dependency."""
    return lambda: {"uid": "test_user_id"}


@pytest.fixture
async def client(monkeypatch, mock_db, mock_get_current_user):
    """Async test client for the app with mocked dependencies."""
    # monkeypatch.setattr(db, "db", mock_db)  # TODO: Fix db import
    app.dependency_overrides[get_current_user] = mock_get_current_user

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
