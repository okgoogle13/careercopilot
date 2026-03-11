---
name: token-enforcement
description: Atomic enforcement gate for tokens and copy hygiene. Returns JSON pass/fail. Use in migration pipelines or standalone validation.
chainable: true
gate_type: enforcement
lifecycle_stage: copy-cleared
depends_on: []
triggers: [visual-ready-gate]
json_io: true
---

# Token Enforcement

## Objective

Keep migrated files aligned to KR Solidarity token canon and user-facing copy standards. Designed for batch processing and skill-chaining.

## Machine-Readable Mode

**JSON Input/Output**: See `references/JSON_CONTRACT.md`

```bash
# Single route validation with JSON output
cd careercopilot-migration-kit-v3
npm run verify -- --json > /tmp/token-gate-output.json
echo $?  # 0 = pass, non-zero = fail
```

## Prerequisites

- migration-kit commands are available in `careercopilot-migration-kit-v3`
- canonical token sources exist and are readable:
  - `frontend/src/design/tokens/tokens.json`
  - `frontend/src/design/styles/design-tokens.css`
- migration audit scope is already known or can be inferred from the target route/screen

## Best Practices

- run this before marking any migrated route ready
- use this together with `migration-audit`, not instead of it
- treat token cleanliness as structural compliance only; visual quality still needs screenshot-based audit
- prefer the wrapper script in `scripts/run-token-enforcement.sh` when you want repeatable operator behavior

## When to Use

- reviewing a migrated screen before marking it ready
- checking whether a style change introduced non-canonical values
- validating token compliance after route migration edits
- before marking a migrated screen `migrated-ready`
- when a screen passes code checks but still risks palette, archetype, or font drift

## Inputs

- migrated file paths
- canonical token source paths
- banned token list
- allowed token prefixes

## Outputs

- token compliance checklist
- invalid usage findings
- remediation guidance
- deterministic command sequence for re-checking after fixes

## Canonical Sources

The only allowed token sources for migration work are:

- `frontend/src/design/tokens/tokens.json`
- `frontend/src/design/styles/design-tokens.css`

Do not introduce a second token source of truth inside `careercopilot-migration-kit-v3`.

## References

- `references/ENFORCEMENT_RULES.md`
- `references/FAILURE_MODES.md`

## Execution Steps

1. Confirm the target files are inside the migration-kit scope, usually:
   - `apps/web/src/screens/**/*.tsx`
   - `apps/web/src/router/**/*.tsx`
   - related migration docs only when wording review is relevant
2. Confirm the only canonical sources are the two parent-repo token files above.
3. Check the target for disallowed style values:
   - hardcoded `#hex`
   - `rgb(...)` / `rgba(...)`
   - `hsl(...)` / `hsla(...)`
   - arbitrary Tailwind literals if present
4. Check for banned deprecated token names:
   - `labWrenMetalBlue`
   - `GumLeafGreen`
   - `WattleGold`
   - `inkGreen`
5. Check for banned deprecated archetype names in new migration code:
   - `Jar`
   - `Cabinet`
   - `Seed`
   - `Leaf`
6. Confirm style references use only:
   - `--sys-color-*`
   - `--sys-shape-*`
   - `--sys-type-*`
7. Re-run lint and design audit after remediation.

## Validation Logic

Treat these as failures:
- any raw color literal in migrated screen code
- any use of banned deprecated token names
- any use of banned archetype names in new migration code
- any screen-level style implementation that bypasses semantic token variables

Treat these as allowed:
- references to the canonical token source files themselves
- generated or documented examples that live outside migration code and are explicitly excluded by audit scope

## Rules Summary

Must fail on:
- hardcoded `#hex`, `rgb(a)`, `hsl(a)` values in migrated code
- banned deprecated tokens: `labWrenMetalBlue`, `GumLeafGreen`, `WattleGold`, `inkGreen`
- banned archetype names in new migration code: `Jar`, `Cabinet`, `Seed`, `Leaf`
- screen-level styling that bypasses `--sys-color-*`, `--sys-shape-*`, or `--sys-type-*`
- forbidden font family drift such as `Inter`, `Roboto`, or `Arial` introduced in migration code

Must allow:
- canonical token source files themselves
- excluded generated/build output
- migration docs that reference canonical token paths descriptively without implementing styles

## When to Chain

**Upstream Gates**: None (can run independently)

**Downstream Gates**:
- `visual-ready-gate` - Trigger after token-enforcement passes
- `migration-audit` - Orchestrator that calls this gate in sequence

**Batch Processing**:
```bash
# Validate multiple routes in parallel
for route in login register dashboard; do
  cd careercopilot-migration-kit-v3
  npm run verify -- --json > "/tmp/${route}-token-gate.json" &
done
wait

# Aggregate results
node tools/aggregate-gate-results.js /tmp/*-token-gate.json
```

