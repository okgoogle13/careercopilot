#!/bin/sh
# detect-trigger.sh
# Reads git diff of last commit, routes to correct Perplexity prompt.
# Called by .husky/post-commit

REPO_ROOT="$(git rev-parse --show-toplevel)"
PROMPTS_DIR="$REPO_ROOT/docs/project/prompts"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
CHANGED=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only HEAD 2>/dev/null)

# Helper: call Perplexity CLI with a prompt file
run_perplexity() {
  PROMPT_FILE="$1"
  if [ ! -f "$PROMPT_FILE" ]; then
    echo "⚠️  Prompt file not found: $PROMPT_FILE"
    return
  fi
  echo "🔄 Running Perplexity sync: $PROMPT_FILE"
  # Perplexity CLI invocation — reads prompt file, uses active connectors
  perplexity "$PROMPT_FILE" --connectors filesystem,linear,notion 2>/dev/null \
    || echo "⚠️  Perplexity sync failed (non-blocking)"
}

# Trigger 1: New sprint branch created
if echo "$BRANCH" | grep -q "^sprint/"; then
  COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null)
  if [ "$COMMIT_COUNT" = "1" ]; then
    echo "🚀 Sprint branch detected. Initialising sprint in Linear + Notion..."
    run_perplexity "$PROMPTS_DIR/sprint-open.md"
    exit 0
  fi
fi

# Trigger 2: SPRINT_LOG.md changed (sprint close)
if echo "$CHANGED" | grep -q "SPRINT_LOG.md"; then
  echo "🏁 Sprint log updated. Writing handover to Notion + closing Linear cycle..."
  run_perplexity "$PROMPTS_DIR/sprint-close.md"
fi

# Trigger 3: TASKS.md changed (task completed)
if echo "$CHANGED" | grep -q "TASKS.md"; then
  echo "✅ TASKS.md changed. Syncing task status to Linear..."
  run_perplexity "$PROMPTS_DIR/task-done.md"
fi

# Trigger 4: DECISIONS.md changed
if echo "$CHANGED" | grep -q "DECISIONS.md"; then
  echo "📝 Decision logged. Creating Notion decision entry..."
  run_perplexity "$PROMPTS_DIR/decision-logged.md"
fi
