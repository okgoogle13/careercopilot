# Migration Status

**Program:** PR126 frontend source-of-truth migration
**Status:** Active
**Current phase:** Runtime-truth resync and migration-workspace closeout planning — `frontend-cleanup-manager` owns Batch A route classification and Batch D destination-map/dissolution prep while `/tracker` and `/profile` env verification remain downstream closeout gates
**Execution truth:** `control/COMET-MANIFEST.md`
**Retained planning baselines:** `control/archive/route-matrix.{md,json}`, `control/archive/implementation-backlog.md`, `control/archive/workflow.md`
**Terminal closeout requirement:** this workspace does not remain active indefinitely; after runtime resync and canonical destination mapping, surviving artifacts must move to canonical homes or retained archive/history status.
**Salvage requirement:** remaining prototype `[HARVEST]` candidates must receive terminal outcomes in `control/PROTOTYPE-SALVAGE-TRACKER.md` before dissolution can be called complete.

## Current Progress Metrics (Tri-Layer Truth)

| Dimension | Metric | Status |
| :--- | :--- | :--- |
| **Runtime Truth** | 31 mounted paths in `App.tsx`; route integrity is green, but PM/control classification is not yet fully resynced | 🟡 RESYNC REQUIRED |
| **Design Truth** | 12/12 screen pairs aligned | ✅ CLEAN |
| **Capability Truth** | 10/10 backend modules | ✅ 95% Saturation Target |
| **PM Governance** | 13/13 build contracts valid | ✅ VALID |
| **Shell Promotion** | 14/15 canonical protected routes on MigratedRouteLayout | ✅ PROMOTED (1 canonical holdout on ProtectedLayout) |
| **Total Migration** | ~94% Complete | 🟡 Final Closeout Pending |

## Current state

- **Nav Label Lock (2026-03-22)**:
  - `navigation.schema.ts` replaced: 7-item stale schema (Feed, Kanban, Landing, Ingest, Overview) → 6 canonical items with `nav-*` IDs.
  - `Sidebar.tsx` updated: removes Cover Letter Workbench, KSC, Templates; adds Profile; corrects stale labels to the locked user-facing set: `Jobs`, `ATS Check`, `Applications`, `Submitted Docs`, `Profile`.
  - `MigratedRouteLayout.tsx` fallback updated: `lab-dashboard` → `nav-dashboard`.
  - Permanent nav now matches the route-matrix lock table: `Dashboard`, `Jobs`, `ATS Check`, `Applications`, `Submitted Docs`, `Profile`. Settings remains sidebar gear-icon only.
- **Comet Strategy Consolidation (2026-03-22)**:
  - All AI Studio prompting strategy, execution backlog, and harvest blueprints consolidated into `control/COMET-MANIFEST.md`.
  - Redundant documentation (`aistudio-report.md`, `comet-backlog.md`, etc.) and fragmented folders (`ai-studio-prototype-harvest/`) removed.
  - One canonical source of truth established for Support-Reference Mode harvest.
- **Prototype-First Sequence Lock (2026-03-24)**:
  - AI Studio work now runs as a prototype-wide pass first: `B1-B19`, with route-specific packs such as `MIG-202` acting as ownership locks inside that pass.
  - `MIG-202` is no longer treated as an immediate harvest trigger; it must hold through later prototype batches, especially `B18`.
  - Harvest begins only after the selected prototype batch pass and prototype-wide alignment sweep are complete.
- **Step 6 Completion (2026-03-18)**:
  - `6A — Route retirement`: Prototype `/kr/*` routes retired and registration removed from `App.tsx`.
  - `6B — Screen pairing`: 6 unrouted screens paired with canonical features; orphan report cleared.
  - `Shell Promotion`: 14 canonical routes now use the migrated shell; 7 redirects explicit in router.
- **Scan Results (2026-03-28 refresh)**:
  - `node --import tsx tools/ci/check-route-integrity.ts` → route integrity clean.
  - `node --import tsx tools/ci/check-screen-pairs.ts` → all 12 screens correctly paired.
  - `node --import tsx tools/scripts/scan-routes.ts` → 31 live mounted paths now reflected in runtime evidence; PM/control route classification still needs cleanup-manager resync.
- **Route ownership cleanup (2026-03-17)**:
  - `/analysis` and `/apply/quick` runtime owners moved to `features/`.
  - `frontend/src/routes.tsx` removed; `frontend/src/App.tsx` is authoritative.
