
import asyncio
import os
<<<<<<< HEAD
import shutil
import sys
from typing import Optional

try:
    from mcp import ClientSession, StdioServerParameters
    from mcp.client.stdio import stdio_client
except ImportError:  # pragma: no cover - optional dependency in test/CI
    ClientSession = None
    StdioServerParameters = None
    stdio_client = None
=======

from app.services.mcp_utils import require_mcp_client

>>>>>>> restoration-KR-Rage-Figma-v2.0

class PlaywrightService:
    """
    A service wrapper for the Playwright MCP Server.
    Enables headless browser interaction via the Model Context Protocol.
    """

    def __init__(self):
        # We assume the MCP server is installed globally via npm
        # and available in the environment path or known location
        self.server_command = "npx"
        self.server_args = ["-y", "@executeautomation/playwright-mcp-server"]
        self.env = {**os.environ} # Inherit current environment

    async def navigate_and_scrape(self, url: str) -> str:
        """
        Navigates to a URL and returns the page content (HTML text).
        Uses the 'Playwright_navigate' and 'Playwright_get_visible_text' tools.
        """
<<<<<<< HEAD
        if not ClientSession or not StdioServerParameters or not stdio_client:
            raise RuntimeError("MCP Playwright client not installed")
=======
        ClientSession, StdioServerParameters, stdio_client = require_mcp_client(
            "MCP Playwright client not installed"
        )
>>>>>>> restoration-KR-Rage-Figma-v2.0

        server_params = StdioServerParameters(
            command=self.server_command,
            args=self.server_args,
            env=self.env
        )

        try:
            async with stdio_client(server_params) as (read, write):
                async with ClientSession(read, write) as session:
                    await session.initialize()

                    # 1. Navigate to the URL
                    # We might want to wait for network idle to ensure dynamic content loads
                    await session.call_tool(
                        "playwright_navigate",
                        arguments={
                            "url": url,
<<<<<<< HEAD
                            "waitUntil": "domcontentloaded" 
=======
                            "waitUntil": "domcontentloaded"
>>>>>>> restoration-KR-Rage-Figma-v2.0
                        }
                    )

                    # 2. Extract Visible Text (or HTML if preferred for parsing)
<<<<<<< HEAD
                    # Getting pure text is often safer for LLMs to process than raw HTML 
                    # unless structure is strictly needed. 
=======
                    # Getting pure text is often safer for LLMs to process than raw HTML
                    # unless structure is strictly needed.
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    # For extraction tasks, HTML might be better. Let's get HTML for maximum context.
                    result = await session.call_tool(
                        "playwright_get_visible_html", # Assuming this tool exists or similar
                        arguments={
                             "cleanHtml": True, # If supported by the specific server wrapper
                             "removeScripts": True
                        }
                    )
<<<<<<< HEAD
                    
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
                    # Fallback if specific tool fails or name differs - check available tools
                    # tools = await session.list_tools()
                    # print(tools)

                    # The result structure from call_tool usually has a 'content' list
                    if result.content and len(result.content) > 0:
                        return result.content[0].text
<<<<<<< HEAD
                    
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
                    return ""

        except Exception as e:
            # Propagate error with context
<<<<<<< HEAD
            raise RuntimeError(f"Playwright MCP Service Failed for {url}: {str(e)}") from e
=======
            raise RuntimeError(f"Playwright MCP Service Failed for {url}: {e!s}") from e
>>>>>>> restoration-KR-Rage-Figma-v2.0

# Simple synchronous wrapper for non-async calling contexts if needed
def scrape_url_sync(url: str) -> str:
    return asyncio.run(PlaywrightService().navigate_and_scrape(url))
