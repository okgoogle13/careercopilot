---
name: vision-scorer-mcp
description: Deterministic MCP-based visual compliance scoring for Kerala Rage assets with hard gates for token usage, wireframe alignment, manifest integrity, and hero composition quality.
metadata:
  legacy_frontmatter:
    type: mcp-server
    version: 2.0.0
    tags:
    - audit
    - vision
    - compliance
---

# Vision-Scorer MCP

## Purpose
Use vision scoring as the final quality gate for asset audits. This skill is strict: assets must score `>= 90` to pass packaging/deployment.

## Required Inputs
```json
{
  "image_path": "frontend/public/assets/kr-solidarity/...png",
  "asset_id": "KR-SOLID-001",
  "wireframe_ref": "docs/design/annotated-wireframes.md",
  "manifest_path": "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json",
  "hero_registry_path": "frontend/public/assets/kr-solidarity-hero-registry.json",
  "target_score": 90
}
```

## Hard Rules
1. Reject any UI output that uses hardcoded hex colors in implementation files. Require semantic tokens: `--sys-color-*` and `--sys-type-*`.
2. Verify asset references exist in the manifest and filesystem.
3. Verify placement intent against annotated wireframes (layering, anchor usage, motif role).
4. Verify hero leverage:
- No missing hero asset references.
- Prefer layered compositions (`>= 4` layers) for hero-grade outputs.
- Check halo/lighting intent is explicitly represented in composition metadata or blend stack.
5. Decision is binary:
- `PACKAGE` only when `overall_score >= target_score`
- `REGENERATE` otherwise

## Scoring Rubric (100)
- Token compliance (`--sys-color-*`, `--sys-type-*`, no hex in UI paths): 25
- Wireframe placement fidelity: 20
- Manifest/reference integrity: 20
- Visual quality (contrast, hierarchy, motif clarity): 20
- Hero leverage (layer depth + halo intent): 15

## Output Contract
```json
{
  "asset_id": "KR-SOLID-001",
  "overall_score": 92,
  "decision": "PACKAGE",
  "checks": {
    "token_compliance": 24,
    "wireframe_fidelity": 18,
    "manifest_integrity": 20,
    "visual_quality": 18,
    "hero_leverage": 12
  },
  "violations": [],
  "actions": []
}
```

## Failure Conditions
Immediate fail if any of the following is true:
- Missing manifest file or invalid schema
- Broken asset reference
- Unresolved `TODO[asset]` in targeted audited surfaces
- Hardcoded hex colors in production UI files tied to the audited scope

## Recommended Combo
Run with:
1. `asset-placement-strategy` for wireframe placement checks
2. `manifest-reconciler` for gap/orphan verification
3. `batch-processor` for parallel scoring and aggregate pass/fail

## Baseline Commands
```bash
python3 scripts/design-validation/validate-tokens.py
node frontend/scripts/kr/validate-manifest.mjs
rg -n "TODO\[asset\]" docs/design frontend/src
rg -n "#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\\b" frontend/src/components frontend/src/layouts frontend/src/pages
```
