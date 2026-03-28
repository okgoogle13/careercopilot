import os
import httpx
from mcp.server.fastmcp import FastMCP
from typing import Optional, List, Dict, Any

# Initialize FastMCP server
mcp = FastMCP("perplexity")

# Constants
PERPLEXITY_API_BASE = "https://api.perplexity.ai/chat/completions"

def get_api_key():
    api_key = os.getenv("PERPLEXITY_API_KEY")
    if not api_key:
        raise ValueError("PERPLEXITY_API_KEY environment variable is not set")
    return api_key

async def call_perplexity(model: str, messages: List[Dict[str, str]], temperature: float = 0.2):
    api_key = get_api_key()
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(PERPLEXITY_API_BASE, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def perplexity_ask(query: str, model: str = "sonar") -> str:
    """
    General research query using Perplexity AI.

    Args:
        query: The research question or topic to ask about.
        model: Perplexity model to use (default: sonar).
    """
    messages = [{"role": "user", "content": query}]
    result = await call_perplexity(model, messages)
    return result["choices"][0]["message"]["content"]

@mcp.tool()
async def perplexity_search_web(query: str) -> str:
    """
    Focused web search using Perplexity's sonar-pro model for up-to-date information.

    Args:
        query: Specific search query for the web.
    """
    messages = [{"role": "system", "content": "You are a focused web search assistant. Provide accurate, up-to-date information with citations."},
                {"role": "user", "content": query}]
    result = await call_perplexity("sonar-pro", messages)
    return result["choices"][0]["message"]["content"]

@mcp.tool()
async def perplexity_deep_research(topic: str) -> str:
    """
    Comprehensive analysis via sonar-reasoning-pro for complex research tasks.

    Args:
        topic: The complex topic or problem to research in-depth.
    """
    messages = [{"role": "system", "content": "You are a deep research specialist. Perform a thorough analysis of the following topic, exploring multiple facets and providing reasoning-backed conclusions."},
                {"role": "user", "content": topic}]
    result = await call_perplexity("sonar-reasoning-pro", messages)
    return result["choices"][0]["message"]["content"]

@mcp.tool()
async def perplexity_summarize_with_citations(text_or_url: str) -> str:
    """
    Concise summary with numbered source citations using sonar-pro.

    Args:
        text_or_url: The text content or URL to summarize and cite.
    """
    messages = [{"role": "system", "content": "Summarize the following content concisely, providing numbered citations for every factual claim. Ensure the summary is actionable."},
                {"role": "user", "content": f"Please summarize this: {text_or_url}"}]
    result = await call_perplexity("sonar-pro", messages)
    return result["choices"][0]["message"]["content"]

if __name__ == "__main__":
    mcp.run()
