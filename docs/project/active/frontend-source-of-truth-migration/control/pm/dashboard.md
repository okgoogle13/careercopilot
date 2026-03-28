# PR126 Migration Dashboard

Execution truth:
- `control/COMET-MANIFEST.md`
- `control/AI-STUDIO-PROMPT-PACK.md`
- `control/FRONTEND-CLEANUP-REPORT.md`
- `control/PROTOTYPE-SALVAGE-TRACKER.md`

Planning narrative:
- `control/status.md`
- `control/route-matrix.json`
- `control/archive/route-matrix.md`
- `control/archive/implementation-backlog.md`

Evidence inputs (advisory only):
- `docs/manifests/routes.json`
- `docs/manifests/screens.json`
- `docs/manifests/frontend-api-usage.json`
- `docs/manifests/backend-endpoints.json`
- `docs/manifests/orphans.json`

## Current Phase

- **Migration closeout IN_PROGRESS (2026-03-28)** — shell promotion, route ownership cleanup, API convergence, and governed build-contract coverage are complete, but PM closeout still requires runtime-truth resync and a terminal migration-workspace dissolve plan.
- Evidence-weighted completion: approximately 94% — route and screen integrity are green, but route-matrix/runtime classification and migration-workspace closeout are still incomplete.

## Executive Snapshot

- **Highest-priority decision:** classify the live runtime paths that are mounted in `App.tsx` but not yet fully represented in route-matrix planning.
- **Primary risk:** PM/control artifacts still undercount live mounted paths and can overstate closeout readiness if left unchanged.
- **Dependency at risk:** the migration workspace cannot be dissolved safely until route-matrix truth is resynced, the remaining salvage candidates are given terminal outcomes, and a canonical destination map exists.
- **Next gate:** `frontend-cleanup-manager` Batch A — runtime-truth resync.

## Recent Progress

- Frontend cleanup remediation frame added (2026-03-28):
  - `FRONTEND-CLEANUP-REPORT.md` created as the execution brief for `frontend-cleanup-manager`
  - route-matrix gaps are now enumerated directly from live `App.tsx` mounts
  - terminal migration-workspace dissolution is now a named PM closeout stream instead of an implied future cleanup

- Prototype salvage execution lane defined (2026-03-28):
  - `PROTOTYPE-SALVAGE-TRACKER.md` created to separate actual salvage work from the prototype audit labels
  - the remaining four prototype `[HARVEST]` candidates are now mapped to canonical destinations and terminal statuses
  - final migration-workspace dissolution now depends on salvage resolution, not just cleanup reporting

- Planning/control sync refreshed (2026-03-25):
  - active control docs now reference the retained `control/archive/` route-matrix, backlog, and workflow baselines instead of missing root-level files
  - `COMET-MANIFEST.md` and `AI-STUDIO-PROMPT-PACK.md` now annotate batches against canonical route owners and `contracts/*.xml`
  - support-reference `Submitted Docs` prompts now explicitly preserve `/documents`, `/ksc-generator`, and `/cover-letter-generator` ownership separation

- TSX identity-gate artifacts checked in for all three Figma-informed routes (2026-03-16):
  - `/analysis`: `identity_pass`
  - `/dashboard`: `identity_pass_with_rewrites` (5 token violations remediated)
  - `/` (landing): `identity_pass`
  - Artifacts: `analysis/2026-03-16-tsx-identity-gate-{analysis,dashboard,root}.md`
- `/opportunities` Step 6B closure complete (2026-03-17):
  - token-enforcement: pass (rgba drop-shadow→color-mix remediation)
  - migration-audit: pass
  - build contract generated and XSD-validated: `contracts/build-contract-opportunities.xml`
  - route-matrix: `implementation_status: complete`
  - route-specific identity gate checked in
- Governed build-contract coverage refreshed (2026-03-24):
  - `/profile` contract added: `contracts/build-contract-profile.xml`
  - all 13 governed build contracts now validate against `build_contract.xsd`
  - the governed contract set is now complete for the currently active product routes
- Canonical gap-fill outputs regenerated (2026-03-24):
  - `tmp/migration/tracker-gap-fill-plan.json`
  - `tmp/migration/opportunities-gap-fill-plan.json`
  - `tmp/migration/analysis-gap-fill-plan.json`
  - `tmp/migration/dashboard-gap-fill-plan.json`
  - `tmp/migration/root-gap-fill-plan.json`
  - `tmp/migration/profile-gap-fill-plan.json`
