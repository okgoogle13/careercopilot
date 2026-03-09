#!/usr/bin/env python3
import os
import httpx
from mcp.server.fastmcp import FastMCP
from typing import Optional, List, Literal

# Initialize FastMCP for Perplexity
mcp = FastMCP("perplexity_fixed")

PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions"

def get_api_key():
    return os.getenv("PERPLEXITY_API_KEY")

@mcp.tool()
async def perplexity_chat(
    query: str, 
    model: Literal["sonar-reasoning-pro", "sonar-reasoning", "sonar-pro", "sonar"] = "sonar",
    system_prompt: Optional[str] = "You are a helpful assistant with real-time web search capabilities."
) -> str:
    """
    Perform a chat completion with Perplexity AI, allowing for real-time web research.
    """
    api_key = get_api_key()
    if not api_key:
        return "Error: PERPLEXITY_API_KEY not found in environment."

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ]
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(PERPLEXITY_API_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Error calling Perplexity API: {str(e)}"

@mcp.tool()
async def perplexity_search_web(
    query: str,
    focus: Literal["internet", "scholar", "writing", "youtube", "reddit"] = "internet"
) -> str:
    """
    Search the web using Perplexity AI. This is a specialized tool for research.
    """
    # Map focus to specific prompt instructions since Perplexity API 
    # uses models to determine search capability.
    prompt = f"Search focus: {focus}. Please research the following: {query}"
    return await perplexity_chat(query=prompt, model="sonar-pro")

@mcp.tool()
async def perplexity_deep_research(query: str) -> str:
    """
    Perform deep research on a topic using the most capable Perplexity model.
    """
    return await perplexity_chat(
        query=query, 
        model="sonar-reasoning-pro",
        system_prompt="You are a detailed research assistant. Provide comprehensive analysis with citations."
    )

@mcp.tool()
async def perplexity_summarize_with_citations(
    query: str,
    max_sources: int = 5
) -> str:
    """
    Research a topic and return a concise summary with numbered citations.
    Useful for quickly gathering sourced facts without long-form reasoning.
    """
    system_prompt = (
        f"You are a concise research assistant. "
        f"Summarize the topic in no more than 3 paragraphs and include up to {max_sources} "
        "numbered citations at the end. Format citations as: [N] URL or title."
    )
    return await perplexity_chat(
        query=query,
        model="sonar-pro",
        system_prompt=system_prompt,
    )

if __name__ == "__main__":
    mcp.run()
