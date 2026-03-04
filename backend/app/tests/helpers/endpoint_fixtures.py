"""Reusable fixtures for API endpoint tests."""

from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client():
    """Create a lightweight API test client."""
    from app.main import app

    return TestClient(app)


@pytest.fixture
def authenticated_client():
    """Create a test client with the common auth dependencies overridden."""
    from app.core.auth import get_current_user as auth_get_current_user
    from app.core.dependencies import get_current_user as dependencies_get_current_user
    from app.main import app

    authenticated_user = SimpleNamespace(
        id="test-user-endpoint",
        email="endpoint@test.com",
        name="Endpoint Test User",
        auth_provider="firebase",
    )

    def override_current_user():
        return authenticated_user

    app.dependency_overrides[dependencies_get_current_user] = override_current_user
    app.dependency_overrides[auth_get_current_user] = override_current_user

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def mock_current_user(monkeypatch):
    """Mock an authenticated backend user."""

    def mock_get_current_user():
        return SimpleNamespace(
            id="test-user-genkit",
            email="genkit@test.com",
            name="Genkit Test User",
            auth_provider="firebase",
        )

    from app.core import dependencies

    monkeypatch.setattr(dependencies, "get_current_user", mock_get_current_user)


@pytest.fixture
def mock_genkit_enabled():
    """Mock Genkit as enabled."""
    with patch("app.api.endpoints.genkit.is_genkit_enabled", return_value=True):
        yield


@pytest.fixture
def mock_genkit_disabled():
    """Mock Genkit as disabled."""
    with patch("app.api.endpoints.genkit.is_genkit_enabled", return_value=False):
        yield


@pytest.fixture
def mock_uploaded_text():
    """Mock the canonical upload text extractor used by ingestion endpoints."""
    with patch(
        "app.api.endpoints._shared.extract_text_from_upload", new_callable=AsyncMock
    ) as mock:
        yield mock


def make_upload_payload(
    filename: str = "resume.txt",
    content: bytes = b"Sample resume text",
    content_type: str = "text/plain",
) -> dict[str, tuple[str, bytes, str]]:
    """Return a simple multipart payload for file-upload endpoint tests."""
    return {"files": (filename, content, content_type)}
