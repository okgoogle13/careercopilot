# Frontend Source-Of-Truth Migration Implementation Backlog

**Date:** 2026-03-13
**Status:** Proposed implementation backlog
**Canonical planning inputs:**
- `docs/project/active/frontend-source-of-truth-migration/2026-03-13-proposed-final-migration-plan.md`
- `docs/project/active/frontend-source-of-truth-migration/2026-03-13-target-state-route-matrix.md`
- `docs/project/active/frontend-source-of-truth-migration/2026-03-13-backend-feature-frontend-component-gap-map.md`

## Objective

Convert the migration plan into a feature-first, component-aware backlog that can be implemented without re-deciding route ownership, component ownership, or backend capability mapping.

## Milestones

### M1: Phase 1 and Phase 1A - Planning Inputs and Migration Support Review

Goal:
- make the governance inputs trustworthy enough to guide implementation work

Plan phase references:
- `Phase 1: Fix the planning inputs`
- `Phase 1A: Review skills and scripts infrastructure`

Parallel execution guidance:
- run `MIG-001`, `MIG-003`, `MIG-004`, and `MIG-005` in parallel
- start `MIG-002` only after `MIG-001` closes
- do not block skill/script review work behind governance-data cleanup

Acceptance:
- `pytest tests/plans -q` passes
- `frontend/scripts/validate-governance-artifacts.mjs` enforces the same minimum invariants as the Python plan tests
- `genkit_job_analysis` has normalized capability metadata
- custom skills and migration-support scripts are reviewed and classified as fit for purpose before they are used as execution infrastructure
- token-enforcement expectations are defined for any route touched by migration work

Backlog items:

#### MIG-001: Fix capability matrix completeness
- Plan phase reference: `Phase 1`
- Area: planning integrity
- Type: docs or governance data
- Depends on: none
- Deliverables:
  - add missing `resolution_status` values
  - add missing `blocked_by` and `resolved_commit` metadata where required
- Completion evidence:
  - plan tests pass for capability metadata checks

#### MIG-002: Align governance validator with tests
- Plan phase reference: `Phase 1`
- Area: planning integrity
- Type: tooling
- Depends on: `MIG-001`
- Deliverables:
  - validator checks capability status fields, not just IDs
  - validator fails on the same minimum issues covered by the Python tests
- Completion evidence:
  - JS validator and Python tests agree on pass/fail for current artifacts

#### MIG-003: Review migration skills for fit-for-purpose
- Plan phase reference: `Phase 1A`
- Area: planning integrity
- Type: process/tooling review
- Depends on: none
- Deliverables:
  - review `sprint-coordinator`, `frontend-backend-mapper`, `api-contract-validator`, `migration-audit`, and `verification-before-completion`
  - classify each as `approved`, `approved_with_limits`, or `not_fit_for_purpose`
  - record exact allowed use and known limits
- Completion evidence:
  - a tracked review artifact exists in the migration folder and is referenced by the backlog

#### MIG-004: Review migration scripts for fit-for-purpose
- Plan phase reference: `Phase 1A`
- Area: planning integrity
- Type: tooling review
- Depends on: none
- Deliverables:
  - review `frontend/scripts/validate-governance-artifacts.mjs` and `frontend/scripts/component-inventory.ts`
  - confirm whether outputs match the route matrix and component gap map
  - identify any script that must be corrected before it can be treated as a gate
- Completion evidence:
  - each reviewed script is classified as `approved`, `approved_with_limits`, or `not_fit_for_purpose`

#### MIG-005: Define token-enforcement gate for touched routes
- Plan phase reference: `Phase 1`
- Area: planning integrity
- Type: design-system guardrail
- Depends on: none
- Deliverables:
  - define the default token-enforcement check for touched route files:
    `rg --type-add 'tsx:*.tsx' --type-add 'ts:*.ts' '#[0-9A-Fa-f]{3,6}|rgb\\(' frontend/src/pages frontend/src/features frontend/src/layouts`
  - require migration work to explain any allowed exceptions, such as style-guide or test fixtures
  - identify which review steps enforce token compliance during migration
- Completion evidence:
  - milestone closure includes the grep result for touched route files and any justified exceptions

### M2: Phase 2.1 and Phase 2.2 - Applications and Smart Ingestion

Goal:
- remove the highest-value mock or partial flows

Plan phase references:
- `Phase 2.1: Applications`
- `Phase 2.2: Smart ingestion`

Acceptance:
- `/tracker` uses real CRUD-backed behavior
- `/career/ingest` owns one canonical upload-to-save flow on `/api/v1/ingest`

Backlog items:

#### MIG-101: Replace mock-backed applications flow in `/tracker`
- Plan phase reference: `Phase 2.1`
- Area: applications
- Type: feature integration
- Depends on: `M1`
- Owner route: `/tracker`
- Canonical surface: `ApplicationTracker`
- Deliverables:
  - confirm the mounted applications CRUD endpoints and current frontend API client match the intended tracker data flow before replacing mocks
  - wire list view to real application data
  - remove mock-only path from the main tracker flow
