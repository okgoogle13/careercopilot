## MCP Server Configuration Status

### Working Servers ✅
- **Flash Sidekick** (Workspace): Uses local Python server in `.venv/bin/python3`
- **GitHub** (Global): 6 HTTP endpoints for GitHub API integration

### Problematic Servers ⚠️
Docker and Playwright MCP servers are experiencing a **Settings Sync Cache** issue.

#### Root Cause
VS Code/Antigravity is ignoring configuration files and using cached commands:
- Trying: `npm exec --yes -- @modelcontextprotocol/server-docker` ❌
- Trying: `npm exec --yes -- @modelcontextprotocol/server-playwright` ❌
- Should use: `mcp-server-docker` ✅
- Should use: `mcp-server-playwright` ✅

#### Evidence
Error logs show npm attempting to install non-existent packages:
- `/home/njd/.npm/_logs/2025-12-28T10_54_10_707Z-debug-0.log`
- `/home/njd/.npm/_logs/2025-12-28T09_14_55_012Z-debug-0.log`

Both logs show `npm exec @modelcontextprotocol/server-*` being invoked despite:
1. Configuration files using correct binary names
2. Binaries being globally installed
3. Multiple cache cleanups performed

#### Current Configuration

**Global** (`~/config/Code/User/mcp.json`):
- GitHub servers only (Docker/Playwright removed to prevent conflicts)

**Workspace** (`/home/njd/careercopilot/careercopilot-1/mcp.json`):
```json
{
  "servers": {
    "flash-sidekick": { ... },
    "playwright": { "command": "mcp-server-playwright" },
    "docker": { "command": "mcp-server-docker" }
  }
}
```

#### Actions Taken
1. ✅ Cleaned all MCP caches
2. ✅ Disabled Settings Sync cache
3. ✅ Removed problematic entries from global config
4. ✅ Added correct configs to workspace mcp.json
5. ✅ Verified binaries are installed and functional

#### Next Steps
**User must:**
1. **Quit VS Code/Antigravity completely** (not just reload)
2. Reopen the workspace
3. If issue persists, check Settings UI for hardcoded MCP entries

#### Alternative Solution
If the above fails, Docker/Playwright can be invoked via custom scripts that wrap the binaries, preventing the editor from transforming the command into `npx`.
