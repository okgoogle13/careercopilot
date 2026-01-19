# MCP Server Fix - Final Steps

## What We Just Did

Added experimental MCP feature flags to `~/.config/Antigravity/User/settings.json`:
```json
"mcp.enabled": true,
"mcp.experimental.enabled": true,
"mcp.servers.enabled": true
```

## Next Steps (Do These Now)

### 1. Close Antigravity Completely
- **File** → **Exit** (or **Code** → **Quit Antigravity**)
- **OR** from a native terminal (not Antigravity's terminal):
  ```bash
  pkill -9 antigravity
  ```

### 2. Verify All Processes Are Stopped
```bash
ps aux | grep -i antigravity | grep -v grep
```
Should return **no output**.

### 3. Restart Antigravity
```bash
antigravity &
```

### 4. Check for MCP Servers

Try **ALL** of these locations:

#### A. Agent Manager
1. Click **🤖 Agent icon** on the left sidebar
2. Look for **⋮ three-dot menu** at the top
3. Select **MCP Servers** → **Manage MCP Servers**

#### B. Command Palette
1. Press `Ctrl+Shift+P`
2. Type: "**MCP**"
3. Look for commands like:
   - "MCP: Manage Servers"
   - "MCP: Show Server Status"
   - "MCP: Refresh Servers"

#### C. Settings UI
1. Open **Settings**: `Ctrl+,`
2. Search for: "**mcp**"
3. You should now see MCP-related settings

#### D. View Menu
1. **View** → **Command Palette**
2. Or check **View** menu for an "MCP" submenu

## If Servers Still Don't Appear

The issue might be that Antigravity's MCP support is:
1. **Still experimental** and not fully integrated into the UI
2. **Requires a separate extension** from the marketplace
3. **Only accessible via API/config files** (no UI yet)

In that case, the servers **ARE working** (logs prove it), but you'll interact with them through:
- The Agent Manager chat interface
- API calls
- Extension commands

Let me know what you see after restarting!
