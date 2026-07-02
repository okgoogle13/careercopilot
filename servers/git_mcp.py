#!/usr/bin/env python3
from __future__ import annotations

import os
import subprocess
from pathlib import Path
from typing import Optional

from mcp.server.fastmcp import FastMCP


def _workspace_root() -> Path:
    env_root = os.environ.get("MCP_WORKSPACE_ROOT")
    if env_root:
        return Path(env_root).expanduser().resolve()
    cwd = Path.cwd().resolve()
    if cwd != Path(__file__).resolve().parent:
        return cwd
    return Path(__file__).resolve().parent.parent


mcp = FastMCP("git")


def _run_git(args: list[str], timeout_s: int = 20) -> str:
    root = _workspace_root()
    if not (root / ".git").exists():
        raise RuntimeError(f"not a git repository (missing .git in {root})")

    proc = subprocess.run(
        ["git"] + args,
        cwd=str(root),
        capture_output=True,
        text=True,
        timeout=timeout_s,
    )
    out = (proc.stdout or "").strip()
    err = (proc.stderr or "").strip()
    if proc.returncode != 0:
        msg = err or out or f"git exited with code {proc.returncode}"
        raise RuntimeError(msg)
    return out or err


@mcp.tool()
def status() -> str:
    """`git status --porcelain=v1 -b`"""
    return _run_git(["status", "--porcelain=v1", "-b"])


@mcp.tool()
def diff(staged: bool = False, path: Optional[str] = None, context_lines: int = 3) -> str:
    """`git diff` (optionally staged and/or restricted to a path)."""
    args = ["diff", f"-U{context_lines}"]
    if staged:
        args.append("--staged")
    if path:
        args += ["--", path]
    return _run_git(args, timeout_s=30)


@mcp.tool()
def log(max_count: int = 20, path: Optional[str] = None) -> str:
    """`git log --oneline --decorate --max-count=N` (optionally for a path)."""
    args = ["log", "--oneline", "--decorate", f"--max-count={max_count}"]
    if path:
        args += ["--", path]
    return _run_git(args, timeout_s=30)


# @mcp.tool()
def show(rev: str = "HEAD") -> str:
    """`git show <rev>`"""
    return _run_git(["show", rev], timeout_s=30)


# @mcp.tool()
def blame(path: str, rev: str = "HEAD") -> str:
    """`git blame <rev> -- <path>`"""
    return _run_git(["blame", rev, "--", path], timeout_s=30)


if __name__ == "__main__":
    mcp.run()
