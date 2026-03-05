"""
Comprehensive tests for the AI client functionality.
"""

import asyncio
from typing import Any, Dict, List, Optional
from unittest.mock import AsyncMock, patch

import httpx
import pytest
from fastapi.testclient import TestClient

from app.core.ai_client import (
    SUPPORTED_PROVIDERS,
    AIConfigManager,
    AIProvider,
    AIProviderClient,
    AIRequest,
    AIResponse,
    GoogleAIClient,
    ModelConfig,
)
from app.core.observability import monitor_performance, track_ai_usage, track_error
from app.models.user import User


# Mock AIConfigManager for testing
class MockAIConfigManager(AIConfigManager):
    def __init__(
        self,
        provider_credentials: Optional[Dict[str, str]] = None,
        model_configs: Optional[List[ModelConfig]] = None,
    ):
        self.provider_credentials = provider_credentials or {}
        self.model_configs = model_configs or []

    def get_provider_credentials(self, provider: AIProvider) -> Any:
        return self.provider_credentials.get(provider.value)

    def get_model_config(self, model_name: str) -> ModelConfig:
        for config in self.model_configs:
            if config.name == model_name:
                return config
        return None


# Mock ModelConfig for testing
class MockModelConfig(ModelConfig):
    def __init__(
        self,
        name: str,
        model_id: str,
        max_tokens: int = 100,
        temperature: float = 0.7,
        timeout_seconds: int = 10,
        top_p: float = 1.0,
    ):
        self.name = name
        self.model_id = model_id
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.timeout_seconds = timeout_seconds
        self.top_p = top_p


@pytest.fixture
def ai_client(mock_ai_config_manager):
    return GoogleAIClient(mock_ai_config_manager)


@pytest.fixture
def mock_ai_config_manager():
    credentials = {"GOOGLE_AI": "test_api_key"}
    model_config = MockModelConfig(name="test_model", model_id="gemini-1.0-pro")
    return MockAIConfigManager(provider_credentials=credentials, model_configs=[model_config])


@pytest.fixture
def mock_httpx_client():
    with patch("httpx.AsyncClient") as mock_client:
        yield mock_client


@pytest.fixture
def mock_response():
    # Mock Gemini API response
    response_data = {
        "candidates": [
            {
                "content": {"parts": [{"text": "Test response content"}]},
                "finishReason": "STOP",
                "safetyRatings": [],
            }
        ]
    }
    return response_data


class TestGoogleAIClient:
    @pytest.mark.asyncio
    async def test_generate_text_success(self, ai_client, mock_httpx_client, mock_response):
        request = AIRequest(prompt="Test prompt", service_name="test_service", user_id="test_user")
        model_config = ai_client.config_manager.get_model_config("test_model")

        mock_httpx_client.return_value.__aenter__.return_value.post.return_value.status_code = 200
        mock_httpx_client.return_value.__aenter__.return_value.post.return_value.json.return_value = (
            mock_response
        )

        response = await ai_client.generate_text(request, model_config)

        assert response.content == "Test response content"
        assert response.model_used == "test_model"
        assert response.provider == "GOOGLE_AI"
        assert isinstance(response.tokens_used, dict)
        assert isinstance(response.response_time_ms, float)
        assert response.cached is False
        assert isinstance(response.cost_estimate, float)
        assert isinstance(response.metadata, dict)
        assert response.request_id.startswith("google_")

    @pytest.mark.asyncio
    async def test_generate_text_failure(self, ai_client, mock_httpx_client):
        request = AIRequest(prompt="Test prompt", service_name="test_service", user_id="test_user")
        model_config = ai_client.config_manager.get_model_config("test_model")

        mock_httpx_client.return_value.__aenter__.return_value.post.return_value.status_code = 400
        mock_httpx_client.return_value.__aenter__.return_value.post.return_value.raise_for_status.side_effect = httpx.HTTPStatusError(
            "Bad Request",
            response=mock_httpx_client.return_value.__aenter__.return_value.post.return_value,
        )

        with pytest.raises(httpx.HTTPStatusError) as exc_info:
            await ai_client.generate_text(request, model_config)

        assert "Bad Request" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_generate_text_no_credentials(self, ai_client):
        ai_client.credentials = None
        request = AIRequest(prompt="Test prompt", service_name="test_service", user_id="test_user")
        model_config = ai_client.config_manager.get_model_config("test_model")

        with pytest.raises(ValueError) as exc_info:
            await ai_client.generate_text(request, model_config)

        assert "Google AI credentials not configured" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_generate_embeddings(self, ai_client):
        # Implement embedding tests if the method is implemented
        pass

    @pytest.mark.asyncio
    async def test_health_check(self, ai_client):
        # Implement health check tests if the method is implemented
        pass


class TestAIClientBase:
    @pytest.fixture
    def mock_provider_client(self):
        class MockClient(AIProviderClient):
            async def generate_text(
                self, request: AIRequest, model_config: ModelConfig
            ) -> AIResponse:
                return AIResponse(
                    content="Mock content",
                    model_used="mock_model",
                    provider="mock_provider",
                    tokens_used={"input": 10, "output": 20},
                    response_time_ms=100,
                    cached=False,
                    cost_estimate=0.1,
                    metadata={},
                    request_id="mock_request",
                )

            async def generate_embeddings(
                self, texts: list[str], model_config: ModelConfig
            ) -> list[list[float]]:
                return [[]]

            async def health_check(self) -> bool:
                return True

        return MockClient(AIProvider.GOOGLE_AI, MockAIConfigManager())

    def test_supported_providers(self):
        assert len(SUPPORTED_PROVIDERS) == 2
        assert AIProvider.GOOGLE_AI in SUPPORTED_PROVIDERS
        assert AIProvider.ANTHROPIC in SUPPORTED_PROVIDERS
