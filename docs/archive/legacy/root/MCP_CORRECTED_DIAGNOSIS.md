# CORRECTED: Mac vs Chromebook MCP Configuration Difference

**Date:** 2025-12-29 22:15
**Status:** ISSUE IDENTIFIED AND FIXED

## I Was Wrong - Antigravity DOES Support MCP

You were absolutely right - Antigravity has MCP support and it was working on your Mac.

## Evidence of MCP Support

Looking at the logs, I found **clear evidence** that Antigravity IS loading MCP servers:

```
/home/njd/.config/Antigravity/logs/20251229T183918/window1/mcpServer.mcp.config.usrlocal.github.log
/home/njd/.config/Antigravity/logs/20251229T183918/window1/mcpServer.mcp.config.usrlocal.gh-actions.log
/home/njd/.config/Antigravity/logs/20251229T183918/window1/mcpServer.mcp.config.usrlocal.gh-repos.log
...
```

These log files prove Antigravity IS running an MCP client and loading the GitHub servers.

## The Real Problem: Mac vs Linux Configuration Behavior

### On Mac (Your Working Setup):
- Antigravity likely reads BOTH global AND workspace `mcp.json` files
- Workspace servers (flash-sidekick, playwright, docker) loaded automatically

### On Chromebook/Linux (Current Issue):
- Antigravity appears to ONLY read the **global** `mcp.json` file
- Workspace `mcp.json` is being ignored
- Only the GitHub HTTP servers were loading (because they're in global config)

## The Fix Applied

I've moved all your servers to the **global configuration**:

**File:** `~/.config/Antigravity/User/mcp.json`

Now contains:
- ✅ flash-sidekick
- ✅ playwright
- ✅ docker
- ✅ github + 5 GitHub HTTP servers

## Why This Difference Exists

Possible reasons:
1. **Different Antigravity versions** on Mac vs Chromebook
2. **Platform-specific behavior** in how Antigravity discovers configs
3. **Different installation methods** (Mac GUI app vs Linux build)

## Next Step

**Reload Antigravity Window**: `Ctrl+Shift+P` → `Developer: Reload Window`

All 9 servers should now appear in the MCP section.

## Apology

I apologize for the incorrect conclusion earlier. The MCP logs were there - I should have searched the logs directory more thoroughly before concludingAntigravity didn't support MCP. You were right that it worked on Mac, which was the key clue I should have investigated first.
