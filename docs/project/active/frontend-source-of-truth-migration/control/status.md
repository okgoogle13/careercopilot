# Migration Status

**Program:** PR126 frontend source-of-truth migration
**Status:** Active
**Current phase:** Prototype-first AI Studio completion — execute the active prompt sequence from `control/AI-STUDIO-PROMPT-PACK.md`, preserve contract route ownership during the prototype pass, then harvest; `/tracker` and `/profile` env verification remain downstream closeout gates
**Execution truth:** `control/COMET-MANIFEST.md`
**Retained planning baselines:** `control/archive/route-matrix.{md,json}`, `control/archive/implementation-backlog.md`, `control/archive/workflow.md`

## Current Progress Metrics (Tri-Layer Truth)

| Dimension | Metric | Status |
| :--- | :--- | :--- |
| **Runtime Truth** | 26/26 reachable paths (`19` canonical routes + `7` legacy redirects) | ✅ CLEAN |
| **Design Truth** | 12/12 screen pairs aligned | ✅ CLEAN |
| **Capability Truth** | 10/10 backend modules | ✅ 95% Saturation Target |
| **PM Governance** | 13/13 build contracts valid | ✅ VALID |
| **Shell Promotion** | 14/15 canonical protected routes on MigratedRouteLayout | ✅ PROMOTED (1 canonical holdout on ProtectedLayout) |
| **Total Migration** | ~97% Complete | 🟡 Final Closeout Pending |

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
- **Scan Results (2026-03-18)**:
  - `node --import tsx tools/ci/check-route-integrity.ts` → route integrity clean (26 reachable paths scanned from `App.tsx`).
  - `node --import tsx tools/ci/check-screen-pairs.ts` → all 12 screens correctly paired.
  - `node --import tsx tools/scripts/scan-routes.ts` → 26 reachable paths: public 5 · migrated 20 · protected 1.
- **Route ownership cleanup (2026-03-17)**:
  - `/analysis` and `/apply/quick` runtime owners moved to `features/`.
  - `frontend/src/routes.tsx` removed; `frontend/src/App.tsx` is authoritative.
- **API convergence (2026-03-18)**:
  - Quick Apply, Analysis, Evidence upload, redline upload, Jobs/Opportunities/Profile flows now call the service-client wrappers (`workflowService`, `analysisService`, `ingestion.service`, `documentService`).
- **Build-contract coverage (2026-03-24)**:
  - `build-contract-profile.xml` added to complete governed route coverage for `/profile`.
  - `scripts/derive-gap-fill-plan.py` rerun for `tracker`, `opportunities`, `analysis`, `dashboard`, `root`, and `profile`; outputs now live under `tmp/migration/`.
  - `scripts/validate-wireframe-workflow.py --json-out tmp/migration/wireframe-workflow-report.json` confirms 13/13 build contracts valid with 0 XSD failures; current remaining wireframe issue is warning burn-down (`79` warnings), not schema breakage.
- **Planning sync refresh (2026-03-25)**:
  - active control docs now point at the retained `control/archive/` route-matrix, backlog, and workflow baselines instead of missing root-level files.
  - `AI-STUDIO-PROMPT-PACK.md` and `COMET-MANIFEST.md` now use contract-alignment annotations instead of expressive-token annotations.
  - prompt-pack notes now explicitly preserve canonical ownership for `/documents`, `/ksc-generator`, `/cover-letter-generator`, `/profile`, and `/settings`.
- **Identity Gates**:
  - Complete: `/analysis`, `/dashboard`, `/`, `/opportunities`.
  - Pending environment verification: `/tracker`, `/profile`.

### Phase 4: Shell Integration & Asset Alignment

- **Logo Component**: `COMPLETE`. Canonical TSX exists and is mounted in `Sidebar`.
- **Shell Promotion**: `COMPLETE`. Canonical shell mix is now 14 migrated + 1 protected + 4 public.

### Phase 5: API Convergence & Closeout

- **Shared clients**: `workflowService`, `analysisService`, `ingestion.service`, and `documentService` now sit behind every production route.
- **Verification reruns**: `scan-routes.ts`, `scan-screens.ts`, `detect-orphans.ts` stay green.
- **Next steps**: Complete the selected prototype-wide AI Studio pass, hold the `MIG-202` route lock through later prototype batches, then harvest into canonical runtime code and return to `/tracker` and `/profile` env verification.

### Known Blockers

| ID | Component | Severity | Status | Mitigation / Next Action |
|---|---|---|---|---|
| B1 | `workflow_orchestration` | `High` | `RESOLVED` | `ApplyQuick.tsx` → `POST /api/workflows/generate-application`. |
| B2 | `resume_audit` history | `Medium` | `RESOLVED` | Wired to `GET /api/resume-audit/history`. |
| B3 | `/analysis` vs `/asset-library` ownership | `Medium` | `RESOLVED` | Route explicitly marked support-only. |
| B4 | `ingestion contract convergence` | `High` | `RESOLVED` | All callers now use `/api/v1/ingest`. |
| B5 | `/tracker` env verification | `High` | `BLOCKED` | `FIREBASE_PROJECT_ID=careercopilot-468811` and Firestore env missing. |
| B8 | `/profile` env verification | `High` | `BLOCKED` | Voice-profile GET/POST verification is blocked on the same local Firebase/auth environment readiness. |
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
- Prototype pass — Comet/AI Studio: `IN_PROGRESS` (complete the selected `B1-B19` batch pass and prototype alignment before new harvest work).
- Phase 4 — Route Gating: `COMPLETE_WITH_WARNING` (governed contracts and gap-fill outputs are current; wireframe validator still reports non-schema warnings).
- Shell Promotion — B3: `COMPLETE` (14 canonical routes on `MigratedRouteLayout`).
- Step 6A/B — Retirement/Pairing: `COMPLETE` (Clean route registry, 12 paired screens).

---
*Status refreshed: 2026-03-24 (build-contract coverage + gap-fill closeout sync)*
