# Claude Desktop Usage Analysis & Optimization

**Date:** 2026-01-29
**Issue:** 90% usage limit reached
**Root Cause:** Filesystem MCP server overuse

## 📊 Usage Breakdown

### MCP Log Analysis

- **Total MCP operations:** 27,016 log entries
- **Filesystem operations:** 2,362 (9% of all operations)
- **Large file operations:** Multiple 30KB+ file reads/writes

### Primary Culprits

1. **Filesystem MCP Server** - Heavy file I/O operations
2. **Repeated file reads** - No caching between operations
3. **Large file transfers** - 36KB+ files being read/written frequently

## 🔧 Fixes Applied

### 1. Flash-Sidekick MCP Server Fixed ✅

**Problem:** Server crashing due to missing `GEMINI_API_KEY` environment variable

**Solution:** Added env configuration to both configs:

```json
"flash-sidekick": {
<<<<<<< HEAD
  "command": "/Users/okgoogle13/Desktop/careercopilot/.venv/bin/python3",
  "args": ["/Users/okgoogle13/Desktop/careercopilot/servers/flash_sidekick.py"],
=======
  "command": "/Users/okgoogle13/Projects/careercopilot/.venv/bin/python3",
  "args": ["/Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py"],
>>>>>>> restoration-KR-Rage-Figma-v2.0
  "env": {
    "GEMINI_API_KEY": "${GEMINI_API_KEY}"
  }
}
```

**Files Updated:**

- `~/Library/Application Support/Claude/claude_desktop_config.json`
- `~/.gemini/antigravity/mcp_config.json`

## 💡 Recommendations to Reduce Usage

### Immediate Actions

1. **Restart Claude Desktop** - Apply the flash-sidekick fix
2. **Clear MCP cache** - Run: `rm -rf ~/Library/Caches/Claude/mcp-*`
3. **Monitor usage** - Check Settings → Usage after restart

### Long-term Optimizations

#### 1. Use Flash-Sidekick for Large Operations

Instead of reading large files directly, use flash-sidekick tools:

- `quick_summarize` - For long file summaries
- `generate_idf` - For code structure extraction
- `batch_file_analysis` - For analyzing multiple files

#### 2. Reduce Filesystem MCP Calls

- Avoid repeatedly reading the same files
- Use view_file with line ranges instead of reading entire files
- Cache file contents in conversation context when possible

#### 3. Optimize File Operations

- Read only necessary sections of large files
- Use grep/search instead of full file reads
- Batch related file operations together

#### 4. Consider Disabling Heavy MCP Servers

If not actively using certain servers, disable them temporarily:

- Playwright (if not doing browser automation)
- Docker (if not managing containers)
- Genkit (if not using AI flows)

## 📈 Expected Impact

After implementing these fixes:

- **Flash-sidekick working** → Can offload heavy operations to Gemini
- **Reduced filesystem calls** → Lower Claude API usage
- **Better caching** → Fewer redundant operations

## 🔍 Monitoring

Check usage regularly:

```bash
# View MCP log size
ls -lh ~/Library/Logs/Claude/mcp.log

# Count filesystem operations
grep -c "Filesystem" ~/Library/Logs/Claude/mcp.log

# Monitor flash-sidekick health
tail -f /tmp/mcp-flash-sidekick.log
```

## ⚠️ Usage Limit Context

Claude Desktop has usage limits to prevent abuse. The 90% threshold indicates:

- Heavy MCP server usage (especially filesystem)
- Frequent large file operations
- Possible inefficient conversation patterns

**Next Reset:** Typically monthly or per billing cycle

---

**Status:** ✅ Flash-sidekick fixed, ready to test
**Action Required:** Restart Claude Desktop to apply changes