- Completion evidence:
  - tracker reads real backend data in the normal flow
  - the contract check against mounted backend endpoints is recorded

#### MIG-102: Add application detail, edit, and status flows
- Plan phase reference: `Phase 2.1`
- Area: applications
- Type: component build
- Depends on: `MIG-101`
- Precondition:
  - `MIG-101` has already confirmed request and response shape for detail, edit, archive, and status actions
- New components:
  - `ApplicationDetailPanel`
  - `ApplicationEditForm`
  - `ApplicationStatusActions`
  - `ApplicationArchiveAction`
- Completion evidence:
  - tracker supports detail, edit, status transition, and archive behavior

#### MIG-103: Converge ingestion on `/api/v1/ingest`
- Plan phase reference: `Phase 2.2`
- Area: ingestion
- Type: contract cleanup
- Depends on: `M1`
- Owner route: `/career/ingest`
- Canonical surface: `IngestionPage`
- Deliverables:
  - confirm `/api/v1/ingest` remains mounted in `backend/app/main.py`
  - inventory current ingestion callers across `/api/v1/ingest`, `/api/career/ingest`, `/api/ingest/artifacts/upload`, and `/api/ingestion/*`
  - classify each caller as canonical, transitional, or deprecated
  - route all canonical ingestion behavior through `/api/v1/ingest`
  - stop treating overlapping ingestion paths as canonical
- Completion evidence:
  - active ingestion path uses the canonical contract
  - the caller inventory and canonical/deprecated classification are recorded

#### MIG-104: Build the routed smart-ingestion flow
- Plan phase reference: `Phase 2.2`
- Area: ingestion
- Type: component build
- Depends on: `MIG-103`
- New components:
  - `SmartIngestionUploadStep`
  - `SmartIngestionTagConfirmStep`
  - `SmartIngestionSaveStep`
- Completion evidence:
  - `/career/ingest` supports upload, tag confirm, and save as one routed flow

### M3: Phase 2.3 and Phase 2.4 - Voice Profile and Documents Redline

Goal:
- remove the “backend exists, no live owner” gap for documents redline and voice profile

Plan phase references:
- `Phase 2.3: Voice profile`
- `Phase 2.4: Documents redline`

Acceptance:
- `/documents` owns redline workflow
- `/profile` owns voice profile workflow

Backlog items:

#### MIG-201: Add redline workflow ownership to `/documents`
- Plan phase reference: `Phase 2.4`
- Area: documents
- Type: feature integration
- Depends on: `M1`
- Owner route: `/documents`
- Canonical surface: `Documents`
- New components:
  - `DocumentRedlineUploadPanel`
  - `TrackedChangesWorkspace`
  - `RedlineActionBar`
- Deliverables:
  - confirm the mounted document redline and review contracts before building route-owned UI
  - expose redline and review workflow inside the documents route
- Completion evidence:
  - documents route exposes redline and review workflow without creating a new top-level route
  - the document redline contract check is recorded

#### MIG-202: Add voice profile management to `/profile`
- Plan phase reference: `Phase 2.3`
- Area: account/profile
- Type: feature integration
- Depends on: `M1`
- Owner route: `/profile`
- Canonical surface: `ProfileView`
- New components:
  - `VoiceProfileCreationPanel`
  - `VoiceSampleSubmissionForm`
  - `VoiceProfileStatusCard`
  - `VoiceProfileManagementSection`
- Completion evidence:
  - profile route becomes the visible owner of voice profile creation and management

### M4: Phase 2.5 and Phase 3 Support - Resume Audit, Jobs, and Explicit Deferrals

Goal:
- route and surface the retained analysis and job capabilities without overbuilding blocked features

Plan phase references:
- `Phase 2.5: Resume audit`
- `Phase 3: Repair the wireframe-to-component workflow`

Phase 3 backlog expansion note:
- before broad Phase 3 route migration starts, expand this milestone from the route matrix so each affected product area has its own implementation or deferral item

Acceptance:
- `/analysis` supports minimum viable resume audit flow
- jobs family has a clear place for job analysis results
- explicitly blocked capabilities remain deferred rather than half-built

Backlog items:

#### MIG-301: Decide and wire the minimum viable resume audit flow
- Plan phase reference: `Phase 2.5`
- Area: analysis
- Type: feature integration
- Depends on: `M1`
- Owner route: `/analysis`
- Canonical surface: `AnalysisPage`
- Reuse:
  - `ResumeAuditPage`
- New components:
  - `ResumeAuditEntryPoint`
  - `ResumeAuditResultsPanel`
- Deferred:
  - `ResumeAuditHistoryList`
