---
name: asset-placement-strategy
description: Resolve wireframe TODO[asset] slots to canonical manifest IDs and emit deterministic placement compliance reports.
metadata:
  version: 6.5.0
  tags:
    - assets
    - wireframes
    - placement
---

# Asset Placement Strategy

## Purpose

Convert wireframe TODO asset hints into valid manifest placements and produce report artifacts suitable for CI gating.

## When to Use

- Between wireframe annotation and component implementation.
- During placement regression checks.
- When a migration audit flags weak or incorrect asset usage.
- When a screen has the right assets available but they are poorly slotted, layered, or justified.

## Shared References

- `references/SCORING.md`
- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`

## Scripts

- `scripts/run_asset_placement.py`
- `scripts/validate_placement_report.py`

## How To Use

Use this skill when you have a wireframe or screen-level asset expectation and need to turn it into a deterministic placement report.

### Typical workflow

1. Confirm the target screen or wireframe artifact.
2. Run placement resolution.
3. Validate the resulting placement report.
4. Feed the result into a migration or visual audit as the asset-usage evidence source.

### Example invocation

```bash
cd /Users/okgoogle13/Projects/careercopilot
python3 .claude/skills/asset-placement-strategy/scripts/run_asset_placement.py \
  --timestamp \
  --output-report /tmp/asset-placement-report.json \
  --output-resolved-dir /tmp/asset-placement-resolved \
  --min-score 90 \
  --strict-zero-flora
```

Then validate the result:

```bash
cd /Users/okgoogle13/Projects/careercopilot
python3 .claude/skills/asset-placement-strategy/scripts/validate_placement_report.py \
  --report /tmp/asset-placement-report.json
```

### When to use this instead of running scripts directly

Use the skill when:
- you need the decision logic and score interpretation
- you want the result framed as placement compliance for another audit
- you need to decide whether an asset issue is placement-related or manifest-related

Run the scripts directly when:
- you already know the placement workflow
- you just need to regenerate or validate a report artifact quickly

## Runtime Controls

- `--timestamp`
- `--output-report`
- `--output-resolved-dir`
- `--fail-on-unresolved`
- `--min-score`
- `--strict-zero-flora`

## Expected Outputs

- placement report JSON
- resolved asset output directory
- deterministic score using `references/SCORING.md`
- diagnostics for unresolved slots, invalid token refs, or invalid asset refs

## Edge Cases

- No asset slots in the target:
  - treat as intentional absence only if that is justified by the screen or benchmark context
- High score but unresolved hard-rule issue:
  - hard-rule failures still block acceptance
- Wrong asset but valid manifest id:
  - this is still a placement/composition failure, not a manifest success

## Troubleshooting

### Report validates but composition still feels wrong

- use `component-visual-audit` or `m3-visual-audit` after placement resolution
- placement correctness is necessary, not sufficient

### Unresolved slots remain

- inspect the wireframe hints and benchmark expectations
- rerun with `--fail-on-unresolved`

### Asset refs are valid but token refs are not

- treat this as a token-compliance issue inside placement, not as a visual-only issue

## Tests

- `tests/test_placement.sh`
- `tests/golden_snapshot.sh`

## Related Skills

- `wireframe-annotator`
- `manifest-reconciler`
- `ui-design-evaluator`
- `migration-audit`
