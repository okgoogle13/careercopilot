"""
Tests for AI Client Expanded
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import httpx
import time
from typing import List, Dict, Any

from backend.app.core.ai_client import (
    AIRequest,
    AIResponse,
    AIProviderClient,
    GoogleAIClient,
    AIProvider,
    AIConfigManager,
    ModelConfig,
)
from backend.app.core.ai_config import AIModelType
from backend.app.core.monitoring import monitor_performance, track_ai_usage, track_error

# Mock User class for testing purposes
class User:
    def __init__(self, id: str, email: str):
        self.id = id
        self.email = email

@pytest.fixture
def mock_ai_config_manager():
    """Mock AIConfigManager for testing."""
    mock_manager = AsyncMock()
    mock_manager.get_provider_credentials.return_value = {"api_key": "test_api_key"}
    mock_manager.get_model_config.return_value = ModelConfig(
        name="test_model",
        model_id="test_model_id",
        provider=AIProvider.GOOGLE_AI,
        max_tokens=100,
        temperature=0.7,
        top_p=0.9,
        timeout_seconds=10
    )
    return mock_manager

@pytest.fixture
def mock_google_ai_client(mock_ai_config_manager):
    """Fixture for GoogleAIClient."""
    return GoogleAIClient(mock_ai_config_manager)

@pytest.fixture
def test_client():
    """Fixture for a test client."""
    return TestClient(app="backend.app.main:app")  # Replace with your app entry point

class TestGoogleAIClient:
    @pytest.mark.asyncio
    async def test_generate_text_success(self, mock_google_ai_client, mock_ai_config_manager):
        """Test successful text generation."""
        mock_google_ai_client.config_manager = mock_ai_config_manager
        request = AIRequest(prompt="Test prompt", service_name="test_service", user_id="test_user")
        model_config = ModelConfig(name="test_model", model_id="test_model_id", provider=AIProvider.GOOGLE_AI, max_tokens=50, temperature=0.5)

        mock_response = {
            "candidates": [
                {
                    "content": {"parts": [{"text": "Test response"}]},
                    "finishReason": "STOP",
                    "safetyRatings": []
                }
            ]
        }
        mock_google_ai_client.base_url = "http://example.com"
        mock_google_ai_client.credentials = {"api_key": "test_key"}

        async def mock_post(url, json):
            return httpx.Response(status_code=200, json=mock_response)

        mock_google_ai_client.config_manager.get_model_config.return_value = model_config
        with patch("httpx.AsyncClient") as mock_client:
            mock_client_instance = AsyncMock()
            mock_client_instance.post.return_value = mock_response
            mock_client.return_value = mock_client_instance

            response = await mock_google_ai_client.generate_text(request, model_config)

        assert response.content == "Test response"
        assert response.model_used == "test_model"
        assert response.provider == "GOOGLE_AI"
        assert isinstance(response.tokens_used, dict)
        assert response.response_time_ms > 0
        assert not response.cached
        assert isinstance(response.cost_estimate, float)
        assert isinstance(response.metadata, dict)

    @pytest.mark.asyncio
    async def test_generate_text_error(self, mock_google_ai_client, mock_ai_config_manager):
        """Test text generation with an error response."""
        mock_google_ai_client.config_manager = mock_ai_config_manager
        request = AIRequest(prompt="Test prompt", service_name="test_service", user_id="test_user")
        model_config = ModelConfig(name="test_model", model_id="test_model_id", provider=AIProvider.GOOGLE_AI, max_tokens=50, temperature=0.5)

        mock_response = {"error": "Test error"}
        mock_google_ai_client.base_url = "http://example.com"
        mock_google_ai_client.credentials = {"api_key": "test_key"}

        async def mock_post(url, json):
            return httpx.Response(status_code=500, json=mock_response)

        with patch("httpx.AsyncClient") as mock_client:
            mock_client_instance = AsyncMock()
            mock_client_instance.post.return_value = httpx.Response(status_code=500, json=mock_response)
            mock_client.return_value = mock_client_instance

            with pytest.raises(Exception) as excinfo:
                await mock_google_ai_client.generate_text(request, model_config)

        assert "Test error" in str(excinfo.value)

    @pytest.mark.asyncio
    async def test_generate_embeddings_success(self, mock_google_ai_client, mock_ai_config_manager):
        """Test successful embedding generation."""
        mock_google_ai_client.config_manager = mock_ai_config_manager
        texts = ["Test text 1", "Test text 2"]
        model_config = ModelConfig(name="test_model", model_id="test_model_id", provider=AIProvider.GOOGLE_AI, max_tokens=50, temperature=0.5)

        mock_response = [[0.1, 0.2], [0.3, 0.4]]

        with patch("httpx.AsyncClient") as mock_client:
            mock_client_instance = AsyncMock()
            mock_client_instance.post.return_value = httpx.Response(status_code=200, json=mock_response)
            mock_client.return_value = mock_client_instance

            embeddings = await mock_google_ai_client.generate_embeddings(texts, model_config)

        assert embeddings == [[0.1, 0.2], [0.3, 0.4]]

    @pytest.mark.asyncio
    async def test_health_check_success(self, mock_google_ai_client):
        """Test successful health check."""
        mock_google_ai_client.credentials = {"api_key": "test_key"}
        with patch("httpx.AsyncClient") as mock_client:
            mock_client_instance = AsyncMock()
            mock_client_instance.get.return_value = httpx.Response(status_code=200)
            mock_client.return_value = mock_client_instance

            result = await mock_google_ai_client.health_check()

        assert result is True

    @pytest.mark.asyncio
    async def test_health_check_failure(self, mock_google_ai_client):
        """Test failed health check."""
        mock_google_ai_client.credentials = {"api_key": "test_key"}
        with patch("httpx.AsyncClient") as mock_client:
            mock_client_instance = AsyncMock()
            mock_client_instance.get.return_value = httpx.Response(status_code=500)
            mock_client.return_value = mock_client_instance

            result = await mock_google_ai_client.health_check()

        assert result is False

    @pytest.mark.asyncio
    async def test_generate_text_with_system_prompt(self, mock_google_ai_client, mock_ai_config_manager):
        """Test text generation with a system prompt."""
        mock_google_ai_client.config_manager = mock_ai_config_manager
        request = AIRequest(prompt="Test prompt", service_name="test_service", user_id="test_user", system_prompt="System prompt")
        model_config = ModelConfig(name="test_model", model_id="test_model_id", provider=AIProvider.GOOGLE_AI, max_tokens=50, temperature=0.5)

        mock_response = {
            "candidates": [
                {
                    "content": {"parts": [{"text": "Test response with system prompt"}]},
                    "finishReason": "STOP",
                    "safetyRatings": []
                }
            ]
        }
        mock_google_ai_client.base_url = "http://example.com"
        mock_google_ai_client.credentials = {"api_key": "test_key"}

        async def mock_post(url, json):
            return httpx.Response(status_code=200, json=mock_response)

        with patch("httpx.AsyncClient") as mock_client:
            mock_client_instance = AsyncMock()
            mock_client_instance.post.return_value = mock_response
            mock_client.return_value = mock_client_instance

            response = await mock_google_ai_client.generate_text(request, model_config)

        assert response.content == "Test response with system prompt"

class TestAIProviderClient:
    @pytest.mark.asyncio
    async def test_init_without_credentials(self, mock_ai_config_manager):
        """Test initialization without credentials."""
        mock_ai_config_manager.get_provider_credentials.return_value = None
        with pytest.raises(ValueError):
            GoogleAIClient(mock_ai_config_manager)