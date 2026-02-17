#!/bin/bash
# MCP Usage Monitor - Alerts when filesystem is overused vs flash-sidekick

set -e

MCP_LOG="$HOME/Library/Logs/Claude/mcp.log"
THRESHOLD_RATIO=0.5  # Alert if filesystem:flash-sidekick ratio > 0.5

echo "🔍 MCP Usage Monitor"
echo "===================="
echo ""

if [ ! -f "$MCP_LOG" ]; then
    echo "❌ MCP log not found at $MCP_LOG"
    exit 1
fi

# Count tool calls for each server
echo "📊 Counting MCP tool calls..."
FILESYSTEM_CALLS=$(grep -c "Filesystem.*tools/call" "$MCP_LOG" 2>/dev/null || echo "0")
FLASH_SIDEKICK_CALLS=$(grep -c "flash-sidekick.*tools/call" "$MCP_LOG" 2>/dev/null || echo "0")
GITHUB_CALLS=$(grep -c "github.*tools/call" "$MCP_LOG" 2>/dev/null || echo "0")
PLAYWRIGHT_CALLS=$(grep -c "playwright.*tools/call" "$MCP_LOG" 2>/dev/null || echo "0")

TOTAL_CALLS=$((FILESYSTEM_CALLS + FLASH_SIDEKICK_CALLS + GITHUB_CALLS + PLAYWRIGHT_CALLS))

echo ""
echo "📈 MCP Server Usage:"
echo "  Filesystem:     $FILESYSTEM_CALLS calls"
echo "  Flash-Sidekick: $FLASH_SIDEKICK_CALLS calls"
echo "  GitHub:         $GITHUB_CALLS calls"
echo "  Playwright:     $PLAYWRIGHT_CALLS calls"
echo "  ────────────────────────────"
echo "  Total:          $TOTAL_CALLS calls"
echo ""

# Calculate ratios
if [ "$FLASH_SIDEKICK_CALLS" -gt 0 ]; then
    RATIO=$(echo "scale=2; $FILESYSTEM_CALLS / $FLASH_SIDEKICK_CALLS" | bc)
    echo "📊 Filesystem:Flash-Sidekick Ratio: $RATIO"
    echo "   (Target: <0.5 for optimal token usage)"
    echo ""

    # Check if ratio is too high
    if (( $(echo "$RATIO > $THRESHOLD_RATIO" | bc -l) )); then
        echo "⚠️  WARNING: Filesystem usage is too high!"
        echo "   You're using filesystem $RATIO times more than flash-sidekick"
        echo "   This wastes Claude tokens on operations Gemini could handle"
        echo ""
        echo "💡 Recommendations:"
        echo "   1. Use 'flash-sidekick quick_summarize' for large file summaries"
        echo "   2. Use 'flash-sidekick batch_file_analysis' for multiple files"
        echo "   3. Use 'flash-sidekick analyze_code_quality' for code analysis"
        echo "   4. Review .claude/mcp-usage-policy.md for best practices"
    else
        echo "✅ Good job! You're using flash-sidekick efficiently"
    fi
else
    echo "⚠️  Flash-sidekick has not been used yet"
    echo "   Consider using it for heavy operations to save Claude tokens"
fi

echo ""
echo "🔍 Recent Large File Operations:"
grep "Filesystem.*read_text_file" "$MCP_LOG" | tail -5 | while read -r line; do
    # Extract file path from log line
    if echo "$line" | grep -q "path"; then
        echo "  - $(echo "$line" | grep -o '"path":"[^"]*"' | cut -d'"' -f4)"
    fi
done

echo ""
echo "💾 Log File Size: $(du -h "$MCP_LOG" | cut -f1)"
echo ""
echo "📝 To reset counters, clear the log:"
echo "   rm ~/Library/Logs/Claude/mcp.log"
echo ""
echo "🔄 To monitor in real-time:"
echo "   tail -f ~/Library/Logs/Claude/mcp.log | grep 'tools/call'"
