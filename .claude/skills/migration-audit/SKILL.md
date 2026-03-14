---
name: migration-audit
description: Run deterministic migration quality audits for this repo's frontend source-of-truth migration.
commands:
  - /migration-audit
  - /audit-migration
  - /ma
metadata:
  version: 2.1.0
  tags:
    - migration
    - audit
    - orchestrator
    - benchmark
---

# Migration Audit

## Purpose

Audit one migrated route or wireframe-backed surface and produce a single report that separates structural correctness from visual quality.

For this repository, use the active migration workspace under:

- `docs/project/active/frontend-source-of-truth-migration/control/`
- `docs/project/active/frontend-source-of-truth-migration/contracts/`

This skill is execution support, not planning truth.

## Allowed Use

- audit route/runtime/design/capability alignment after the owner route is already defined in `control/route-matrix.json`
- audit wireframe-backed routes only after `scripts/validate-wireframe-workflow.py` has passed or been explicitly reviewed
- use as evidence for readiness on routes that already have a named benchmark

## Blocked Use

- do not use this skill to decide canonical route ownership
- do not use derived artifacts to override runtime truth, design truth, or capability truth
- do not audit non-auth routes without a named benchmark target
- do not treat this skill as a substitute for `control/fit-for-purpose.md`

## Benchmarks

- default benchmark: `auth-benchmark-v1` for `/login` and `/register` only
- every non-auth route must name its own benchmark before this skill is used against it
- `/tracker`, `/career/ingest`, `/documents`, and `/profile` remain benchmark-dependent

## Inputs

- target route or screen
- benchmark id when required
- optional screenshot paths
- canonical control docs:
  - `control/blueprint.md`
  - `control/route-matrix.json`
  - `control/gap-map.json`
- optional route-level contract docs from `contracts/`

## Workflow

1. Confirm the route owner and target state in `control/route-matrix.json`.
2. Confirm the capability owner in `control/gap-map.json` when applicable.
3. If wireframes are in scope, run or review `scripts/validate-wireframe-workflow.py`.
4. Run `token-enforcement`.
5. Run visual/design checks only after structural inputs are trusted.
6. Return an audit result with evidence and explicit blockers.

## Evidence Sources

- runtime truth: `frontend/src/App.tsx` and mounted route owners
- design truth: `frontend/src/screens/**/*.wireframe.xml`
- capability truth: `backend/app/api/endpoints/`
- support truth: active migration docs under `docs/project/active/frontend-source-of-truth-migration/`

## Output Expectations

Report:

- route audited
- benchmark used
- evidence files checked
- pass / needs_refinement / fail
- blocking issues
- follow-up commands

## Operator Notes

- prefer repo-root commands
- if benchmark coverage is missing, stop and report that instead of guessing
- if the route is still mock-backed, report that as an execution blocker, not a planning decision
