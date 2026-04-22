# CLAUDE.md

> **Output**: Code first. No preamble.

<output_constraints>
- NO PREAMBLE: Skip all introductory phrases and verbose status updates. Lead with direct action verbs.
- NO UNNECESSARY REPORTS: Status updates strictly under 2 sentences. Only generate markdown reports if explicitly requested.
- PLAN LOCATION: Save implementation plans to `docs/project/active/plans/`. **This overrides any superpowers skill default** — do not use `.claude/plans/` or `docs/superpowers/plans/`.
- REPORT LOCATION: Save reports and documentation to `.claude/reports/`. Handovers go to `docs/project/active/handovers/`.
</output_constraints>

## Planning Governance

Four canonical surfaces. No others without explicit approval.

| Surface | File | Rule |
|---|---|---|
| Repo instructions | `CLAUDE.md` | Evergreen only. Keep under 200 lines. |
| Sprint brief | `SPRINT_BRIEF.md` | One file. Replace, don't multiply. |
| Task queue | `TASKS.md` + `dashboard.html` | One task board. No shadow trackers. |
| Decision log | `DECISIONS.md` | Short entries: what, why, tradeoff, follow-up. |
| Velocity log | `SPRINT_LOG.md` | One row per sprint close. |

**Rules:**
- Do not create new `.md` planning files without user approval
- Do not create parallel sprint plans, status trackers, or strategy notes
- Every kept artifact must drive execution, report status, or record a durable decision
- `dashboard.html` is the status view — open locally in browser, reads/writes `TASKS.md`
- `SPRINT_LOG.md` updated at sprint close only (tasks planned vs done + notes)
- Codex and Claude Code both operate off `TASKS.md` directly

---

## Technical Stack

- **Frontend**: React 18 + TS + Vite + Tailwind v4 + Zustand + TanStack Query
- **Backend**: FastAPI + SQLAlchemy + Genkit + Python 3.10+
- **Cloud**: GCP (us-central1) · Firebase · Cloud Run
- **Design**: **KR Solidarity v6.1** (M3 Expressive)
- **Tests**: Jest, Playwright (e2e), pytest

---

## Workspace Commands

```bash
# Frontend
cd frontend && yarn dev        # dev server
cd frontend && yarn test       # Jest
cd frontend && yarn lint       # ESLint
cd frontend && yarn tsc --noEmit  # type-check
cd frontend && yarn build      # production build
python3 scripts/build-m3-tokens.py  # rebuild CSS vars (run from repo root)

# Backend
cd backend && source venv/bin/activate
uvicorn app.main:app --reload --port 8000
pytest
```

**Key paths:**
- UI primitives: `frontend/src/components/ui/`
- Design tokens (source of truth): `frontend/src/design/tokens/tokens.json`

---

## Routing Conventions

**Single source of truth**: `frontend/src/config/route-registry.ts` — every route lives here. `App.tsx` and `routeModeMap.ts` derive from it; no manual duplication.

**Import alias pattern** (in `App.tsx`):
```ts
import { ComponentName as RouteName } from './features/feature/ComponentName';
// e.g. import { Dashboard as DashboardPage } from './features/dashboard/Dashboard';
```

**Route entry shape**:
```ts
{ path, name, auth, layout: 'public' | 'migrated' | 'protected', mode: 'KrDark', screenId?, apiDeps[], prototype? }
```

**Layout tiers**:
| Layout | Shell | Use for |
|---|---|---|
| `public` | None | Landing, auth, dev tools |
| `migrated` | `MigratedRouteLayout` | All production screens |
| `protected` | `ProtectedLayout` (legacy sidebar) | Support-only surfaces |

**Rules**:
- Production routes source from `features/`, not `components/` or `pages/`
- Prototype routes go under `/prototype/*` with `prototype: true`
- `screenId` must match `screens/NN_name/` directory if one exists
- CI enforced via `tools/ci/check-route-integrity.ts` and `check-screen-pairs.ts`

---

## Active Phase

Post-Figma. Three live workstreams (in priority order):
1. **Templating refactor** — `DocumentPipeline` + `CareerProfile` contract (`backend/app/renderers/themed_document_renderer.py`)
2. **Pipeline state wiring** — `analysisPipelineStore` (ingestion → ATS → export), retire client-side jsPDF
3. **API consolidation** — collapse `src/services/` into `src/api/`, extend TanStack Query

## Go-Live Stages

- **Stage 1** (ship first): core path working end-to-end — ingest → score → generate → export, auth, CRUD tracker. Rough UI OK.
- **Stage 2**: full tests, UI polish, production error handling.
Always finish all Stage 1 tasks before Stage 2.

