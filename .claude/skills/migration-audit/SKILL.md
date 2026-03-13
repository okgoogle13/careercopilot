---
name: migration-audit
description: Run deterministic migration-kit quality audits during feature-to-screen migration.
commands:
  - /migration-audit
  - /audit-migration
  - /ma
metadata:
  version: 2.0.0
  tags:
    - migration
    - audit
    - orchestrator
    - benchmark
    - parallel
---

# Migration Audit

## Purpose

Run one complete audit over a migration-kit target and produce a single report that distinguishes structural compliance from visual quality.

This is the canonical public-facing audit skill for `careercopilot-migration-kit-v3`.

## Quick Start

### Via slash command

```bash
/migration-audit /login
/migration-audit /register --audit-mode visual_only
/ma /login --benchmark auth-benchmark-v1
/migration-audit /dashboard --benchmark dashboard-benchmark-v1
```

### Via skill tool

```bash
claude-code --skill migration-audit --target /login
```

Arguments:
- `target` required: route path or screen file path
- `--audit-mode`: `full | code_only | visual_only | benchmark_only`
- `--benchmark`: benchmark id, default `auth-benchmark-v1`
- `--screenshots`: comma-separated screenshot paths; auto-captured if omitted where possible

## When to Use

- auditing `/login`, `/register`, or later migrated routes
- checking whether a route is truly production-ready instead of merely lint-clean
- comparing a migrated screen against the auth benchmark
- preparing a sprint-level audit batch that can run in parallel with `sprint-coordinator`
- before marking a migration PR ready for review
- after completing a route migration or major visual refactor
- when KR Solidarity token, typography, asset, or zero-flora drift is suspected
- when verifying that a route is visually acceptable rather than merely structurally compliant

## Prerequisites

- `careercopilot-migration-kit-v3` exists and contains the expected `apps/web`, `docs/migration`, and `tools` paths
- repo dependencies are installed so `npm run lint`, `npm run test`, and the audit CLIs are available
- the benchmark bundle and wireframe artifacts exist for the target, or can be generated during the workflow
- if full-confidence visual scoring is required, the migration-kit app can be served locally for Playwright screenshot capture
- **a benchmark must exist for the target route before running this skill** — `auth-benchmark-v1` applies only to `/login` and `/register`; all other routes require a named benchmark defined before the audit begins; do not run this skill against a non-auth route using the default benchmark
- if the route is governed by canonical XML wireframes, `scripts/validate-wireframe-workflow.py` must pass or be reviewed before trusting wireframe-derived audit inputs

## Best Practices

- run `migration-audit` after each meaningful route-level UI change, not only at the end of a sprint
- use `migration-audit` before asking for design review or marking a route `migrated-ready`
- prefer full mode for auth screens and user-facing routes; use `code_only` only for narrow structural validation
- rerun the audit after any asset, typography, or UX-copy change because those can move the score materially
- use `sprint-coordinator` when auditing more than one route or when screenshot capture and visual scoring should happen in parallel

## Canonical Sub-Skills

Run these specialist skills in order and treat their output as evidence:

1. `token-enforcement`
2. `scripts/validate-wireframe-workflow.py` for canonical wireframe-backed routes
3. `asset-placement-strategy`
4. `manifest-reconciler`
5. `component-visual-audit`
6. `m3-visual-audit`
7. `kerala-rage-typography-strategy`
8. `m3-anti-slop-validator`
9. `ux-copy-writer`
10. `kerala-rage-brand-enforcer` when policy ambiguity remains

If the target is still a wireframe or mockup rather than implemented code, use `ui-design-evaluator` before visual scoring.

## Detection → Remediation → Validation Workflow

migration-audit orchestrates detection skills that **report violations**, not auto-fix them.

### Workflow Pattern

