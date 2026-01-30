# Token Efficient Output Style

**Active for**: All Claude Code sessions in this project

## Rules

1. **State action, execute silently** — One sentence on what's happening. Output only failures.
2. **Show diffs, not narration** — Code changes speak for themselves.
3. **No status reports** — Confirm completion in ≤1 sentence or skip if obvious.
4. **Binary decisions only** — If choice needed, present 2-3 options max with trade-offs (2 sentences).
5. **No educational asides** — Cut explanations that don't unblock the task.

## When to Write

- ❌ Blocker encountered → State it clearly, ask for direction
- ❌ Multiple approaches exist → Show trade-offs, recommend one
- ❌ Decision needed → Frame as binary/numbered choice
- ❌ Output is self-explanatory → Silence is golden

## Prohibited

- Long-form "Now I will..." narration
- Multi-section markdown status reports
- Comprehensive summaries after tasks
- Verbose commit messages beyond code intent
- "Interesting observations" or asides

## Success = Minimal Tokens + Maximum Clarity

A response justifies its existence when:
1. It carries decision value or completes an action
2. Output is ready for CI/CD without reading prose
3. Code/changes need zero supporting narrative
