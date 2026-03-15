#!/usr/bin/env python3
from __future__ import annotations

import os
from typing import Any, Literal, Optional

import httpx
from mcp.server.fastmcp import FastMCP


mcp = FastMCP("github")


def _get_token() -> str:
    token = os.getenv("GITHUB_TOKEN") or os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
    if not token:
        raise ValueError("Missing GITHUB_TOKEN (or GITHUB_PERSONAL_ACCESS_TOKEN) in environment")
    return token


@mcp.tool()
async def github_rest(
    path: str,
    method: Literal["GET", "POST", "PUT", "PATCH", "DELETE"] = "GET",
    params: Optional[dict[str, Any]] = None,
    json_body: Optional[dict[str, Any]] = None,
    timeout_s: float = 30.0,
) -> Any:
    """
    Call GitHub REST API (api.github.com). `path` must start with `/`.
    Returns decoded JSON when possible, otherwise raw text.
    """
    if not path or not path.startswith("/"):
        raise ValueError("path must start with '/' (example: '/user' or '/repos/OWNER/REPO')")

    token = _get_token()
    url = f"https://api.github.com{path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    async with httpx.AsyncClient(timeout=timeout_s) as client:
        resp = await client.request(method, url, headers=headers, params=params, json=json_body)
        if resp.status_code >= 400:
            raise RuntimeError(f"GitHub API error {resp.status_code}: {resp.text[:500]}")
        content_type = resp.headers.get("content-type", "")
        if "application/json" in content_type:
            return resp.json()
        return resp.text


@mcp.tool()
async def github_graphql(
    query: str,
    variables: Optional[dict[str, Any]] = None,
    timeout_s: float = 30.0,
) -> Any:
    """Call GitHub GraphQL API (api.github.com/graphql)."""
    if not query:
        raise ValueError("query is required")

    token = _get_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
    }
    payload = {"query": query, "variables": variables or {}}

    async with httpx.AsyncClient(timeout=timeout_s) as client:
        resp = await client.post("https://api.github.com/graphql", headers=headers, json=payload)
        if resp.status_code >= 400:
            raise RuntimeError(f"GitHub GraphQL error {resp.status_code}: {resp.text[:500]}")
        data = resp.json()
        if isinstance(data, dict) and data.get("errors"):
            raise RuntimeError(f"GitHub GraphQL returned errors: {data['errors']}")
        return data


if __name__ == "__main__":
    mcp.run()
