# PR126 Migration Dashboard

Execution truth:
- `control/blueprint.md`
- `control/workflow.md`

Planning narrative:
- `control/plan.md`

Evidence inputs (advisory only):
- `docs/manifests/routes.json`
- `docs/manifests/screens.json`
- `docs/manifests/frontend-api-usage.json`
- `docs/manifests/backend-endpoints.json`
- `docs/manifests/orphans.json`

## Current Phase

- Phase 3: Route execution (Step 3a `/tracker` in progress) with Step 6 cleanup & legacy pairing work underway

## Recent Progress

- Phase 1 scanning scripts completed (`tools/scripts/scan-*.ts`, `scan-endpoints.py`) and production manifests now live in `docs/manifests/` (routes, screens, APIs, orphans).
- Job Queue logic now lives under `frontend/src/features/jobs/JobQueue.tsx` with its tests consolidated under `frontend/src/features/jobs/__tests__/`; `App.tsx` and routing now reference the feature directly, removing the legacy page file and aligning `/opportunities` with `features/opportunities/`.
- Step 6.2/6.3 workbench/finalization pairing is scoped (see `docs/project/active/frontend-source-of-truth-migration/control/implementation-backlog.md` and the Gemini implementation plan) so we can wrap the feature components with the canonical `screens/08_workbench` and `screens/09_finalization` shells.
- `/apply/quick` route: `JobAnalysisResultsPanel` component extracted from `ApplyQuick.tsx`; token enforcement gate PASS; `build-contract-apply-quick.xml` generated (M2 execution). Tests and human approval pending.

## Next Gates

- Restore local backend environment for live-session verification (`uvicorn` blocked by missing `email-validator` per `control/status.md`)
- Run final brand gate for `/tracker` after hero composition is compliant (zero-flora, no non-human mascot)
- Confirm the reader-facing route screen shells (`DocumentWorkbench` & `ApplicationFinalization`) accept live content and pass token-enforcement after step 6 pairings.

## Critical Blockers

- Live-session verification blocked by local backend environment (`email-validator` missing)
- `/tracker` hero composition not yet acceptable for brand signoff (zero-flora, no non-human mascot)

## Next Actions

1. Close `/tracker` live verification and brand gate (real backend + hero compliance) so Step 3a can flip to complete.
2. Execute the Step 6 cleanup pairing (Document Workbench & Application Finalization + mapping schema updates) and rerun token-enforcement/migration-audit on those screens.
3. Begin `/career/ingest` and `/documents` execution lanes with the stabilized `visions` blueprint, then tie them into the route registry refactor work right after `/tracker` is fully verified.
