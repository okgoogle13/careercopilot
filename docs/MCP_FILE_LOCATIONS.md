# MCP Configuration File Locations

## Active Configuration Files

### 1. Workspace Configuration (Project-Specific)
**Path:** `/home/njd/careercopilot/careercopilot-1/mcp.json`

**Purpose:** Defines MCP servers for **this specific workspace/project only**

**Servers Configured:**
- `flash-sidekick` - Local Python AI server (project-specific)
- `playwright` - Browser automation (absolute path)
- `docker` - Container management (absolute path)

**Scope:** Only active when you open the CareerCopilot workspace

---

### 2. Global Configuration (Editor-Wide)
**Path:** `/home/njd/.config/Antigravity/User/mcp.json`

**Equivalent Path:** `~/.config/Antigravity/User/mcp.json` (same file, different notation)

**Purpose:** Defines MCP servers for **all workspaces** in Antigravity/VS Code

**Servers Configured:**
- `github` - GitHub API integration
- `gh-actions` - GitHub Actions
- `gh-repos` - GitHub Repositories
- `gh-copilot` - GitHub Copilot
- `gh-dependabot` - Dependabot
- `gh-users` - GitHub Users

**Scope:** Active in all projects, always available

---

## File Differences Explained

| File | Scope | Purpose | Servers |
|------|-------|---------|---------|
| `mcp.json` (workspace) | This project only | Project-specific tools | flash-sidekick, playwright, docker |
| `Antigravity/User/mcp.json` | All projects | Global GitHub integration | 6 GitHub HTTP endpoints |

---

## Why Two Files?

**Workspace Config** → Tools specific to this project (e.g., Flash Sidekick needs the local `.venv`)

**Global Config** → Tools you want everywhere (e.g., GitHub integration)

---

## Cleanup Actions Performed

✅ **Removed:** `/home/njd/.config/Code/User/mcp.json` (duplicate of Antigravity config)

✅ **Archived:** Legacy MCP config moved to `/docs/archive_mcp_configs/legacy_mcp.json`

✅ **Kept:**
- Workspace: `/home/njd/careercopilot/careercopilot-1/mcp.json`
- Global: `/home/njd/.config/Antigravity/User/mcp.json`

---

## Note on Paths

These are the **same file**:
- `/home/njd/.config/Antigravity/User/mcp.json`
- `~/.config/Antigravity/User/mcp.json`

The `~` is just shorthand for `/home/njd` - they refer to the exact same location.

---

## Current Active Servers

When you open the CareerCopilot workspace, you get **all 9 servers**:

**From Workspace:**
1. flash-sidekick
2. playwright
3. docker

**From Global:**
4. github
5. gh-actions
6. gh-repos
7. gh-copilot
8. gh-dependabot
9. gh-users

All other MCP files have been archived or removed.
