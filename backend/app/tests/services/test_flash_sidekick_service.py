"""Unit tests for the Flash Sidekick service wrapper."""

import asyncio
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

import app.services.flash_sidekick_service as flash_sidekick_module
from app.services.flash_sidekick_service import FlashSidekickService, extract_links_sync


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
    """Minimal MCP client session test double."""

    def __init__(self, _read, _write, result=None, error=None):
        self.result = result
        self.error = error
        self.initialized = False
        self.tool_name = None
        self.arguments = None

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        return False

    async def initialize(self):
        self.initialized = True

    async def call_tool(self, tool_name, arguments):
        self.tool_name = tool_name
        self.arguments = arguments
        if self.error:
            raise self.error
        return self.result


def test_flash_sidekick_service_sets_default_server_config():
    """The constructor should wire the expected MCP server command."""
    service = FlashSidekickService()

    assert service.server_command.endswith("python3")
    assert service.server_args[-1].endswith("flash_sidekick.py")
    assert service.env["GEMINI_MODEL"] == "models/gemini-2.5-flash-lite"


def test_extract_links_from_search_results_parses_json_response(monkeypatch):
    """Valid JSON responses should be parsed into a URL list."""
    result = SimpleNamespace(content=[SimpleNamespace(text='```json\n["https://a.example/job"]\n```')])
    session = _FakeClientSession("read", "write", result=result)

    def fake_require_mcp_client():
        def client_session(read, write):
            assert (read, write) == ("read", "write")
            return session

        def server_params(**kwargs):
            return kwargs

        def stdio_client(params):
            assert params["command"]
            return _AsyncContextManager(("read", "write"))

        return client_session, server_params, stdio_client

    monkeypatch.setattr(flash_sidekick_module, "require_mcp_client", fake_require_mcp_client)

    links = asyncio.run(
        FlashSidekickService().extract_links_from_search_results("<html>job listings</html>")
    )

    assert links == ["https://a.example/job"]
    assert session.initialized is True
    assert session.tool_name == "consult_pro"
    assert "job listings" in session.arguments["query"]


def test_extract_links_from_search_results_returns_empty_on_invalid_json(monkeypatch):
    """Malformed tool output should degrade to an empty list."""
    result = SimpleNamespace(content=[SimpleNamespace(text="not json")])
    session = _FakeClientSession("read", "write", result=result)

    monkeypatch.setattr(
        flash_sidekick_module,
        "require_mcp_client",
        lambda: (
            lambda _read, _write: session,
            lambda **kwargs: kwargs,
            lambda _params: _AsyncContextManager(("read", "write")),
        ),
    )

    assert (
        asyncio.run(FlashSidekickService().extract_links_from_search_results("<html></html>")) == []
    )


def test_extract_links_from_search_results_returns_empty_on_session_failure(monkeypatch):
    """MCP session failures should be swallowed and returned as an empty list."""
    session = _FakeClientSession("read", "write", error=RuntimeError("mcp down"))
    monkeypatch.setattr(
        flash_sidekick_module,
        "require_mcp_client",
        lambda: (
            lambda _read, _write: session,
            lambda **kwargs: kwargs,
            lambda _params: _AsyncContextManager(("read", "write")),
        ),
    )

    assert asyncio.run(FlashSidekickService().extract_links_from_search_results("<html></html>")) == []


def test_extract_links_sync_uses_asyncio_run(monkeypatch):
    """The sync helper should delegate through asyncio.run."""
    run = MagicMock(return_value=["https://a.example/job"])
    monkeypatch.setattr(flash_sidekick_module.asyncio, "run", run)

    result = extract_links_sync("<html></html>")

    assert result == ["https://a.example/job"]
    run.assert_called_once()
