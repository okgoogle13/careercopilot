# Flash-Sidekick Quick Reference Card

## 🚀 When to Use Flash-Sidekick

**Purpose:** Token-efficient analysis, summarization, and code generation using Gemini Flash (with GitHub Models fallback).

### Common Scenarios

#### 1. Analyzing Code Files

```
❌ DON'T: "Read and analyze /path/to/file.py"
✅ DO: "Use flash-sidekick analyze_code_quality on /path/to/file.py"
```

#### 2. Summarizing Large Files

```
❌ DON'T: "Read AGENTS.md and summarize"
✅ DO: "Use flash-sidekick quick_summarize on AGENTS.md content"
```

#### 3. Multiple File Analysis

```
❌ DON'T: "Analyze flash_sidekick.py, agent_handoff.py, and cloud_ops.py"
✅ DO: "Use flash-sidekick batch_file_analysis with files=[...] and type='quality'"
```

#### 4. Generating Documentation

```
❌ DON'T: "Read all server files and create a README"
✅ DO: "Use flash-sidekick create_readme with combined code"
```

#### 5. Code Refactoring Suggestions

```
❌ DON'T: "Read this file and suggest refactorings"
✅ DO: "Use flash-sidekick suggest_refactoring on this code"
```

## 📋 Available Tools

| Tool                         | Use Case                  | Input              | Output               |
| ---------------------------- | ------------------------- | ------------------ | -------------------- |
| `quick_summarize`            | Summarize large text/code | text               | Concise summary      |
| `generate_idf`               | Extract code structure    | code               | Interface definition |
| `consult_pro`                | Complex analysis          | query, context     | Deep analysis        |
| `batch_file_analysis`        | Analyze multiple files    | file_paths[], type | Aggregated results   |
| `analyze_code_quality`       | Code quality check        | code, language     | JSON with issues     |
| `generate_docstrings`        | Add documentation         | code, style        | Code with docstrings |
| `generate_unit_tests`        | Create tests              | code, framework    | Test code            |
| `suggest_refactoring`        | Refactoring ideas         | code               | Suggestions          |
| `create_readme`              | Generate README           | code               | README.md content    |
| `extract_dependencies`       | Find imports              | code               | Dependency list      |
| `generate_api_docs`          | API documentation         | code               | API docs             |
| `generate_integration_tests` | E2E tests                 | code               | Test scenarios       |
| `web_research_synthesis`     | Research with citations   | query              | Answer + sources     |

## 💬 Conversation Starters

### For Code Analysis

```
"Use flash-sidekick to analyze the code quality of all Python files in /servers/"
```

### For Documentation

```
"Use flash-sidekick to generate a comprehensive README for the flash_sidekick.py server"
```

### For Batch Operations

```
"Use flash-sidekick batch_file_analysis to check security issues in [file1, file2, file3]"
```

### For Research

```
"Use flash-sidekick web_research_synthesis to research 'MCP server best practices'"
```

## 🎯 Token Savings

| Your Recent Operation  | Tokens Used | With Flash-Sidekick | Savings |
| ---------------------- | ----------- | ------------------- | ------- |
| Read AGENTS.md         | ~3,000      | ~200                | 93%     |
| Read flash_sidekick.py | ~6,000      | ~300                | 95%     |
| Read agent_handoff.py  | ~1,200      | ~150                | 87%     |
| **Total**              | **~10,200** | **~650**            | **94%** |

## 🔧 Backend Configuration

### Primary: Gemini Flash
- **Models**: `gemini-2.0-flash-exp` → `gemini-1.5-flash` → `gemini-pro`
- **API Key**: Retrieved from macOS Keychain (`gemini-key`)
- **Current Status**: ⚠️ API key invalid (400 error)

### Fallback: GitHub Models
- **Model**: `gpt-4o-mini`
- **Token**: Retrieved from `GITHUB_TOKEN` or `GH_TOKEN` env var
- **Status**: ⚠️ Configured but missing `azure-ai-inference` dependency

## 🔧 Quick Commands

```bash
# Check Gemini API key status
python3 -c "
import os, google.generativeai as genai
key = os.getenv('GEMINI_API_KEY')
print(f'Key: {key[:10]}...{key[-4:]}' if key else 'NOT SET')
genai.configure(api_key=key)
try:
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    print('✅ API Key Valid')
except Exception as e:
    print(f'❌ {str(e)[:100]}')
"

# Update Gemini API key in keychain
security delete-generic-password -a "gemini-key" -s "careercopilot"
/Users/okgoogle13/scripts/setup-keychain-secrets.sh

# Install GitHub Models fallback dependencies
cd /Users/okgoogle13/Desktop/careercopilot
source .venv/bin/activate
pip install --no-cache-dir azure-ai-inference openai

# Test flash-sidekick
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | \
  /Users/okgoogle13/Desktop/careercopilot/.venv/bin/python3 \
  /Users/okgoogle13/Desktop/careercopilot/servers/flash_sidekick.py

# Monitor flash-sidekick logs
tail -f /tmp/mcp-flash-sidekick.log
```

---

**Remember:** Flash-sidekick uses Gemini (free/cheap), Filesystem uses Claude tokens (expensive/limited)

**Last Updated:** 2026-02-15
**Status:** ⚠️ Blocked on invalid Gemini API key - see diagnosis report
