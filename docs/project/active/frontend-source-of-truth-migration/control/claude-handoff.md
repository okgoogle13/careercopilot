# Claude Handoff — PR126 Migration Workflow

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

Current state:
- Step 3a `/tracker` route logic is fixed (canonical API path restored, retry logic optimized); closeout is blocked only by local Firebase/Firestore environment convergence.
- **Environment Evidence**:
  - Valid Firebase tokens for `careercopilot-468811` verify successfully on `:8001`.
  - Stale backend on `:8000` lacks project config.
  - CRUD operations (`GET /api/applications/`) are pending a working Firestore backend run.
- Step 6A is complete.
- Step 6B is mostly complete; `/opportunities` remains the open route-family item.
- Step 4 audit coverage now spans all 7 Figma pages plus a dedicated shared-shell audit.
- Figma-informed closure is still blocked by missing TSX identity-gate artifacts for `/analysis`, `/dashboard`, and `/`.

Immediate next actions:
1. Record TSX identity-gate artifacts for `/analysis`, `/dashboard`, and `/`, or explicitly downgrade those routes from closed to gated.
2. Explicitly complete or defer `/opportunities` so Step 6B can close honestly.
3. **Restore `/tracker` environment**:
   - Backend requirements: `FIREBASE_PROJECT_ID=careercopilot-468811`, `GOOGLE_APPLICATION_CREDENTIALS` (service account with Firestore permissions).
   - Validation steps: Generate a fresh Firebase ID token, verify `GET /api/applications/` returns data, and capture high-fidelity browser screenshots of the Kanban board.
   - Evidence check: See `analysis/2026-03-16-tracker-live-session-closeout.md` for the latest session logs and API fixes.

Shell rules:
- Do not silently redefine sidebar/logo/header/footer/layout ownership.
- Use the shared-shell audit before any shell-affecting route work.
- `Ingestion` is a structural outlier and must not be forced into the sidebar shell.
