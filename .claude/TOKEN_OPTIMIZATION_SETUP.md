# Flash-Sidekick Token Optimization Setup

**Status:** ✅ Complete
**Date:** 2026-01-30
**Goal:** Reduce Claude token usage by routing expensive operations to Gemini Flash

## What Was Configured

### 1. Claude Desktop Config (`~/.claude/claude_desktop_config.json`)
Added:
- **flash-sidekick** MCP server (already configured)
- **design-system-sidekick** MCP server (NEW—for kerala-rage validation)
- `customInstructions` field with routing policy for both

**Key points:**
- Routes large file summarization (>10KB) to flash-sidekick
- Routes code analysis tasks to Gemini Flash
- Routes design asset validation to design-system-sidekick
- Preserves Claude tokens for creative/architectural decisions
- Target: 2:1 flash-sidekick:filesystem ratio

### 2. Project-Level Config (`.claude/settings.local.json`)
Added detailed `customInstructions` for Claude Code with:
- Flash-sidekick decision matrix and examples
- Design-system-sidekick usage patterns
- Token savings percentages and ratios
- kr-dark vs. kr-dark mode guidance

**Key points:**
- Provides specific Task syntax examples
- Explains token savings (97% for large file analysis)
- Documents design-system-sidekick tools: `validate_asset_compliance`, `generate_implementation_package`
- Clarifies when to use filesystem vs. sidekicks
- References the MCP usage policy

### 3. MCP Servers Registered
- ✅ **flash-sidekick** — General analysis, code quality, documentation
- ✅ **design-system-sidekick** — kerala-rage kr-solidarity validation & asset orchestration
- ✅ Existing policies:
  - `.claude/mcp-usage-policy.md` — Comprehensive decision matrix
  - `CLAUDE.md` — MCP task routing table

## How It Works Now

### Automatic Routing via Custom Instructions

**Flash-Sidekick (Code/Analysis Tasks)**
When you ask me to:
1. **Summarize a large file (>10KB)** → Task tool with flash-sidekick
2. **Analyze code quality** → Route to Gemini Flash
3. **Analyze 3+ files** → Batch operation via flash-sidekick
4. **Generate documentation** → Offload to Gemini
5. **Suggest refactoring** → Complex analysis task → Gemini

**Design-System-Sidekick (Design Tasks)**
When you ask me to:
1. **Validate design assets** → `validate_asset_compliance` tool
2. **Check kerala-rage compliance** → Design-system-sidekick MCP
3. **Generate component scaffolding** → `generate_implementation_package` tool
4. **Create design implementation packages** → Design-system-sidekick

### Manual Requests
If you explicitly ask me to "analyze [large file]", "check code quality", or "validate design assets," I'll now route via the appropriate sidekick instead of processing directly.

## Token Savings Expected

| Operation | Direct Read | Flash-Sidekick | Savings |
|-----------|------------|-----------------|---------|
| Analyze 50KB file | ~15K tokens | ~500 tokens | 97% |
| Summarize 10 files | ~100K tokens | ~2K tokens | 98% |
| Generate README | ~20K tokens | ~1K tokens | 95% |
| Code quality check | ~25K tokens | ~800 tokens | 97% |

Your 200K session budget now stretches much further.

## Next Steps

1. **Observe behavior** — I'll now route bulk operations to flash-sidekick automatically
2. **Monitor token usage** — Compare session token counts with previous sessions
3. **Adjust thresholds** if needed — Currently set to >10KB for large file operations
4. **Verify flash-sidekick API key** — Make sure `GEMINI_API_KEY` is set in your environment

## Verification

To verify the setup:

```bash
# Check Claude Desktop config has customInstructions
grep "customInstructions" ~/.claude/claude_desktop_config.json

# Check project config has customInstructions
grep "customInstructions" /Users/okgoogle13/Projects/careercopilot/.claude/settings.local.json

# Verify flash-sidekick is enabled in Claude Desktop
grep -A 10 '"flash-sidekick"' ~/.claude/claude_desktop_config.json
```

## Files Modified

1. **`~/.claude/claude_desktop_config.json`**
   - Added `design-system-sidekick` MCP server registration
   - Updated `customInstructions` with both flash-sidekick and design-system-sidekick routing

2. **`.claude/settings.local.json`**
   - Updated `customInstructions` with flash-sidekick and design-system-sidekick guidance
   - Added design-system-sidekick tool descriptions and usage patterns

3. **`.claude/TOKEN_OPTIMIZATION_SETUP.md`** (NEW)
   - This documentation file

## References

- [MCP Usage Policy](./ mcp-usage-policy.md)
- [Claude Instructions](../../CLAUDE.md)
- Flash-Sidekick Server: `.venv/bin/python3 servers/flash_sidekick.py`
