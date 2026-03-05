"""
Comprehensive tests for the AI client functionality.
"""

import asyncio
from typing import Any, Dict, List
from unittest.mock import AsyncMock, patch

import httpx
import pytest
from fastapi.testclient import TestClient

from backend.app.core.ai_client import (
    AIConfigManager,
    AIProvider,
    AIProviderClient,
    AIRequest,
    AIResponse,
    GoogleAIClient,
    ModelConfig,
    ProviderCredentials,
)
from backend.app.core.dependencies import get_current_user
from backend.app.core.observability import monitor_performance, track_ai_usage, track_error
from backend.app.main import app  # Import the FastAPI app
from backend.app.schemas import User


# Mock User class for testing
class MockUser(object):
    def __init__(self, id, email):
        self.id = id
        self.email = email


# Mock AIConfigManager
class MockAIConfigManager(AIConfigManager):
    def __init__(self, credentials: Dict[str, str], model_configs: List[ModelConfig]):
        self.credentials = credentials
        self.model_configs = model_configs

    def get_provider_credentials(self, provider: AIProvider) -> ProviderCredentials | None:  # type: ignore[override]
        return ProviderCredentials(provider=provider, api_key=self.credentials.get("api_key"))  # type: ignore[arg-type]

    def get_model_config(self, model_name: str) -> ModelConfig | None:  # type: ignore[override]
        for config in self.model_configs:
            if config.name == model_name:
                return config
        return None


@pytest.fixture
def mock_current_user():
    """Mock authenticated user."""

    def mock_get_current_user():
        return MockUser(id="test", email="test@example.com")

    from backend.app.core import dependencies

    with patch("backend.app.core.dependencies.get_current_user", new_callable=AsyncMock) as mock:
        mock.return_value = MockUser(id="test", email="test@example.com")
        yield mock


@pytest.fixture
def mock_ai_config_manager(monkeypatch):
    """Mock AIConfigManager for testing."""
    credentials = {"api_key": "test_api_key"}
    model_configs = [
        ModelConfig(
            name="gemini-pro",
            model_id="gemini-pro",
            provider=AIProvider.GOOGLE_AI,
            max_tokens=200,
            temperature=0.7,
            top_p=0.9,
            timeout_seconds=10,
        )
    ]
    mock_config_manager = MockAIConfigManager(credentials, model_configs)
    monkeypatch.setattr("backend.app.core.ai_client.AIConfigManager", lambda: mock_config_manager)
    return mock_config_manager


@pytest.fixture
def mock_google_ai_client(mock_ai_config_manager):
    """Fixture for a mocked GoogleAIClient."""
    return GoogleAIClient(mock_ai_config_manager)


@pytest.fixture
def test_client():
    """Fixture for a test client."""
    return TestClient(app)


class TestGoogleAIClient:
    @pytest.mark.asyncio
    async def test_generate_text_success(
        self, mock_google_ai_client, mock_ai_config_manager, mock_current_user
    ):
        """Test successful text generation with Google AI."""
        mock_google_ai_client.credentials = {"api_key": "test_key"}
        mock_response = {
            "candidates": [
                {
                    "content": {"parts": [{"text": "Test response"}]},
                    "finishReason": "STOP",
                    "safetyRatings": [],
                }
            ]
        }
        mock_httpx_post = AsyncMock()
        mock_httpx_post.return_value.status_code = 200
        mock_httpx_post.return_value.json.return_value = mock_response

        with patch("httpx.AsyncClient") as mock_client:
            mock_client.return_value.__aenter__.return_value.post = mock_httpx_post

        request = AIRequest(
            prompt="Test prompt",
            service_name="test_service",
            user_id="test_user",
            model_name="gemini-pro",
        )
        model_config = mock_ai_config_manager.get_model_config("gemini-pro")

        response = await mock_google_ai_client.generate_text(request, model_config)

        assert response.content == "Test response"
        assert response.provider == "GOOGLE_AI"
        assert response.response_time_ms > 0
        assert response.cached is False

    @pytest.mark.asyncio
    async def test_generate_text_failure(self, mock_google_ai_client, mock_ai_config_manager):
        """Test text generation failure with Google AI (HTTP error)."""
        mock_google_ai_client.credentials = {"api_key": "test_key"}
        mock_httpx_post = AsyncMock()
        mock_httpx_post.return_value.status_code = 400
        mock_httpx_post.return_value.raise_for_status.side_effect = httpx.HTTPStatusError(
            "Bad Request", response=mock_httpx_post.return_value
        )

        with patch("httpx.AsyncClient") as mock_client:
            mock_client.return_value.__aenter__.return_value.post = mock_httpx_post

        request = AIRequest(
            prompt="Test prompt",
            service_name="test_service",
            user_id="test_user",
            model_name="gemini-pro",
        )
        model_config = mock_ai_config_manager.get_model_config("gemini-pro")

        with pytest.raises(httpx.HTTPStatusError) as exc_info:
            await mock_google_ai_client.generate_text(request, model_config)

        assert "Bad Request" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_generate_text_no_credentials(self, mock_google_ai_client):
        """Test text generation with no credentials configured."""
        mock_google_ai_client.credentials = None
        request = AIRequest(
            prompt="Test prompt",
            service_name="test_service",
            user_id="test_user",
            model_name="gemini-pro",
        )
        model_config = mock_google_ai_client.config_manager.get_model_config("gemini-pro")

        with pytest.raises(ValueError) as exc_info:
            await mock_google_ai_client.generate_text(request, model_config)

        assert "Google AI credentials not configured" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_health_check(self, mock_google_ai_client):
        """Test health check functionality."""
        mock_google_ai_client.credentials = {"api_key": "test_key"}
        with patch.object(mock_google_ai_client, "base_url", "https://test.com"):
            result = await mock_google_ai_client.health_check()
        assert result is True


class TestAIClientIntegration:
    @pytest.mark.asyncio
    async def test_ai_endpoint_success(
        self, test_client, mock_ai_config_manager, mock_current_user
    ):
        """Test the AI endpoint with a successful response."""
        mock_response = {
            "candidates": [
                {
                    "content": {"parts": [{"text": "Test response"}]},
                    "finishReason": "STOP",
                    "safetyRatings": [],
                }
            ]
        }
        with patch("httpx.AsyncClient") as mock_client:
            mock_client.return_value.__aenter__.return_value.post.return_value.status_code = 200
            mock_client.return_value.__aenter__.return_value.post.return_value.json.return_value = (
                mock_response
            )

        response = await test_client.post("/ai", json={"prompt": "Test prompt"})
        assert response.status_code == 200
        assert response.json()["content"] == "Test response"

    @pytest.mark.asyncio
    async def test_ai_endpoint_failure(
        self, test_client, mock_ai_config_manager, mock_current_user
    ):
        """Test the AI endpoint with a failure response."""
        with patch("httpx.AsyncClient") as mock_client:
            mock_client.return_value.__aenter__.return_value.post.return_value.status_code = 500
            mock_client.return_value.__aenter__.return_value.post.return_value.raise_for_status.side_effect = httpx.HTTPStatusError(
                "Internal Server Error",
                response=mock_client.return_value.__aenter__.return_value.post.return_value,
            )

        response = await test_client.post("/ai", json={"prompt": "Test prompt"})
        assert response.status_code == 500
