---
name: asset-placement-strategy
description: Resolve wireframe TODO[asset] slots to canonical manifest IDs and emit deterministic placement compliance reports for CI or migration evidence. Use after integrity and path checks when a screen has candidate assets but slotting, layering, token fit, or justification still need verification.
---

# Asset Placement Strategy

## Purpose

Convert wireframe TODO asset hints into valid manifest placements and produce report artifacts suitable for CI gating, migration evidence, and harvest-prep review.

## Shared References

- `references/SCORING.md`
- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`
- `../../../docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md`
- `../../../docs/project/active/frontend-source-of-truth-migration/control/archive/harvest-spec.md`

## Scripts

- `scripts/run_asset_placement.py`
- `scripts/validate_placement_report.py`

## Preconditions

- run `manifest-reconciler` first when asset integrity is uncertain
- run `asset-path-validator` first when references may still drift
- keep prototype shell and support-only surfaces outside acceptance decisions unless a canonical owner and contract explicitly authorize the candidate

## How To Use

Use this skill when you have a wireframe or screen-level asset expectation and need to turn it into a deterministic placement report.

### Typical workflow

1. Confirm the target screen or wireframe artifact.
2. Run placement resolution.
3. Validate the resulting placement report.
4. Feed the result into a migration or visual audit as the asset-usage evidence source.
5. Treat the report as evidence for harvest planning, not as standalone authorization to port support-only prototype code.

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

## Harvest Alignment

- map a passing placement report to "placement evidence ready", not automatically to `harvest_now`
- if the source surface is still support-only or blocked by contract ownership, keep it support-only even when placement scores are high
- use `migration-audit`, route contracts, and the harvest spec to decide `harvest_now`, `support_only`, or `blocked`
- use `scripts/enforce-asset-coverage.sh` when harvest prep needs broader wireframe coverage after base placement is already working

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
- evidence suitable for downstream migration or visual audit, not a substitute for contract ownership review

## Edge Cases

- No asset slots in the target:
  - treat as intentional absence only if that is justified by the screen or benchmark context
- High score but unresolved hard-rule issue:
  - hard-rule failures still block acceptance
- Wrong asset but valid manifest id:
  - this is still a placement/composition failure, not a manifest success
- High score on a support-only prototype surface:
  - keep it support-only until the canonical owner and harvest spec authorize promotion

## Troubleshooting

### Report validates but composition still feels wrong

- use `component-visual-audit` or `m3-visual-audit` after placement resolution
- placement correctness is necessary, not sufficient

### Unresolved slots remain

- inspect the wireframe hints and benchmark expectations
- rerun with `--fail-on-unresolved`

### Asset refs are valid but token refs are not

- treat this as a token-compliance issue inside placement, not as a visual-only issue

### Placement passes but harvest still should not proceed

- confirm contract ownership, support-only boundaries, and migration audit requirements
- this skill validates slot quality, not route authority

## Tests

- `tests/test_placement.sh`
- `tests/golden_snapshot.sh`

## Related Skills

- `asset-path-validator`
- `wireframe-annotator`
- `manifest-reconciler`
- `ui-design-evaluator`
- `migration-audit`
