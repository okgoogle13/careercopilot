# Frontend Source-of-Truth Migration

This folder is the canonical home for the active PR126 migration control system while the migration remains in progress. The active closeout lane is now runtime-truth resync plus migration-workspace dissolution planning, not a new prototype-first build pass.

Start here:
- `AGENTS.md` — migration-specific agent guide (PR126 execution rules)
- `control/blueprint.md` — execution blueprint and dependency graph
- `control/status.md` — current phase, active blockers, next actions
- `control/workflow.md` — deterministic script and gate sequence
- `control/pm/dashboard.md` — executive snapshot (phase, gates, blockers, next steps)
- `control/solution-requirements-tech-spec.md` — baseline product scope, route ownership, and traceability spec
- `control/AI-STUDIO-PROMPT-PACK.md` — detailed `B1-B19` Google AI Studio / Comet prompt pack for the prototype-first pass
- `control/comet-profile-voice-ownership-prompt-pack.md` — route-specific AI Studio / Comet prompt pack for `/profile` voice ownership
- `control/tracker-step-3a-execution-packet.md` — first `/tracker` stub-generation packet
- `control/route-matrix.json` — route ownership truth for migration work
- `control/gap-map.json` — backend capability to frontend surface mapping

Current execution lanes:
- Prototype-first AI Studio harvest prep is complete enough for remediation planning. Do not start a new prototype-first build pass unless COMET-specific blockers re-open.
- `/tracker` Step 3a closeout is blocked by the local Firebase/Firestore environment (`:8000` lacks Firebase config and `:8001` stalls on `/api/applications`), so leave Step 3a blocked unless the environment is restored.
- `/profile` Step 3c closeout is blocked by the same local Firebase/auth environment; route ownership is implemented, but live GET/POST verification is still required.
- Canonical harvest starts only after the prototype-wide pass is complete; do not treat `MIG-202` completion as an immediate harvest trigger.
- Step 6B + Phase 4 support-reference normalization remains downstream cleanup; use the approved audit packs for `landing`, `dashboard`, and `analysis` before consuming any Figma-derived assets, and run the TSX identity gate before closing any such route.
- `frontend-cleanup-manager` now owns the active PM closeout batches:
  - Batch A: route/runtime resync for `App.tsx`, `route-registry.ts`, `routes.json`, `route-matrix.json`, and `status.md`
  - Batch B/C: single-owner cleanup plus proof that no live runtime depends on migration-workspace artifacts
  - Batch D: destination-map publication and terminal archive/dissolution closeout for this folder

Structure:
- `control/` — canonical living docs and control artifacts
- `contracts/` — build contracts, supplementary briefs, contract-generation prompt
- `analysis/` — comparative notes and supporting analysis, not execution truth
- `history/` — reserved for superseded snapshots and archived migration notes

Support artifacts (support-only, not execution truth):
- `docs/design/architecture-migration.png` — current vs target component architecture lanes
- `docs/design/layered-component-blueprint.json` — layered inventory snapshot for reference
- `frontend/component-inventory.json` — inventory report derived from `frontend/scripts/component-inventory.ts`

Support-reference flow reminder:
- only honor the audit packs at `analysis/2026-03-16-support-reference-audit-{landing,dashboard,analysis}.md` as the governed path for Figma-derived behavior.
- treat `sources/consolidated-reference/**` as evidence, not authority; rewrite styling/assets/motifs unless the corresponding audit pack permits reuse, and always pass the late-stage TSX identity gate before closure.

Primary scripts:
- `scripts/validate-wireframe-workflow.py`
  - validates canonical wireframes against `control/route-matrix.json` and `control/gap-map.json`
  - writes `tmp/migration/wireframe-workflow-report.json` when run with `--json-out`
- `scripts/derive-gap-fill-plan.py`
  - produces tokens-first route reuse/build guidance
  - writes `tmp/migration/<route-id>-gap-fill-plan.json` when run with `--json-out` or by default
- `scripts/scaffold-from-contract.py`
  - scaffolds files from `contracts/build-contract-tracker.xml`

Run from repo root:

```bash
python3 scripts/validate-wireframe-workflow.py --json-out tmp/migration/wireframe-workflow-report.json
python3 scripts/derive-gap-fill-plan.py --route-id tracker --build-contract docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-tracker.xml --json-out tmp/migration/tracker-gap-fill-plan.json
python3 scripts/scaffold-from-contract.py --build-contract docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-tracker.xml --supplementary-briefs docs/project/active/frontend-source-of-truth-migration/contracts/tracker-supplementary-component-briefs.xml --dry-run
```

Rules:
- Treat `control/` as canonical unless a file explicitly says otherwise.
- Treat `analysis/` as reference input only.
- Do not use derived artifacts to override runtime truth, design truth, or capability truth.
- Keep ephemeral validator output in `tmp/migration/`.

## Terminal End State

This folder is not intended to remain a permanent second source of frontend truth.

The terminal closeout state is:
- canonical runtime code lives in `frontend/src/**`
- canonical shared components live in their final homes under `frontend/src/components/**`
- canonical design canon lives in `docs/design/**`
- route/runtime metadata is synchronized to the maintained app control artifacts
- no live frontend runtime imports from `docs/project/active/frontend-source-of-truth-migration/**`
- the remaining contents of this folder are either:
  - retained archive/history records, or
  - deleted because they were migration-only scaffolding

Until those conditions are met, treat this folder as active migration control only, not as a permanent parallel implementation tree.
