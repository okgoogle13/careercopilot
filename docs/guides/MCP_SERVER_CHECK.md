# How to Check MCP Servers List in Antigravity

## 🎯 Quick Answer

In Antigravity, MCP servers are typically accessed through the **Agent Panel** or **MCP Manager**. Here's how to find it:

## 📍 **Method 1: Visual UI Check (Recommended)**

### **Step 1: Look in the Sidebar**
Antigravity usually has a sidebar with icons. Look for:
- 🤖 **Agent icon** (robot or brain symbol)
- 🔧 **Tools icon** (wrench or gear)
- 🔌 **Extensions icon** (puzzle piece)
- 📡 **MCP icon** (might say "MCP" or "Servers")

### **Step 2: Check the Menu Bar**
Click on the **Antigravity** menu at the top and look for:
- `Antigravity` → `Preferences` → `MCP Servers`
- `Antigravity` → `Settings` → `Extensions` → `MCP`
- `View` → `Agent Manager`
- `View` → `MCP Servers`

### **Step 3: Use Command Palette**
1. Press **`Cmd+Shift+P`** (Mac) or **`Ctrl+Shift+P`** (Windows/Linux)
2. Type: `MCP` or `Agent` or `Servers`
3. Look for commands like:
   - "MCP: Show Servers"
   - "Agent: Show Manager"
   - "View: Show MCP Panel"

### **Step 4: Check Status Bar**
Look at the **bottom status bar** of Antigravity:
- You might see a server count indicator
- Click on it to see connected servers
- Example: `🔌 3 servers` or `MCP: 3 connected`

## 📊 **What You Should See**

When flash-sidekick is successfully connected, you'll see:

```
┌─────────────────────────────────────┐
│ MCP Servers                         │
├─────────────────────────────────────┤
│ ✅ flash-sidekick      [Connected]  │
│    └─ quick_summarize               │
│    └─ generate_idf                  │
│                                     │
│ ✅ github              [Connected]  │
│ ⚠️  perplexity         [No API Key] │
│ ✅ postgres            [Connected]  │
└─────────────────────────────────────┘
```

## 🔍 **Method 2: Check Configuration File**

Verify what servers are configured:

```bash
cat ~/.gemini/antigravity/mcp_config.json
```

This shows **configured** servers, but not their **connection status**.

## 📝 **Method 3: Check Logs**

View MCP server connection logs:

```bash
# Find latest log directory
ls -lt "/Users/okgoogle13/Library/Application Support/Antigravity/logs/" | head -5

# Check agent logs
tail -100 "/Users/okgoogle13/Library/Application Support/Antigravity/logs/20251227T014949/agent-window-console.log" | grep -i mcp

# Check shared process logs
tail -100 "/Users/okgoogle13/Library/Application Support/Antigravity/logs/20251227T014949/sharedprocess.log" | grep -i mcp
```

## 🧪 **Method 4: Test Server Availability**

Try to use a flash-sidekick tool in a conversation:

1. **Start a new conversation** in Antigravity
2. **Type a message** that would benefit from summarization
3. **Look for tool suggestions** - flash-sidekick tools should appear
4. **Or explicitly request**: "Use flash-sidekick to summarize this text: [your text]"

## 🔧 **Troubleshooting: Server Not Showing Up**

### **If flash-sidekick doesn't appear:**

1. **Restart Antigravity Completely**
   ```bash
   # Force quit Antigravity
   killall Antigravity
   # Then reopen it
   ```

2. **Check Server Logs**
   ```bash
   tail -50 /tmp/mcp-flash-sidekick.log
   ```

3. **Verify Configuration**
   ```bash
   cat ~/.gemini/antigravity/mcp_config.json | jq '.mcpServers["flash-sidekick"]'
   ```

4. **Test Server Manually**
   ```bash
   cd /Users/okgoogle13/.gemini/antigravity/playground/primordial-quasar
   echo '{"method":"initialize","params":{}}' | .venv/bin/python3 servers/flash_sidekick.py
   ```

   **Expected output:**
   ```json
   {"result": {"protocolVersion": "0.1.0", "capabilities": {"tools": {}}, "serverInfo": {"name": "sidekick", "version": "2.5"}}}
   ```

## 📸 **Visual Indicators**

### **Connected Server:**
- ✅ Green checkmark or dot
- Status: "Connected" or "Active"
- Tools listed underneath

### **Disconnected Server:**
- ❌ Red X or dot
- Status: "Disconnected" or "Error"
- Error message shown

### **Loading Server:**
- 🔄 Spinner or loading indicator
- Status: "Connecting..." or "Initializing..."

## 🎯 **Quick Test**

After restarting Antigravity, try this:

1. **Open a chat** in Antigravity
2. **Type**: "List available MCP servers"
3. **Or type**: "What tools do you have access to?"
4. The response should mention flash-sidekick if it's connected

## 📞 **Alternative: Ask Antigravity Directly**

In a conversation with Antigravity, you can ask:
- "What MCP servers are currently connected?"
- "Do you have access to flash-sidekick?"
- "List all available tools"
- "Show me the MCP servers panel"

Antigravity should be able to guide you to the UI or tell you the status.

## ✅ **Expected Result After Fix**

Once Antigravity is restarted with the fixed configuration, you should see:

- **Server Name:** flash-sidekick
- **Status:** ✅ Connected
- **Available Tools:**
  - `quick_summarize` - Summarize text using Gemini Flash
  - `generate_idf` - Generate Python Interface Definition Files

## 🚨 **If Still Not Working**

Check these common issues:

1. **API Key Invalid**
   ```bash
   # Test API key directly
   curl -H "Content-Type: application/json" \
        -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDuCsnEtxxgUCVilracX3PRRKjmheaQQS0"
   ```

2. **Python Environment Issues**
   ```bash
   .venv/bin/python3 --version
   .venv/bin/python3 -c "import google.generativeai"
   ```

3. **File Permissions**
   ```bash
   ls -la servers/flash_sidekick.py
   # Should be executable: -rwxr-xr-x
   ```

4. **Configuration Syntax**
   ```bash
   # Validate JSON
   cat ~/.gemini/antigravity/mcp_config.json | jq '.'
   ```

## 📚 **Additional Resources**

- **MCP Config:** `~/.gemini/antigravity/mcp_config.json`
- **Server Script:** `servers/flash_sidekick.py`
- **Server Logs:** `/tmp/mcp-flash-sidekick.log`
- **Antigravity Logs:** `~/Library/Application Support/Antigravity/logs/`
- **Backup Config:** `~/.gemini/antigravity/mcp_config.json.backup`

---

**TL;DR:** Look for an Agent/MCP panel in Antigravity's sidebar or menu, or press `Cmd+Shift+P` and search for "MCP". After restarting Antigravity, flash-sidekick should appear with a green checkmark and show its two tools: `quick_summarize` and `generate_idf`.