- Wireframe validator status refreshed (2026-03-24):
  - `scripts/validate-wireframe-workflow.py --json-out tmp/migration/wireframe-workflow-report.json`
  - current result: fail on warnings only (`79` warnings), with 0 schema failures and 0 build-contract XSD failures
- Five Step 6B routes are gated and now reflected as complete in the route matrix:
  - `/ksc-generator`, `/cover-letter-generator`, `/settings`, `/job-queue`, `/onboarding`
  - token-enforcement: pass (0 violations), migration-audit: pass on all 5
  - Build contracts generated and XSD-validated (8/8 contracts pass `build_contract.xsd`)
- Three Figma-informed routes are gated at the route level:
  - `/analysis`, `/dashboard`, `/`
  - token-enforcement: pass; migration-audit: pass; build contracts: execution_ready
  - identity-gate artifacts are checked in
- Direct Figma MCP page harvest is now recorded for 7 canonical page nodes:
  - Home, Dashboard, Opportunities, Applications, Ingestion, Analysis, Account Control
  - Scaffold IDs and route-family mappings are captured in `analysis/2026-03-16-figma-mcp-inventory-and-accelerators.md`
  - accelerator policy is now explicit: adopt draft build-contract and wireframe-diff support; pilot scaffold injection only; reject schema extraction and token sync automation for now
- Shared-client cleanup: `workflowService`, `analysisService`, `ingestion.service`, and `documentService` now back all fetch-heavy flows (quick apply, ATS scoring, evidence upload, document redline), and the shared `axiosInstance` remains the single auth/token gate; verification scripts reran clean after each slice.
- Shared-shell Figma audit is now checked in:
  - `analysis/2026-03-16-figma-shared-shell-audit.md`
  - shell inheritance is now explicit for layout, sidebar, logo, top-nav/header, and footer
- Route audit expansion is now checked in for the remaining page families:
  - `analysis/2026-03-16-support-reference-audit-opportunities.md`
  - `analysis/2026-03-16-support-reference-audit-applications.md`
  - `analysis/2026-03-16-support-reference-audit-ingestion.md`
  - `analysis/2026-03-16-support-reference-audit-account.md`
- Tracked Claude handoff packet refreshed:
  - `control/claude-handoff.md`
- Shared primitive audit completed (record-only): Logo canonical, Footer canonical component added, AuthGuard has `bg-[#1A1714]` token violation, KrDarkDock canonical.
- XSD schema (`docs/schema/build_contract.xsd`) updated to support all contract shapes including apply-quick pattern.
- `scripts/validate-wireframe-workflow.py` fixed: component_alignment uses full matrix for route-scoped runs; coverage_mismatch downgraded to warning.
- `05_analysis.wireframe.xml` and `09_finalization.wireframe.xml` XML well-formedness issues were fixed (`&` -> `&amp;`).
- CI integrity: route integrity clean, 12/12 screen pairs aligned, 18/18 pytest governance tests pass, governance artifacts valid.
- Governance readiness: `pytest tests/plans -q` → 18 passed; `validate-governance-artifacts.mjs` → ok.

## Recent Progress (2026-03-17)

- Shell promotion complete: `/welcome` and `/documents` moved to `MigratedRouteLayout`. Canonical layout mix: migrated 14 · protected 1 · public 4. Reachable runtime paths total 26 because 7 legacy redirects are explicitly preserved in `App.tsx`.
- Route-owner cleanup complete for the two remaining live `pages/` mounts:
  - `/analysis` → `frontend/src/features/analysis/AnalysisPage.tsx`
  - `/apply/quick` → `frontend/src/features/applications/ApplyQuick.tsx`
- `frontend/src/routes.tsx` retired; `frontend/src/App.tsx` is now the sole router authority.
- `MigratedRouteLayout.tsx` viewMap extended for `/opportunities` (`KrDark-feed`) and `/job-queue` (`overview`).
- Tri-layer truth scripts rerun: route integrity clean, 26 reachable paths scanned (`19` canonical routes + `7` redirects), 12/12 screen pairs, 18 governance tests pass.
- Gap-fill plan run for `/tracker`, `/opportunities`, `/analysis`, `/dashboard`, `/`, and `/profile` — findings saved to `tmp/migration/`.
- `remaining-route-plan.md` created: `analysis/remaining-route-plan.md`.
- `App.tsx` updated: migrated shell is authoritative for all canonical routes except `/asset-library` (support-only) which remains on `ProtectedLayout`.

