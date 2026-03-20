# CLAUDE.md — Branch Override: feat/prototype-harvest-prep

This file overrides `CLAUDE.md` for the duration of this branch.
**Design enforcement is fully suspended. This is a Ready-to-Receive quarantine zone.**

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

Harvest and isolate all AI Studio prototype logic into `frontend/src/prototype-features/`
so it is reachable at `/prototype/*` without touching canonical product code.

---

## Quarantine Rules (ENFORCED)

| Rule | Detail |
|---|---|
| Quarantine boundary | All work inside `frontend/src/prototype-features/` only |
| Protected paths | Do NOT touch `src/features/`, `src/components/ui/`, `src/api/` |
| UI imports | Must resolve to `@/components/PrototypeAdapter` — not `@/components/ui` |
| Lint suppression | `/* eslint-disable */` at top of every harvested `.ts` / `.tsx` file — keep it |
| Routes | All prototype routes under `/prototype/*` with `prototype: true` in route-registry |

---

## Suspended Rules (do not apply on this branch)

- KR Solidarity design tokens, Zero-Flora, semantic color enforcement
- Archetype naming (Strike, Placard, Scaffold, Megaphone, March)
- Typography stack enforcement (Work Sans, Fraunces etc.)
- Shape token rules, no-hardcoded-hex rule
- All design/audit skills from SKILL_REGISTRY.md Tier 1–3

See `.claude/BRANCH_CONTEXT.md` for the full suspended skill list.

---

## Active Skills

| Role | Skill |
|---|---|
| Execution engine | `subagent-driven-development` |
| Phase tracking | `project-manager` |
| Crash/gap diagnosis | `systematic-debugging` |
| Headless route testing | Playwright MCP |
| Git ops | `git-pr-workflows-git-workflow` |

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

- Heavy tasks (>15K tokens): delegate via `task-router` MCP
- File analysis (>300 lines): use `flash-sidekick.quick_summarize`
- Route smoke tests: use Playwright MCP headlessly

---

## Code Review Standards

- Functions > 30 lines: likely doing too much
- Logic duplicated > 2×: extract to utility
- No `any` type in TypeScript
- Missing error handling on async ops

---

*Delete this file and `.claude/BRANCH_CONTEXT.md` before merging to `main`.*