- Completion evidence:
  - analysis route can launch and display audit evaluation results

#### MIG-302: Add the canonical job analysis results surface
- Plan phase reference: `Phase 3`
- Area: jobs
- Type: feature integration
- Depends on: `M1`
- Owner routes:
  - `/apply/quick`
  - `/opportunities`
- New components:
  - `JobAnalysisResultsPanel`
- Deferred:
  - `JobParsingWorkbench`
  - `ExtractFromTextPanel`
  - `AdvancedJobAnalysisPanel`
- Completion evidence:
  - one canonical result surface exists for current job analysis flows

#### MIG-303: Keep workflow orchestration explicitly deferred
- Plan phase reference: `Phase 2.5`
- Area: applications/workflows
- Type: blocked item
- Depends on: none
- Owner route: `/apply/quick`
- Deferred components:
  - `WorkflowProgressScreen`
  - `WorkflowStatusPanel`
  - `EmailScanResultsView`
- Completion evidence:
  - backlog and docs clearly mark orchestration UI as blocked on backend readiness

### M5: Phase 3 and Phase 4 - Route and Component-Library Cleanup

Goal:
- remove ambiguity after the real route owners are in place

Plan phase references:
- `Phase 3: Repair the wireframe-to-component workflow`
- `Phase 4: Cleanup after route ownership is stable`

Acceptance:
- `/kr/*` routes are no longer part of product truth
- reference-only components are clearly distinguished from canonical route-owned components

Backlog items:

#### MIG-401: Retire prototype `/kr/*` routes from live product routing
- Plan phase reference: `Phase 4`
- Area: route cleanup
- Type: route cleanup
- Depends on: `M2`, `M3`, `M4`
- Deliverables:
  - remove `/kr/*` routes from product truth
  - preserve useful patterns only by merging them into canonical routes
- Completion evidence:
  - route matrix and runtime routing no longer treat `/kr/*` as live product ownership

#### MIG-402: Mark reference-only components and cleanup candidates
- Plan phase reference: `Phase 4`
- Area: component-library cleanup
- Type: inventory and cleanup
- Depends on: `M2`, `M3`, `M4`
- Deliverables:
  - mark `KanbanTracker`, `DocumentWorkbench`, `IngestionFlow`, `SettingsControl`, `AnalysisWorkbench`, `LookoutDiscovery`, `OnboardFlow`, `HeroLanding`, `AuthModal`, and `DashboardOverview` as reference-only or cleanup candidates
- Completion evidence:
  - component inventory reflects canonical, support, reference-only, and deferred surfaces

#### MIG-403: Verify token and dependency integrity after route cleanup
- Plan phase reference: `Phase 4`
- Area: component-library cleanup
- Type: verification
- Depends on: `M2`, `M3`, `M4`
- Deliverables:
  - verify touched routes remain token-compliant after cleanup
  - verify no dependency drift was introduced by incremental route or component changes
- Completion evidence:
  - cleanup closes with no token regressions and no new dependency breakage in touched areas

## Dependency Map

- `MIG-001 + MIG-003 + MIG-004 + MIG-005 -> MIG-002`
- `M1 -> M2`
- `M1 -> M3`
- `M1 -> M4`
- `M2 + M3 + M4 -> M5`

## Suggested Implementation Order

1. `MIG-001` (`Phase 1`)
2. `MIG-002` (`Phase 1`)
3. `MIG-003` (`Phase 1A`)
4. `MIG-004` (`Phase 1A`)
5. `MIG-005` (`Phase 1`)
6. `MIG-101` (`Phase 2.1`)
7. `MIG-102` (`Phase 2.1`)
8. `MIG-103` (`Phase 2.2`)
9. `MIG-104` (`Phase 2.2`)
10. `MIG-202` (`Phase 2.3`)
11. `MIG-201` (`Phase 2.4`)
12. `MIG-301` (`Phase 2.5`)
13. `MIG-302` (`Phase 3`)
14. `MIG-303` (`Phase 2.5`)
15. `MIG-401` (`Phase 4`)
16. `MIG-402` (`Phase 4`)
17. `MIG-403` (`Phase 4`)

## Readiness Score

- Formula: `(completed_milestones / 5) * 80 + blocker_bonus`
- `blocker_bonus = 20` when no critical blockers remain in active milestones, else `0`
- Bands:
  - Green: `85-100`
  - Yellow: `60-84`
  - Red: `<60`

## Known Blockers

- `workflow_orchestration` backend is still placeholder-only
- `resume_audit` history support is still incomplete
- `genkit_job_analysis` governance metadata is incomplete until `MIG-001`
- `frontend/scripts/validate-governance-artifacts.mjs` is still not fit for use as a migration gate until parity work lands
- ingestion callers are still fragmented across canonical, transitional, and deprecated contracts until `MIG-103`
- incremental dependency drift remains a risk until cleanup verification is in place
