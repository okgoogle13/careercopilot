#!/bin/sh
# claude-sync.sh — Automated Notion + Linear sync via Claude Code headless (MCP)
#
# DISABLED BY DEFAULT. Enable by setting in your shell:
#   export CAREERCOPILOT_SYNC_MODE=claude
#
# Requires:
#   - Claude Code CLI installed (claude --version)
#   - Linear MCP configured in Claude Code (mcp__claude_ai_Linear__*)
#   - Notion MCP configured in Claude Code (mcp__claude_ai_Notion__*)
#
# Usage (called by detect-trigger.sh):
#   ./claude-sync.sh docs/project/prompts/task-done.md

PROMPT_FILE="$1"

if [ -z "$PROMPT_FILE" ] || [ ! -f "$PROMPT_FILE" ]; then
  echo "⚠️  claude-sync.sh: prompt file missing or not found: $PROMPT_FILE"
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "⚠️  claude CLI not found. Install Claude Code and ensure 'claude' is in PATH."
  exit 1
fi

claude -p "$(cat "$PROMPT_FILE")" \
  --allowedTools \
    "mcp__claude_ai_Linear__save_issue,\
mcp__claude_ai_Linear__list_issues,\
mcp__claude_ai_Linear__list_cycles,\
mcp__claude_ai_Linear__get_team,\
mcp__claude_ai_Notion__notion-create-pages,\
mcp__claude_ai_Notion__notion-search,\
mcp__claude_ai_Notion__notion-update-page,\
Read" \
  2>/dev/null \
  || echo "⚠️  Claude MCP sync failed (non-blocking)"
