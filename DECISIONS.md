# Decision Log

Short entries only: what changed, why, tradeoff, follow-up.

---

## 2026-04-20 — Treat the Gemini sidebar finding as desktop-unconfirmed

**Decision:** Keep the Gemini sidebar `P0` closed as a mobile-viewport false positive unless a desktop-width rerun reproduces it.

**Why:** The audited sidebar is intentionally `hidden md:flex`; the reported absence does not reproduce as a route-shell defect at the intended desktop form factor.

**Tradeoff:** Code extraction stays blocked on a narrower follow-up validation step instead of reopening broad shell surgery in `App.tsx`.

**Follow-up:** Re-run `/auth`, `/opportunities`, `/documents`, `/onboarding`, and `/` at 1440px+ and attach the evidence before clearing the final sprint gate.

---

## 2026-04-20 — Keep support surfaces on the migrated route shell

**Decision:** Route support-only surfaces through `MigratedRouteLayout` and retire the separate `ProtectedLayout` wrapper.

**Why:** The parity remediation touched the shared route shell path, and keeping one protected layout path reduces shell drift between audited surfaces and support surfaces.

**Tradeoff:** Legacy wrapper isolation is gone; future support-only shell experiments must happen inside the migrated layout path or behind explicit route-level branching.

**Follow-up:** Let the desktop-width rerun confirm no support-surface regressions were introduced by the layout consolidation.

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
