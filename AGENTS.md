# AGENTS.md

Single source of truth for all coding agents working in this repo (Claude Code, Codex, Gemini). Routing, procedures, authority order, and go-live criteria live here. Agent-specific model selection is handled by each CLI internally.

---

## Project

CareerCopilot — AI-powered job application assistant.
Stack: React 18 + TS + Vite + Tailwind v4 + Zustand + TanStack Query · FastAPI + SQLAlchemy + Genkit + Python 3.10+ · GCP / Firebase / Cloud Run.

---

## Current Phase

**Post-Figma: Backend wiring + product hardening.**

Figma/design convergence is complete. Active workstreams:

1. **Templating refactor** — `DocumentPipeline`, `CareerProfile` contract, theme renderer (`backend/app/renderers/themed_document_renderer.py`)
2. **Pipeline state wiring** — durable `analysisPipelineStore` (ingestion → ATS score → export), retire client-side jsPDF path
3. **API layer consolidation** — collapse `src/services/` into `src/api/`, extend TanStack Query adoption beyond `features/applications/`

---

## Go-Live Stages

**Stage 1 — Go-Live Gate** (ship this first):
All core features working end-to-end. Rough UI acceptable. Incomplete test coverage acceptable. Goal: real users can use it.
- Resume ingest → ATS score → cover letter generate → export (server-rendered PDF)
- Application CRUD + Kanban tracker
- Auth + profile

**Stage 2 — Polish Gate**:
Full test coverage, UI finesse, production-hardened error handling, performance.

Tasks in plans and TASKS.md are tagged Stage 1 or Stage 2. Always complete all Stage 1 tasks before starting Stage 2.

---

## Inter-CLI Routing (ask first, both triggers)

| Trigger | Route to |
|---------|----------|
| Task is browser visual verification, screenshot comparison | Gemini |
| Task is pure mechanical file edits, CRUD stubs, test scaffolding, lint/CI fix loops | Codex |
| Token pressure: after `/compact` fires OR cache writes exceed ~500K in session | Offer Codex handoff |
| Everything else | Claude Code |

**Protocol**: Claude Code identifies the trigger, tells the user "this looks like a [Codex/Gemini] task — route there?", waits for go-ahead before handing off.

---

## Authority Order

When sources conflict, resolve in this order:

1. `docs/design/01_CANON.md` — palette, typography, shapes, motion, symbolic constraints
2. `TASKS.md` + `SPRINT_BRIEF.md` — active work and sprint scope
3. `DECISIONS.md` — recorded tradeoffs and follow-ups
4. `frontend/src/config/route-registry.ts` + `frontend/src/App.tsx` — live route truth
5. `backend/app/api/endpoints/` — capability truth
6. `frontend/src/design/tokens/tokens.json` — token source of truth

---

## Planning & Task Rules

- Implementation plans → `docs/project/active/plans/`
- Handovers → `docs/project/active/handovers/`
- Reports → `.claude/reports/`
- `TASKS.md` is the only active task board — no shadow trackers
- `DECISIONS.md` for all tradeoff records: what, why, tradeoff, follow-up

---

## Blocker Protocol

- **Low-risk blocker** (style choice, minor implementation detail): decide the safer/simpler option, log to `DECISIONS.md`, keep moving
- **High-risk blocker** (schema changes, route changes, deleting code, auth policy, migrations): stop and ask the user

---

## Safe Commands

```bash
# Frontend
cd frontend && yarn dev
cd frontend && yarn test
cd frontend && yarn lint
cd frontend && yarn tsc --noEmit
cd frontend && yarn build
python3 scripts/build-m3-tokens.py   # run from repo root

# Backend
cd backend && source venv/bin/activate
uvicorn app.main:app --reload --port 8000
pytest
ruff check .
mypy .
```

---

## Design System Rules (KR Solidarity v6.1)

- Dark-only: all backgrounds → `--kr-color-charcoal-background-*`
- Semantic tokens only: `--kr-*` CSS variables, no hardcoded hex
- No Australian flora/fauna. Coconut palms and elephants allowed where canon permits.
- No typography drift: no Inter, Roboto, Arial, Sora, Plus Jakarta Sans
- Archetypes: `Strike`, `Placard`, `ScaffoldInput`, `March`, `Megaphone`
- Deprecated names (`Pebble`, `Stone`, `Slab`, `Jar`, `Cabinet`, `Lens`) are residue — do not use

---

## Backend & Frontend Rules

- Pydantic models for all backend contracts
- Validate auth + user ownership at the backend boundary
- TypeScript strict mode required
- All server communication via `frontend/src/api/` — no direct fetch/axios in feature components
- Do not add calls to `frontend/src/services/` — legacy, being collapsed into `src/api/`

---

## Ask Before

- Installing or upgrading dependencies
- Changing database migrations or auth policy
- Updating required environment variables
- Deploying to staging or production
- Breaking API contract changes

## Never

- Commit secrets, keys, or credentials
- Bypass auth or ownership checks
- Force-push protected branches
- Introduce raw `figma:asset/*` imports in production code
- Treat stale docs or archive artifacts as active authority

---

## Verification Before Claiming Completion

1. Run narrowest relevant validation commands
2. If UI changed: confirm token hygiene (`--kr-*` only, no hex)
3. If route changed: confirm `App.tsx` and `route-registry.ts` agree
4. If backend contracts changed: confirm mounted endpoints and schemas agree
