# Skill / Agent Matrix

This matrix reflects the active harvest-safe automation stack.

## Harvest Core

| Surface | Type | Purpose | Used By |
|---|---|---|---|
| `prototype-harvest-manager` | agent | orchestrate harvest review, planning, and sequencing | user, controller sessions |
| `blueprint` | skill | produce harvest-aware execution plans | `prototype-harvest-manager` |
| `subagent-driven-development` | skill | execute bounded `prototype_support_only`, `harvest_prep`, or `canonical_port` tasks | `prototype-harvest-manager` |
| `frontend-cleanup-manager` | agent | review shell drift, support-only boundaries, and harvest readiness | `prototype-harvest-manager`, direct review requests |
| `systematic-debugging` | skill | break/fix workflow for prototype or canonical regressions | all implementation sessions |

## Canonical Port Gates

| Skill | Purpose | Use Window |
|---|---|---|
| `token-enforcement` | enforce KR token and copy hygiene | after implementation touches canonical route code |
| `migration-audit` | audit route/runtime/design/capability alignment | only when benchmark and workflow conditions are met |
| `route-migration` | route cutover and lifecycle gate | late-stage canonical route promotion |

## Supporting Skills

| Skill | Purpose |
|---|---|
| `jest-test-scaffolder` | frontend unit test scaffolding |
| `pytest-test-scaffolder` | backend unit test scaffolding |
| `api-contract-validator` | frontend/backend contract validation |
| `frontend-backend-mapper` | endpoint and caller discovery |

## Removed From Active Discovery

- `react-component-scaffolder`
- `react-page-scaffolder`
- `figma-to-page`
- `baseline-ui`
- `migration-audit-orchestrator`
- `frontend-migration`

These were removed because they were deprecated, placeholder-only, page-scaffold biased, or structurally incompatible with the current harvest workflow.
