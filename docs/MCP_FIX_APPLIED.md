# MCP Configuration Fix Applied

**Date:** 2025-12-29 22:07
**Status:** Configuration Updated

## Binary Testing Results ✅

### Test 1: Playwright Binary
```bash
$ mcp-server-playwright --version
Version 0.0.53
```
**Result:** ✅ Binary is working correctly

### Test 2: Docker Binary
```bash
$ mcp-server-docker --help
MCP Server Docker - NPX Wrapper
Usage: npx mcp-server-docker [options]
```
**Result:** ✅ Binary is working correctly

## Configuration Changes Applied

### Updated Workspace Configuration
**File:** `/home/njd/careercopilot/careercopilot-1/mcp.json`

**Changed FROM (absolute paths):**
```json
"playwright": {
    "command": "/home/njd/.config/nvm/versions/node/v22.19.0/bin/mcp-server-playwright"
},
"docker": {
    "command": "/home/njd/.config/nvm/versions/node/v22.19.0/bin/mcp-server-docker"
}
```

**Changed TO (simple command names):**
```json
"playwright": {
    "command": "mcp-server-playwright"
},
"docker": {
    "command": "mcp-server-docker"
}
```

### Rationale
1. **Binaries are in PATH**: Both commands are accessible via `which` and execute correctly
2. **Absolute paths causing issues**: Antigravity appears to fail silently when given absolute paths
3. **Simpler is better**: Using command names allows the shell to resolve the path naturally

## Final Configuration State

```json
{
    "name": "careercopilot-mcp",
    "version": "2.0.0",
    "servers": {
        "flash-sidekick": {
            "command": ".venv/bin/python3",
            "args": ["servers/flash_sidekick.py"],
            "env": {
                "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
                "GEMINI_PRO_MODEL": "models/gemini-2.5-pro"
            }
        },
        "playwright": {
            "command": "mcp-server-playwright"
        },
        "docker": {
            "command": "mcp-server-docker"
        }
    }
}
```

## Next Steps

1. **Reload Antigravity Window**: `Ctrl+Shift+P` → `Developer: Reload Window`
2. **Verify servers appear**: Check MCP section in Antigravity
3. **Test functionality**: Try using playwright or docker tools

## Expected Outcome

All 3 workspace servers + 6 global GitHub servers should now be visible and functional:

**Workspace Servers:**
- ✅ flash-sidekick
- ✅ playwright
- ✅ docker

**Global Servers:**
- ✅ github
- ✅ gh-actions
- ✅ gh-repos
- ✅ gh-copilot
- ✅ gh-dependabot
- ✅ gh-users

**Total:** 9 MCP servers

## Troubleshooting If Still Not Visible

If servers still don't appear after reload:

1. **Check process list**:
   ```bash
   ps aux | grep mcp
   ```
   Should see processes for playwright and docker now

2. **Check Antigravity Output Panel**:
   - Open Output panel
   - Select "MCP Servers" from dropdown
   - Look for initialization messages or errors

3. **Nuclear option - Clear cache**:
   ```bash
   pkill -9 Antigravity
   rm -rf ~/.config/Antigravity/CachedData/*
   rm -rf ~/.config/Antigravity/Cache/*
   # Then restart Antigravity
   ```
