# Prototype Integration Guide

## Purpose
- Capture how `/Users/okgoogle13/Projects/prototype_v2.0` can inform PR126 while respecting the migration authority stack (`control/blueprint.md`, `control/workflow.md`, `AGENTS.md`).
- Keep the prototype as **support/reference input only**; nothing from it should override runtime/design/capability truth (see `control/blueprint.md` for the layered authority table).

## Reusable structure (support-reference patterns)
- Layout hierarchy: fixed `AppShell` → `WorkspaceLayout` + hero header + three large panels; useful for documenting panel order when drafting build-contract narratives for `/apply/quick` or `/profile` (see `src/pages/ApplicationWorkspacePage.tsx`).
- Workspace panel order: input capture → tabbed AI outputs → save/export bar; treat this as a **flow template** (not a route) when defining interaction specs for `/apply/quick` (the canonical owner of application CRUD, see `control/gap-map.json#L8`).
- Tabbed AI output pattern: single active indicator + motion; log it as a behavior note in the gap-fill planner so real TSX can mirror the affordance without copying code (`src/components/feature/AiOutputsTabs.tsx`).
- History card layout and badges: useful for `/tracker` or `/analysis` when documenting status badges; convert into descriptive bullets rather than drop-in components (`src/pages/PastApplicationsPage.tsx`).
- Component library page: treat as a reference showcase for tokens/states and track it in `analysis/tsx-identity-gate-template.md` if any of its content influences runtime TSX (`src/pages/ComponentLibraryPage.tsx`).

## What must not be reused
- Do not import the prototype’s tabbed routing (`App.tsx`, `AppShell.tsx`, `SidebarNav.tsx`); your canonical router is `frontend/src/App.tsx`, and the route matrix forbids introducing new top-level navigation without approval (`control/route-matrix.json#L7`).
- Drop the Chrome-extension scaffolding (`manifest.json`, `src/content.ts`, `hooks/useChromeExtension.ts`)—this repo’s runtime truth is Postgres/FastAPI, not extension host.
- Remove the Firebase/Firestore auth/persistence layer and the mocked `useCareerIngestion`; instead document service-layer requirements that tie back to `backend/app/api/endpoints/` and `applicationService`/`ingestion.service`. Writing commit-ready TSX must flow through the authority order (runtime → design → capability).
- Remove external texture URLs and extra dependencies (`lucide-react`, `motion/react` outside approved packages); follow asset manifest rules and keep CSS tokens enforced by `token-enforcement` and `kerala-rage-brand-enforcer` gates.

## Suggested prototype edits to reduce friction
1. Document the workspace panel order and tab semantics as a **build-contract seed** (markdown) rather than code; reference required backend endpoints (`POST /api/flows/analyze-job-from-url`, `/api/applications`, `/api/v1/ingest`) and tie them to `/apply/quick`, `/tracker`, `/career/ingest`.  This gives Gemini something concrete to translate into `contracts/*.xml` without adding code debt.
2. Remove the in-shell navigation state (`activeTab`) and convert the prototype into a single-route support doc; replace it with a note that the canonical `frontend/src/App.tsx` router controls routes. This clarifies the prototype’s role and avoids unauthorized route overlap.
3. Strip Firebase/Firestore from the prototype and replace with a section describing the required service layer (e.g., “use `applicationService` and `ingestion.service`, respect `GEMINI_API_KEY` backend-only policy”). That keeps the prototype truthful while aligning with the “backend capability truth” requirement.
4. Replace hardcoded textures/animations with references to `token-enforcement`-approved tokens so the prototype becomes a palette/tone reference, not a copy-paste asset bundle. Mention that any derived TSX must still pass the identity gate chain before route closure (`analysis/tsx-identity-gate-template.md`).
5. Expand the prototype’s story/motion notes into a “pattern catalog” (name, route target, backend dependencies, tests, what to avoid) so Gemini can synthesize supporting documentation instead of code. This catalog becomes the actionable artifact that migration planners actually cite.

## Next steps
- Use Gemini to turn the pattern catalog into route-level notes, then feed those notes into `contracts/<route>.xml` via the usual workflow.  The goal is to keep prototype influence confined to planning artifacts (build contracts, gap-fill plan entries, test scenario matrices) while letting actual TSX come from the canonical repo files.
- If any prototype idea is promoted beyond support-reference, record the decision in `control/status.md` and re-run the required route-local gates (token-enforcement, identity gate chain) before closing the route.