---

## Design System: KR Solidarity v6.0

**Hard rules**:
- **Dark-only**: all backgrounds → canonical `--kr-color-charcoal-background-*`
- **Semantic colours only**: canonical `--kr-*` CSS variables
- **Selective Flora/Fauna Rule**: allow diaspora or non-Australian flora plus intentional cultural fauna such as elephants; ban Australian native flora and Australian endemic fauna
- **No generic shapes**: use asymmetric `shape.*` tokens

**Archetypes**:
| Archetype | Component | Shape Token | Role |
|---|---|---|---|
| Strike | `Strike.tsx` | `shape.blockRiot03` | Primary active buttons |
| Placard | `Placard.tsx` | `shape.placardTorn01` | Content containers/feeds |
| Scaffold | `ScaffoldInput.tsx` | `shape.blockRiot02` | Structural framing |
| March | `March.tsx` | `shape.blockRiot01` | Sequential select flows |
| Megaphone | `Megaphone.tsx` | `shape.megaphoneCut01` | High-intensity modals |

**Variable fonts**: `Work Sans`, `Fraunces`, `Libre Bodoni`, `JetBrains Mono` — 9× weight ratios.

---

## Agent Routing

Full routing table and inter-CLI handoff rules: see `AGENTS.md`.

### Intra-Claude model ladder

| Task type | Model | Mode | Effort |
|-----------|-------|------|--------|
| Inventory, classification, grep sweeps, status reshaping | **Haiku** | normal | low |
| Multi-file edits, validation scripts, test fixes, token sweeps | **Sonnet** | normal | medium |
| New feature implementation, API wiring, refactors | **Sonnet** | normal | high |
| Architecture decisions, schema design, go/no-go review | **Opus** | normal | high |
| Cross-system design, ambiguous tradeoffs, spec writing | **Opus** | **plan first** | high |
| Long agentic loops (Ralph, iterative UI, lint sweeps 10+ files) | **Haiku** | normal | low — offer Codex if token pressure |

### When to use plan mode
Use `/plan` when: task touches ≥ 3 files across layers, involves schema/route/auth changes, or approach is ambiguous. Skip for: single-file edits, test fixes, token hygiene, mechanical CRUD.

### Extended thinking
Use for: architectural decisions, novel algorithm design, complex tradeoffs. Skip for standard implementation — burns tokens without value.

### Proactive Planning
Detect exploratory requests ("what should we...", "suggest a strategy", "how do we approach", "what could we do about") and invoke `superpowers:brainstorming` immediately without asking. Flow brainstorm output directly to `superpowers:writing-plans`, then to `superpowers:executing-plans` after approval. Own the forward momentum — don't wait for user permission to start the workflow.

---

## Code Review Standards

- Functions > 30 lines: likely doing too much
- Logic duplicated > 2×: extract to utility
- No `any` in TypeScript
- Async operations must have catch/error handling
- Components with > 3 props: group into an object if logical

Run `/simplify` before presenting code results.
- Think before coding: state assumptions, surface tradeoffs, ask before implementing
- Simplicity first: minimum code that solves the problem — no speculative features
- Surgical changes: touch only what the request requires; don't improve adjacent code
- Goal-driven: define verifiable success criteria before starting multi-step tasks

---
*Semantic CSS variables are truth. Follow the selective flora/fauna canon in `docs/design/01_CANON.md`.*

---

## Memory (Hot Cache)

### Me
Jonas Dougall — solo founder, lead engineer + designer on CareerCopilot.

### People
| Who | Role |
|-----|------|
→ Full profiles: memory/people/

### Terms
| Term | Meaning |
|------|---------|
| KR Solidarity | Design system v6.1, M3 Expressive, dark-only |
| canonical shell | Sidebar + page chrome header + content frame, stable node IDs |
| sync-contract | `figma-sync-order.json` + `figma-agent-tasks.md` — Figma↔code mapping source of truth |
| redirect-history | Legacy route aliases — traceability only, not active product surfaces |
| node ID | Figma frame identifier used for code targeting (e.g. `1:4411`) |
| route family | Group of related routes (e.g. `/applications` = `/tracker` + `/kanban`) |
→ Full glossary: memory/glossary.md

### Projects
| Name | What |
|------|------|
| **CareerCopilot** | AI job application assistant — Figma-to-code convergence phase |
→ Details: memory/projects/

### Preferences
- Terse, action-first. No preamble. Code first.
- Plans → `docs/project/active/plans/` · Handovers → `docs/project/active/handovers/` · Reports → `.claude/reports/`