- **API convergence (2026-03-18)**:
  - Quick Apply, Analysis, Evidence upload, redline upload, Jobs/Opportunities/Profile flows now call the service-client wrappers (`workflowService`, `analysisService`, `ingestion.service`, `documentService`).
- **Build-contract coverage (2026-03-24)**:
  - `build-contract-profile.xml` added to complete governed route coverage for `/profile`.
  - `scripts/derive-gap-fill-plan.py` rerun for `tracker`, `opportunities`, `analysis`, `dashboard`, `root`, and `profile`; outputs now live under `tmp/migration/`.
  - `scripts/validate-wireframe-workflow.py --json-out tmp/migration/wireframe-workflow-report.json` confirms 13/13 build contracts valid with 0 XSD failures; current remaining wireframe issue is warning burn-down (`79` warnings), not schema breakage.
- **Prototype Harvest Blocker Sprint Closed (2026-03-25)**:
  - All 5 prototype harvest blockers resolved. Readiness score: 35 → 95/100.
  - `README.md` rewritten as support/reference-only; stale Firebase, `react-router-dom`, History API routing claims removed.
  - `guidelines.md` route section replaced with contract-backed mapping table; obsolete routes removed.
  - `ImageStudioPage.tsx` voice CTA corrected: `/profile` is canonical voice owner (was Settings).
  - `GettingStartedChecklist.tsx` extension-first item replaced with neutral job-intake action.
  - `PROTOTYPE-HARVEST-PATTERN-CATALOG.md` created with 6 route family entries.
  - `prototype_v2.0` is now a harvest-prepared support/reference source.
  - PM milestone M16 added; Phase 6 added to phase-plan.yaml as COMPLETE.

- **Planning sync refresh (2026-03-25)**:
  - active control docs now point at the retained `control/archive/` route-matrix, backlog, and workflow baselines instead of missing root-level files.
  - `AI-STUDIO-PROMPT-PACK.md` and `COMET-MANIFEST.md` now use contract-alignment annotations instead of expressive-token annotations.
  - prompt-pack notes now explicitly preserve canonical ownership for `/documents`, `/ksc-generator`, `/cover-letter-generator`, `/profile`, and `/settings`.
- **Frontend cleanup remediation frame (2026-03-28)**:
  - `FRONTEND-CLEANUP-REPORT.md` created as the execution brief for `frontend-cleanup-manager`.
  - route-matrix gap is now explicit: live runtime mounts exceed current PM/control path accounting.
  - terminal migration-workspace dissolution is now defined as a named closeout phase with destination-map and runtime-import-proof requirements.
- **Prototype salvage lane defined (2026-03-28)**:
  - `PROTOTYPE-SALVAGE-TRACKER.md` created to separate actual salvage execution from audit labels.
  - the remaining four `[HARVEST]` candidates now have explicit canonical destinations and must end in `PORTED`, `ALREADY_CANONICAL`, or `DISCARDED`.
  - final migration-workspace dissolution now depends on salvage resolution as well as cleanup reporting.
- **Identity Gates**:
  - Complete: `/analysis`, `/dashboard`, `/`, `/opportunities`.
  - Pending environment verification: `/tracker`, `/profile`.

### Phase 4: Shell Integration & Asset Alignment

- **Logo Component**: `COMPLETE`. Canonical TSX exists and is mounted in `Sidebar`.
- **Shell Promotion**: `COMPLETE`. Canonical shell mix is now 14 migrated + 1 protected + 4 public.

### Phase 5: API Convergence & Closeout

- **Shared clients**: `workflowService`, `analysisService`, `ingestion.service`, and `documentService` now sit behind every production route.
- **Verification reruns**: `scan-routes.ts`, `scan-screens.ts`, `detect-orphans.ts` stay green.
- **Current closeout lane**:
  - Batch A: classify every live mounted path in `App.tsx` and resync `route-registry.ts`, `routes.json`, `route-matrix.json`, and PM status metrics.
  - Batch B/C: collapse duplicate owner candidates to a single runtime owner and prove no live runtime dependency on migration-workspace artifacts.
  - Prototype salvage pass: resolve the remaining `[HARVEST]` candidates recorded in `PROTOTYPE-SALVAGE-TRACKER.md`.
  - Batch D: publish the canonical destination map and reduce this workspace to retained archive/history only.
