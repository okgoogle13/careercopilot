
import asyncio
import json
import os

from app.services.mcp_utils import require_mcp_client

class FlashSidekickService:
    """
    Service wrapper for the Flash Sidekick MCP Server.
    Provides utility methods for text processing using Gemini models.
    """
    
    def __init__(self):
        self.server_command = "/home/njd/careercopilot/careercopilot-1/.venv/bin/python3"
        self.server_args = ["/home/njd/careercopilot/careercopilot-1/servers/flash_sidekick.py"]
        self.env = {
            **os.environ,
            "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
            "GEMINI_PRO_MODEL": "models/gemini-2.5-pro"
        }

    async def extract_links_from_search_results(self, html_content: str) -> list[str]:
        """
        Extracts valid job listing URLs from a raw HTML search result page.
        """
        ClientSession, StdioServerParameters, stdio_client = require_mcp_client()
        prompt = """
        You are an HTML parser. 
        Input: Raw HTML from a Google Search result page.
        Task: Extract strictly the URLs that point to job listings (e.g., from ethicaljobs.com.au, seek.com.au, etc).
        Ignore navigation links (like 'Next', 'Privacy', 'Login', etc.).
        Output: A pure JSON list of strings. Example: ["https://ethicaljobs..., "https://seek..."].
        Do not output any markdown code blocks, just the raw JSON string.
        """
        
        # We combine prompt + content. Truncate content if too massive (unlikely for search result page)
        # Using quick_summarize tool logic or a direct 'generate' capability if available.
        # Flash Sidekick has "consult_pro" (smart) and "generate_idf" (fast).
        # We'll use "consult_pro" for parsing logic or "extract_data" if we add that capability.
        # Let's use 'consult_pro' as it handles reasoning ("Ignore navigation links").
        
        full_query = f"{prompt}\n\nHTML:\n{html_content[:30000]}" # Limit context to avoid overflow

        server_params = StdioServerParameters(
            command=self.server_command,
            args=self.server_args,
            env=self.env
        )

        try:
            async with stdio_client(server_params) as (read, write):
                async with ClientSession(read, write) as session:
                    await session.initialize()
                    
                    result = await session.call_tool(
                        "consult_pro", # Using the Pro model for better extraction reasoning
                        arguments={
                            "query": full_query
                        }
                    )
                    
                    if result.content and len(result.content) > 0:
                        text_response = result.content[0].text
                        # Clean cleanup (remove markdown ```json if present)
                        clean_json = text_response.replace("```json", "").replace("```", "").strip()
                        try:
                            return json.loads(clean_json)
                        except json.JSONDecodeError:
                            print(f"Failed to parse JSON from AI: {clean_json}")
                            return []
                    return []
        except Exception as e:
            print(f"Flash Sidekick Extraction Failed: {e}")
            return []
            
# Synchronous wrapper
def extract_links_sync(html: str) -> list[str]:
    return asyncio.run(FlashSidekickService().extract_links_from_search_results(html))
