# Scripts Index

Run all commands from repo root.

## Migration control scripts

`python3 scripts/validate-wireframe-workflow.py`
- Validates canonical wireframes against:
  - `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
  - `docs/project/active/frontend-source-of-truth-migration/control/gap-map.json`
- Writes: `tmp/migration/wireframe-workflow-report.json`

`python3 scripts/derive-gap-fill-plan.py --route-id <route-id> --build-contract <contract.xml>`
- Derives tokens-first reuse/build guidance for one route
- Default output:
  - `tmp/migration/<route-id>-gap-fill-plan.json`

`python3 scripts/scaffold-from-contract.py --build-contract <contract.xml> --supplementary-briefs <briefs.xml>`
- Scaffolds TSX/test stubs from a route build contract
- Typical inputs:
  - `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-tracker.xml`
  - `docs/project/active/frontend-source-of-truth-migration/contracts/tracker-supplementary-component-briefs.xml`

## Output conventions

- Checked-in canonical migration artifacts live under:
  - `docs/project/active/frontend-source-of-truth-migration/control/`
  - `docs/project/active/frontend-source-of-truth-migration/contracts/`
- Ephemeral reports live under:
  - `tmp/migration/`
