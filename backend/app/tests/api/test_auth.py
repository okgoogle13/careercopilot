"""Tests for /auth API endpoints."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest


@pytest.fixture
def auth_client(client):
    from app.core.dependencies import get_current_user

    # Ensure name is present for the /me endpoint
    mock_user = SimpleNamespace(
        id="test_user_id", uid="test_uid", email="test@example.com", name="Test User"
    )
    client.app.dependency_overrides[get_current_user] = lambda: mock_user
    yield client
    # Dependency overrides are cleared in conftest's client fixture, but let's be safe
    if get_current_user in client.app.dependency_overrides:
        del client.app.dependency_overrides[get_current_user]


class TestAuthEndpoints:
    def test_get_me_happy_path(self, auth_client):
        """Should return user info from /me."""
        response = auth_client.get("/api/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == "test_user_id"
        assert data["name"] == "Test User"

    def test_create_voice_profile_happy_path(self, auth_client):
        """Should call voiceProfileExtractorFlow after combining documents."""
        with patch(
            "app.api.endpoints.auth.voiceProfileExtractorFlow", new_callable=AsyncMock
        ) as mock_flow:
            response = auth_client.post("/api/auth/voice-profile", json=["Doc 1", "  ", "Doc 2"])
        assert response.status_code == 200
        assert response.json()["user_id"] == "test_user_id"
        # Check that empty/whitespace docs were filtered
        args, kwargs = mock_flow.call_args
        assert "Doc 1\n\n---\n\nDoc 2" in kwargs["writingSample"]

    def test_create_voice_profile_no_docs_returns_400(self, auth_client):
        """Should return 400 if no valid documents provided."""
        response = auth_client.post("/api/auth/voice-profile", json=[" ", ""])
        assert response.status_code == 400
        assert "At least one document" in response.json()["detail"]
