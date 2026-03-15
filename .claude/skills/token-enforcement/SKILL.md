---
name: token-enforcement
description: Atomic enforcement gate for KR Solidarity token and copy hygiene in this repository.
chainable: true
gate_type: enforcement
lifecycle_stage: copy-cleared
depends_on: []
triggers: [visual-ready-gate]
json_io: true
---

# Token Enforcement

## Purpose

Check migrated frontend code for KR Solidarity token compliance and banned naming drift.

This skill applies to this repository's frontend code. Do not redirect operators into an external migration-kit workspace.

## Canonical Sources

- `frontend/src/design/tokens/tokens.json`
- `frontend/src/design/styles/design-tokens.css`

## Allowed Use

- validate migrated route code before marking a route ready
- validate component or page styling after migration edits
- provide a deterministic pass/fail signal for token hygiene

## Blocked Use

- do not use this as a substitute for visual audit
- do not create a second token source of truth
- do not apply migration-only rules to unrelated backend files or non-UI docs

## Enforcement Rules

Fail on:

- hardcoded `#hex`, `rgb(a)`, or `hsl(a)` values in migrated frontend code
- banned deprecated token names:
  - `labWrenMetalBlue`
  - `GumLeafGreen`
  - `WattleGold`
  - `inkGreen`
- banned archetype names in new migration code:
  - `Jar`
  - `Cabinet`
  - `Seed`
  - `Leaf`
- forbidden font drift such as `Inter`, `Roboto`, or `Arial`
- screen-level styling that bypasses:
  - `--sys-color-*`
  - `--sys-shape-*`
  - `--sys-type-*`

Allow:

- canonical token source files themselves
- generated/build output excluded from review scope
- migration docs that reference tokens descriptively without implementing styles

## Suggested Scope

Typical targets:

- `frontend/src/features/**/*.tsx`
- `frontend/src/pages/**/*.tsx`
- `frontend/src/components/**/*.tsx`
- route-specific styles touched during migration

## Operator Workflow

1. Identify the changed frontend files for the route or component.
2. Check them against the canonical token sources above.
3. Run the relevant repo-root verification commands already used by the team.
4. Return pass/fail with violating file paths and exact banned terms or literals found.

## Output Expectations

Return:

- status: `pass` or `fail`
- files checked
- violations
- re-check command

## Notes

- pair this with `migration-audit` when route readiness matters
- keep the result narrow and mechanical; this is a structural gate, not a design critique
