# Claude Code Handover — Remaining Execution

> **Status:** Historical snapshot from 2026-04-18. Do not treat this handover as current execution guidance; use the active task board and current plans under `docs/project/active/` instead.

Use this session as archived context for the 2026-04-18 remaining-execution state.

Read first:
- `CLAUDE.md`
- `AGENTS.md`
- `TASKS.md`
- `docs/project/active/plans/2026-04-18-remaining-execution.md`
- `docs/project/active/figma-sync-order.json`
- `docs/project/active/figma-agent-tasks.md`
- `docs/design/01_CANON.md`
- `docs/design/02_SYSTEM.md`

Active working rules:
- `TASKS.md` is the only active task board.
- `docs/project/active/plans/` is the only active plan location.
- Do not recreate `docs/project/active/PROJECT_DASHBOARD.md`.
- Do not write active plans into `docs/superpowers/plans/`.

Current task queue from `TASKS.md`:
1. Complete `/style-guide` Figma reference frame
2. Implement CI/CD checks for Token/Design drift
3. Execute Broad Code Extraction & Sync

Waiting:
- Collapse redirect-history pages

Important current state:
- Shared shell anchors are already confirmed in the active Figma file `eoNJnwvDZ64OUgSthE20WW`.
- Canonical route node IDs and code-target node IDs are already recorded in `docs/project/active/figma-sync-order.json`.
- DOC-009 is partially repaired:
  - `V-001`, `V-006`, `V-007`, `V-010` are addressed
  - `V-004` remains blocked on canonical `/auth` background guidance because Gallery/Nocturnal is deprecated legacy design
- Stale secondary dashboard has been removed:
  - `docs/project/active/PROJECT_DASHBOARD.md`

Execution order:
1. Finish `/style-guide` in Figma and update `TASKS.md` + `figma-sync-order.json`
2. Add local/CI drift guardrails by extending the existing root Husky hook and existing `.github/workflows/ci.yml`
3. Execute broad route sync in batches:
   - public/auth
   - workflow
   - desktop canonical
4. Only then reopen redirect-history cleanup

Last Figma-side blocker:
- `/style-guide` Figma frame (Task 1) is the only remaining Figma-side work. Once it is complete, all subsequent work (guardrails + route sync) is repo-only and requires no further Figma authoring.

Guardrails:
- Do not use donor/generated code as implementation truth.
- Do not use deprecated Gallery/Nocturnal assets.
- Do not invent missing canonical assets.
- Do not create new shadow trackers or dashboard files.
- Only touch `App.tsx` / `route-registry.ts` when route exposure is actually wrong.

Verification expectations:
- `cd frontend && yarn type-check`
- `cd frontend && yarn lint`
- `python3 scripts/design-validation/validate-tokens.py`
- `node frontend/scripts/validate-governance-artifacts.mjs`

Start by:
- confirming `/style-guide` is the next executable blocker
- stating this is Figma-first work
- executing Task 1 from `docs/project/active/plans/2026-04-18-remaining-execution.md`
