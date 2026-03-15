# Migration Status

**Program:** PR126 frontend source-of-truth migration
**Status:** Active
**Current phase:** Step 3a `/tracker` implementation (finalizing) + Step 3b `/career/ingest` COMPLETE
**Execution truth:** `control/blueprint.md`

## Current state

- Migration docs have been normalized into `control/`, `contracts/`, and `analysis/`.
- Canonical script inputs now point to stable filenames instead of dated filenames.
- Validator output is standardized under `tmp/migration/`.
- Governance readiness checks now pass from repo root:
  - `pytest tests/plans -q`
  - `node frontend/scripts/validate-governance-artifacts.mjs`
- Gemini-style orchestration is adopted as a management overlay only: status, risks, sequencing, and escalation.
- Blueprint updated on 2026-03-15 with a Target State Snapshot and an advisory-only protocol decision log entry (authority order unchanged).
- Execution truth remains `control/blueprint.md` plus `control/workflow.md`.
- `/tracker` now uses the canonical `applicationService` path instead of a mock-backed primary route owner.
- Route-local migration gates now pass for `/tracker`:
  - `bash .claude/skills/token-enforcement/scripts/run-token-enforcement.sh /tracker`
  - `bash .claude/skills/migration-audit/scripts/run-migration-audit.sh /tracker`
- Route-owner verification now exists for `/tracker`:
  - `cd frontend && yarn test src/features/applications/__tests__/ApplicationTracker.test.tsx --runInBand`

## Current blockers

- No planning-input blocker remains for Step 1. Python governance tests and the JS validator now agree on the canonical `control/` workspace.
- Non-auth route benchmarks for `migration-audit` are intentionally deferred. This does not block Step 3 execution unless `migration-audit` is chosen as an immediate gate for `/tracker`, `/career/ingest`, `/documents`, or `/profile`.
- Live-session verification is currently blocked by the local backend environment: `uvicorn` fails because `email-validator` is missing from the active Python environment.
- The tracker hero composition is not yet acceptable for final brand signoff: the current `applications-board` mapping resolves to elephant and palm imagery that conflicts with the migration-era zero-flora / no non-human mascot direction.

## Current gate state

- Step 1 — Planning inputs: `execution_ready`
- Step 2 — `/tracker` build contract: `execution_ready`
- Step 3a — `/tracker` CRUD implementation: `in_progress` (hero brand fix applied 2026-03-15; pending live-verify)
- Step 3b — `/career/ingest` Ingestion implementation: `COMPLETE`
- Step 3c — `/profile` voice_profile_capture: `COMPLETE` (2026-03-15)
- Step 3d — `/documents` Redline Workspace: `COMPLETE` (2026-03-15; build contract generated)
- Step 3e — `/analysis` resume_audit: `COMPLETE` (2026-03-15)
- Step 3f — `/apply/quick` genkit_job_analysis: `in_progress` (governance normalized; JobAnalysisResultsPanel extraction pending)
- Step 6 — Migration Cleanup (Orphans & Legacy Routes): `COMPLETE` (2026-03-15; 8 routes retired)

## Recorded approvals

- `/tracker` build contract human approval recorded on `2026-03-14`
- `/career/ingest` migration (M4) completed on `2026-03-15`
- Approval basis for M4:
  - Canonical `/api/v1/ingest` contract enforcement complete
  - KR Solidarity v6.0 token compliance verified
  - Zero-flora asset audit passed
  - Routing promoted to `SmartIngestion` feature owner in `App.tsx`
- Approval basis:
  - technical gaps resolved in `contracts/build-contract-tracker.xml`
  - supplementary briefs present in `contracts/tracker-supplementary-component-briefs.xml`
  - planning-layer readiness checks passing from repo root

## Next actions

1. Restore the local backend environment so `/tracker` can be exercised against the real applications API.
2. Replace the `/tracker` hero mapping with a compliant brand treatment and rerun screenshot capture.
3. Re-run live-session verification against the backend so Step 3a can move from `in_progress` to complete.
4. Execute Step 3d: `/documents` Redline Workspace implementation.
5. Execute Step 6: systematically migrate the 11 legacy routes and 6 orphaned screens.
