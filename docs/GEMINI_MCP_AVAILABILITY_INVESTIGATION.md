# Gemini MCP Sidekicks - Root Cause Analysis & Solution

**Date**: 2026-02-15  
**Status**: 🔴 **ROOT CAUSE IDENTIFIED** → ✅ **SOLUTION PROVIDED**

---

## Executive Summary

**Problem**: Gemini MCP sidekicks (flash-sidekick, design-system-sidekick, vision-scorer-mcp) are not available for orchestration in Antigravity.

**Root Cause**: **Missing Python dependencies** in the virtual environment used by MCP servers.

**Impact**: MCP servers fail to start, preventing access to Gemini-based tools.

**Solution**: Install required dependencies in the Python environment.

---

## Root Cause Analysis

### Issue 1: Virtual Environment is a Symlink (Not a True Venv)

**Discovery**:
```bash
/Users/okgoogle13/Projects/careercopilot/.venv/bin/python3 
  → /Users/okgoogle13/.pyenv/versions/3.12.3/bin/python3
```

**Analysis**:
- `.venv` is a **symlink** to system Python, not an isolated virtual environment
- Dependencies must be installed in **system Python** (`/Users/okgoogle13/.pyenv/versions/3.12.3`)
- Backend dependencies are in `backend/requirements.txt` but not installed system-wide

### Issue 2: Missing Dependencies

**Required by MCP servers**:
```python
# flash_sidekick.py imports
from pydantic import BaseModel, Field  # ❌ ModuleNotFoundError
from mcp.server.fastmcp import FastMCP  # ✅ Installed
import google.generativeai as genai    # ✅ Installed
```

**Test Results**:
```bash
# ✅ FastMCP available
/Users/okgoogle13/.pyenv/versions/3.12.3/bin/python3 -c "from mcp.server.fastmcp import FastMCP"
# Result: FastMCP OK

# ✅ Gemini SDK available
/Users/okgoogle13/.pyenv/versions/3.12.3/bin/python3 -c "import google.generativeai"
# Result: Gemini SDK OK

# ❌ Pydantic NOT available
/Users/okgoogle13/.pyenv/versions/3.12.3/bin/python3 -c "from pydantic import BaseModel"
# Result: ModuleNotFoundError: No module named 'pydantic'
```

### Issue 3: GoogleSearchRetrieval Import Error (FIXED)

**Original Error**:
```python
from google.generativeai.types import Tool, GoogleSearchRetrieval
# ModuleNotFoundError: cannot import name 'GoogleSearchRetrieval' from 'google.generativeai.types'
```

**Root Cause**: API change in Gemini SDK 0.8.3

**Fix Applied**:
```python
# BEFORE (incorrect)
from google.generativeai.types import Tool, GoogleSearchRetrieval

# AFTER (correct for SDK 0.8.3)
from google.generativeai.protos import Tool, GoogleSearchRetrieval
```

**Status**: ✅ **FIXED** in `servers/flash_sidekick.py` line 164

---

## Solution: Install Missing Dependencies

### Option 1: Install in System Python (Recommended)

Since `.venv` is a symlink to system Python, install dependencies there:

```bash
# Install MCP server dependencies
/Users/okgoogle13/.pyenv/versions/3.12.3/bin/pip install \
  pydantic \
  pydantic-settings \
  python-dotenv \
  sentry-sdk

# Verify installation
/Users/okgoogle13/.pyenv/versions/3.12.3/bin/python3 -c "from pydantic import BaseModel; print('Pydantic OK')"
```

### Option 2: Create True Virtual Environment (Alternative)

Create a proper isolated venv:

```bash
# Remove symlink
rm -rf /Users/okgoogle13/Projects/careercopilot/.venv

# Create true venv
cd /Users/okgoogle13/Projects/careercopilot
python3 -m venv .venv

# Activate and install dependencies
source .venv/bin/activate
pip install \
  mcp \
  fastmcp \
  google-generativeai \
  pydantic \
  pydantic-settings \
  python-dotenv \
  sentry-sdk

# Update MCP config to use new venv path
# (Already correct: /Users/okgoogle13/Projects/careercopilot/.venv/bin/python3)
```

---

## Required Dependencies for MCP Servers

### flash-sidekick.py
```
mcp
fastmcp
google-generativeai
pydantic
pydantic-settings
python-dotenv
sentry-sdk
azure-ai-inference (optional, for GitHub Models fallback)
```

### design-system-sidekick.py
```
mcp
fastmcp
google-generativeai
pydantic
python-dotenv
```