```
┌────────────────────────────────────────────────────┐
│  Phase 1: Detection (migration-audit orchestrates) │
├────────────────────────────────────────────────────┤
│  1. token-enforcement → violations.json            │
│  2. component-visual-audit → score + violations    │
│  3. m3-visual-audit → M3 compliance violations     │
│  4. ux-copy-writer → copy quality violations       │
│                                                    │
│  Output: Combined violation report with:           │
│    - All violations across dimensions              │
│    - Benchmark references showing "correct"        │
│    - Remediation commands per violation            │
└────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────┐
│  Phase 2: Remediation (Human/Agent applies fixes)  │
├────────────────────────────────────────────────────┤
│  For each violation:                               │
│    1. Read benchmark reference (gold standard)     │
│    2. Compare current code vs benchmark example    │
│    3. Apply fix using Edit/Write tools             │
│    4. Document fix in commit message               │
│                                                    │
│  Benchmark Examples:                               │
│    - auth-benchmark-v1/LoginScreen.tsx:42          │
│    - auth-benchmark-v1/rationale.md                │
│    - auth-benchmark-v1/audit-report.json           │
└────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────┐
│  Phase 3: Validation (Re-run migration-audit)      │
├────────────────────────────────────────────────────┤
│  1. Re-run token-enforcement (expect 0 violations) │
│  2. Re-run visual audits (expect score ≥90)        │
│  3. Update MIGRATION_TRACKER.md with results       │
│                                                    │
│  Status outcomes:                                  │
│    - pass: All gates ≥90, 0 critical violations   │
│    - needs_refinement: Score 75-89 or high-sev     │
│    - fail: Score <75 or critical violations        │
└────────────────────────────────────────────────────┘
```

### Benchmark-Guided Remediation

Benchmarks in `docs/design-system/benchmarks/` serve as **gold-standard references**:

**auth-benchmark-v1**:
- Routes: `/login`, `/register`
- Source: `apps/web/src/screens/LoginScreen.tsx`, `RegisterScreen.tsx`
- Expected score: ≥90 overall, dimension floors per `benchmark.json`
- Reference artifacts:
  - `benchmark.json` - Score thresholds, source files, wireframes
  - `audit-report.json` - Previous audit passing at 93/100
  - `rationale.md` - Explains why benchmark represents quality bar

**dashboard-benchmark-v1**:
- Routes: `/dashboard`
- Source: `apps/web/src/screens/DashboardScreen.tsx`
- Expected score: ≥90 overall, dimension floors per `benchmark.json`

### Using Benchmarks to Fix Violations

**Example Violation**:
```json
{
  "type": "hardcoded-color",
  "file": "LoginScreen.tsx:42",
  "value": "#1A1714",
  "benchmark_example": "auth-benchmark-v1/LoginScreen.tsx:42 uses --sys-color-charcoalBackground-base"
}
```

**Remediation Steps**:
1. Open benchmark source: `apps/web/src/screens/LoginScreen.tsx` (current benchmark)
2. Navigate to line 42
3. Observe: Uses `--sys-color-charcoalBackground-base` semantic token
4. Apply same pattern to violating file
5. Re-run `npm run verify` to validate fix

### Remediation Commands

Each violation includes actionable commands:

```json
{
  "remediation": {
    "action": "Replace hardcoded color with semantic token",
    "command": "Edit apps/web/src/screens/LoginScreen.tsx:42",
    "benchmark_reference": "auth-benchmark-v1/LoginScreen.tsx:42",
    "expected_pattern": "--sys-color-charcoalBackground-base"
  }
}
```

## Required Inputs

```yaml
target: string
kit_root: string = "careercopilot-migration-kit-v3"
audit_mode: full | code_only | visual_only | benchmark_only = full
benchmark_id?: string
screenshots:
  default?: string
  focus?: string
  error?: string
  mobile?: string
wireframe_artifact?: string
asset_context?:
  expectation: required | optional | intentionally_absent
  asset_ids?: string[]
  slots?: string[]
route_context?:
  route?: string
  flag_key?: string
  legacy_component?: string
  migrated_component?: string
  default_flag_state?: boolean
copy_context?:
  strings?: string[]
```

## Input Acquisition Rules

