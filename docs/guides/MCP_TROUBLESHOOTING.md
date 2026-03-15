# MCP Server Troubleshooting Guide

**Last Updated:** 2026-03-03
**Config file:** `.vscode/mcp.json` (single source of truth)

---

## Quick Diagnostics

```bash
# Full health check (spawns each server process)
python3 scripts/validate-mcp.py

# Env-var check only — fast, no process spawn
python3 scripts/validate-mcp.py --quick

# Check a single server
python3 scripts/validate-mcp.py --server flash-sidekick
```

---

## Common Issues

### Server doesn't appear in Antigravity

1. **Check env vars** — most servers fail silently when the API key is missing:
   ```bash
   echo $GEMINI_API_KEY        # flash-sidekick, design-system-sidekick
   echo $PERPLEXITY_API_KEY    # perplexity
   echo $GITHUB_TOKEN          # github
   ```
   If empty, export the variable and restart Antigravity.

2. **Check JSON syntax** in `.vscode/mcp.json`:
   ```bash
   python3 scripts/validate-mcp.py --quick --config .vscode/mcp.json
   ```

3. **Check server logs:**
   ```bash
   tail -f /tmp/mcp-flash-sidekick.log
   tail -f /tmp/mcp-design-system-sidekick.log
   ```

4. **Verify the server script exists and is executable:**
   ```bash
   ls -la servers/flash_sidekick.py
   python3 -c "import ast; ast.parse(open('servers/flash_sidekick.py').read()); print('OK')"
   ```

---

### Server drops / disconnects after idle

MCP servers communicate over stdio. When the MCP client idles, some clients close the process.
FastMCP-based servers (`flash-sidekick`, `task-router`, `perplexity`) restart automatically
when the client reconnects on the next tool call.

If a server does **not** restart automatically:
- Restart Antigravity (File → Restart Window or `Cmd+Shift+P` → "Reload Window").
- Check that the Python process isn't stuck: `ps aux | grep mcp`

---

### Design Sidekick drops off

`design_system_sidekick.py` uses a custom stdio protocol (not FastMCP). Connection drops can
occur if:
- The server received a malformed JSON line and exited.
- Gemini API returned an error that propagated to the main loop.

**Fix:**
```bash
# Check if an error caused the exit
tail -20 /tmp/mcp-design-system-sidekick.log

# Test initialization manually
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1"}}}' \
  | python3 servers/design_system_sidekick.py
```

---

### Flash Sidekick drops off

Flash Sidekick uses FastMCP and is generally stable. Check:
```bash
tail -20 /tmp/mcp-flash-sidekick.log
python3 scripts/validate-mcp.py --server flash-sidekick
```

If the log shows `API_KEY_INVALID`, your `GEMINI_API_KEY` is missing or expired.

---

### Task Router drops off

The Task Router uses FastMCP and operates purely on the local filesystem.
Drops are almost always caused by JSON parse errors in the queue file.

```bash
# Validate queue file
python3 -m json.tool /tmp/kerala-rage-task-queue.json

# Reset a corrupted queue
rm /tmp/kerala-rage-task-queue.json
```

---

### Perplexity — tools disappearing

**Symptom:** Only 1 tool visible instead of 4.

**Root cause (resolved):** The previous config used the `perplexity-mcp` npm package, which
registered 4 tools but could lose 3 of them when the server reconnected with a missing API key.
The custom `servers/perplexity_server.py` is now used instead, with all 4 tools defined
explicitly:
- `perplexity_chat`
- `perplexity_search_web`
- `perplexity_deep_research`
- `perplexity_summarize_with_citations`

If tools are still missing:
```bash
# Check API key
echo $PERPLEXITY_API_KEY

# Test the server
python3 scripts/validate-mcp.py --server perplexity

# Check log
# (Perplexity server logs to stderr; check Antigravity's MCP output panel)
```

---

### Environment variable substitution not working

Some MCP clients do not expand `${VAR}` tokens in the `env` block. The canonical fix is to
ensure the variable is exported in your shell **before** starting Antigravity:

```bash
# ~/.zshrc or ~/.bashrc
export GEMINI_API_KEY="your-key-here"
export GITHUB_TOKEN="your-token-here"
export PERPLEXITY_API_KEY="your-key-here"
```

> **Do not** hardcode secrets in `.vscode/mcp.json` — use environment variables only.

**macOS GUI apps** (launched from Dock, not Terminal) inherit a limited environment.
Force them to inherit shell env by launching from Terminal:
```bash
open -a Antigravity
```

Or use `launchctl` to set a system-wide env var:
```bash
launchctl setenv GEMINI_API_KEY "your-key-here"
# Requires Antigravity restart
```

---

## Log Files

| Server | Log location |
|---|---|
| `flash-sidekick` | `/tmp/mcp-flash-sidekick.log` |
| `design-system-sidekick` | `/tmp/mcp-design-system-sidekick.log` |
| `vision-scorer-mcp` | Check stderr in Antigravity MCP panel |
| `perplexity` | Check stderr in Antigravity MCP panel |
| `task-router` | Check stderr in Antigravity MCP panel |

---

## Pre-Commit Hook (Optional)

Add env-var validation as a pre-commit check:

```bash
# .husky/pre-commit  (or .git/hooks/pre-commit)
python3 scripts/validate-mcp.py --quick || { echo "MCP env vars missing — commit blocked"; exit 1; }
```

---

## Legacy Notes

> The following applies only to historical context. The current setup uses `.vscode/mcp.json`.

---

### Historical: Flash-Sidekick Not Appearing (2025-12-27)

**Issue:** flash-sidekick server not showing up in available MCP servers

