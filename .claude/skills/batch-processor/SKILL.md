---
name: batch-processor
description: Parallel batch orchestration for component workflows and asset-audit workflows with aggregated validation gates.
metadata:
  legacy_frontmatter:
    version: 3.0.0
    tags:
    - orchestration
    - batch
    - audit
---

# Batch Processor

## Purpose
Run high-throughput batches with deterministic quality gates. Supports both component pipelines and asset audit pipelines.

## Modes
1. `component_batch` (existing): Protocol -> Wireframe -> Spec -> Build
2. `asset_audit_batch` (new): Token -> Manifest -> Placement -> Vision -> Hero -> Gate

## Asset Audit Input
```json
{
  "mode": "asset_audit_batch",
  "batch_id": "asset-audit-2026-02",
  "assets": [
    {"path": "frontend/public/assets/kr-solidarity/...png", "asset_id": "KR-SOLID-001"}
  ],
  "wireframe_doc": "docs/design/annotated-wireframes.md",
  "manifest": "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json",
  "hero_registry": "frontend/public/assets/kr-solidarity-hero-registry.json",
  "target_score": 90
}
```

## Asset Audit Pipeline
Stage 1: Token Gate
- Run token validation.
- Enforce semantic token policy (`--sys-color-*`, `--sys-type-*`), no hardcoded hex in target UI scope.

Stage 2: Manifest Gate
- Validate schema, duplicates, missing files, and broken references.

Stage 3: Placement Gate
- Use `asset-placement-strategy` to verify wireframe alignment and z-layer intent.

Stage 4: Vision Gate
- Use `vision-scorer-mcp` per asset.

Stage 5: Hero Gate
- Verify hero registry references are valid.
- Verify depth/halo leverage expectations for hero surfaces.

Stage 6: Aggregate Gate
- Compute aggregate score and fail batch when any critical check fails.
- Minimum pass score: `>= 90`.

## Aggregate Score (100)
- Token compliance: 20
- Manifest integrity: 20
- Placement fidelity: 20
- Vision compliance: 25
- Hero leverage: 15

## Output Contract
```json
{
  "batch_id": "asset-audit-2026-02",
  "mode": "asset_audit_batch",
  "overall_score": 91,
  "status": "PASS",
  "assets_passed": 12,
  "assets_failed": 1,
  "failed_ids": ["KR-SOLID-021"],
  "blocking_issues": []
}
```

## Fail-Fast Conditions
- Manifest invalid
- Broken asset references
- Hardcoded hex introduced in audited target implementation files
- Any audited asset score `< 90`

## Recommended Integration
- `vision-scorer-mcp` (scoring)
- `asset-placement-strategy` (wireframe mapping)
- `manifest-reconciler` (gaps and orphan checks)
