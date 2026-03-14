# Frontend Source-of-Truth Migration

This folder is the canonical home for the active PR126 migration control system.

Start here:
- `control/blueprint.md` — execution blueprint and dependency graph
- `control/status.md` — current phase, active blockers, next actions
- `control/workflow.md` — deterministic script and gate sequence
- `control/tracker-step-3a-execution-packet.md` — first `/tracker` stub-generation packet
- `control/route-matrix.json` — route ownership truth for migration work
- `control/gap-map.json` — backend capability to frontend surface mapping

Current execution handoff:
- next active route: `/tracker` (Step 3a)
- non-auth benchmark creation is deferred unless `migration-audit` is intentionally used as an immediate gate

Structure:
- `control/` — canonical living docs and control artifacts
- `contracts/` — build contracts, supplementary briefs, contract-generation prompt
- `analysis/` — comparative notes and supporting analysis, not execution truth
- `history/` — reserved for superseded snapshots and archived migration notes

Support artifacts (support-only, not execution truth):
- `docs/design/architecture-migration.png` — current vs target component architecture lanes
- `docs/design/layered-component-blueprint.json` — layered inventory snapshot for reference
- `frontend/component-inventory.json` — inventory report derived from `frontend/scripts/component-inventory.ts`

Primary scripts:
- `scripts/validate-wireframe-workflow.py`
  - validates canonical wireframes against `control/route-matrix.json` and `control/gap-map.json`
  - writes `tmp/migration/wireframe-workflow-report.json`
- `scripts/derive-gap-fill-plan.py`
  - produces tokens-first route reuse/build guidance
  - writes `tmp/migration/<route-id>-gap-fill-plan.json`
- `scripts/scaffold-from-contract.py`
  - scaffolds files from `contracts/build-contract-tracker.xml`

Run from repo root:

```bash
python3 scripts/validate-wireframe-workflow.py
python3 scripts/derive-gap-fill-plan.py --route-id tracker --build-contract docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-tracker.xml
python3 scripts/scaffold-from-contract.py --build-contract docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-tracker.xml --supplementary-briefs docs/project/active/frontend-source-of-truth-migration/contracts/tracker-supplementary-component-briefs.xml --dry-run
```

Rules:
- Treat `control/` as canonical unless a file explicitly says otherwise.
- Treat `analysis/` as reference input only.
- Do not use derived artifacts to override runtime truth, design truth, or capability truth.
- Keep ephemeral validator output in `tmp/migration/`.
