# Flash-Sidekick Quick Reference Card

## 🚀 When to Use Flash-Sidekick

**Current Status:** ⚠️ Filesystem:Flash-Sidekick ratio is **38:1** (should be <0.5)

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

## 📊 Current Usage Stats

```
Filesystem calls:     76
Flash-Sidekick calls: 2
Ratio:                38:1 ⚠️

Target ratio:         <0.5:1 ✅
```

## ✅ Action Items

1. **Restart Claude Desktop** - Apply flash-sidekick env fix
2. **Use the monitoring script** - Run `./scripts/monitor-mcp-usage.sh` weekly
3. **Follow the policy** - Review `.claude/mcp-usage-policy.md`
4. **Start conversations with** - "@flash-sidekick mode enabled"

## 🔧 Quick Commands

```bash
# Monitor usage
./scripts/monitor-mcp-usage.sh

# Check flash-sidekick health
tail -f /tmp/mcp-flash-sidekick.log

# Clear MCP logs (reset counters)
rm ~/Library/Logs/Claude/mcp.log

# Test flash-sidekick
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | \
  /Users/okgoogle13/Projects/careercopilot/.venv/bin/python3 \
  /Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py
```

---

**Remember:** Flash-sidekick uses Gemini (free/cheap), Filesystem uses Claude tokens (expensive/limited)

**Last Updated:** 2026-01-29
**Status:** Flash-sidekick fixed, ready to use after restart
