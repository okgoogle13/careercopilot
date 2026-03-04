"""Compatibility tests for the current AI client interfaces."""

import asyncio

import httpx
import pytest

from app.core.ai_client import AIRequest, GoogleAIClient
from app.core.ai_config import AIModelType, AIProvider, ModelConfig, ProviderCredentials


class _FakeResponse:
    """Minimal response object for provider tests."""

    def __init__(self, payload=None, status_code=200, error=None):
        self._payload = payload or {}
        self.status_code = status_code
        self._error = error

    def raise_for_status(self):
        if self._error:
            raise self._error

    def json(self):
        return self._payload


class _AsyncClient:
    """Simple async context manager that returns canned responses."""

    def __init__(self, post_response=None, get_response=None):
        self.post_response = post_response
        self.get_response = get_response

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        return False

    async def post(self, url, **kwargs):
        return self.post_response

    async def get(self, url, **kwargs):
        return self.get_response


class _ConfigManager:
    """Lightweight config manager stub for provider tests."""

    def __init__(self, credentials=None):
        self._credentials = credentials

    def get_provider_credentials(self, provider):
        return self._credentials


def _make_model_config(**overrides):
    config = {
        "name": "test-model",
        "provider": AIProvider.GOOGLE_AI,
        "model_type": AIModelType.TEXT_GENERATION,
        "model_id": "gemini-test",
        "max_tokens": 64,
        "temperature": 0.4,
        "top_p": 0.8,
        "timeout_seconds": 5,
    }
    config.update(overrides)
    return ModelConfig(
        **config,
    )


def test_google_ai_client_requires_credentials():
    """GoogleAIClient should fail fast without configured credentials."""
    with pytest.raises(ValueError, match="No credentials configured"):
        GoogleAIClient(_ConfigManager())


def test_generate_text_success(monkeypatch):
    """GoogleAIClient should parse the Gemini response structure."""
    credentials = ProviderCredentials(provider=AIProvider.GOOGLE_AI, api_key="test-key")
    client = GoogleAIClient(_ConfigManager(credentials))
    request = AIRequest(prompt="Test prompt", service_name="draft", user_id="user-1")
    model_config = _make_model_config()

    fake_client = _AsyncClient(
        post_response=_FakeResponse(
            payload={
                "candidates": [
                    {
                        "content": {"parts": [{"text": "Test response"}]},
                        "finishReason": "STOP",
                        "safetyRatings": [],
                    }
                ]
            }
        )
    )
    monkeypatch.setattr(httpx, "AsyncClient", lambda timeout=None: fake_client)

    response = asyncio.run(client.generate_text(request, model_config))

    assert response.content == "Test response"
    assert response.model_used == "test-model"
    assert response.provider == AIProvider.GOOGLE_AI.value
    assert response.cached is False
    assert response.request_id.startswith("google_")


def test_generate_text_raises_on_http_error(monkeypatch):
    """GoogleAIClient should re-raise provider HTTP failures."""
    credentials = ProviderCredentials(provider=AIProvider.GOOGLE_AI, api_key="test-key")
    client = GoogleAIClient(_ConfigManager(credentials))
    request = AIRequest(prompt="Test prompt", service_name="draft", user_id="user-1")
    model_config = _make_model_config()
    failing_response = httpx.Response(
        500,
        request=httpx.Request("POST", "https://example.test"),
    )

    fake_client = _AsyncClient(
        post_response=_FakeResponse(
            error=httpx.HTTPStatusError(
                "server error",
                request=failing_response.request,
                response=failing_response,
            )
        )
    )
    monkeypatch.setattr(httpx, "AsyncClient", lambda timeout=None: fake_client)

    with pytest.raises(httpx.HTTPStatusError):
        asyncio.run(client.generate_text(request, model_config))


@pytest.mark.parametrize(
    ("status_code", "expected"),
    [
        (200, True),
        (500, False),
    ],
)
def test_health_check_reflects_provider_status(monkeypatch, status_code, expected):
    """Health checks should map the provider HTTP status to a boolean."""
    credentials = ProviderCredentials(provider=AIProvider.GOOGLE_AI, api_key="test-key")
    client = GoogleAIClient(_ConfigManager(credentials))
    fake_client = _AsyncClient(get_response=_FakeResponse(status_code=status_code))
    monkeypatch.setattr(httpx, "AsyncClient", lambda timeout=None: fake_client)

    assert asyncio.run(client.health_check()) is expected


def test_generate_embeddings_not_implemented():
    """The Google provider still does not expose embeddings through this client."""
    credentials = ProviderCredentials(provider=AIProvider.GOOGLE_AI, api_key="test-key")
    client = GoogleAIClient(_ConfigManager(credentials))
    model_config = _make_model_config(model_type=AIModelType.TEXT_EMBEDDING)

    with pytest.raises(NotImplementedError, match="not yet implemented"):
        asyncio.run(client.generate_embeddings(["one", "two"], model_config))
