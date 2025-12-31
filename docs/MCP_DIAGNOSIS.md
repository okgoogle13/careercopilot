# MCP Configuration Diagnosis & Recovery Document

## Current Configuration State (2025-12-29 18:58)

### Workspace Configuration
**Location:** `/home/njd/careercopilot/careercopilot-1/mcp.json`

```json
{
    "name": "careercopilot-mcp",
    "version": "2.0.0",
    "servers": {
        "flash-sidekick": {
            "command": ".venv/bin/python3",
            "args": [
                "servers/flash_sidekick.py"
            ],
            "env": {
                "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
                "GEMINI_PRO_MODEL": "models/gemini-2.5-pro"
            }
        },
        "playwright": {
            "command": "/home/njd/.config/nvm/versions/node/v22.19.0/bin/mcp-server-playwright"
        },
        "docker": {
            "command": "/home/njd/.config/nvm/versions/node/v22.19.0/bin/mcp-server-docker"
        }
    }
}
```

### Global Configuration
**Location:** `/home/njd/.config/Antigravity/User/mcp.json`

```json
{
    "servers": {
        "github": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/"
        },
        "gh-actions": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/x/actions"
        },
        "gh-repos": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/x/repos"
        },
        "gh-copilot": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/x/copilot"
        },
        "gh-dependabot": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/x/dependabot"
        },
        "gh-users": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/x/users"
        }
    },
    "inputs": []
}
```

## Root Cause Analysis

### Original Setup Script
**File:** `docs/archive_mcp_configs/legacy_setup_mcp.sh` (now archived)

This script contained **FATAL CONFIGURATION ERRORS** on lines 347-357:

```bash
"playwright": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-playwright"],  # ❌ WRONG PACKAGE
  ...
},
"docker": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-docker"],  # ❌ WRONG PACKAGE
  ...
}
```

### The Fundamental Flaws:

1. **Non-existent Packages**: The packages `@modelcontextprotocol/server-playwright` and `@modelcontextprotocol/server-docker` **DO NOT EXIST** on npm.

2. **Correct Packages**:
   - Playwright: `@playwright/mcp` 
   - Docker: `@thelord/mcp-server-docker-npx` or `mcp-server-docker`

3. **Cache Persistence**: Even after fixing the config files, VS Code/Antigravity cached the broken configurations internally, causing persistent errors.

## Why Servers Are Not Visible in Antigravity

### Possible Causes:

1. **GEMINI_API_KEY not set in environment**: The `flash-sidekick` server requires `GEMINI_API_KEY` in your shell environment. If not set, the server may fail to start silently.

2. **Antigravity Settings Sync Override**: Your editor may have Settings Sync enabled, which is re-downloading the broken configuration from the cloud.

3. **Internal Cache**: Antigravity may still have cached state from the broken configurations.

## Immediate Recovery Steps

### Step 1: Verify GEMINI_API_KEY
```bash
echo $GEMINI_API_KEY
```
If empty, add to `~/.bashrc`:
```bash
export GEMINI_API_KEY="your-key-here"
```

### Step 2: Check MCP Server Process
```bash
ps aux | grep -E "(mcp|flash_sidekick)"
```

### Step 3: Check Antigravity Logs
Look for MCP initialization errors in:
- Output panel → "MCP Servers" or "Antigravity"
- `~/.config/Antigravity/logs/`

### Step 4: Nuclear Option - Complete Cache Clear
```bash
# Close Antigravity completely
pkill -9 Antigravity

# Clear all caches
rm -rf ~/.config/Antigravity/CachedData/*
rm -rf ~/.config/Antigravity/Cache/*
rm -rf ~/.config/Antigravity/User/workspaceStorage/*

# Restart
```

### Step 5: Disable Settings Sync
In Antigravity:
1. `Ctrl+Shift+P` → "Settings Sync: Turn Off"
2. This prevents cloud-stored broken configs from overwriting local fixes

## External Troubleshooting Checklist

- [ ] Verify `GEMINI_API_KEY` is set in environment
- [ ] Check if `flash-sidekick` process is running
- [ ] Verify npm binaries exist:
  - `which mcp-server-playwright`
  - `which mcp-server-docker`
- [ ] Check Antigravity Output panel for MCP errors
- [ ] Disable Settings Sync
- [ ] Close Antigravity, clear cache, restart
- [ ] Check if workspace is correctly opened (not just a folder)

## Configuration Files Summary

All configuration files now have **CORRECT** content:
- ✅ No references to `@modelcontextprotocol/server-*` packages
- ✅ Absolute paths for binaries to prevent npx transformation
- ✅ No hardcoded API keys

The issue is likely in Antigravity's internal state, not the config files themselves.
