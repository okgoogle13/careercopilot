# CLAUDE.md

> **Output**: Code first. No preamble.

<output_constraints>
- NO PREAMBLE: Skip all introductory phrases and verbose status updates. Lead with direct action verbs.
- NO UNNECESSARY REPORTS: Status updates strictly under 2 sentences. Only generate markdown reports if explicitly requested.
- PLAN LOCATION: Save implementation plans to `.claude/plans/`.
- REPORT LOCATION: Save reports and documentation to `.claude/reports/`.
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
cd frontend && yarn build      # production build
python3 scripts/build-m3-tokens.py  # rebuild CSS vars from tokens.json

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

## Figma MCP Workflow

**URL parsing** — extract `fileKey` and `nodeId`:
```
figma.com/design/:fileKey/:name?node-id=:nodeId   ← convert "-" to ":" in nodeId
figma.com/board/:fileKey/:name                     ← FigJam, use get_figjam
figma.com/design/:fileKey/branch/:branchKey/...   ← use branchKey as fileKey
```

**Design-to-code steps**:
1. `get_design_context(fileKey, nodeId)` — primary tool; returns code + screenshot + hints
2. Adapt output to project stack (React + Tailwind v4 + KR Solidarity tokens)
3. Map CSS vars from Figma → `--sys-color-{name}-base` tokens
4. Replace raw hex / absolute positioning with semantic tokens and KR archetypes

**Dev Mode**:
- Use `get_design_context` with dev mode node IDs for spec-accurate measurements
- Code Connect mappings: `get_code_connect_map` / `send_code_connect_mappings`
- Design system search: `search_design_system` before creating new components

**Never**: raw hex colours, white backgrounds, flora, generic shapes.

---

## Design System: KR Solidarity v6.1

**Hard rules**:
- **Dark-only**: all backgrounds → `--sys-color-charcoalBackground-base`
- **Semantic colours only**: `--sys-color-{name}-base` CSS variables
- **Zero-Flora Lockdown**: no flora or Australian endemic fauna
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

## Model Ladder

| Model | Use for |
|---|---|
| Haiku | Inventory, classification, presence checks, PM/status reshaping |
| Sonnet | Most implementation (multi-file edits, validation scripts, per-screen parity) |
| Opus | Architectural decisions, route-promotion decisions, final go/no-go |

---

## Code Review Standards

- Functions > 30 lines: likely doing too much
- Logic duplicated > 2×: extract to utility
- No `any` in TypeScript
- Async operations must have catch/error handling
- Components with > 3 props: group into an object if logical

Run `/simplify` before presenting code results.

---
*Semantic CSS variables are truth. Zero-Flora enforced.*

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
- Plans → `.claude/plans/` · Reports → `.claude/reports/`
- No broad Figma-to-code until sync-contract repair + shared shell anchors done
