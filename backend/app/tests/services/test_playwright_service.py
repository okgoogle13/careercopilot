"""Unit tests for the Playwright MCP service wrapper."""

import asyncio
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

import app.services.playwright_service as playwright_module
from app.services.playwright_service import PlaywrightService, scrape_url_sync


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


class _AsyncContextManager:
    """Simple async context manager helper."""

    def __init__(self, value):
        self.value = value

    async def __aenter__(self):
        return self.value

    async def __aexit__(self, exc_type, exc, tb):
        return False


class _FakeClientSession:
    """Minimal async session double for MCP calls."""

    def __init__(self, _read, _write, first_result=None, second_result=None, error=None):
        self.first_result = first_result
        self.second_result = second_result
        self.error = error
        self.calls = []

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        return False

    async def initialize(self):
        return None

    async def call_tool(self, tool_name, arguments):
        self.calls.append((tool_name, arguments))
        if self.error:
            raise self.error
        if len(self.calls) == 1:
            return self.first_result
        return self.second_result


def test_playwright_service_sets_default_server_config():
    """The constructor should point to the npm-based MCP server."""
    service = PlaywrightService()

    assert service.server_command == "npx"
    assert service.server_args == ["-y", "@executeautomation/playwright-mcp-server"]


def test_navigate_and_scrape_returns_html(monkeypatch):
    """Successful navigation should return the HTML payload from the second tool call."""
    session = _FakeClientSession(
        "read",
        "write",
        first_result=SimpleNamespace(content=[]),
        second_result=SimpleNamespace(content=[SimpleNamespace(text="<html>body</html>")]),
    )
    monkeypatch.setattr(
        playwright_module,
        "require_mcp_client",
        lambda _message=None: (
            lambda _read, _write: session,
            lambda **kwargs: kwargs,
            lambda _params: _AsyncContextManager(("read", "write")),
        ),
    )

    result = asyncio.run(PlaywrightService().navigate_and_scrape("https://example.com"))

    assert result == "<html>body</html>"
    assert session.calls[0][0] == "playwright_navigate"
    assert session.calls[1][0] == "playwright_get_visible_html"


def test_navigate_and_scrape_returns_empty_string_for_empty_tool_content(monkeypatch):
    """Missing content from the HTML tool should return an empty string."""
    session = _FakeClientSession(
        "read",
        "write",
        first_result=SimpleNamespace(content=[]),
        second_result=SimpleNamespace(content=[]),
    )
    monkeypatch.setattr(
        playwright_module,
        "require_mcp_client",
        lambda _message=None: (
            lambda _read, _write: session,
            lambda **kwargs: kwargs,
            lambda _params: _AsyncContextManager(("read", "write")),
        ),
    )

    assert asyncio.run(PlaywrightService().navigate_and_scrape("https://example.com")) == ""


def test_navigate_and_scrape_wraps_mcp_errors(monkeypatch):
    """MCP failures should be wrapped with URL context."""
    session = _FakeClientSession("read", "write", error=RuntimeError("browser missing"))
    monkeypatch.setattr(
        playwright_module,
        "require_mcp_client",
        lambda _message=None: (
            lambda _read, _write: session,
            lambda **kwargs: kwargs,
            lambda _params: _AsyncContextManager(("read", "write")),
        ),
    )

    with pytest.raises(RuntimeError, match="Playwright MCP Service Failed for https://example.com"):
        asyncio.run(PlaywrightService().navigate_and_scrape("https://example.com"))


def test_scrape_url_sync_uses_asyncio_run(monkeypatch):
    """The sync helper should delegate through asyncio.run."""
    run = MagicMock(return_value="<html>body</html>")
    monkeypatch.setattr(playwright_module.asyncio, "run", run)

    result = scrape_url_sync("https://example.com")

    assert result == "<html>body</html>"
    run.assert_called_once()
