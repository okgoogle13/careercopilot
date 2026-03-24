"""Tests for /auth API endpoints."""

import sys
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest


@pytest.fixture
def auth_client(client):
    from app.core.auth import get_current_user

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

    def test_get_voice_profile_returns_profile(self, auth_client):
        """Should return mapped voice profile fields when profile exists."""
        mock_result = {
            "tone": "Professional",
            "style": "Concise and direct",
            "vocabularyLevel": "Advanced",
            "common_phrases": ["leveraged", "delivered outcomes"],
            "savedAt": "2025-01-15T10:00:00Z",
        }
        mock_vp_instance = MagicMock()
        mock_vp_instance.generate_voice_profile = AsyncMock(return_value=mock_result)
        mock_vp_module = MagicMock()
        mock_vp_module.voice_profiler = mock_vp_instance
        with patch.dict(sys.modules, {"app.ai_operations.voice_profiler": mock_vp_module}):
            response = auth_client.get("/api/auth/voice-profile")
        assert response.status_code == 200
        data = response.json()
        assert data["tone"] == "Professional"
        assert data["style"] == "Concise and direct"
        assert data["vocabularyLevel"] == "Advanced"
        assert data["preferredPhrasing"] == ["leveraged", "delivered outcomes"]
        assert data["savedAt"] == "2025-01-15T10:00:00Z"

    def test_get_voice_profile_returns_null_when_none(self, auth_client):
        """Should return null body when no voice profile exists."""
        mock_vp_instance = MagicMock()
        mock_vp_instance.generate_voice_profile = AsyncMock(return_value=None)
        mock_vp_module = MagicMock()
        mock_vp_module.voice_profiler = mock_vp_instance
        with patch.dict(sys.modules, {"app.ai_operations.voice_profiler": mock_vp_module}):
            response = auth_client.get("/api/auth/voice-profile")
        assert response.status_code == 200
        assert response.json() is None
