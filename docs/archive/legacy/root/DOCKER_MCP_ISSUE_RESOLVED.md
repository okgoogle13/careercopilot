# Docker MCP Server Issue - Resolution

## Problem Identified

The Docker MCP server packages have a **critical bug** that prevents them from working with MCP protocol initialization:

### Error
```
Error: calling "initialize": invalid character 'ð' looking for beginning of value
```

### Root Cause
Both tested Docker MCP packages output **non-JSON data** (emojis, Unicode characters, or banner text) before the actual JSON-RPC response. This breaks the MCP protocol which expects pure JSON communication.

**Affected packages:**
- ❌ `@0xshariq/docker-mcp-server` - Outputs emoji banners before JSON
- ❌ `@thelord/mcp-server-docker-npx` - Same issue

---

## Solution: Removed Docker MCP Server

Updated both config files to **remove the Docker server** and keep only working servers:

### Working MCP Servers (2)

1. **flash-sidekick** ✅
   - Custom Python MCP server
   - Uses Gemini models
   - Status: Working

2. **playwright** ✅
   - Browser automation
   - E2E testing
   - Status: Working

---

## Alternative Docker Management Options

### Option 1: Use Docker CLI Directly
You can still use Docker commands directly in the terminal:
```bash
docker ps
docker images
docker run ...
```

### Option 2: Use `dockerode` npm Package
For programmatic Docker control in Node.js:
```bash
npm install dockerode
```

Then use in your code:
```javascript
const Docker = require('dockerode');
const docker = new Docker();

// List containers
const containers = await docker.listContainers();
```

### Option 3: Wait for Package Fix
Monitor these packages for updates:
- Watch `@0xshariq/docker-mcp-server` on npm
- Check GitHub issues for fixes

### Option 4: Create Custom Docker MCP Server
Build a proper MCP server that:
1. Outputs **only** valid JSON-RPC
2. No banner text or emojis before the JSON
3. Properly implements the MCP protocol

---

## Updated Configuration Files

### `.vscode/mcp.json`
```json
{
  "mcpServers": {
    "flash-sidekick": {
      "command": "/home/njd/careercopilot/careercopilot-1/.venv/bin/python3",
      "args": [
        "/home/njd/careercopilot/careercopilot-1/servers/flash_sidekick.py"
      ],
      "env": {
        "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
        "GEMINI_PRO_MODEL": "models/gemini-2.5-pro"
      },
      "disabled": false,
      "autoApprove": []
    },
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@executeautomation/playwright-mcp-server"
      ],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

Same config is in `~/.gemini/antigravity/mcp_config.json`.

---

## Next Steps

1. **Reload Antigravity window**
   - `Ctrl+Shift+P` → "Developer: Reload Window"

2. **Verify 2 servers appear**
   - Agent Manager → ⋮ → MCP Servers → Manage MCP Servers
   - Should see: flash-sidekick ✅, playwright ✅
   - No Docker error ✅

3. **For Docker operations**, use one of the alternatives above

---

## Technical Details: Why This Happens

The MCP protocol expects **pure JSON-RPC communication**:

**Correct output:**
```json
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05"}}
```

**What Docker MCP servers output:**
```
🐳 Docker MCP Server - Starting...
📊 Loading tools...

{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05"}}
```

The banner text (`🐳 Docker MCP Server...`) breaks JSON parsing, resulting in the "invalid character 'ð'" error (the 'ð' is part of the emoji Unicode).

---

## Summary

- ✅ **Fixed**: Removed broken Docker MCP server
- ✅ **Working**: flash-sidekick and playwright servers
- 🔄 **Alternative**: Use Docker CLI or `dockerode` package
- ⏳ **Future**: Monitor for Docker MCP package fixes

**Reload the window now to see the error disappear!** 🚀
