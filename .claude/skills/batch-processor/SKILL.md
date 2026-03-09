---
name: batch-processor
description: Parallel batch orchestration for component workflows and asset-audit workflows with aggregated validation gates.
metadata:
  version: 3.2.0
  tags:
    - orchestration
    - batch
    - audit
---

# Batch Processor (v3.2.0)

## Purpose
Run high-throughput batches with deterministic quality gates. Supports both component pipelines and asset audit pipelines.

## Modes (v3.2.0)
1. `component_batch` (Phase 3): Wireframe→Spec→JSX w/ M3 gates
2. `asset_audit_batch`: Token → Manifest → Placement → Vision → Hero → Gate

## Pipelines

### Component Batch Input (Phase 3)
```json
{
  "mode": "component_batch",
  "batch_id": "phase3-batch2",
  "input_wireframes": [".claude/wireframes/01_*.xml"],
  "output_dir": "frontend/src/components/batch/",
  "tokens_file": "frontend/src/design/tokens/tokens.json",
  "skills_pipeline": ["spec-generator", "scaffolder", "builder|transformer"]
}
```

### Component Batch (Phase 3)
1. Token Gate (20pts): --sys-* only
2. Motion Gate (25pts): spring physics
3. Typo Gate (20pts): Kerala fonts
4. Slot Gate (20pts): KR-SOLID-* preserve
5. React Gate (15pts): Zustand/Tailwind V4

### Asset Audit Input
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
  "target_score": 90,
  "visual_direct": true
}
```

### Visual Gates (v3.2.0)
Fail batch when any metric falls below threshold.
```json
{
  "visual_gates": {
    "hero_slots_max": 3,
    "density_ratio": 0.35,
    "contrast_focal": 12,
    "whitespace_ratio": 0.6
  }
}
```

### Pipelines
### Component Batch (Phase 3)

1. Token Gate (20pts): --sys-* only
2. Motion Gate (25pts): spring physics
3. Typo Gate (20pts): Kerala fonts
4. Slot Gate (20pts): KR-SOLID-* preserve
5. React Gate (15pts): Zustand/Tailwind V4

### Asset Audit Pipeline
#### Stage 1: Token Gate
- Run token validation.
- Enforce semantic token policy (`--sys-color-*`, `--sys-type-*`), no hardcoded hex in target UI scope.

#### Stage 2: Manifest Gate
- Validate schema, duplicates, missing files, and broken references.

#### Stage 3: Placement Gate
- Use `asset-placement-strategy` to verify wireframe alignment and z-layer intent.

#### Stage 4: Vision Gate
- Use `vision-scorer-mcp` per asset.
- If vision MCP is available, proxy visual gates via screenshot analysis (component/page screenshots) and emit per-screen gate metrics.
- If vision MCP is unavailable, mark visual gate status as `unverified` and fail by default unless explicitly overridden by batch config.

#### Stage 5: Hero Gate
- Verify hero registry references are valid.
- Verify depth/halo leverage expectations for hero surfaces.

#### Stage 6: Aggregate Gate
- Compute aggregate score and fail batch when any critical check fails.
- Minimum pass score: `>= 90`.
- Enforce visual gate thresholds:
  - `hero_slots_max <= 3`
  - `density_ratio < 0.35`
  - `contrast_focal >= 12`
  - `whitespace_ratio >= 0.6`

#### Stage 7: Visual Direct Curation (Optional, `visual_direct=true`)
- Auto-run `vision-scorer-mcp.curate_visual` after fill/audit.
- Apply returned slot disable recommendations in a patch queue.
- Re-score visual gates and emit `curation_fixes` in batch output.

## Aggregate Score (100 Phase 3)
- Tokens: 20 (NO hex)
- Motion: 25 (springs ONLY)
- Typography: 20 (Fraunces/Work Sans/JetBrains Mono)
- Slots: 20 (Phase 4 ready)
- React/Vite: 15 (hooks/Zustand/Tailwind V4)

## Output Contract
```json
{
  "batch_id": "phase3-batch2",
  "mode": ["asset_audit_batch", "component_batch"],
  "overall_score": 97,
  "compliance_breakdown": {"tokens":100,"motion":96},
  "visual_gates": {
    "hero_slots_max": {"value": 3, "threshold": 3, "pass": true},
    "density_ratio": {"value": 0.31, "threshold": 0.35, "pass": true},
    "contrast_focal": {"value": 12.4, "threshold": 12, "pass": true},
    "whitespace_ratio": {"value": 0.64, "threshold": 0.6, "pass": true}
  },
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
- Any visual gate below threshold (`hero_slots_max`, `density_ratio`, `contrast_focal`, `whitespace_ratio`)
- Visual gates `unverified` when vision MCP is expected/available

## Recommended Integration
- `vision-scorer-mcp` (scoring)
- `asset-placement-strategy` (wireframe mapping)
- `manifest-reconciler` (gaps and orphan checks)
