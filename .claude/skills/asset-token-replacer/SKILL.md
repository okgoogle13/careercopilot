---
name: asset-token-replacer
description: Replace generic asset placeholders with canonical KR Solidarity asset IDs and runtime-safe paths using deterministic mapping rules.
metadata:
  version: 6.2.0
  tags:
    - assets
    - token-mapping
    - migration
---

# Asset Token Replacer

## Purpose

Map placeholder/generic asset references to canonical manifest IDs and valid runtime paths.

## When to Use

- During migration from placeholders to canonical assets.
- Before visual audits to remove token/path ambiguity.
- During batch refactors across frontend/docs.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`

## Scope

This skill covers:
- deterministic placeholder-to-asset mapping
- replacement safety checks
- post-replacement verification

This skill does not cover:
- generating new assets
- visual scoring itself

## Mapping Rules

1. Prefer explicit manifest ID hints.
2. Otherwise map by strongest semantic/category/layer match.
3. Never replace to non-existent target paths.
4. Preserve filetype/runtime compatibility.

## Output Contract

```json
{
  "replacement_audit": {
    "status": "pass|needs_refinement|fail",
    "score": 0,
    "replacements": [],
    "skipped": [],
    "recommendations": []
  }
}
```

## Process

1. Collect placeholders.
2. Resolve deterministic candidates.
3. Apply replacements.
4. Validate resulting paths and manifest references.

## Troubleshooting

### No confident match
- Keep original token and emit `skipped` with reason.

### Path exists mismatch
- Prefer canonical runtime path and re-run validator.

## Related Skills

- `asset-path-validator`
- `manifest-reconciler`
- `asset-packager`
