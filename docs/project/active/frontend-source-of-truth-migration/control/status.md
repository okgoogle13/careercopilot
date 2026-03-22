# Migration Status

**Program:** PR126 frontend source-of-truth migration
**Status:** Active
**Current phase:** Migration closeout — API wiring, route cleanup, and shared-component ownership now aligning; `/tracker` Firebase env verification still pending
**Execution truth:** `control/blueprint.md`

## Current Progress Metrics (Tri-Layer Truth)

| Dimension | Metric | Status |
|-----------|--------|--------|
| **Runtime Truth** | 26/26 reachable paths (`19` canonical routes + `7` legacy redirects) | ✅ CLEAN |
| **Design Truth** | 12/12 screen pairs aligned | ✅ CLEAN |
| **Capability Truth** | 10/10 backend modules | ✅ 95% Saturation Target |
| **PM Governance** | 12/12 build contracts valid | ✅ VALID |
| **Shell Promotion** | 14/15 canonical protected routes on MigratedRouteLayout | ✅ PROMOTED (1 canonical holdout on ProtectedLayout) |
| **Total Migration** | ~95% Complete | 🟡 Final Closeout Pending |

## Current state

- **Nav Label Lock (2026-03-22)**:
  - `navigation.schema.ts` replaced: 7-item stale schema (Feed, Kanban, Landing, Ingest, Overview) → 6 canonical items with `nav-*` IDs.
  - `Sidebar.tsx` updated: removes Cover Letter Workbench, KSC, Templates; adds Profile; corrects "ATS Score & Optimise"→Analysis, "Job Scout"→Jobs, "My Documents"→Documents.
  - `MigratedRouteLayout.tsx` fallback updated: `lab-dashboard` → `nav-dashboard`.
  - Permanent nav now matches route-matrix lock table. Settings remains sidebar gear-icon only.
- **Comet Strategy Consolidation (2026-03-22)**:
  - All AI Studio prompting strategy, execution backlog, and harvest blueprints consolidated into `control/COMET-MANIFEST.md`.
  - Redundant documentation (`aistudio-report.md`, `comet-backlog.md`, etc.) and fragmented folders (`ai-studio-prototype-harvest/`) removed.
  - One canonical source of truth established for Support-Reference Mode harvest.
- **Step 6 Completion (2026-03-18)**:
  - `6A — Route retirement`: Prototype `/kr/*` routes retired and registration removed from `App.tsx`.
  - `6B — Screen pairing`: 6 unrouted screens paired with canonical features; orphan report cleared.
  - `Shell Promotion`: 14 canonical routes now use the migrated shell; 7 redirects explicit in router.
- **Scan Results (2026-03-18)**:
  - `node --import tsx tools/ci/check-route-integrity.ts` → route integrity clean (26 reachable paths scanned from `App.tsx`).
  - `node --import tsx tools/ci/check-screen-pairs.ts` → all 12 screens correctly paired.
  - `node --import tsx tools/scripts/scan-routes.ts` → 26 reachable paths: public 5 · migrated 20 · protected 1.
- **Route ownership cleanup (2026-03-17)**:
  - `/analysis` and `/apply/quick` runtime owners moved to `features/`.
  - `frontend/src/routes.tsx` removed; `frontend/src/App.tsx` is authoritative.
- **API convergence (2026-03-18)**:
  - Quick Apply, Analysis, Evidence upload, redline upload, Jobs/Opportunities/Profile flows now call the service-client wrappers (`workflowService`, `analysisService`, `ingestion.service`, `documentService`).
- **Identity Gates**:
  - Complete: `/analysis`, `/dashboard`, `/`, `/opportunities`.
  - Pending environment verification: `/tracker`, `/profile`.

### Phase 4: Shell Integration & Asset Alignment

- **Logo Component**: `COMPLETE`. Canonical TSX exists and is mounted in `Sidebar`.
- **Shell Promotion**: `COMPLETE`. Canonical shell mix is now 14 migrated + 1 protected + 4 public.

### Phase 5: API Convergence & Closeout

- **Shared clients**: `workflowService`, `analysisService`, `ingestion.service`, and `documentService` now sit behind every production route.
- **Verification reruns**: `scan-routes.ts`, `scan-screens.ts`, `detect-orphans.ts` stay green.
- **Next steps**: Resolve `/tracker` and `/profile` Firebase environment verification; final gate closure.

### Known Blockers

| ID | Component | Severity | Status | Mitigation / Next Action |
|---|---|---|---|---|
| B1 | `workflow_orchestration` | `High` | `RESOLVED` | `ApplyQuick.tsx` → `POST /api/workflows/generate-application`. |
| B2 | `resume_audit` history | `Medium` | `RESOLVED` | Wired to `GET /api/resume-audit/history`. |
| B3 | `/analysis` vs `/asset-library` ownership | `Medium` | `RESOLVED` | Route explicitly marked support-only. |
| B4 | `ingestion contract convergence` | `High` | `RESOLVED` | All callers now use `/api/v1/ingest`. |
| B5 | `/tracker` env verification | `High` | `BLOCKED` | `FIREBASE_PROJECT_ID=careercopilot-468811` and Firestore env missing. |
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
- Step 3c — `/profile` Voice Capture: `BLOCKED` (waiting on Firebase/Firestore environment unblock).
- Phase 4 — Route Gating: `IN_PROGRESS` (6 routes gated; `/tracker` holds on env evidence).
- Shell Promotion — B3: `COMPLETE` (14 canonical routes on `MigratedRouteLayout`).
- Step 6A/B — Retirement/Pairing: `COMPLETE` (Clean route registry, 12 paired screens).

---
*Status refreshed: 2026-03-22 (Comet consolidation and Step 6 closeout)*
