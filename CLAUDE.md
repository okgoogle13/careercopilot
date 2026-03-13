# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Output**: Code first. No preamble.

<output_constraints>
- NO PREAMBLE: Skip all introductory phrases, conversational fillers, and verbose status updates. Lead with direct action verbs.
- NO UNNECESSARY REPORTS: DO NOT generate comprehensive markdown reports summarizing your tasks unless explicitly instructed by the user. Status updates must be kept strictly under 2 sentences.
- TOKEN GUARDIAN ACTIVE: You must adhere to the rules in `.claude/TOKEN_GUARDIAN.md`. Track token usage and mandate sidekick routing if usage exceeds 80%.
- PLAN LOCATION: **ALWAYS** save implementation plans to `/Users/okgoogle13/Projects/careercopilot/.claude/plans/`. NEVER save plans to worktree directories or global user home folder.
- REPORT LOCATION: Save reports and documentation to `.claude/reports/` within the project repository.
</output_constraints>

---

## Stack
- **Frontend**: React 18 + TS + Vite + Tailwind v4 + Zustand + TanStack Query
- **Backend**: FastAPI + SQLAlchemy + Genkit + Python 3.10+
- **Cloud**: GCP us-central1 · Firebase · Cloud Run
- **Design**: **KR Solidarity v6.1** (M3 Expressive)
- **Tests**: Jest, Playwright (e2e), pytest

---

## Active Initiative: Frontend Source-of-Truth Migration

**Phase**: M1 (Planning Gates) — no implementation started
**Plan**: `docs/project/active/frontend-source-of-truth-migration/`

### Locked Route Decisions
- **expand**: `/tracker` (mock→CRUD), `/career/ingest`, `/profile`, `/documents`, `/analysis`, `/opportunities`, `/apply/quick`
- **retire**: `/kr/*` (5 prototype routes), `/design-sidekick`, `/style-guide`, `/test-tokens`

### M1 Gates (must clear before M2)
- MIG-001: Fix capability matrix (`resolution_status`, `blocked_by`, `resolved_commit`)
- MIG-002: Align `validate-governance-artifacts.mjs` with Python tests (blocks on MIG-001)
- MIG-003: Approve 5 migration skills (sprint-coordinator, frontend-backend-mapper, api-contract-validator, migration-audit, verification-before-completion)
- MIG-004: Approve scripts review (component-inventory.ts `approved_with_limits`; mjs `not_fit_for_purpose`)
- MIG-005: Define token-enforcement gate (regex scan hardcoded colors on touched routes)

### Tool Limits (until human upgrades to `approved`)
- All migration skills: `approved_with_limits` — cannot override route matrix or decide product truth
- `validate-governance-artifacts.mjs`: `not_fit_for_purpose` — ad hoc inspection only, NOT a gate

### Critical Blockers
- `workflow_orchestration` backend placeholder-only (defers workflow UI to M5)
- Ingestion callers fragmented across 4 API paths (canonicalized in MIG-103)

---

## Task Delegation (Token Conservation) ⚡

**RULE: Default to delegation via the task-router MCP, NOT local execution.**

- **Delegate Heavy Tasks**:
  - Test generation (>50 lines), security/coverage analysis, refactoring, report generation, documentation.
  - If it takes >15K tokens or is an autonomous task, DELEGATE to the `task-router` MCP server (e.g., use the `create_task` tool to assign tasks to other agents like `gemini` or `flash-sidekick`).
- **Keep Local**:
  - Code review, bug fixes with architectural decisions, git operations, and integration/deployment.
- **Token Budget Target**:
  - Max 150K per sprint (Claude Code).
  - Use Sidekick tools aggressively to preserve tokens per `.claude/TOKEN_GUARDIAN.md`.

---

## Workspace Structure & Quick Commands

- **Frontend**: `cd frontend` -> `yarn dev`, `yarn test`, `yarn build`.
  - UI Primitives: `src/components/ui/`
  - Design Tokens: `src/design/tokens/tokens.json` (Source of truth, DTCG format)
- **Backend**: `cd backend && source venv/bin/activate` -> `uvicorn app.main:app --reload --port 8000`, `pytest`.
- **Scripts**: Run `python3 scripts/build-m3-tokens.py` to rebuild CSS variables from `tokens.json`.

---

## Design System: KR Solidarity v6.1 (M3 Expressive)

**Strict Rules**:
- **Zero-Flora Lockdown**: Absolutely NO flora or Australian endemic fauna.
- **Dark-only territory**: No white backgrounds. All backgrounds use `--sys-color-charcoalBackground-base`.
- **No generic shapes**: Use asymmetric `shape.*` radii tokens (e.g. `shape.blockRiot03`).
- **Semantic Colors Only**: Use `--sys-color-{name}-base` variable tokens for assignments.
- **Extreme Contrast**: Variable fonts (`Work Sans`, `Fraunces`, `Libre Bodoni`, `JetBrains Mono`, `Caveat`, `Nabla`) with strict optical sizing and 9x weight ratios.

### Canonical Archetypes (v6.1) & Gold Standard Components
*Note: Pebble, Stone, Slab, Jar, Lens, and Cabinet are deprecated.*

| Archetype | Component | Shape Token | Role |
| --- | --- | --- | --- |
| **Strike** | `Strike.tsx` | `shape.blockRiot03` | Primary active buttons, decisive actions. |
| **Placard** | `Placard.tsx` | `shape.placardTorn01` | Content containers, opportunity logic feeds. |
| **Scaffold** | `ScaffoldInput.tsx` / `ScaffoldArea.tsx` | `shape.blockRiot02` | Immutable structural layout framing, inputs. |
| **March** | `March.tsx` | `shape.blockRiot01` -> `pebbleSurge01` | Sequential select flows, collective progress. |
| **Megaphone** | `Megaphone.tsx` | `shape.megaphoneCut01` | Modals, intense announcement focus. |

**Component Source**: `frontend/src/components/ui/*.tsx`

### Sources of Truth
1. **Canon**: `docs/design/01_CANON.md` (Identity, Rules)
2. **System**: `docs/design/02_SYSTEM.md` (Palette, Typography)
3. **Components**: `docs/design/03_COMPONENTS.md` (Archetypes)
4. **Assets**: `docs/design/04_ASSETS.md`
5. **Tokens**: `frontend/src/design/tokens/tokens.json`

---

## Design Workflow (Design Workflow 2026)

Follow `/.agent/workflows/design-workflow-2026.md` and use available skills:
- `/figma-to-page`
- `/kr-svg`
- `/ui-design-evaluator`
- `/m3-expressive-ui-evaluator`
- `/kerala-rage-brand-enforcer`
- `/token-orchestrator`
- `/wireframe-annotator`

---
*Tokens are law. Semantic CSS variables are truth. Zero-Flora enforced.*
