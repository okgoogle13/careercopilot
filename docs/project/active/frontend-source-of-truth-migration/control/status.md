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
| **Total Migration** | ~93% Complete | 🟡 Final Closeout Pending |

## Current state

- **Scan Results (2026-03-18)**:
  - `node --import tsx tools/ci/check-route-integrity.ts` → route integrity clean (26 reachable paths scanned from `App.tsx`).
  - `node --import tsx tools/ci/check-screen-pairs.ts` → all 12 screens correctly paired.
  - `node --import tsx tools/scripts/scan-routes.ts` → 26 reachable paths: public 5 · migrated 20 · protected 1. Canonical surfaces remain 19 total (`4` public + `14` migrated + `1` protected); 7 additional paths are legacy redirects.
  - `python3 scripts/derive-gap-fill-plan.py --route-id opportunities` → `Opportunities` token_state=`clean`; no required_actions remain.
  - `python3 scripts/validate-wireframe-workflow.py --route opportunities` → status `warn`; 0 schema failures, 4 schema warnings, 0 XSD failures.
  - `pytest tests/plans -q` → 18 passed.
- **Shell Promotion (2026-03-18)**:
  - `/onboarding`, `/ksc-generator`, `/cover-letter-generator`, `/job-queue` promoted from `ProtectedLayout` → `MigratedRouteLayout`.
  - Canonical shell state now remains: migrated `14`, protected `1`, public `4`.
  - Redirect paths are now explicit in `App.tsx`: `/auth`, `/dashboard-overview`, `/kanban`, `/ingestion`, `/feed`, `/studio`, `/editor`.
- **Route ownership cleanup (2026-03-17)**:
  - `/analysis` runtime owner moved from `frontend/src/pages/AnalysisPage.tsx` → `frontend/src/features/analysis/AnalysisPage.tsx`.
  - `/apply/quick` runtime owner moved from `frontend/src/pages/ApplyQuick.tsx` → `frontend/src/features/applications/ApplyQuick.tsx`.
  - `frontend/src/routes.tsx` removed; `frontend/src/App.tsx` is now the sole runtime router authority.
  - Remaining on `ProtectedLayout`: `/asset-library` (support-only).
- **Route ownership truth (2026-03-17)**:
  - `genkit_job_analysis`: complete; `/apply/quick` is the canonical execution owner and `/opportunities` is support-only.
  - `workflow_orchestration`: RESOLVED — `ApplyQuick.tsx` now calls `POST /api/workflows/generate-application`; result surfaced via `payload.result`; workflow tests updated to new contract.
  - `resume_audit`: RESOLVED — `ResumeAuditEntryPoint.tsx` fetches and renders persisted history via `getAuditHistory()`; history panel added below action button.
  - `/asset-library`: RESOLVED — `App.tsx` comment updated; route explicitly marked support-only (intentionally NOT promoted); distinct from `/welcome` and `/documents`.
  - Ingestion: active career-ingestion callers now converge on `/api/v1/ingest`; specialized artifact and smart-ingestion endpoints remain intentionally separate.
  - API convergence (2026-03-18): Quick Apply, Analysis, Evidence upload, redline upload, Jobs/Opportunities/Profile flows now call the service-client wrappers (`workflowService`, `analysisService`, `ingestion.service`, `documentService`); shared `axiosInstance` keeps auth/error handling centralized. Verification pack (`scan-routes.ts`, `scan-screens.ts`, `detect-orphans.ts`, `tools/ci/check-route-integrity.ts`, `tools/ci/check-screen-pairs.ts`, `cd frontend && yarn type-check`) reran after each slice and stays green.
- **Identity Gates**:
  - Complete: `/analysis` (`identity_pass`), `/dashboard` (`identity_pass_with_rewrites`), `/` (`identity_pass`).
  - Complete: `/opportunities` (`identity_pass_with_rewrites`)
  - Complete: `/tracker` (`identity_pass_deferred_verification` due to gRPC hang; seeded via REST API).
- **Shared Primitives**:
  - `Logo`: Canonical TSX present and used by `Sidebar`.
  - `Sidebar`: Token-compliant; Zero-Flora violations removed.
  - `KrDarkDock`: Canonical nav — authoritative.
  - `Footer`: Canonical component adopted by the authoritative migrated shell (`MigratedRouteLayout`).
  - Placeholder UI primitives removed from `frontend/src/components/ui/` (icon-badge, chart, collapsible, table), leaving the shared `frontend/packages/ui` exports as the canonical implementation.

