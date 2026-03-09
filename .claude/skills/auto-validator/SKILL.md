---
name: auto-validator
description: Run deterministic pre-packaging visual compliance validation for KR Solidarity assets with score gates and correction guidance.
metadata:
  version: 1.2.0
  tags:
    - assets
    - visual-validation
    - scoring
---

# Auto Validator

## Purpose

Validate candidate assets before manifest/package integration and return structured score + fix guidance.

## When to Use

- After asset generation.
- Before asset-packager.

## Shared References

- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`

## Output Contract

Use deterministic audit shape with wrapper key `asset_validation_audit`.

## Process

1. Evaluate compliance dimensions.
2. Compute score and status.
3. Emit violations and correction prompts.

## Related Skills

- `asset-packager`
- `kerala-rage-asset-cataloger`
- `asset-metadata-enricher`
