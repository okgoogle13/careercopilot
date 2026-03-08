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

## Shared References

- `../shared-references/ASSET_WORKFLOW_CANON.md`
- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`

## Scripts

- `scripts/run_asset_placement.py`
- `scripts/validate_placement_report.py`

## Runtime Controls

- `--timestamp`
- `--output-report`
- `--output-resolved-dir`
- `--fail-on-unresolved`
- `--min-score`
- `--strict-zero-flora`

## Tests

- `tests/test_placement.sh`
- `tests/golden_snapshot.sh`

## Related Skills

- `wireframe-annotator`
- `manifest-reconciler`
- `ui-design-evaluator`
