import pytest

from app.services import mcp_utils


def test_require_mcp_client_raises_when_any_dependency_missing(monkeypatch):
    monkeypatch.setattr(mcp_utils, "ClientSession", object)
    monkeypatch.setattr(mcp_utils, "StdioServerParameters", None)
    monkeypatch.setattr(mcp_utils, "stdio_client", object)

    with pytest.raises(RuntimeError, match="MCP client not installed"):
        mcp_utils.require_mcp_client()


def test_require_mcp_client_raises_with_custom_error_message(monkeypatch):
    monkeypatch.setattr(mcp_utils, "ClientSession", None)
    monkeypatch.setattr(mcp_utils, "StdioServerParameters", object)
    monkeypatch.setattr(mcp_utils, "stdio_client", object)

    with pytest.raises(RuntimeError, match="custom missing"):
        mcp_utils.require_mcp_client("custom missing")


def test_require_mcp_client_returns_objects_when_available(monkeypatch):
    client_session = object()
    server_parameters = object()
    stdio_client = object()

    monkeypatch.setattr(mcp_utils, "ClientSession", client_session)
    monkeypatch.setattr(mcp_utils, "StdioServerParameters", server_parameters)
    monkeypatch.setattr(mcp_utils, "stdio_client", stdio_client)

    result = mcp_utils.require_mcp_client()
    assert result == (client_session, server_parameters, stdio_client)
