---
name: asset-path-validator
description: Deep-scan frontend, wireframe, and docs asset references, resolve targets, and emit deterministic fixes for broken or non-canonical paths. Use after path migrations, asset moves, harvest prep, or release checks when references may drift from manifest-approved asset roots.
---

# Asset Path Validator

## Purpose

Detect broken or non-canonical asset references and produce fix-ready diagnostics before placement review, packaging, or harvest decisions rely on those references.

## Shared References

- `references/CANONICAL_ROOTS.md`
- `../shared-references/BRAND_CANON.md`
- `../shared-references/STATUS_THRESHOLDS.md`
- `../../../docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md`
- `../../../docs/project/active/frontend-source-of-truth-migration/control/archive/harvest-spec.md`

## Scripts

- `scripts/run_asset_path_validation.py`

## Scope

Checks include:
- missing file targets
- broken relative paths
- path style drift between docs and frontend runtime
- non-canonical asset roots

## Canonical Boundary

- treat frontend runtime asset refs as canonical when they resolve through `/assets/...`
- treat docs and support-reference artifacts as canonical when they resolve repo-relative without machine-specific absolute paths
- do not treat support-only prototype references as harvest-ready just because the target file exists

## Deterministic Process

1. Scan configured file patterns.
2. Extract candidate paths from known attributes/markdown links.
3. Resolve filesystem targets.
4. Emit structured findings with exact fix suggestions.
5. Classify the result for the harvest chain:
   - `pass`: safe to continue to placement review
   - `needs_refinement`: keep support-only until paths are normalized
   - `fail`: block placement, packaging, and harvest prep until broken refs are fixed

## Output Contract

```json
{
  "path_audit": {
    "status": "pass|needs_refinement|fail",
    "score": 0,
    "broken_paths": [],
    "non_canonical_paths": [],
    "orphaned_assets": [],
    "recommendations": []
  }
}
```

## Operator Workflow

Run the scanner from repo root:

```bash
cd /Users/okgoogle13/Projects/careercopilot
python3 .claude/skills/asset-path-validator/scripts/run_asset_path_validation.py \
  --json-out /tmp/asset-path-audit.json
```

Use `--fail-on-broken` when you want a non-zero exit on missing targets:

```bash
cd /Users/okgoogle13/Projects/careercopilot
python3 .claude/skills/asset-path-validator/scripts/run_asset_path_validation.py \
  --json-out /tmp/asset-path-audit.json \
  --fail-on-broken
```

## Handoffs

- run this after `manifest-reconciler` when manifest ids are trustworthy but references may still drift
- hand off to `asset-placement-strategy` when paths pass and slotting still needs review
- hand off back to `manifest-reconciler` if path failures reveal manifest/root drift rather than bad references

## Edge Cases

- frontend code references an existing repo file through a non-runtime path:
  - treat as `needs_refinement`; existing is not the same as canonical
- docs or wireframes use absolute machine paths:
  - treat as non-canonical even if the local machine resolves them
- a target file exists under the prototype support tree only:
  - keep the reference support-only until the canonical owner maps it into runtime truth
- broken refs cluster under one renamed folder:
  - fix the root rename pattern before editing files one by one
- a ref is built dynamically with template expressions:
  - treat that as a follow-up manual audit; this scanner is intentionally limited to deterministic string-literal references

## Success Metrics

- one command returns a machine-readable path audit
- broken references are separated from merely non-canonical ones
- harvest workers can tell whether to fix pathing, revisit manifest integrity, or move to placement

## Related Skills

- `asset-token-replacer`
- `manifest-reconciler`
- `asset-placement-strategy`