## 🔍 Root Cause Identified

**The Problem:** API key environment variable substitution not working

The MCP configuration was using `${GEMINI_API_KEY}` variable substitution:
```json
"env": {
  "GEMINI_API_KEY": "${GEMINI_API_KEY}",
  ...
}
```

However, Antigravity didn't have access to this environment variable when launching the MCP server, causing authentication failures.

## 📊 Diagnostic Results

### ✅ What's Working
1. **MCP Config File:** Exists at `~/.gemini/antigravity/mcp_config.json`
2. **Python Environment:** Virtual environment exists at `.venv/bin/python3`
3. **Server Script:** `servers/flash_sidekick.py` is present and executable
4. **Dependencies:** `google-generativeai==0.8.6` installed
5. **Server Response:** Script responds correctly to test initialization

### ❌ What Was Failing
**API Key Validation:** Server logs showed:
```
2025-12-27 01:41:07,366 - [Sidekick] - WARNING - Failed to init fast model gemini-1.5-flash:
400 API key not valid. Please pass a valid API key.
[reason: "API_KEY_INVALID"]
```

## ✅ Solution Applied

**Quick Fix:** Hardcoded API key in MCP configuration

Updated `~/.gemini/antigravity/mcp_config.json` to include the actual API key value instead of variable substitution:

```json
{
  "mcpServers": {
    "flash-sidekick": {
      "command": "/Users/okgoogle13/.gemini/antigravity/playground/primordial-quasar/.venv/bin/python3",
      "args": ["/Users/okgoogle13/.gemini/antigravity/playground/primordial-quasar/servers/flash_sidekick.py"],
      "env": {
        "GEMINI_API_KEY": "[REDACTED]",
        "GEMINI_MODEL": "gemini-1.5-flash"
      }
    },
    ...
  }
}
```

**Backup Created:** `~/.gemini/antigravity/mcp_config.json.backup`

## 🚀 Next Steps

### 1. Restart Antigravity
Close and reopen Antigravity to reload the MCP configuration.

### 2. Verify Server Appears
Check if `flash-sidekick` now appears in the MCP servers list.

### 3. Test the Server
Try using the `quick_summarize` or `generate_idf` tools from flash-sidekick.

## 🔄 Alternative Solutions (For Future Reference)

### Option 1: System-Wide Environment Variable (More Secure)
Add to `~/.zshrc`:
```bash
export GEMINI_API_KEY="[REDACTED]"
```

Then update MCP config back to:
```json
"env": {
  "GEMINI_API_KEY": "${GEMINI_API_KEY}",
  ...
}
```

**Advantages:**
- API key not stored in config file
- Can be used by other applications
- Easier to rotate keys

**Disadvantages:**
- Requires shell restart
- Antigravity must be launched from terminal to inherit env vars

### Option 2: launchctl (Mac-Specific)
```bash
launchctl setenv GEMINI_API_KEY "[REDACTED]"
```

**Advantages:**
- Works for GUI applications
- Persists across sessions

**Disadvantages:**
- Mac-specific
- Requires restart of Antigravity

### Option 3: Antigravity Environment File
If Antigravity supports a `.env` file for MCP servers, create:
```
~/.gemini/antigravity/.env
```
With:
```
GEMINI_API_KEY=[REDACTED]
```

## ⚠️ Additional Issues Found

### 1. Python Version
- **Current:** Python 3.9.6
- **Status:** Past end-of-life
- **Recommendation:** Upgrade to Python 3.10+ or 3.12
- **Impact:** Security and compatibility warnings

### 2. Deprecated Package
- **Package:** `google-generativeai`
- **Status:** Deprecated, no longer maintained
- **Recommendation:** Migrate to `google-genai`
- **Impact:** Won't receive updates or bug fixes

### 3. OpenSSL Warning
- **Issue:** urllib3 v2 requires OpenSSL 1.1.1+, but system has LibreSSL 2.8.3
- **Impact:** Potential SSL/TLS compatibility issues
- **Recommendation:** Update OpenSSL or use Python with proper SSL support

## 📝 Server Capabilities

Once working, flash-sidekick provides:

### Tools Available
1. **`quick_summarize`**
   - Summarize text using Gemini Flash
   - Fast, token-efficient summaries

2. **`generate_idf`**
   - Generate Python Interface Definition Files
   - Extract signatures and docstrings only
   - Saves tokens for large codebases

### Models Used
- **Fast Model:** `gemini-1.5-flash` (default)
- **Pro Model:** `gemini-2.5-pro` (fallback)

## 🔧 Testing Commands

### Test Server Manually
```bash
cd /Users/okgoogle13/.gemini/antigravity/playground/primordial-quasar
echo '{"method":"initialize","params":{}}' | .venv/bin/python3 servers/flash_sidekick.py
```

### Check Server Logs
```bash
tail -f /tmp/mcp-flash-sidekick.log
```

### Verify API Key
```bash
.venv/bin/python3 -c "
import os
import google.generativeai as genai
genai.configure(api_key='[REDACTED]')
model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content('Hello')
print('API Key Valid:', bool(response.text))
"
```

## 📚 Resources

- **MCP Config Location:** `~/.gemini/antigravity/mcp_config.json`
- **Server Script:** `servers/flash_sidekick.py`
- **Server Logs:** `/tmp/mcp-flash-sidekick.log`
- **Backup Config:** `~/.gemini/antigravity/mcp_config.json.backup`

## ✅ Summary

**Problem:** API key not being passed to MCP server
**Solution:** Hardcoded API key in MCP configuration
**Status:** Ready for testing after Antigravity restart
**Next Action:** Restart Antigravity and verify flash-sidekick appears in MCP servers list
