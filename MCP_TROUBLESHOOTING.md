# Flash-Sidekick MCP Server Troubleshooting

**Date:** 2025-12-27T01:44:32+11:00  
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
        "GEMINI_API_KEY": "AIzaSyDuCsnEtxxgUCVilracX3PRRKjmheaQQS0",
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
export GEMINI_API_KEY="AIzaSyDuCsnEtxxgUCVilracX3PRRKjmheaQQS0"
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
launchctl setenv GEMINI_API_KEY "AIzaSyDuCsnEtxxgUCVilracX3PRRKjmheaQQS0"
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
GEMINI_API_KEY=AIzaSyDuCsnEtxxgUCVilracX3PRRKjmheaQQS0
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
genai.configure(api_key='AIzaSyDuCsnEtxxgUCVilracX3PRRKjmheaQQS0')
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