## Nested Tasks Added (2026-03-24)

- **TSX Identity Gate** for `/tracker`: blocked on live env evidence.
- **Env-backed route verification** for `/profile`: blocked on live Firebase/auth evidence.
- **Shared-shell cleanup**: `Footer` adoption is now complete in `MigratedRouteLayout`.
- **AuthGuard B3**: replace `bg-[#1A1714]` with semantic token (App.tsx:72).

## Next Gates

- Step 3a `/tracker`: BLOCKED on Firebase/Firestore — see `analysis/remaining-route-plan.md §4` for exact env config and validation steps.
- Step 3c `/profile`: BLOCKED on the same Firebase/auth environment — verify GET/POST `/api/v1/auth/voice-profile` before marking the route fully closed.
- `frontend-cleanup-manager` Batch A: resync `App.tsx`, `route-registry.ts`, `routes.json`, `route-matrix.json`, and `status.md`
- Prototype salvage pass: update `PROTOTYPE-SALVAGE-TRACKER.md` so each remaining harvest candidate is ported, confirmed already canonical, or discarded
- `frontend-cleanup-manager` Batch D: publish destination map and reduce the migration workspace to retained archive/history

## Capability Blockers — ALL RESOLVED (2026-03-17)

| Blocker | Resolution |
|---------|-----------|
| `workflow_orchestration` | `ApplyQuick.tsx` → `POST /api/workflows/generate-application`; full `analyzeJobFromUrl` pipeline delegated; result returned inline; tests updated to auth-required + 200 contract. |
| `resume_audit` history | `ResumeAuditEntryPoint.tsx` renders persisted history panel via `getAuditHistory()`; wired to `GET /api/resume-audit/history`. |
| `/analysis` vs `/asset-library` | `App.tsx` route comment explicit: support-only, intentionally NOT promoted; separate from pending design-parity routes. |
| Ingestion client fragmentation | `ResumeUploader.tsx` → `/api/v1/ingest`; artifact upload + smart-ingestion specialized scopes unchanged. |

## Remaining Open Items

- `/tracker` closeout: BLOCKED on Firebase/Firestore env. `FIREBASE_PROJECT_ID` absent from `backend/.env`. Requires `FIREBASE_PROJECT_ID=careercopilot-468811` + Firestore service account. See `analysis/remaining-route-plan.md §4`.
- `/profile` closeout: BLOCKED on Firebase/auth env. Requires the same local project configuration plus an authenticated verification pass against `GET/POST /api/v1/auth/voice-profile`.
- Route-matrix/runtime drift: live mounted paths currently exceed the planning layer's explicit path accounting and require cleanup-manager classification.
- Prototype salvage pass: still pending; remaining harvest candidates need terminal outcomes before the migration workspace can be dissolved.
- Migration workspace dissolution: planned but not executed; destination mapping and runtime-import proof are still outstanding.
- Footer shell adoption: `RESOLVED` (adopted by `MigratedRouteLayout`).
- AuthGuard B3: `App.tsx:72` `bg-[#1A1714]` → semantic token (deferred, non-critical).
- PM artifact refresh: `status.md`, `implementation-backlog.*`, and `remaining-route-plan.md` synced on 2026-03-24; keep `blueprint.md` task-status summary aligned during final closeout.

## Next Actions

1. `frontend-cleanup-manager` Batch A: classify all mounted runtime paths and resync PM/control route truth.
2. Step 3a `/tracker`: set `FIREBASE_PROJECT_ID=careercopilot-468811` in `backend/.env`, start backend, verify `GET /api/applications/`, capture populated board screenshot ≥90.
3. Step 3c `/profile`: with the same env restored, verify authenticated `GET` and `POST /api/v1/auth/voice-profile`, then confirm `/profile` remains the visible runtime owner.
4. Prototype salvage pass: resolve the remaining four harvest candidates in `PROTOTYPE-SALVAGE-TRACKER.md`.
5. `frontend-cleanup-manager` Batch D: publish canonical destination map and move the migration workspace out of Active status.
