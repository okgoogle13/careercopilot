from unittest.mock import MagicMock

import pytest
from app.core.dependencies import get_current_user
from app.main import app
from httpx import ASGITransport, AsyncClient


import asyncio
from unittest.mock import AsyncMock, MagicMock


@pytest.fixture
def mock_db():
    """Fixture to mock the Firestore database client."""
    mock = MagicMock()
    mock.collection.return_value.document.return_value.get = AsyncMock()
    return mock


@pytest.fixture(autouse=True)
def mock_get_db(monkeypatch, mock_db):
    """Mocks the get_db function for all tests."""
    monkeypatch.setattr("app.core.db.get_db", lambda: mock_db)


@pytest.fixture
def mock_get_current_user():
    """Fixture to mock the get_current_user dependency."""
    return lambda: {"uid": "test_user_id"}


@pytest.fixture
async def client(mock_get_current_user):
    """Async test client for the app with mocked dependencies."""
    app.dependency_overrides[get_current_user] = mock_get_current_user

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

    app.dependency_overrides.clear()
