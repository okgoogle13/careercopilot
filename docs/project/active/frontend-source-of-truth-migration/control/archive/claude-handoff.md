# Migration Closeout Handover: Remaining Real Blockers

Read first:
- `docs/project/active/frontend-source-of-truth-migration/control/status.md`
- `docs/project/active/frontend-source-of-truth-migration/control/pm/dashboard.md`
- `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`
- `docs/project/active/frontend-source-of-truth-migration/control/workflow.md`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-tracker-live-session-closeout.md`

Figma MCP execution inputs:
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-figma-mcp-inventory-and-accelerators.md`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-figma-shared-shell-audit.md`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-landing.md`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-dashboard.md`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-analysis.md`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-opportunities.md`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-applications.md`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-ingestion.md`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-account.md`

Execution rules:
- Keep `control/blueprint.md` and `control/workflow.md` as execution truth.
- Treat Figma MCP and consolidated-reference outputs as support-only.
- Allowed Figma acceleration:
  - draft build-contract inputs
  - draft wireframe diffs
  - scaffold-injection pilots for shell decomposition only
- Blocked:
  - direct Figma TSX promotion
  - backend/schema generation from Figma labels
  - token authority from Figma variables

Current truth (2026-03-18):
- `genkit_job_analysis` is complete in capability truth. `/apply/quick` is the canonical execution owner; `/opportunities` is support-only. Do not reopen this blocker.
- Step 6A: complete.
- Step 6B: complete (including `/opportunities` route-matrix closure). Archetype swaps on `Opportunities.tsx` are complete.
- Shell promotion is complete for `/onboarding`, `/ksc-generator`, `/cover-letter-generator`, `/job-queue`, and the migrated shell now also owns `/welcome` and `/documents`. Canonical layout mix: migrated 14 · protected 1 · public 4, with 7 explicit legacy redirect paths preserved in `App.tsx`.
- Tri-layer scripts last known clean: route integrity clean; runtime scan shows 26 reachable paths (`19` canonical routes + `7` redirects); 12/12 screen pairs; 18/18 governance tests.
- `/tracker` route logic is fixed but live closeout is still blocked on Firebase/Firestore env evidence.

Remaining real blockers:
1. `workflow_orchestration` remains placeholder-only in backend capability truth.
2. `resume_audit` history remains deferred.
3. `/analysis` vs `/asset-library` ownership boundaries still need cleanup.
4. Ingestion clients remain fragmented across `/api/v1/ingest`, `/api/career/ingest`, `/api/ingest/artifacts/upload`, and `/api/ingestion/*`.

Implementation targets:
1. Add real `POST /api/workflows/generate-application` + `GET /api/workflows/status/{workflow_id}` support for `/apply/quick`.
2. Add `GET /api/resume-audit/history` and wire `/analysis` to persisted history.
3. Keep `/asset-library` as a support route only; remove orphan/parallel-product ambiguity in runtime and docs.
4. Converge user-facing career-ingestion clients on `/api/v1/ingest`; keep artifact upload specialized.
5. After implementation, reconcile:
   - `control/route-matrix.md`
   - `control/gap-map.json`
   - `control/status.md`
   - `control/pm/dashboard.md`
   - `analysis/remaining-route-plan.md`

Execution order:
1. Ingestion convergence
2. Resume audit history
3. Workflow orchestration MVP
4. `/analysis` vs `/asset-library` boundary cleanup
5. PM artifact reconciliation

Verification required:
- `cd frontend && yarn type-check`
- targeted backend pytest slices for workflows, resume audit, and ingestion APIs
- `node frontend/scripts/validate-governance-artifacts.mjs`
- `node --import tsx tools/ci/check-route-integrity.ts`

Non-goals:
- no full async queue/worker rollout
- no product expansion beyond MVP-real backend support
- no promotion of `/asset-library` to a first-class product pillar

Additional blocker:
- `/tracker` live verification still requires `FIREBASE_PROJECT_ID=careercopilot-468811` plus Firestore-capable credentials before final closeout evidence can be captured.

Shell rules:
- Do not silently redefine sidebar/logo/header/footer/layout ownership.
- Use the shared-shell audit before any shell-affecting route work.
- `Ingestion` is a structural outlier and must not be forced into the sidebar shell.
