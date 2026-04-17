# Decision Log

Short entries only: what changed, why, tradeoff, follow-up.

---

## 2026-04-16 — MCP Strategy

**Decision:** Built-in Claude Code tools only. Figma MCP is the sole exception.

**Why:** MCP tool calls are billed per use (input tokens). Built-in tools (Read, Edit, Write, Bash, Glob, Grep) have no MCP overhead. WebSearch replaces context7. Git + filesystem replace GitHub MCP.

**Tradeoff:** Lose some automation convenience; gain token efficiency and simplicity.

**Follow-up:** Revisit if Notion MCP becomes necessary for sprint tracking.

---

## 2026-04-16 — Planning Surface Consolidation

**Decision:** Four canonical surfaces only — `CLAUDE.md`, `SPRINT_BRIEF.md`, `TASKS.md`, `DECISIONS.md`. Notion for task/status. No autonomous `.md` creation without approval.

**Why:** ~130 planning markdown files in repo, none acting as control system. Noise > signal. Adherence drops with large vague instruction surfaces.

**Tradeoff:** Less flexibility for ad-hoc notes; all decisions must route through one of the four surfaces.

**Follow-up:** Set up Notion sprint board as task source of truth.

---
