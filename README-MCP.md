# MCP Quick Start — CareerCopilot

> Model Context Protocol (MCP) servers extend coding agents with AI tools, web research,
> design validation, and task management.

---

## 1. Prerequisites

| Requirement | Notes |
|---|---|
| Python 3.10+ | Used by all custom servers |
| Node.js 18+ | Used by npm-based servers (`filesystem`, `git`, `github`) |
| Project virtualenv | `pip install -r servers/requirements.txt` |
| Environment variables | See section 2 |

---

## 2. Set Up Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.mcp.example .env.mcp
# Then edit .env.mcp with your actual keys
```

Required variables:

| Variable | Where to get it |
|---|---|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `GITHUB_TOKEN` | [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens) |
| `PERPLEXITY_API_KEY` | [Perplexity Settings → API](https://www.perplexity.ai/settings/api) |

Load them in your shell:

```bash
# Add to ~/.zshrc or ~/.bashrc
export GEMINI_API_KEY="your-key"
export GITHUB_TOKEN="your-token"
export PERPLEXITY_API_KEY="your-key"
source ~/.zshrc   # reload
```

---

## 3. Validate Everything Works

```bash
python3 scripts/validate-mcp.py
```

Expected output:

```
✓ flash-sidekick      Alive (1.3s) — Responded as 'FlashSidekick' v1.0
✓ design-system-sidekick  Alive (0.9s) — Responded with valid MCP result
✓ perplexity          Alive (0.4s) — Responded as 'perplexity_fixed' v1.0
✓ task-router         Alive (0.3s) — Responded as 'task-router' v1.0
...
✓ All 8 server(s) passed.
```

---

## 4. Config Files

| File | Purpose |
|---|---|
| `.vscode/mcp.json` | **Canonical config** — Antigravity IDE reads this directly |
| `tools/config/mcp.json` | Claude Desktop mirror — keep in sync with `.vscode/mcp.json` |
| `.env.mcp.example` | Template of required environment variables |

> **Rule:** Always edit `.vscode/mcp.json` first, then mirror changes to `tools/config/mcp.json`.

---

## 5. Available Servers

| Server | Purpose |
|---|---|
| `flash-sidekick` | Code analysis, test generation, summarisation |
| `design-system-sidekick` | Kerala Rage compliance validation |
| `vision-scorer-mcp` | M3 Expressive visual scoring |
| `perplexity` | Real-time web research (4 tools) |
| `task-router` | Multi-agent task queue |
| `filesystem` | Project file read/write |
| `git` | Git operations |
| `github` | GitHub API |

Full tool catalog: `docs/MCP_SERVER_REGISTRY.md`

---

## 6. Troubleshooting

| Symptom | Quick fix |
|---|---|
| Server doesn't appear | Check env vars: `python3 scripts/validate-mcp.py --quick` |
| Server drops after idle | Restart Antigravity; the client reconnects automatically |
| Perplexity tools missing | Confirm `PERPLEXITY_API_KEY` is set and valid |
| `command not found: python3` | Install Python 3 or use full path in `args` |

Full troubleshooting guide: `docs/guides/MCP_TROUBLESHOOTING.md`

---

## 7. Adding a New Server

1. Implement the server in `servers/my_server.py` using FastMCP.
2. Add its entry to `.vscode/mcp.json`.
3. Mirror the entry to `tools/config/mcp.json`.
4. Add required env vars to `.env.mcp.example`.
5. Document it in `docs/MCP_SERVER_REGISTRY.md`.
6. Run `python3 scripts/validate-mcp.py --server my-server`.