- **Follow-on work after cleanup-manager batches**: return to `/tracker` and `/profile` env verification, then complete final archive/deactivation.
- **Final archive gate (planned)**:
  - resync `control/route-matrix.json` and `control/archive/route-matrix.md` to the current `App.tsx` route set
  - give every remaining prototype harvest candidate a terminal outcome in `control/PROTOTYPE-SALVAGE-TRACKER.md`
  - produce a canonical destination map for any surviving migration artifacts
  - prove that no live frontend runtime imports from `docs/project/active/frontend-source-of-truth-migration/**`
  - move the folder out of Active status once only retained archive/history contents remain
- **Known route-matrix gaps to classify**:
  - `/auth`
  - `/animation-test`
  - `/prototype/*`
  - `/dashboard-overview`
  - `/kanban`
  - `/ingestion`
  - `/feed`
  - `/studio`
  - `/editor`

### Known Blockers

| ID | Component | Severity | Status | Mitigation / Next Action |
|---|---|---|---|---|
| B1 | `workflow_orchestration` | `High` | `RESOLVED` | `ApplyQuick.tsx` → `POST /api/workflows/generate-application`. |
| B2 | `resume_audit` history | `Medium` | `RESOLVED` | Wired to `GET /api/resume-audit/history`. |
| B3 | `/analysis` vs `/asset-library` ownership | `Medium` | `RESOLVED` | Route explicitly marked support-only. |
| B4 | `ingestion contract convergence` | `High` | `RESOLVED` | All callers now use `/api/v1/ingest`. |
| B5 | `/tracker` env verification | `High` | `BLOCKED` | `FIREBASE_PROJECT_ID=careercopilot-468811` and Firestore env missing. |
| B8 | `/profile` env verification | `High` | `BLOCKED` | Voice-profile GET/POST verification is blocked on the same local Firebase/auth environment readiness. |
| B9 | `route-matrix/runtime resync` | `High` | `BLOCKED` | Live runtime paths exceed current PM route accounting; `frontend-cleanup-manager` must classify and resync route artifacts before final closeout. |
| B11 | `prototype salvage pass` | `Medium` | `BLOCKED` | Remaining `[HARVEST]` candidates still need terminal salvage outcomes in `PROTOTYPE-SALVAGE-TRACKER.md` before dissolution is credible. |
| B10 | `migration workspace dissolution` | `Medium` | `BLOCKED` | Canonical destination map and runtime-import proof are now required before this folder can leave Active status. |
| B6 | `Footer shell adoption` | `Low` | `RESOLVED` | Canonical `Footer` is adopted by `MigratedRouteLayout`. |
| B7 | `fetch ⇒ service client cleanup` | `Low` | `RESOLVED` | All production routes use shared API services. |

### Execution Skill Matrix (Phase 4 Finalization)

| Role | Skill | Action |
|---|---|---|
| **Governor** | `design-orchestration` | Run after each major refinement and before execution gate. |
| **Logic Harvester** | `COMET-MANIFEST` | Drive AI Studio "Build" mode using the consolidated manifest. |
| **Brand Enforcer** | `kerala-rage-brand-enforcer` | Remediate token compliance and Zero-Flora violations. |
| **Scaffolder** | `blueprint` | Update task status and manage delegation. |
| **Tracker** | `project-manager` | Update this document and dashboard after completion. |

## Current gate state

- Step 3a — `/tracker` CRUD: `COMPLETE_DEFERRED_VERIF` (seeded via REST; logic verified; env blocker documented).
- Step 3c — `/profile` Voice Capture: `COMPLETE_DEFERRED_VERIF` (route owner and support components are implemented; env-backed verification remains blocked).
- Prototype pass — Comet/AI Studio: `COMPLETE_FOR_REMEDIATION` (prototype harvest prep is complete enough for cleanup/resync closeout planning; no new prototype-first batch is required before Batch A route classification).
- Phase 4 — Route Gating: `COMPLETE_WITH_WARNING` (governed contracts and gap-fill outputs are current; wireframe validator still reports non-schema warnings).
- Shell Promotion — B3: `COMPLETE` (14 canonical routes on `MigratedRouteLayout`).
- Step 6A/B — Retirement/Pairing: `COMPLETE` (Clean route registry, 12 paired screens).
- Prototype salvage pass: `PLANNED` (tracker created; remaining four harvest candidates now need terminal outcomes).
- Phase 7 — Runtime Resync + Migration Workspace Dissolution: `IN_PROGRESS` (`frontend-cleanup-manager` execution is now defined; Batch A route classification is the active gate).

---
*Status refreshed: 2026-03-28 (cleanup-manager closeout planning sync)*
