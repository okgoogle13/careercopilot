#!/bin/sh
# detect-trigger.sh
# Reads git diff of last commit, prints which Perplexity prompt to run.
# Called by .husky/post-commit
#
# WORKFLOW: Perplexity web (manual).
#   On trigger, this script prints the prompt file path.
#   Open that file in docs/project/prompts/ and paste into Perplexity
#   with filesystem + Linear + Notion connectors active.
#
# AUTOMATED FALLBACK: Claude MCP (disabled by default).
#   To enable: set CAREERCOPILOT_SYNC_MODE=claude in your shell env.
#   See scripts/sync/claude-sync.sh for the automated path.

REPO_ROOT="$(git rev-parse --show-toplevel)"
PROMPTS_DIR="$REPO_ROOT/docs/project/prompts"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
CHANGED=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only HEAD 2>/dev/null)

notify_sync() {
  PROMPT_FILE="$1"
  LABEL="$2"
  if [ ! -f "$PROMPT_FILE" ]; then
    echo "⚠️  Prompt file not found: $PROMPT_FILE"
    return
  fi

  if [ "$CAREERCOPILOT_SYNC_MODE" = "claude" ]; then
    # Automated path — Claude Code headless with Linear + Notion MCP
    echo "🤖 [$LABEL] Running Claude MCP sync..."
    "$REPO_ROOT/scripts/sync/claude-sync.sh" "$PROMPT_FILE"
  else
    # Manual path — print prompt location for Perplexity web
    echo ""
    echo "──────────────────────────────────────────────"
    echo "  SYNC NEEDED: $LABEL"
    echo "  Open in Perplexity (filesystem + Linear + Notion connectors):"
    echo "  $PROMPT_FILE"
    echo "──────────────────────────────────────────────"
    echo ""
  fi
}

# Trigger 1: New sprint branch (first commit)
if echo "$BRANCH" | grep -q "^sprint/"; then
  COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null)
  if [ "$COMMIT_COUNT" = "1" ]; then
    notify_sync "$PROMPTS_DIR/sprint-open.md" "Sprint Open"
    exit 0
  fi
fi

# Trigger 2: SPRINT_LOG.md changed → sprint close
if echo "$CHANGED" | grep -q "SPRINT_LOG.md"; then
  notify_sync "$PROMPTS_DIR/sprint-close.md" "Sprint Close"
fi

# Trigger 3: TASKS.md changed → task done
if echo "$CHANGED" | grep -q "TASKS.md"; then
  notify_sync "$PROMPTS_DIR/task-done.md" "Task Done"
fi

# Trigger 4: DECISIONS.md changed → decision logged
if echo "$CHANGED" | grep -q "DECISIONS.md"; then
  notify_sync "$PROMPTS_DIR/decision-logged.md" "Decision Logged"
fi
