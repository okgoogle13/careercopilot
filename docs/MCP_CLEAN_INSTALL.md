# MCP Server Configuration - Clean Install

## Overview
This is a fresh, clean MCP configuration after removing all cached/stale references.

## Configured Servers

### Workspace Servers (`mcp.json`)
Located at: `/home/njd/careercopilot/careercopilot-1/mcp.json`

1. **flash-sidekick** ✅
   - Local Python server
   - Command: `.venv/bin/python3 servers/flash_sidekick.py`
   - Purpose: Fast AI assistance using Gemini 2.5 Flash

2. **playwright** ✅
   - Global NPM package: `@playwright/mcp@0.0.53`
   - Command: `/home/njd/.config/nvm/versions/node/v22.19.0/bin/mcp-server-playwright`
   - Purpose: Browser automation
   - **Note:** Using absolute path to prevent NPM exec conflicts

3. **docker** ✅
   - Global NPM package: `@thelord/mcp-server-docker-npx@0.4.0`
   - Command: `/home/njd/.config/nvm/versions/node/v22.19.0/bin/mcp-server-docker`
   - Purpose: Docker container management
   - **Note:** Using absolute path to prevent NPM exec conflicts

### Global Servers (VS Code/Antigravity)
Located at: `~/.config/Code/User/mcp.json` and `~/.config/Antigravity/User/mcp.json`

1. **github** - GitHub API integration
2. **gh-actions** - GitHub Actions
3. **gh-repos** - GitHub Repositories
4. **gh-copilot** - GitHub Copilot
5. **gh-dependabot** - Dependabot
6. **gh-users** - GitHub Users

All GitHub servers use HTTP endpoints (no local binaries required).

## Key Changes from Previous Configuration

### 1. Absolute Paths
Changed from:
```json
"command": "mcp-server-playwright"
```

To:
```json
"command": "/home/njd/.config/nvm/versions/node/v22.19.0/bin/mcp-server-playwright"
```

**Reason:** Prevents VS Code from transforming commands into `npm exec --yes -- @modelcontextprotocol/server-*`

### 2. Separated Concerns
- **Workspace (`mcp.json`)**: Stdio servers (flash-sidekick, playwright, docker)
- **Global (Code/Antigravity)**: HTTP servers (GitHub endpoints)

### 3. Clean Slate
- Removed all cached configurations
- Killed all running MCP processes
- Deleted stale backup files
- Cleared globalStorage and workspaceStorage MCP artifacts

## Verification

Run the health check:
```bash
/home/njd/careercopilot/careercopilot-1/scripts/check-mcp-health.sh
```

## Next Steps

1. **Reload VS Code/Antigravity**: `Ctrl+Shift+P` → "Developer: Reload Window"
2. **Verify no errors**: Check the output panel for MCP initialization
3. **Test servers**: Use each server to confirm functionality

## Troubleshooting

If you still see `npm exec` errors in logs:
1. Check VS Code Settings UI for hardcoded MCP entries
2. Disable Settings Sync temporarily
3. Close and fully restart VS Code (not just reload)

## Installed Binaries

```bash
$ which mcp-server-playwright
/home/njd/.config/nvm/versions/node/v22.19.0/bin/mcp-server-playwright

$ which mcp-server-docker  
/home/njd/.config/nvm/versions/node/v22.19.0/bin/mcp-server-docker

$ mcp-server-playwright --version
Version 0.0.53

$ mcp-server-docker --help
MCP Server Docker - NPX Wrapper
```

All binaries are functional and ready to use.
