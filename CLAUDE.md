# CLAUDE.md — Branch Override: feat/prototype-harvest-prep

This file overrides `CLAUDE.md` for the duration of this branch.
This branch is a prototype-harvest quarantine lane, but it still defers to the active harvest control docs.

> **Output**: Code first. No preamble.

<output_constraints>
- NO PREAMBLE: Lead with direct action verbs.
- NO UNNECESSARY REPORTS: Status updates under 2 sentences.
- PLAN LOCATION: Save plans to `.claude/plans/`.
- REPORT LOCATION: Save reports to `.claude/reports/`.
</output_constraints>

---

## Stack

- **Frontend**: React 18 + TS + Vite + Tailwind v4 + Zustand + TanStack Query
- **Backend**: FastAPI + SQLAlchemy + Genkit + Python 3.10+
- **Tests**: Jest, Playwright (e2e), pytest

---

## Branch Objective

Harvest and isolate AI Studio prototype logic into `frontend/src/prototype-features/`
without promoting prototype shell ownership into canonical product routing.

---

## Harvest Authority

Use these as the active decision stack:

1. `docs/project/active/frontend-source-of-truth-migration/control/workflow.md`
2. `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.md`
3. `docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md`
4. `docs/project/active/frontend-source-of-truth-migration/control/harvest-spec.md`
5. `docs/project/active/frontend-source-of-truth-migration/control/fit-for-purpose.md`

Prototype code is support/reference input only unless a route-owned port decision explicitly promotes a pattern.

## Quarantine Rules (ENFORCED)

| Rule | Detail |
|---|---|
| Quarantine boundary | All work inside `frontend/src/prototype-features/` only |
| Protected paths | Do NOT touch `src/features/`, `src/components/ui/`, `src/api/` |
| UI imports | Must resolve to `@/components/PrototypeAdapter` — not `@/components/ui` |
| Lint suppression | `/* eslint-disable */` at top of every harvested `.ts` / `.tsx` file — keep it |
| Routes | All prototype routes under `/prototype/*` with `prototype: true` in route-registry |

---

## Branch-Specific Limits

- Do not run late-stage canonical closure gates on prototype-only files unless the task explicitly asks for a port-readiness audit.
- Do not treat the prototype shell, tab labels, or local `activeTab` state as canonical route authority.
- Do not introduce `react-router-dom` or new dependencies into prototype surfaces.

---

## Active Skills

| Role | Skill |
|---|---|
| Harvest orchestration | `prototype-harvest-manager` |
| Harvest review | `frontend-cleanup-manager` |
| Planning | `blueprint` |
| Execution engine | `subagent-driven-development` |
| Crash/gap diagnosis | `systematic-debugging` |
| Canonical late-stage gates | `token-enforcement`, `migration-audit`, `route-migration` |

---

## Workspace Commands

```bash
# Frontend
cd frontend && yarn dev
cd frontend && yarn type-check
cd frontend && yarn test

# Backend
cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000
cd backend && pytest
```

---

## Task Delegation

- **Task delegation (>15K tokens)**: delegate via `task-router` MCP.
- **File analysis (>300 lines)**: use `flash-sidekick.quick_summarize`.
- **Deep reasoning**: use `flash-sidekick.consult_pro`.
- **Visual compliance**: use `design-system-sidekick.validate_asset_compliance`.
- **Token validation**: use `python3 scripts/design-validation/validate-tokens.py`.
- **Token build**: use `python3 scripts/build-m3-tokens.py`.

---

## Code Review Standards

- Functions > 30 lines: likely doing too much
- Logic duplicated > 2×: extract to utility
- No `any` type in TypeScript
- Missing error handling on async ops

---

*Delete this file and `.claude/BRANCH_CONTEXT.md` before merging to `main`.*
