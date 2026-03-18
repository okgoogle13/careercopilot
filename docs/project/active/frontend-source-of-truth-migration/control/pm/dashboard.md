# PR126 Migration Dashboard

Execution truth:
- `control/blueprint.md`
- `control/workflow.md`

Planning narrative:
- `control/blueprint.md`

Evidence inputs (advisory only):
- `docs/manifests/routes.json`
- `docs/manifests/screens.json`
- `docs/manifests/frontend-api-usage.json`
- `docs/manifests/backend-endpoints.json`
- `docs/manifests/orphans.json`

## Current Phase

- **Shell Promotion COMPLETE + Phase 5 (API convergence) ACTIVE; program closeout still IN_PROGRESS (2026-03-18)** — `/welcome` and `/documents` were promoted into the canonical migrated shell; `/asset-library` remains the only intentional legacy-shell holdout (support-only). Canonical shell state is now 14 migrated + 1 protected + 4 public, and the runtime preserves 7 explicit legacy redirect paths in `App.tsx`. API wiring now funnels all jobs, opportunities, profile, ingestion, analysis, and quick-apply flows through the shared `frontend/src/api/*Service` layer, so PM gate metrics now need a final artifact refresh.
- Evidence-weighted completion: approximately 90% — route ownership, shell promotion, and `/opportunities` closure are aligned, tracker backend CRUD is real, and ingestion convergence is substantially improved. However, `workflow_orchestration` and `resume_audit` history remain only backend-complete, while `/analysis` vs `/asset-library` cleanup and live tracker verification are still open.

## Recent Progress

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
- All 12 build contracts now validate: 12/12 pass `build_contract.xsd`
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
- CI integrity: route integrity clean, 11/11 screen pairs aligned, 18/18 pytest governance tests pass, governance artifacts valid.
- Governance readiness: `pytest tests/plans -q` → 18 passed; `validate-governance-artifacts.mjs` → ok.

## Recent Progress (2026-03-17)

- Shell promotion complete: `/welcome` and `/documents` moved to `MigratedRouteLayout`. Canonical layout mix: migrated 14 · protected 1 · public 4. Reachable runtime paths total 26 because 7 legacy redirects are explicitly preserved in `App.tsx`.
- Route-owner cleanup complete for the two remaining live `pages/` mounts:
  - `/analysis` → `frontend/src/features/analysis/AnalysisPage.tsx`
  - `/apply/quick` → `frontend/src/features/applications/ApplyQuick.tsx`
- `frontend/src/routes.tsx` retired; `frontend/src/App.tsx` is now the sole router authority.
- `MigratedRouteLayout.tsx` viewMap extended for `/opportunities` (`KrDark-feed`) and `/job-queue` (`overview`).
- Tri-layer truth scripts rerun: route integrity clean, 26 reachable paths scanned (`19` canonical routes + `7` redirects), 11/11 screen pairs, 18 governance tests pass.
- Gap-fill plan run for `/opportunities` and `/tracker` — findings saved to `tmp/migration/`.
- `remaining-route-plan.md` created: `analysis/remaining-route-plan.md`.
- `App.tsx` updated: migrated shell is authoritative for all canonical routes except `/asset-library` (support-only) which remains on `ProtectedLayout`.

## Nested Tasks Added (2026-03-17)

- **TSX Identity Gate** for `/tracker`: blocked on live env evidence.
- **Shared-shell cleanup**: `Footer` adoption is now complete in `MigratedRouteLayout`.
- **AuthGuard B3**: replace `bg-[#1A1714]` with semantic token (App.tsx:72).
- **`/documents` Step 3d**: redline workspace — requires Step 3d execution.

## Next Gates

- Step 3a `/tracker`: BLOCKED on Firebase/Firestore — see `analysis/remaining-route-plan.md §4` for exact env config and validation steps.
- AuthGuard token: `App.tsx:72` — deferred, non-critical.

## Capability Blockers — ALL RESOLVED (2026-03-17)

| Blocker | Resolution |
|---------|-----------|
| `workflow_orchestration` | `ApplyQuick.tsx` → `POST /api/workflows/generate-application`; full `analyzeJobFromUrl` pipeline delegated; result returned inline; tests updated to auth-required + 200 contract. |
| `resume_audit` history | `ResumeAuditEntryPoint.tsx` renders persisted history panel via `getAuditHistory()`; wired to `GET /api/resume-audit/history`. |
| `/analysis` vs `/asset-library` | `App.tsx` route comment explicit: support-only, intentionally NOT promoted; separate from pending design-parity routes. |
| Ingestion client fragmentation | `ResumeUploader.tsx` → `/api/v1/ingest`; artifact upload + smart-ingestion specialized scopes unchanged. |

## Remaining Open Items

- `/tracker` closeout: BLOCKED on Firebase/Firestore env. `FIREBASE_PROJECT_ID` absent from `backend/.env`. Requires `FIREBASE_PROJECT_ID=careercopilot-468811` + Firestore service account. See `analysis/remaining-route-plan.md §4`.
- Footer shell adoption: `RESOLVED` (adopted by `MigratedRouteLayout`).
- AuthGuard B3: `App.tsx:72` `bg-[#1A1714]` → semantic token (deferred, non-critical).
- PM artifact refresh: update `status.md`/`blueprint.md`/`route-matrix.md` to cite API convergence and note outstanding `/tracker` env evidence before closing the book.

## Next Actions

1. Step 3a `/tracker`: set `FIREBASE_PROJECT_ID=careercopilot-468811` in `backend/.env`, start backend, verify `GET /api/applications/`, capture populated board screenshot ≥90.
2. Wire canonical `Footer` into `MigratedRouteLayout` during the next shell pass.
3. AuthGuard semantic token fix (`App.tsx:72`).
