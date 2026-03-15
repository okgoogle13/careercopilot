# AGENTS.md — Frontend Source-of-Truth Migration (PR126)

This file is the migration-specific agent guide. It complements the repo-root `AGENTS.md` and only applies to PR126 migration work.

## Execution Truth

- `control/blueprint.md`
- `control/workflow.md`
- `control/status.md` (status only, not execution authority)

## Authority Layers

- **Design truth**: `frontend/src/screens/**/*.wireframe.xml` plus paired `frontend/src/screens/**/*.tsx`
- **Runtime truth**: `frontend/src/features/**` and `frontend/src/pages/**` reachable from `frontend/src/App.tsx`
- **Capability truth**: mounted backend endpoints (`backend/app/api/endpoints/`) and build contracts in `contracts/`
- **Derived artifacts**: route-matrix and gap-map JSON, migration-kit wireframes (support-only)

## Canonical Inputs

- `control/route-matrix.json`
- `control/gap-map.json`
- `contracts/*.xml`
- `frontend/src/screens/**/*.wireframe.xml`
- `frontend/src/App.tsx`
- `backend/app/api/endpoints/`

## Gates & Validation (Follow `control/workflow.md` for order)

- `pytest tests/plans -q`
- `node frontend/scripts/validate-governance-artifacts.mjs`
- `python3 scripts/validate-wireframe-workflow.py`
- `bash .claude/skills/token-enforcement/scripts/run-token-enforcement.sh <route>`
- `bash .claude/skills/migration-audit/scripts/run-migration-audit.sh <route>`

## Advisory Protocols

Gemini-updated skills and orchestration notes are **advisory only**. They do not override authority layers or gate ownership. Human direction is required for migration decisions.

## Working Rules

- Treat `control/` as canonical unless a file explicitly says otherwise.
- Treat `analysis/` as reference input only.
- Do not let derived artifacts override runtime, design, or capability truth.
- Keep validator output in `tmp/migration/`.
