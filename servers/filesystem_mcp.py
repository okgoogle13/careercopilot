#!/usr/bin/env python3
from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from mcp.server.fastmcp import FastMCP


def _workspace_root() -> Path:
    env_root = os.environ.get("MCP_WORKSPACE_ROOT")
    if env_root:
        return Path(env_root).expanduser().resolve()
    cwd = Path.cwd().resolve()
    if cwd != Path(__file__).resolve().parent:
        return cwd
    return Path(__file__).resolve().parent.parent


mcp = FastMCP("filesystem")


def _resolve_workspace_path(path: str) -> tuple[Path, Path]:
    if not path:
        raise ValueError("path is required")

    root = _workspace_root()
    candidate = Path(path)
    resolved = candidate.resolve() if candidate.is_absolute() else (root / candidate).resolve()

    if not resolved.is_relative_to(root):
        raise ValueError("path must be within the workspace")

    return resolved, root


@mcp.tool()
def list_dir(path: str = ".", recursive: bool = False, max_entries: int = 2000) -> list[str]:
    """
    List files/directories under `path` (workspace-scoped).
    Returns workspace-relative paths.
    """
    base, root = _resolve_workspace_path(path)
    if not base.exists():
        raise FileNotFoundError(f"not found: {path}")
    if not base.is_dir():
        raise NotADirectoryError(f"not a directory: {path}")

    entries: list[str] = []
    if recursive:
        for p in base.rglob("*"):
            if len(entries) >= max_entries:
                break
            try:
                entries.append(str(p.relative_to(root)))
            except Exception:
                continue
    else:
        for p in base.iterdir():
            if len(entries) >= max_entries:
                break
            entries.append(str(p.relative_to(root)))
    return entries


@mcp.tool()
def read_file(path: str, max_bytes: int = 200_000) -> str:
    """Read a UTF-8 text file (workspace-scoped), truncating after `max_bytes`."""
    target, _ = _resolve_workspace_path(path)
    if not target.exists():
        raise FileNotFoundError(f"not found: {path}")
    if target.is_dir():
        raise IsADirectoryError(f"is a directory: {path}")

    data = target.read_bytes()
    if len(data) > max_bytes:
        data = data[:max_bytes] + b"\n...[Truncated]"
    return data.decode("utf-8", errors="replace")


@mcp.tool()
def write_file(
    path: str,
    content: str,
    overwrite: bool = True,
    create_dirs: bool = True,
) -> dict[str, Any]:
    """Write a UTF-8 text file (workspace-scoped)."""
    target, root = _resolve_workspace_path(path)
    if target.exists() and not overwrite:
        raise FileExistsError(f"already exists: {path}")
    if create_dirs:
        target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")
    return {"ok": True, "path": str(target.relative_to(root)), "bytes": len(content.encode("utf-8"))}


@mcp.tool()
def file_info(path: str) -> dict[str, Any]:
    """Return basic file metadata for a workspace-scoped path."""
    target, root = _resolve_workspace_path(path)
    if not target.exists():
        raise FileNotFoundError(f"not found: {path}")
    st = target.stat()
    return {
        "path": str(target.relative_to(root)),
        "is_dir": target.is_dir(),
        "size": st.st_size,
        "mtime": st.st_mtime,
        "mode": oct(st.st_mode),
    }


@mcp.tool()
def delete_path(path: str) -> dict[str, Any]:
    """Delete a file or empty directory (workspace-scoped)."""
    target, root = _resolve_workspace_path(path)
    if not target.exists():
        return {"ok": True, "deleted": False, "path": path}
    if target.is_dir():
        target.rmdir()
    else:
        target.unlink()
    return {"ok": True, "deleted": True, "path": str(target.relative_to(root))}


if __name__ == "__main__":
    mcp.run()
