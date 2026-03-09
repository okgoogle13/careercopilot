---
name: asset-path-validator
description: Validate asset references across code/docs and report broken, orphaned, and non-canonical paths with deterministic fix guidance.
metadata:
  version: 6.2.0
  tags:
    - assets
    - validation
    - paths
---

# Asset Path Validator

## Purpose

Detect broken/non-canonical asset references and produce fix-ready diagnostics.

## When to Use

- Before merge when asset paths changed.
- During release readiness checks.
- After bulk token/path migration.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`

## Scope

Checks include:
- missing file targets
- broken relative paths
- path style drift between docs and frontend runtime
- non-canonical asset roots

## Deterministic Process

1. Scan configured file patterns.
2. Extract candidate paths from known attributes/markdown links.
3. Resolve filesystem targets.
4. Emit structured findings with exact fix suggestions.

## Output Contract

```json
{
  "path_audit": {
    "status": "pass|needs_refinement|fail",
    "score": 0,
    "broken_paths": [],
    "orphaned_assets": [],
    "recommendations": []
  }
}
```

## Usage

`Validate asset references under frontend + docs and return deterministic path fixes.`

## Related Skills

- `asset-token-replacer`
- `manifest-reconciler`
- `asset-placement-strategy`
