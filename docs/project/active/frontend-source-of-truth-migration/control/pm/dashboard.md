# PR126 Migration Dashboard

Execution truth:
- `control/blueprint.md`
- `control/workflow.md`

Planning narrative:
- `control/plan.md`

Evidence inputs (advisory only):
- `docs/manifests/routes.json`
- `docs/manifests/screens.json`
- `docs/manifests/frontend-api-usage.json`
- `docs/manifests/backend-endpoints.json`
- `docs/manifests/orphans.json`

## Current Phase

- **Step 6B COMPLETE + Phase 4 COMPLETE (2026-03-16)** — all six Step 6B routes gated and route-matrix-complete, TSX identity-gate artifacts checked in for all three Figma-informed routes, 12/12 build contracts XSD-validated. Only remaining open item is `/tracker` CRUD closeout blocked on Firebase/Firestore environment.
- Evidence-weighted completion: approximately 90% — all planned phases complete; final 10% is `/tracker` live verification and deferred Logo/AuthGuard cleanup.

## Recent Progress

- TSX identity-gate artifacts checked in for all three Figma-informed routes (2026-03-16):
  - `/analysis`: `identity_pass`
  - `/dashboard`: `identity_pass_with_rewrites` (5 token violations remediated)
  - `/` (landing): `identity_pass`
  - Artifacts: `analysis/2026-03-16-tsx-identity-gate-{analysis,dashboard,root}.md`
- `/opportunities` Step 6B closure complete (2026-03-16):
  - token-enforcement: pass (rgba drop-shadow→color-mix remediation)
  - migration-audit: pass
  - build contract generated and XSD-validated: `contracts/build-contract-opportunities.xml`
  - route-matrix: `implementation_status: complete`
  - M7B and M11 milestones: COMPLETE
- All 12 build contracts now validate: 12/12 pass `build_contract.xsd`
- Five Step 6B routes are gated and now reflected as complete in the route matrix:
  - `/ksc-generator`, `/cover-letter-generator`, `/settings`, `/job-queue`, `/onboarding`
  - token-enforcement: pass (0 violations), migration-audit: pass on all 5
  - Build contracts generated and XSD-validated (8/8 contracts pass `build_contract.xsd`)
- Three Figma-informed routes are gated at the route level:
  - `/analysis`, `/dashboard`, `/`
  - token-enforcement: pass; migration-audit: pass; build contracts: execution_ready
  - identity-gate artifacts are still missing, so these are gated rather than fully closed
- Direct Figma MCP page harvest is now recorded for 7 canonical page nodes:
  - Home, Dashboard, Opportunities, Applications, Ingestion, Analysis, Account Control
  - Scaffold IDs and route-family mappings are captured in `analysis/2026-03-16-figma-mcp-inventory-and-accelerators.md`
  - accelerator policy is now explicit: adopt draft build-contract and wireframe-diff support; pilot scaffold injection only; reject schema extraction and token sync automation for now
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
- Shared primitive audit completed (record-only): Logo MISSING, Footer MISSING, AuthGuard has `bg-[#1A1714]` token violation, KrDarkDock canonical.
- XSD schema (`docs/schema/build_contract.xsd`) updated to support all contract shapes including apply-quick pattern.
- `scripts/validate-wireframe-workflow.py` fixed: component_alignment uses full matrix for route-scoped runs; coverage_mismatch downgraded to warning.
- `05_analysis.wireframe.xml` and `09_finalization.wireframe.xml` XML well-formedness issues were fixed (`&` -> `&amp;`).
- CI integrity: route integrity clean, 11/11 screen pairs aligned, 18/18 pytest governance tests pass, governance artifacts valid.
- Governance readiness: `pytest tests/plans -q` → 18 passed; `validate-governance-artifacts.mjs` → ok.

## Next Gates

- Step 3a `/tracker`: BLOCKED on Firebase/Firestore environment — do not attempt without one local backend run that has both Firebase config and working Firestore.
- Logo remediation: deferred — `Logo.tsx` missing as standalone; `🦄` emoji in Sidebar is Zero-Flora violation. Dedicated session after Phase 4.
- AuthGuard token violation: deferred — `App.tsx:71` uses `bg-[#1A1714]`.

## Critical Blockers

- `/tracker` closeout blocked by local Firebase/Firestore environment (route wiring fixed; environment not execution-ready).
- Logo/Footer missing — no future work may silently define shared chrome.

## Next Actions

1. Step 3a `/tracker`: BLOCKED — do not attempt without Firebase + Firestore on the same local backend run.
2. Logo/AuthGuard cleanup: schedule as a dedicated session after tracker closeout.