### Phase 4: Shell Integration & Asset Alignment

- **Logo Component**: `COMPLETE`. Canonical TSX exists and is mounted in `Sidebar`.
- **Shell Promotion**: `COMPLETE`. Canonical shell mix is now 14 migrated + 1 protected + 4 public.

### Phase 5: API Convergence & Closeout

- **Shared clients**: `workflowService`, `analysisService`, `ingestion.service`, and `documentService` now sit behind every production route that was still hitting `fetch`. The shared `axiosInstance` manages auth, error logging, and interceptors.
- **Verification reruns**: After each client migration chunk the following remained green: `scan-routes.ts`, `scan-screens.ts`, `detect-orphans.ts`, `tools/ci/check-route-integrity.ts`, `tools/ci/check-screen-pairs.ts`, and `cd frontend && yarn type-check`.
- **Next steps**: Sync PM artifacts with this wiring progress (route matrix, blueprint, status) and capture the still-blocked `/tracker` Firebase verification evidence before final gate closure.

### Known Blockers

| ID | Component | Severity | Status | Mitigation / Next Action |
|---|---|---|---|---|
| B1 | `workflow_orchestration` | `High` | `RESOLVED` | `ApplyQuick.tsx` → `POST /api/workflows/generate-application`; result returned inline; tests updated. |
| B2 | `resume_audit` history | `Medium` | `RESOLVED` | `ResumeAuditEntryPoint.tsx` renders history panel via `getAuditHistory()`; wired to `GET /api/resume-audit/history`. |
| B3 | `/analysis` vs `/asset-library` ownership | `Medium` | `RESOLVED` | `App.tsx` comment clarifies support-only intent; asset-library explicitly NOT promoted; separate from pending design-parity routes. |
| B4 | `ingestion contract convergence` | `High` | `RESOLVED` | Active career-ingestion callers now use `/api/v1/ingest`; artifact upload and smart-ingestion remain specialized scopes. |
| B5 | `/tracker` env verification | `Medium` | `PARTIALLY_UNBLOCKED` | Backend applications CRUD is real and API tests pass, but this review did not rerun live Firebase/Firestore verification against a running local stack. |
| B6 | `Footer shell adoption` | `Low` | `RESOLVED` | Canonical `Footer` is adopted by `MigratedRouteLayout`. |
| B7 | `fetch ⇒ service client cleanup` | `Low` | `RESOLVED` | Jobs/Opportunities/Profile/analysis/ingestion flows now use the shared API services; verification scripts reran cleanly after each slice. |

### Execution Skill Matrix (Phase 4 Finalization)

| Role | Skill | Action |
|---|---|---|
| **Governor** | `design-orchestration` | Run after each major refinement and before execution gate. |
| **Design Validator** | `careercopilot-design-critique` | Audit routes before shell promotion; gate on ≥90/100 score. |
| **Brand Enforcer** | `kerala-rage-brand-enforcer` | Remediate token compliance and Zero-Flora violations. |
| **Scaffolder** | `blueprint` | Invoke `/blueprint` to generate step-by-step construction tasks. |
| **Tracker** | `project-manager` | Update this document and dashboard after completion. |

## Current gate state

- Step 3a — `/tracker` CRUD: `COMPLETE_DEFERRED_VERIF` (seeded via REST; verified logic; gRPC blocker documented).
- Phase 4 — Route Gating: `IN_PROGRESS` (`/analysis`, `/dashboard`, `/`, `/opportunities` checked in; `/tracker` blocked on environment evidence).
- Step 6B — Feature Finalization: `COMPLETE` (All 6 routes gated; 4 routes shell-promoted 2026-03-17).
- Shell Promotion — B3: `COMPLETE` (14 canonical routes on `MigratedRouteLayout`; 1 canonical holdout remains on `ProtectedLayout`).
- Migration closeout blocker set: `RESOLVED` (2026-03-17) — all four blockers fully addressed. B4 (ingestion) converged; B1/B2/B3 frontend-wired and tests updated. Remaining: B5 `/tracker` Firebase env only.

---
*Status refreshed: 2026-03-17 (route-complete closeout — B5 Firebase env remains)*
