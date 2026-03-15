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

- Phase 3: Route execution (Step 3a `/tracker` in progress)

## Next Gates

- Restore local backend environment for live-session verification (`uvicorn` blocked by missing `email-validator` per `control/status.md`)
- Run final brand gate for `/tracker` after hero composition is compliant (zero-flora, no non-human mascot)

## Critical Blockers

- Live-session verification blocked by local backend environment (`email-validator` missing)
- `/tracker` hero composition not yet acceptable for brand signoff (zero-flora, no non-human mascot)

## Next Actions

1. Close `/tracker` live verification and brand gate
2. Start `/career/ingest` ownership execution lane
3. Start `/documents` redline ownership execution lane
