import pytest

from app.services import mcp_utils


def test_require_mcp_client_raises_when_missing():
    if all([mcp_utils.ClientSession, mcp_utils.StdioServerParameters, mcp_utils.stdio_client]):
        pytest.skip("MCP client available in environment")
    with pytest.raises(RuntimeError):
        mcp_utils.require_mcp_client()


def test_require_mcp_client_returns_objects_when_available():
    if not all([mcp_utils.ClientSession, mcp_utils.StdioServerParameters, mcp_utils.stdio_client]):
        pytest.skip("MCP client not available in environment")
    client_session, server_parameters, stdio_client = mcp_utils.require_mcp_client()
    assert client_session is mcp_utils.ClientSession
    assert server_parameters is mcp_utils.StdioServerParameters
    assert stdio_client is mcp_utils.stdio_client
