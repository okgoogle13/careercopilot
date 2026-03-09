# MCP Configuration — Architecture & Single Source of Truth

**Last Updated:** 2026-03-03  
**Status:** ✅ Consolidated to `.vscode/mcp.json`

---

## Overview

CareerCopilot uses the [Model Context Protocol (MCP)](https://modelcontextprotocol.io) to expose
AI tools and utilities to coding agents and IDE assistants. This document describes the
configuration architecture and explains where each config file lives.

---

## Single Source of Truth

```
.vscode/mcp.json          ← CANONICAL — edit this file
tools/config/mcp.json     ← Claude Desktop mirror (keep in sync)
```

**`.vscode/mcp.json`** is the primary config file. It is read directly by Antigravity IDE
(our VS Code-based development environment). It uses JSONC (JSON with Comments) so each server
entry can be annotated.

**`tools/config/mcp.json`** is a plain-JSON mirror for Claude Desktop and other clients that do
not support JSONC. The set of `mcpServers` entries must match `.vscode/mcp.json`.

### Why a single source of truth?

Previously, there were multiple config files (`claude_desktop_config.json`,
`~/.gemini/antigravity/mcp_config.json`, `tools/config/mcp.json`) that drifted out of sync
over time, causing servers to appear in one client but not another.  
The single-source model eliminates this drift.

---

## Claude Desktop Synchronisation

Claude Desktop reads from `~/.claude/claude_desktop_config.json` (Linux/macOS) or
`%APPDATA%\Claude\claude_desktop_config.json` (Windows). Because that file lives outside the
repository, we use **Option C: documented manual sync**.

**Sync process:**

1. Edit `.vscode/mcp.json` (the canonical file).
2. Copy the `mcpServers` block to `tools/config/mcp.json`.
3. Copy the same `mcpServers` block into your Claude Desktop config file.
4. Validate: `python3 scripts/validate-mcp.py --quick`

A Git pre-commit hook can automate step 4 (see `docs/guides/MCP_TROUBLESHOOTING.md`).

---

## Environment Variables

All secrets are referenced by name — **never hardcode values**. See `.env.mcp.example` for the
full list of required variables.

| Variable | Required by |
|---|---|
| `GEMINI_API_KEY` | flash-sidekick, design-system-sidekick, vision-scorer-mcp |
| `GITHUB_TOKEN` | github, flash-sidekick (fallback), design-system-sidekick (fallback) |
| `PERPLEXITY_API_KEY` | perplexity |

Add variables to your shell profile (`~/.zshrc`, `~/.bashrc`, or a `.env` file loaded at
shell start). Do **not** commit `.env` files — they are gitignored.

---

## Server Categories

| Category | Servers |
|---|---|
| AI / Gemini Engines | `flash-sidekick`, `design-system-sidekick`, `vision-scorer-mcp` |
| Web Research | `perplexity` |
| Task & Workflow | `task-router` |
| Source Control & Filesystem | `filesystem`, `git`, `github` |
| Disabled (uncomment to enable) | `playwright`, `cloud-ops`, `docker` |

---

## Diagnostics

```bash
# Check all servers (env vars + process probe)
python3 scripts/validate-mcp.py

# Quick env-var check only (no process spawn)
python3 scripts/validate-mcp.py --quick

# Test a single server
python3 scripts/validate-mcp.py --server flash-sidekick
```

---

## Adding a New Server

1. Add the entry to `.vscode/mcp.json` in the correct category section.
2. Add its required environment variables to `.env.mcp.example`.
3. Add its entry to `tools/config/mcp.json` (Claude Desktop mirror).
4. Document it in `docs/MCP_SERVER_REGISTRY.md`.
5. Run `python3 scripts/validate-mcp.py --server <name>` to confirm it starts.

---

## File Reference

| File | Purpose |
|---|---|
| `.vscode/mcp.json` | Canonical JSONC config (Antigravity IDE) |
| `tools/config/mcp.json` | Plain-JSON mirror for Claude Desktop |
| `.env.mcp.example` | Template of required environment variables |
| `servers/` | MCP server implementation scripts |
| `docs/MCP_SERVER_REGISTRY.md` | Catalog of all servers and their tools |
| `docs/guides/MCP_TROUBLESHOOTING.md` | Diagnosing connection issues |
| `scripts/validate-mcp.py` | Automated health check script |
