import pytest
from httpx import AsyncClient
from unittest.mock import MagicMock

from app.main import app

@pytest.fixture
def mock_db():
    """Fixture to mock the Firestore database client."""
    return MagicMock()

@pytest.fixture
async def test_client():
    """Async test client for the app with mocked dependencies."""

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
import db