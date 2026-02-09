try:
    from mcp import ClientSession, StdioServerParameters
    from mcp.client.stdio import stdio_client
except ImportError:  # pragma: no cover - optional dependency in test/CI
    ClientSession = None
    StdioServerParameters = None
    stdio_client = None


def require_mcp_client(error_message: str = "MCP client not installed"):
    if not ClientSession or not StdioServerParameters or not stdio_client:
        raise RuntimeError(error_message)
    return ClientSession, StdioServerParameters, stdio_client
