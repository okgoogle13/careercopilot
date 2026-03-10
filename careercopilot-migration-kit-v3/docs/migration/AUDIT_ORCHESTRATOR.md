# Audit Orchestrator

## Purpose

This runbook defines the canonical audit workflow for migrated screens in `careercopilot-migration-kit-v3`.

Canonical public skill:
- `.claude/skills/migration-audit/SKILL.md`

It distinguishes:
- structural compliance
- visual quality
- asset correctness
- UX copy quality

## Benchmark

- Benchmark id: `auth-benchmark-v1`
- Benchmark class: auth screen
- Intended use: `/login` and `/register` quality comparison
- Benchmark id: `dashboard-benchmark-v1`
- Benchmark class: dashboard screen
- Intended use: `/dashboard` quality comparison

The benchmark is the gold standard for:
- shapes
- colour
- motion
- typography
- M3 Expressive quality
- asset usage and placement
- proportions
- anti-slop distinctiveness
- UX copy

## Input Contract

Required:

```yaml
target: /login | /register | /dashboard | <screen-path>
kit_root: careercopilot-migration-kit-v3
audit_mode: full | code_only | visual_only | benchmark_only
benchmark_id: auth-benchmark-v1 | dashboard-benchmark-v1
```

Optional but auto-resolvable:

```yaml
screenshots:
  default?: string
  focus?: string
  error?: string
wireframe_artifact?: string
asset_context?: object
route_context?: object
copy_context?: object
```

## Screenshot Acquisition

If screenshots are not provided, obtain them automatically using:

- `frontend/tests/e2e/visual/visual-audit.spec.ts`

The audit must:
1. resolve the migration-kit base URL
2. capture the target route screenshot(s)
3. record the output directory under `frontend/docs/design/generated/previews/`

## Scoring

Overall thresholds:
- `pass`: score `>= 90` and no critical violations
- `needs_refinement`: score `75-89` or any high-severity violations
- `fail`: score `< 75` or any critical violations

Dimension weights:
- Typography: 12
- Shapes/archetypes: 12
- Colour/token compliance: 12
- Motion/expressive interaction intent: 8
- M3 Expressive quality: 12
- Asset usage/placement: 16
- Proportions/layout hierarchy: 10
- Anti-slop distinctiveness: 8
- UX copy: 10

## Canonical Sub-Skills

Run in this order:
1. `migration-audit`
2. `token-enforcement`
3. `asset-placement-strategy`
4. `manifest-reconciler`
5. `component-visual-audit`
6. `m3-visual-audit`
7. `kerala-rage-typography-strategy`
8. `m3-anti-slop-validator`
9. `ux-copy-writer`
10. `kr-solidarity-brand-enforcer` when needed

## Follow-ons Below 90

If the score is below 90:
- emit at least one command
- emit at least one manual task
- emit at least one next-skill handoff

Typical follow-ons:
- `ux-copy-writer` when CTA/helper/error copy is weak
- `asset-placement-strategy` when asset composition or slot use is wrong
- `manifest-reconciler` when manifest or path integrity is broken
- `component-visual-audit` or `m3-visual-audit` rerun after fixes

For `/dashboard` specifically:
- use `benchmark_id: dashboard-benchmark-v1`
- still require full structural and visual evidence

## Parallel Mode

When multiple targets are being audited, use `sprint-coordinator` as the control plane.

Parallel child tasks:
- route resolution
- screenshot acquisition
- migration audit
- token enforcement
- asset placement
- manifest reconciliation
- UX copy audit

Blocked on screenshots:
- component visual audit
- page visual audit
- anti-slop review