### vision-scorer-mcp.py
```
mcp
fastmcp
google-generativeai
pydantic
python-dotenv
```

---

## Verification Steps

### Step 1: Install Dependencies
```bash
/Users/okgoogle13/.pyenv/versions/3.12.3/bin/pip install \
  pydantic pydantic-settings python-dotenv sentry-sdk
```

### Step 2: Test Server Startup
```bash
# Should start without errors
timeout 3 /Users/okgoogle13/Projects/careercopilot/.venv/bin/python3 \
  /Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py

# Expected: Server starts, waits for input, timeout after 3s (normal)
# Error: ModuleNotFoundError = dependencies still missing
```

### Step 3: Test in Antigravity
```
Ask: "What MCP tools do you have from flash-sidekick?"

Expected response:
- quick_summarize
- generate_idf
- consult_pro
- batch_file_analysis
- web_research_synthesis
- analyze_code_quality
- generate_docstrings
- generate_unit_tests
- suggest_refactoring
- create_readme
- extract_dependencies
- generate_api_docs
- generate_integration_tests
```

### Step 4: Test a Tool
```
Ask: "Use flash-sidekick to summarize this text: 
The Model Context Protocol (MCP) is a standard for connecting AI systems with external tools."

Expected: Concise summary generated by Gemini Flash
```

---

## Why This Happened

### Timeline of Events

1. **MCP config created** with path to `.venv/bin/python3`
2. **`.venv` was a symlink** to system Python (not a true venv)
3. **Backend dependencies** installed in `backend/` directory only
4. **MCP server dependencies** NOT installed in system Python
5. **Servers fail to start** due to missing `pydantic`
6. **Antigravity can't list tools** because servers never fully initialize

### Why It Wasn't Obvious

- ✅ `mcp` and `google-generativeai` WERE installed (some tools worked)
- ❌ `pydantic` was NOT installed (servers crashed on import)
- 🔕 **Silent failure**: Servers fail to start, no error shown in Antigravity UI
- 📝 **Logs show the error**: `/tmp/mcp-flash-sidekick.log` had the traceback

---

## Post-Fix Checklist

After installing dependencies:

- [ ] ✅ GoogleSearchRetrieval import fixed (already done)
- [ ] ⏭️ Dependencies installed in system Python
- [ ] ⏭️ Server startup test passes (no ModuleNotFoundError)
- [ ] ⏭️ Antigravity can list flash-sidekick tools
- [ ] ⏭️ Test tool execution (e.g., quick_summarize)
- [ ] ⏭️ Verify design-system-sidekick tools available
- [ ] ⏭️ Verify vision-scorer-mcp tools available
- [ ] ⏭️ Check logs for any remaining errors

---

## Long-Term Recommendation

**Create a proper requirements.txt for MCP servers**:

```bash
# Create servers/requirements.txt
cat > /Users/okgoogle13/Projects/careercopilot/servers/requirements.txt << 'EOF'
# MCP Server Dependencies
mcp>=1.0.0
fastmcp>=0.1.0
google-generativeai>=0.8.0
pydantic>=2.0.0
pydantic-settings>=2.0.0
python-dotenv>=1.0.0
sentry-sdk>=1.0.0

# Optional: GitHub Models fallback
azure-ai-inference>=1.0.0
azure-core>=1.0.0
EOF

# Install from requirements
/Users/okgoogle13/.pyenv/versions/3.12.3/bin/pip install -r servers/requirements.txt
```

---

## Summary

| Issue | Status | Action Required |
|-------|--------|-----------------|
| GoogleSearchRetrieval import | ✅ Fixed | None (already updated) |
| Missing pydantic | 🔴 Blocking | Install dependencies |
| Missing other deps | 🔴 Blocking | Install dependencies |
| Virtual env is symlink | ⚠️ Non-standard | Consider creating true venv |
| No requirements.txt | ⚠️ Missing | Create servers/requirements.txt |

**Next Step**: Run the installation command:
```bash
/Users/okgoogle13/.pyenv/versions/3.12.3/bin/pip install \
  pydantic pydantic-settings python-dotenv sentry-sdk
```

Then test in Antigravity:
```
"What MCP tools do you have from flash-sidekick?"
```

---

**Status**: � **BLOCKED** → ⏭️ **READY TO FIX**  
**Root Cause**: Missing Python dependencies  
**Solution**: Install dependencies in system Python  
**ETA**: 2-3 minutes (install + test)