**Skill Chain Example**:
```bash
# Migration orchestrator pattern
@route-migration /profile        # Generates scaffold, defines lifecycle
  → @token-enforcement /profile  # Gate 3: copy-cleared validation
  → @visual-audit /profile       # Gate 4: visual-ready validation
  → @migration-audit /profile    # Gate 5: migrated-ready final check
```

## How To Use

### Unified Verification (Recommended)

Run all 5 checks in one command:

```bash
cd careercopilot-migration-kit-v3
npm run verify
# Runs: lint + type-check + test + audit:copy + design-audit
# Exit code 0 = all pass, non-zero = failures detected
```

**JSON Mode** (for batch processing):

```bash
npm run verify -- --json
```

Output structure:
```json
{
  "lint": "pass",
  "type_check": "pass",
  "test": "pass",
  "audit_copy": { "status": "pass", "violations": 0 },
  "design_audit": { "status": "pass", "violations": 0 }
}
```

### Screen-level enforcement

Use this when reviewing a migrated route such as `/login` or `/register`.

```bash
cd /Users/okgoogle13/Projects/careercopilot/careercopilot-migration-kit-v3
npm run lint
npm run design-audit
```

Interpretation:
- if either command flags hardcoded values or banned design terms, the screen is not token-clean
- if both pass, the screen is structurally token-compliant, but may still need visual audit

### Suspected token drift after UI edits

Use this after changing classes, inline styles, or component-level presentation.

```bash
cd /Users/okgoogle13/Projects/careercopilot/careercopilot-migration-kit-v3
npm run design-audit -- --json
```

Review:
- hardcoded-style findings
- banned-term findings
- affected file paths

### CI / pre-merge enforcement

Use this when a route is nearly ready and you want a single deterministic pass.

```bash
cd /Users/okgoogle13/Projects/careercopilot
.claude/skills/token-enforcement/scripts/run-token-enforcement.sh
```

This wrapper:
- runs the migration-kit lint and design-audit commands
- preserves exit codes
- is the preferred operator entrypoint for repeatable review

## Edge Cases

- Canonical token files changed during migration:
  - do not audit them as violations
  - re-verify downstream screens against the updated token canon
- Zero findings but weak visual quality:
  - token compliance passed, but visual quality still needs `component-visual-audit` or `m3-visual-audit`
- Partial pass:
  - if lint passes and design-audit fails, treat the screen as blocked
- Missing audit tooling:
  - stop and report the missing command rather than guessing compliance
- Zero findings but suspicious typography:
  - token enforcement passed; escalate to `component-visual-audit` or `m3-visual-audit`
- The file is outside migration-kit scope:
  - route to `token-orchestrator` or broader repo linting instead of forcing migration-kit rules everywhere

## Troubleshooting

### `npm run design-audit` is missing

- confirm you are in `careercopilot-migration-kit-v3`
- inspect `package.json` scripts before continuing
- do not silently substitute a different audit path

### Audit fails on a canonical token file

- verify the scan scope is correct
- canonical files should be excluded from migration false-positive checks
- if they are being flagged, fix the scope before trusting results

### No violations are reported but the screen still feels off

- token enforcement is not a visual audit
- hand off to `migration-audit`, `component-visual-audit`, or `m3-visual-audit`

### A reviewer claims token drift but audits are clean

- compare the changed file against `references/ENFORCEMENT_RULES.md`
- then run:

```bash
cd /Users/okgoogle13/Projects/careercopilot/careercopilot-migration-kit-v3
npm run design-audit -- --json
```

## Related Skills

- `migration-audit`
- `route-migration`
- `component-visual-audit`
- `m3-visual-audit`
- `token-orchestrator`

## Guardrails

- semantic token usage only
- zero-flora
- ban `labWrenMetalBlue`, `GumLeafGreen`, `WattleGold`, `inkGreen`
- ban deprecated archetype names in new migration code: `Jar`, `Cabinet`, `Seed`, `Leaf`
- do not treat canonical token source files as violations

## Example

```bash
cd /Users/okgoogle13/Projects/careercopilot/careercopilot-migration-kit-v3
npm run lint
npm run design-audit
```

### Example JSON-style outcome

```json
{
  "target": "apps/web/src/screens/LoginScreen.tsx",
  "status": "pass",
  "checks": {
    "lint": "pass",
    "design_audit": "pass"
  },
  "violations": [],
  "next_step": "Escalate to visual audit if typography or proportion quality is still in doubt."
}
```

## Success Criteria

- migrated files pass lint and design audit with zero blocking token violations
- the reviewer can tell what failed, why it failed, and what exact command to rerun

## Success Metrics

- first-pass enforcement can be executed with one wrapper command
- blocking token violations map directly to affected files and rule classes
- zero-reviewer-ambiguity on canonical token sources and banned token names

## Fallback

If the skill is unavailable, use `docs/migration/MIGRATION_GUARDRAILS.md`, `docs/migration/PR_PLAN.md`, and the ESLint/design-audit checks directly.