1. Use explicit user-provided inputs first.
2. Resolve route context from the migration kit when `target` is a route.
3. Resolve benchmark class by target:
   - `/login` and `/register` default to `auth-benchmark-v1`
   - `/dashboard` defaults to `dashboard-benchmark-v1`
3. Resolve wireframe artifacts from `docs/design-system/wireframes/*.json`.
4. Resolve copy context from the target screen source.
5. Resolve asset expectations from benchmark metadata, wireframe context, and `asset-placement-strategy`.
6. If screenshots are missing, obtain them automatically through Playwright using:
   - repo-root `frontend/tests/e2e/visual/visual-audit.spec.ts`
7. If evidence cannot be obtained, return `needs_refinement` with executable next steps instead of guessing.

## Screenshot Auto-Acquisition

When visual evidence is missing, do this automatically:

1. Check whether recent screenshots already exist for the target route.
2. If not, start or reuse a migration-kit preview/dev server.
3. Run the existing Playwright visual audit spec with `PLAYWRIGHT_BASE_URL` pointing at the migration-kit app.
4. Capture only the requested route targets when possible.
5. Resolve the generated screenshot paths from the latest run directory under:
   - repo-root `frontend/docs/design/generated/previews/`
6. Feed those screenshot paths into `component-visual-audit` and `m3-visual-audit`.

The audit must record:
- whether screenshots were provided or auto-captured
- which base URL was used
- which run directory was used
- which targets were captured

## Evidence References

- `references/EVIDENCE_CAPTURE.md`
- `references/SCREENSHOT_EXAMPLES.md`

## Benchmark Contract

Use these canonical benchmarks:

```yaml
benchmark_id: auth-benchmark-v1
benchmark_class: auth_screen
```

```yaml
benchmark_id: dashboard-benchmark-v1
benchmark_class: dashboard_screen
```

The benchmark bundle must include:
- benchmark source reference
- benchmark wireframe JSON
- benchmark screenshot set
- benchmark audit report JSON
- benchmark rationale markdown

The benchmark may also include:
- `derivedFrom` source files that define the rubric behind the bundle
- a style-guide-derived rubric reference when the benchmark inherits shared visual expectations

The benchmark represents the gold standard for:
- shapes
- colour
- motion
- typography
- M3 Expressive quality
- asset usage and placement
- proportions
- anti-slop distinctiveness
- UX copy

## Scoring System

Use the shared thresholds from `shared-references/STATUS_THRESHOLDS.md`:
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

### Dimension Requirements

Every dimension must emit:
- numeric score
- evidence summary
- violations
- remediation guidance

### Asset Usage Rules

Asset usage is a first-class dimension. Score it with `asset-placement-strategy` and `manifest-reconciler`.

Evaluate:
- correct asset selection
- correct slot/placement
- compositional role and z-layer fit
- manifest and path integrity
- justified omission when assets should be absent
- no decorative overload

### UX Copy Rules

Score UX copy through `ux-copy-writer`.

Evaluate:
- label clarity
- CTA specificity
- error/help usefulness
- tone fit
- accessibility wording
- avoidance of generic placeholder phrasing

## Output Contract

Use the shared audit contract with wrapper key `migration_visual_audit` and add:

```json
{
  "migration_visual_audit": {
    "target": "string",
    "status": "pass|needs_refinement|fail",
    "score": 0,
    "benchmark_id": "auth-benchmark-v1|dashboard-benchmark-v1",
    "benchmark_score": 0,
    "dimension_scores": {
      "typography": 0,
      "shapes": 0,
      "colour": 0,
      "motion": 0,
      "m3_expressive": 0,
      "asset_usage": 0,
      "proportions": 0,
      "anti_slop": 0,
      "ux_copy": 0
    },
    "dimension_deltas": {},
    "below_benchmark_reasons": [],
    "evidence_acquisition": {
      "mode": "provided|auto_captured",
      "playwright_spec": "frontend/tests/e2e/visual/visual-audit.spec.ts",
      "base_url": "string",
      "run_directory": "string",
      "captured_targets": []
    },
    "violations": [],
    "summary": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    },
    "recommendations": [],
    "followons": []
  }
}
```

