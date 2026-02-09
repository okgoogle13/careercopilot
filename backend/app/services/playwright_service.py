
import asyncio
import os
import shutil
import sys
from typing import Optional

from app.services.mcp_utils import require_mcp_client

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
        ClientSession, StdioServerParameters, stdio_client = require_mcp_client(
            "MCP Playwright client not installed"
        )

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
                            "waitUntil": "domcontentloaded" 
                        }
                    )

                    # 2. Extract Visible Text (or HTML if preferred for parsing)
                    # Getting pure text is often safer for LLMs to process than raw HTML 
                    # unless structure is strictly needed. 
                    # For extraction tasks, HTML might be better. Let's get HTML for maximum context.
                    result = await session.call_tool(
                        "playwright_get_visible_html", # Assuming this tool exists or similar
                        arguments={
                             "cleanHtml": True, # If supported by the specific server wrapper
                             "removeScripts": True
                        }
                    )
                    
                    # Fallback if specific tool fails or name differs - check available tools
                    # tools = await session.list_tools()
                    # print(tools)

                    # The result structure from call_tool usually has a 'content' list
                    if result.content and len(result.content) > 0:
                        return result.content[0].text
                    
                    return ""

        except Exception as e:
            # Propagate error with context
            raise RuntimeError(f"Playwright MCP Service Failed for {url}: {str(e)}") from e

# Simple synchronous wrapper for non-async calling contexts if needed
def scrape_url_sync(url: str) -> str:
    return asyncio.run(PlaywrightService().navigate_and_scrape(url))
