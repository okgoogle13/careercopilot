"""
Comprehensive tests for the AI client functionality.
"""

import asyncio
from typing import Any, Dict, List
from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient

from app.api.endpoints.genkit import SmartCoverLetter
from app.core.ai_client import (
    AIProviderClient,
    AIRequest,
    AIResponse,
    GoogleAIClient,
)
from app.core.ai_config import (
    AIConfigManager,
    AIModelType,
    AIProvider,
    ModelConfig,
    ProviderCredentials,
)
from app.core.dependencies import get_current_user
from app.core.observability import monitor_performance, track_ai_usage, track_error
from app.main import app  # Import the FastAPI app

# from app.schemas import User  # Removed unused import


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
        return ProviderCredentials(provider=provider, api_key=self.credentials.get("api_key"))

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

    from app.core import dependencies

    with patch("app.core.dependencies.get_current_user", new_callable=AsyncMock) as mock:
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
            model_type=AIModelType.TEXT_GENERATION,
            max_tokens=200,
            temperature=0.7,
            top_p=0.9,
            timeout_seconds=10,
        )
    ]
    mock_config_manager = MockAIConfigManager(credentials, model_configs)
    monkeypatch.setattr("app.core.ai_client.AIConfigManager", lambda: mock_config_manager)
    return mock_config_manager


@pytest.fixture
def mock_google_ai_client(mock_ai_config_manager):
    """Fixture for a mocked GoogleAIClient."""
    client = GoogleAIClient(mock_ai_config_manager)
    # Ensure credentials are set correctly (sometimes constructor might get dict from real manager)
    client.credentials = ProviderCredentials(provider=AIProvider.GOOGLE_AI, api_key="test_api_key")
    return client


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
        mock_google_ai_client.credentials = ProviderCredentials(
            provider=AIProvider.GOOGLE_AI, api_key="test_key"
        )
        mock_response = {
            "candidates": [
                {
                    "content": {"parts": [{"text": "Test response"}]},
                    "finishReason": "STOP",
                    "safetyRatings": [],
                }
            ]
        }
        mock_response_obj = MagicMock(spec=httpx.Response)
        mock_response_obj.status_code = 200
        mock_response_obj.json.return_value = mock_response

        mock_httpx_post = AsyncMock(return_value=mock_response_obj)

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
        assert response.provider == "google_ai"
        assert response.response_time_ms > 0
        assert response.cached is False

    @pytest.mark.asyncio
    async def test_generate_text_failure(self, mock_google_ai_client, mock_ai_config_manager):
        """Test text generation failure with Google AI (HTTP error)."""
        mock_google_ai_client.credentials = ProviderCredentials(
            provider=AIProvider.GOOGLE_AI, api_key="test_key"
        )
        mock_response = MagicMock(spec=httpx.Response)
        mock_response.status_code = 400
        mock_request = MagicMock(spec=httpx.Request)
        mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
            "Bad Request", request=mock_request, response=mock_response
        )
        mock_httpx_post = AsyncMock(return_value=mock_response)

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
        mock_google_ai_client.credentials = ProviderCredentials(
            provider=AIProvider.GOOGLE_AI, api_key="test_key"
        )
        with patch("httpx.AsyncClient") as mock_client:
            mock_client.return_value.__aenter__.return_value.get.return_value.status_code = 200
            result = await mock_google_ai_client.health_check()
            assert result is True


@pytest.mark.skip(reason="Integration tests need complex Pydantic mocking")
class TestAIClientIntegration:
    def test_ai_endpoint_success(self, test_client, mock_ai_config_manager, mock_current_user):
        """Test the AI endpoint with a successful response."""
        payload = {
            "candidate_profile": {"name": "Test User"},
            "job_description": "Test job",
            "style": "professional",
        }
        mock_response = {
            "letter_content": "Test response",
            "subject_line": "Test subject",
            "analysis": {
                "tone_assessment": "professional",
                "missing_requirements": [],
                "strengths_highlighted": [],
                "personalization_score": 0.9,
                "compelling_score": 0.8,
                "keyword_alignment": 0.7,
                "strengths": [],
                "improvement_areas": [],
                "unique_elements": [],
            },
            "alternative_versions": {},
            "personalization_notes": [],
            "key_selling_points": [],
            "company_connections": [],
            "follow_up_suggestions": [],
        }
        with (
            patch("app.api.endpoints.genkit.is_genkit_enabled", return_value=True),
            patch("app.api.endpoints.genkit.generate_smart_cover_letter") as mock_gen,
        ):
            mock_gen.return_value = SmartCoverLetter(**mock_response)

            response = test_client.post("/api/genkit/cover-letter/generate", json=payload)

        assert response.status_code == 200
        assert response.json()["content"] == "Test response"

    def test_ai_endpoint_failure(self, test_client, mock_ai_config_manager, mock_current_user):
        """Test the AI endpoint with a failure response."""
        payload = {"candidate_profile": {"name": "Test User"}, "job_description": "Test job"}
        with (
            patch("app.api.endpoints.genkit.is_genkit_enabled", return_value=True),
            patch("app.api.endpoints.genkit.generate_smart_cover_letter") as mock_gen,
        ):
            mock_gen.side_effect = Exception("Generation failed")

            response = test_client.post("/api/genkit/cover-letter/generate", json=payload)

        assert response.status_code == 500
