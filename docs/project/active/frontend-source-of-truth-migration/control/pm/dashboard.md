# PR126 Migration Dashboard

Execution truth:
- `control/COMET-MANIFEST.md`
- `control/AI-STUDIO-PROMPT-PACK.md`

Planning narrative:
- `control/status.md`
- `control/archive/route-matrix.md`
- `control/archive/implementation-backlog.md`

Evidence inputs (advisory only):
- `docs/manifests/routes.json`
- `docs/manifests/screens.json`
- `docs/manifests/frontend-api-usage.json`
- `docs/manifests/backend-endpoints.json`
- `docs/manifests/orphans.json`

## Current Phase

- **Migration closeout IN_PROGRESS (2026-03-24)** — shell promotion, route ownership cleanup, API convergence, and governed build-contract coverage are complete. Canonical shell state remains 14 migrated + 1 protected + 4 public, and the runtime preserves 7 explicit legacy redirect paths in `App.tsx`. The only program-level blocker is env-backed verification for `/tracker` and `/profile`.
- Evidence-weighted completion: approximately 97% — all governed build contracts now validate, the canonical gap-fill planner has been rerun for the priority routes, and the PM artifacts now reflect the real remaining work: environment verification plus bounded cleanup.

## Recent Progress

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
- `/profile` closeout: BLOCKED on Firebase/auth env. Requires the same local project configuration plus an authenticated verification pass against `GET/POST /api/v1/auth/voice-profile`.
- Footer shell adoption: `RESOLVED` (adopted by `MigratedRouteLayout`).
- AuthGuard B3: `App.tsx:72` `bg-[#1A1714]` → semantic token (deferred, non-critical).
- PM artifact refresh: `status.md`, `implementation-backlog.*`, and `remaining-route-plan.md` synced on 2026-03-24; keep `blueprint.md` task-status summary aligned during final closeout.

## Next Actions

1. Step 3a `/tracker`: set `FIREBASE_PROJECT_ID=careercopilot-468811` in `backend/.env`, start backend, verify `GET /api/applications/`, capture populated board screenshot ≥90.
2. Step 3c `/profile`: with the same env restored, verify authenticated `GET` and `POST /api/v1/auth/voice-profile`, then confirm `/profile` remains the visible runtime owner.
3. AuthGuard semantic token fix (`App.tsx:72`).
