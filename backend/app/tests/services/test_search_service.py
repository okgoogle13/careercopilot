"""Unit tests for the Perplexity-backed search service."""

import asyncio
from types import SimpleNamespace
from unittest.mock import MagicMock

import httpx
import pytest

import app.services.search_service as search_service_module
from app.services.search_service import SearchResult, SearchService


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


class _AsyncContextManager:
    """Async context manager wrapper for fake httpx clients."""

    def __init__(self, value):
        self.value = value

    async def __aenter__(self):
        return self.value

    async def __aexit__(self, exc_type, exc, tb):
        return False


class _FakeAsyncClient:
    """Minimal async http client test double."""

    def __init__(self, response=None, error=None):
        self.response = response
        self.error = error
        self.calls = []

    async def post(self, *args, **kwargs):
        self.calls.append((args, kwargs))
        if self.error:
            raise self.error
        return self.response


def test_search_result_defaults_to_empty_citations():
    """The response model should default citations to an empty list."""
    result = SearchResult(content="Summary")

    assert result.citations == []


def test_search_service_warns_when_api_key_missing(monkeypatch):
    """Missing API keys should log a warning during construction."""
    logger = MagicMock()
    monkeypatch.delenv("PERPLEXITY_API_KEY", raising=False)
    monkeypatch.setattr(search_service_module.logging, "getLogger", MagicMock(return_value=logger))

    service = SearchService()

    assert service.api_key is None
    logger.warning.assert_called_once()


def test_research_company_returns_none_without_api_key():
    """Research should be disabled when the API key is absent."""
    service = SearchService()
    service.api_key = None

    assert asyncio.run(service.research_company("Community First")) is None


def test_research_company_returns_content_on_success(monkeypatch):
    """Successful Perplexity responses should return the first choice content."""
    response = MagicMock()
    response.raise_for_status.return_value = None
    response.json.return_value = {
        "choices": [{"message": {"content": "Detailed company summary"}}]
    }
    fake_client = _FakeAsyncClient(response=response)
    monkeypatch.setattr(
        search_service_module.httpx,
        "AsyncClient",
        lambda: _AsyncContextManager(fake_client),
    )
    service = SearchService()
    service.api_key = "token"

    result = asyncio.run(service.research_company("Community First"))

    assert result == "Detailed company summary"
    args, kwargs = fake_client.calls[0]
    assert args[0] == service.base_url
    assert kwargs["headers"]["Authorization"] == "Bearer token"
    assert kwargs["json"]["model"] == "sonar-pro"


def test_research_company_returns_none_on_http_error(monkeypatch):
    """HTTP transport failures should be logged and returned as None."""
    logger = MagicMock()
    request = httpx.Request("POST", "https://api.perplexity.ai/chat/completions")
    error = httpx.HTTPStatusError("boom", request=request, response=MagicMock())
    fake_client = _FakeAsyncClient(error=error)
    monkeypatch.setattr(
        search_service_module.httpx,
        "AsyncClient",
        lambda: _AsyncContextManager(fake_client),
    )
    service = SearchService()
    service.api_key = "token"
    service.logger = logger

    assert asyncio.run(service.research_company("Community First")) is None
    logger.error.assert_called_once()


def test_research_company_returns_none_on_malformed_response(monkeypatch):
    """Unexpected response shapes should be handled safely."""
    logger = MagicMock()
    response = MagicMock()
    response.raise_for_status.return_value = None
    response.json.return_value = {}
    fake_client = _FakeAsyncClient(response=response)
    monkeypatch.setattr(
        search_service_module.httpx,
        "AsyncClient",
        lambda: _AsyncContextManager(fake_client),
    )
    service = SearchService()
    service.api_key = "token"
    service.logger = logger

    assert asyncio.run(service.research_company("Community First")) is None
    logger.error.assert_called_once()
