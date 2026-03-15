# MCP Servers UI Navigation Guide

## Problem
The MCP servers are configured correctly in `~/.config/Antigravity/User/mcp.json` and Antigravity is creating log files for them, but they're not visible in the IDE UI.

## What You're Currently Viewing (WRONG)
You have the "Manage MCPs" **tab** open, which shows:
- ❌ GitHub integration configuration
- ❌ Cloud Run settings
- ❌ GitHub tools (add_comment_to_pending_review, etc.)

This is **NOT** the MCP server management interface.

## Where MCP Servers Should Appear (CORRECT)

### Method 1: Agent Manager (Primary Location)
1. Click the **🤖 Agent icon** on the LEFT sidebar (vertical icon bar)
2. In the Agent Manager panel that opens, look for the **⋮ three-dot menu** at the top
3. Click it and select: **MCP Servers** → **Manage MCP Servers**
4. You should see a list of all 9 servers

### Method 2: Command Palette
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: "**MCP**"
3. Look for commands like:
   - "MCP: Manage Servers"
   - "MCP: Show Server Status"
   - "MCP: Refresh Servers"

### Method 3: Settings UI
1. Open **Settings**: `File` → `Preferences` → `Settings` (or `Ctrl+,`)
2. Search for: "**mcp**"
3. Look for an "**MCP Servers**" section with a "Manage" or "Edit" button

## Verification Steps

### 1. Check if Antigravity supports MCP natively
Antigravity version **1.104.0** (from your process list) may or may not have built-in MCP support. Some editors require an extension.

### 2. Check for MCP extensions
Run this command to see if there's an MCP extension installed:
```bash
ls ~/.antigravity/extensions/ | grep -i mcp
```

### 3. Check Antigravity documentation
The fact that log files are being created suggests Antigravity **does** support MCP, but the UI location might be different than expected.

## Current Status

✅ **What's Working:**
- `mcp.json` has valid JSON syntax
- All 9 servers are defined correctly
- Antigravity is creating log files for each server
- No errors in the logs

❌ **What's NOT Working:**
- Servers aren't visible in the UI
- The "Manage MCPs" tab shows GitHub integration, not MCP servers

## Next Steps

1. **Close the "Manage MCPs" tab** (it's misleading)
2. **Check if there's an MCP extension** that needs to be installed
3. **Use Command Palette** (`Ctrl+Shift+P`) and search for "MCP" to see all available commands
4. **Check Antigravity release notes** for version 1.104.0 to see if MCP is a native feature or requires an extension

## Possible Root Cause

Antigravity might be **processing the `mcp.json` file** (hence the log files) but **not exposing MCP servers in the UI** because:
- MCP support is experimental and hidden behind a feature flag
- An MCP extension needs to be installed separately
- The UI for MCP servers is in a different location than documented
- The version of Antigravity you're using has partial MCP support

## Configuration Files (Verified Correct)

- `~/.config/Antigravity/User/mcp.json` ✅
- `~/careercopilot/careercopilot-1/mcp.json` ✅

Both files have correct JSON syntax and all required fields.