## Follow-ons Below 90

If the score is below 90, always emit:
- at least one exact command
- at least one explicit manual task
- at least one next-skill handoff

Allowed follow-on types:
- `command`
- `task`
- `skill`
- `auto_fix`

Only use `auto_fix` for deterministic, non-destructive steps such as:
- rerunning an audit
- generating a missing wireframe artifact
- capturing missing screenshots

Do not auto-fix subjective design decisions.

## Parallelization with Sprint Coordinator

Use `sprint-coordinator` as the control plane when auditing multiple targets or when evidence acquisition, asset checks, and visual scoring should run concurrently.

The tandem contract is:
- `migration-audit`: one target, one complete audit report
- `sprint-coordinator`: many targets, dependency graph, batching, delegation, readiness rollup

Recommended parallel child tasks per target:
- route/code context resolution
- screenshot acquisition
- code and compliance audit
- token enforcement
- asset placement
- manifest reconciliation
- UX copy audit

Tasks that should wait for screenshots:
- `component-visual-audit`
- `m3-visual-audit`
- anti-slop review

## Commands for Migration Kit Audits

```bash
cd /Users/okgoogle13/Projects/careercopilot/careercopilot-migration-kit-v3
npm run lint
npm run design-audit -- --json
npm run audit:legacy -- --json
npm run test
npm run test:factory
```

When a wireframe is missing:

```bash
npm run generate:wireframe -- login
```

## Examples

### Example 1: Full auth-screen audit

Use this when auditing `/login` or `/register` for production readiness.

```bash
cd /Users/okgoogle13/Projects/careercopilot/careercopilot-migration-kit-v3
npm run lint
npm run design-audit -- --json
npm run audit:legacy -- --json
npm run test
```

Expected outcome:
- structural audits pass
- screenshot evidence is provided or auto-captured
- final report contains dimension scores, benchmark delta, and follow-ons if score is below 90

Example JSON output:

```json
{
  "migration_visual_audit": {
    "target": "/login",
    "status": "needs_refinement",
    "score": 84,
    "benchmark_id": "auth-benchmark-v1",
    "benchmark_score": 93,
    "dimension_scores": {
      "typography": 8,
      "shapes": 11,
      "colour": 12,
      "motion": 6,
      "m3_expressive": 9,
      "asset_usage": 13,
      "proportions": 8,
      "anti_slop": 7,
      "ux_copy": 10
    },
    "below_benchmark_reasons": [
      "Typography hierarchy is weaker than benchmark.",
      "Overall composition is structurally compliant but visually timid."
    ],
    "followons": [
      {
        "type": "skill",
        "skill": "kerala-rage-typography-strategy"
      },
      {
        "type": "task",
        "task": "Revise login headline, hierarchy, and field spacing in LoginScreen.tsx"
      }
    ]
  }
}
```

### Example 2: Boundary-check style investigation

Use this when a migrated screen references a parent-repo file and you need confidence that the dependency does not leak banned terms or style drift.

```bash
cd /Users/okgoogle13/Projects/careercopilot/careercopilot-migration-kit-v3
node --import ../node_modules/tsx/dist/loader.mjs tools/design-audit/bin/audit-design-compliance.ts --root . --boundary-check
```

Expected outcome:
- migration scope remains narrow by default
- only explicitly referenced parent-repo files are inspected

### Example 3: Tracker-ready pass with zero violations

Use this when a route appears clean and you need to confirm the result is real, not missing evidence.

```bash
cd /Users/okgoogle13/Projects/careercopilot/careercopilot-migration-kit-v3
npm run verify
```

Expected outcome:
- zero lint/type/test/design-audit failures
- audit output still includes benchmark comparison and evidence acquisition details
- tracker note can be updated to `migrated-ready` only if the score is `>= 90`

### Example 4: Existing screenshot evidence

These repo-root screenshot examples already exist and are valid evidence for visual sub-audits:

