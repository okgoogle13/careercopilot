# MCP Server Usage Policy

**Purpose:** Optimize Claude Desktop token usage by routing heavy operations to Gemini via flash-sidekick

## 🎯 Core Principle

**ALWAYS prefer flash-sidekick tools over direct file operations when:**

- File size > 10KB
- Need to analyze multiple files
- Performing code analysis/quality checks
- Generating documentation
- Summarizing large content

## 📋 Decision Matrix

### Use Flash-Sidekick When:

| Task                            | Flash-Sidekick Tool                                 | Why                                       |
| ------------------------------- | --------------------------------------------------- | ----------------------------------------- |
| Summarizing large files (>10KB) | `quick_summarize`                                   | Saves Claude tokens, uses Gemini Flash    |
| Analyzing code structure        | `generate_idf`                                      | Fast extraction without full context      |
| Code quality analysis           | `analyze_code_quality`                              | Returns structured JSON analysis          |
| Multiple file analysis          | `batch_file_analysis`                               | Concurrent processing, aggregated results |
| Generating documentation        | `create_readme`, `generate_api_docs`                | Offloads heavy generation to Gemini Pro   |
| Adding docstrings               | `generate_docstrings`                               | Batch operation, preserves Claude context |
| Generating tests                | `generate_unit_tests`, `generate_integration_tests` | Heavy generation task                     |
| Refactoring suggestions         | `suggest_refactoring`                               | Complex analysis, uses Gemini Pro         |
| Web research                    | `web_research_synthesis`                            | Uses Google Search Grounding              |
| Dependency extraction           | `extract_dependencies`                              | Fast, structured output                   |

### Use Filesystem MCP When:

| Task                              | Why                             |
| --------------------------------- | ------------------------------- |
| Reading small config files (<5KB) | Quick reference, minimal tokens |
| Editing specific lines            | Precise modifications needed    |
| Creating new files                | Direct write operation          |
| Listing directories               | Metadata only                   |
| Checking file existence           | Boolean operation               |

## 🔧 Implementation Strategies

### 1. Custom Instructions (Recommended)

Add to your Claude Desktop custom instructions or project-level `.claude/settings.local.json`:

```json
{
  "customInstructions": "When analyzing files >10KB or performing code analysis, ALWAYS use flash-sidekick MCP tools (quick_summarize, analyze_code_quality, batch_file_analysis, etc.) instead of reading files directly via filesystem MCP. This preserves Claude tokens and leverages Gemini's capabilities."
}
```

### 2. Conversation Prefixes

Start conversations with:

```
@flash-sidekick mode: Use flash-sidekick tools for all heavy operations
```

### 3. Explicit Tool Requests

Instead of:

```
Read and analyze /path/to/large_file.py
```

Say:

```
Use flash-sidekick's analyze_code_quality tool on /path/to/large_file.py
```

### 4. Batch Operations

Instead of:

```
Analyze these 10 files: file1.py, file2.py, ...
```

Say:

```
Use flash-sidekick's batch_file_analysis with type='quality' on [file1.py, file2.py, ...]
```

## 📊 Token Savings Examples

| Operation          | Filesystem MCP | Flash-Sidekick | Savings |
| ------------------ | -------------- | -------------- | ------- |
| Analyze 50KB file  | ~15K tokens    | ~500 tokens    | 97%     |
| Summarize 10 files | ~100K tokens   | ~2K tokens     | 98%     |
| Generate README    | ~20K tokens    | ~1K tokens     | 95%     |
| Code quality check | ~25K tokens    | ~800 tokens    | 97%     |

## 🚫 What NOT to Do

❌ **Don't:**

- Read entire large files just to get a summary
- Analyze multiple files sequentially via filesystem
- Generate documentation by reading all code first
- Perform code quality checks by reading full files

✅ **Do:**

- Use `quick_summarize` for summaries
- Use `batch_file_analysis` for multiple files
- Use `create_readme` for documentation
- Use `analyze_code_quality` for quality checks

## 🎛️ Advanced: MCP Server Priority

You can also adjust MCP server priority by reordering them in the config (servers listed first are preferred):

```json
{
  "mcpServers": {
    "flash-sidekick": { ... },  // Listed first = higher priority
    "github": { ... },
    "playwright": { ... },
    "filesystem": { ... }       // Listed last = lower priority
  }
}
```

## 📝 Quick Reference Commands

### File Analysis

```bash
# Instead of: read file.py
Use: flash-sidekick analyze_code_quality(code=file.py, language=python)
```

### Batch Processing

```bash
# Instead of: read file1.py, file2.py, file3.py
Use: flash-sidekick batch_file_analysis(file_paths=[...], analysis_type=quality)
```

### Documentation

```bash
# Instead of: read all files then write README
Use: flash-sidekick create_readme(code=combined_code)
```

### Summarization

```bash
# Instead of: read large_doc.md
Use: flash-sidekick quick_summarize(text=large_doc_content)
```

## 🔍 Monitoring Usage

Check which MCP servers are being used:

```bash
# Count filesystem operations
grep -c "Filesystem.*tools/call" ~/Library/Logs/Claude/mcp.log

# Count flash-sidekick operations
grep -c "flash-sidekick.*tools/call" ~/Library/Logs/Claude/mcp.log
```

Target ratio: **Flash-sidekick:Filesystem should be >2:1 for code projects**

---

**Last Updated:** 2026-01-29
**Applies To:** Claude Desktop, Antigravity
