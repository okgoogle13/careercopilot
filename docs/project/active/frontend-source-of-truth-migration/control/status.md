# Migration Status

**Program:** PR126 frontend source-of-truth migration
**Status:** Active
**Current phase:** Step 3a `/tracker` implementation refinement — BLOCKED on local Firebase/Firestore environment
**Execution truth:** `control/blueprint.md`

## Current Progress Metrics (Tri-Layer Truth)

| Dimension | Metric | Status |
|-----------|--------|--------|
| **Runtime Truth** | 19/19 routes reachable | ✅ CLEAN |
| **Design Truth** | 11/11 screen pairs aligned | ✅ CLEAN |
| **Capability Truth** | 10/10 backend modules | 🟡 85% Saturation Target |
| **PM Governance** | 12/12 build contracts valid | ✅ VALID |
| **Total Migration** | ~90% Complete | 🟡 Final Closeout Pending |

## Current state

- **Scan Results (2026-03-17)**:
  - `node --import tsx tools/ci/check-route-integrity.ts` -> route integrity clean (19 routes).
  - `node --import tsx tools/ci/check-screen-pairs.ts` -> all 11 screens correctly paired.
  - `python3 scripts/derive-gap-fill-plan.py` -> identifies `/opportunities` styling as "Dirty" (requires archetype swaps).
- **Identity Gates**:
  - Gated: `/analysis`, `/dashboard`, `/`. Artifacts verified in `analysis/`.
  - Pending: `/opportunities` (deferred capability), `/tracker`.
- **Shared Primitives**:
  - `Logo`: Remediated (Compass symbol).
  - `Sidebar`: Token-compliant; Zero-Flora violations removed.
  - `AuthGuard`: Token violation in `App.tsx:71` (deferred).
### Phase 4: Shell Integration & Asset Alignment (IN PROGRESS)

- **Logo Component**: `DEFERRED`. Missing canonical TSX. Zero-Flora violation in legacy.
- **AuthGuard Color**: `DEFERRED`. Token violation in hardcoded surface color.
- **Shell Promotion**: `NEW / BLOCKED`. Routes currently persist legacy sidebar. Promotion tasks added to Completion Plan.

### Known Blockers

| ID | Component | Severity | Status | Mitigation / Next Action |
|---|---|---|---|---|
| B1 | `/tracker` | `Critical` | `BLOCKED` | Evidence packet collected. Resolve Firestore connectivity. |
| B2 | `/opportunities` | `High` | `DEFERRED` | Archetype swaps (`Pebble` -> `Strike`) pending in next phase. |
| B3 | `App Layout` | `Medium` | `IN_PROGRESS` | **Shell Promotion**: Replace `ProtectedLayout` with `MigratedRouteLayout`. |

### Execution Skill Matrix (Phase 4 Finalization)

| Role | Skill | Action |
|---|---|---|
| **Governor** | `design-orchestration` | Run after each major refinement and before execution gate. |
| **Scaffolder** | `blueprint` | Invoke `/blueprint` to generate step-by-step construction tasks. |
| **Tracker** | `project-manager` | Update this document and dashboard after completion. |
- **Diagnostic Packet**:
    - **Error**: `401 Unauthorized` on `:8000` (missing project config).
    - **Error**: `Stalled Read` on `:8001` (Firestore connectivity timeout).
    - **Affected Path**: `GET /api/applications/`.
    - **Evidence Required**: Populated Kanban screenshot with score >= 90.

## Current gate state

- Step 3a — `/tracker` CRUD implementation: `IN_PROGRESS` (logic verified; env blocked).
- Phase 4 — Route Gating: `COMPLETE` (Identity gates for landing, dashboard, analysis checked in).
- Step 6B — Feature Finalization: `COMPLETE` (All 6 routes gated).

---
*Status refreshed: 2026-03-17*