```text
frontend/docs/design/generated/previews/login.png
frontend/docs/design/generated/previews/register.png
frontend/docs/design/generated/previews/run-2026-03-09_21-27-57/login.png
frontend/docs/design/generated/previews/run-2026-03-09_21-27-57/register.png
```

Example JSON output:

```json
{
  "migration_visual_audit": {
    "target": "/register",
    "status": "pass",
    "score": 91,
    "benchmark_id": "auth-benchmark-v1",
    "benchmark_score": 93,
    "summary": {
      "critical": 0,
      "high": 0,
      "medium": 1,
      "low": 2
    },
    "followons": [
      {
        "type": "command",
        "command": "Update MIGRATION_TRACKER.md with the new verification date"
      }
    ]
  }
}
```

## CI/CD Integration

Use this skill as the human-readable workflow behind migration-kit gating.

Example CI sequence:

```bash
cd /Users/okgoogle13/Projects/careercopilot/careercopilot-migration-kit-v3
npm run lint
npm run type-check
npm run test
npm run design-audit -- --json
npm run audit:legacy -- --json
```

Recommended CI behavior:
- fail immediately on lint, type-check, test, or design-audit errors
- treat a sub-90 benchmarked migration audit as a release/readiness block even if code checks pass
- archive JSON audit outputs with the job artifacts when practical

## Edge Cases

- Missing migration kit directory:
  - stop immediately and report that `careercopilot-migration-kit-v3` cannot be resolved
- Missing benchmark bundle:
  - return `needs_refinement` and emit a follow-on to create or restore benchmark evidence
- Missing screenshots in `visual_only` mode:
  - auto-capture with Playwright if possible; otherwise return actionable capture steps
- Zero violations but weak visual quality:
  - do not treat zero code violations as success; the screen can still fail on typography, proportions, anti-slop, asset usage, or UX copy
- Partial results:
  - if code audits pass but screenshot capture fails, report reduced confidence and block `pass`
- Tool unavailable:
  - if `lint`, Playwright capture, or design-audit tooling is unavailable, emit a blocked result with exact recovery commands

## Troubleshooting

### `careercopilot-migration-kit-v3` directory not found

- Verify the repo root
- Confirm the kit directory exists
- Do not widen the audit to the parent `frontend/` app as a substitute

### `npm run lint` or `npm run test` fails

- Treat that as a blocking structural failure
- Fix the underlying issue before trusting any benchmark score
- Do not mark the route `migrated-ready`

### Playwright screenshot capture fails

- Verify the migration-kit app can run locally
- Verify the target route is reachable
- Re-run capture with the existing visual audit spec before continuing visual scoring

### Zero violations but the UI still looks bad

- This is expected when structural compliance passes but visual dimensions are weak
- Inspect typography, proportions, anti-slop, asset usage, and UX-copy scores instead of assuming success

### Tracker update conflicts

- Never overwrite route history blindly
- Append or revise only the target route row and preserve prior verification dates where they still apply

## Related Skills

- `token-enforcement`
- `route-migration`
- `sprint-coordinator`
- `asset-placement-strategy`
- `manifest-reconciler`
- `component-visual-audit`
- `m3-visual-audit`
- `ux-copy-writer`

## Success Metrics

- benchmark score is `>= 90`
- no critical violations
- no unresolved high-severity issues
- screenshot evidence is present or auto-captured for visual scoring
- follow-ons are concrete enough for another engineer or agent to execute immediately
- tracker wording remains consistent with the actual audit outcome

## References

- `references/AUDIT_RULES.md`
- `references/TRACKER_FORMAT.md`
- `references/TROUBLESHOOTING.md`
- `scripts/run-migration-audit.sh`

## Success Criteria

- one audit entrypoint can judge structural and visual quality together
- a screen can be marked below standard even if lint and design-audit pass
- below-90 outputs include executable next steps
- benchmark deltas explain what “good” looks like

## Fallback

If the skill is unavailable, run the sub-skills manually in the order above, compare the target to the auth benchmark, and record the combined result in migration docs.
