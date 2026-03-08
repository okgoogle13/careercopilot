---
name: asset-placement-strategy
description: Resolve wireframe TODO[asset] slots into manifest IDs, enforce KR Solidarity placement rules, and emit deterministic per-screen plus aggregate compliance reports.
metadata:
  version: 6.4.0
  tags:
    - design-system
    - asset-management
    - kr-solidarity
    - wireframe-automation
---

# KR Solidarity: Asset Placement Strategy (v6.4.0)

Deterministic, wireframe-driven asset placement validation for KR Solidarity.

## Purpose

This skill converts `TODO[asset]` slot hints in wireframe XML into concrete `asset:<id>` assignments from the manifest. It enforces token format rules, z-layer compatibility, full manifest accounting, and Zero-Flora checks. It outputs resolved XML plus machine-readable compliance reports.

## When to Use

- Resolve `TODO[asset]` placeholders from `wireframe-annotator` output.
- Validate slot-to-asset mapping before component generation.
- Audit current placement against KR Solidarity hard rules.
- Produce deterministic placement scoring and diagnostics for PR review.

## Capabilities

- Parse `<assets><slot ...>` blocks from multiple wireframes.
- Resolve slot hints against `kerala-rage-kr-solidarity-manifest.json`.
- Prioritize unused assets first to maximize manifest coverage.
- Produce proposed additional placements for still-unused compatible assets.
- Enforce token format (`--sys-*` only) in placement refs.
- Validate all placed `asset_id`s exist in the manifest.
- Detect flora-related terms on placed assets (Zero-Flora gate).
- Emit per-screen 100-point rubric scoring and aggregate pass/fail.

## Inputs

### Required

```json
{
  "wireframe_xml_dir": ".claude/wireframes",
  "manifest": "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json"
}
```

### Optional

```json
{
  "hero_registry": "frontend/public/assets/kr-solidarity-hero-registry.json",
  "asset_root": "frontend/public/assets/kr-solidarity"
}
```

Notes:
- `hero_registry` is used for diagnostics/context metadata.
- `asset_root` enables file existence checks for placed asset paths.

## TODO Hint Contract

Format:

```text
TODO[asset] key1=value1;key2=value2;...
```

Supported keys:
- `id` / `asset_id`
- `category`
- `layer`
- `scale`
- `aspect`
- `priority`
- `semantic_weight`
- `functional_role`
- `layering_role`

Also supported:
- explicit ID ranges like `KR-SOLID-010 to KR-SOLID-020`
- direct IDs inside slot text

## Hard Rules

1. Semantic token format only in `token_refs`: must start with `--sys-`.
2. No hex/RGB values in token refs.
3. Layer compatibility must match slot `z_layer` intent.
4. All placed asset IDs must exist in manifest.
5. Full manifest accounting required: every manifest asset is either used or unused with reason.
6. Zero-Flora lockdown: placed assets must not match blocked flora terms.

## Process

1. Parse each wireframe XML and collect slot contexts.
2. Resolve TODO slots with compatibility scoring and unused-first ranking.
3. Write resolved XML files to `.claude/wireframes/resolved/`.
4. Compute per-screen rubric score (0-100).
5. Compute aggregate compliance and diagnostics.
6. Write aggregate report to `.claude/wireframes/placement_report.json`.

## Scoring Rubric (100)

- Wireframe alignment + z-order correctness: 35
- Token compliance: 25
- Manifest-valid mapping: 20
- Hero depth and lighting intent: 20

Detailed scoring math and diagnostics mapping:
- [references/SCORING.md](./references/SCORING.md)

Pass gate:
- aggregate score `>= 90`
- no unresolved slots
- all assets accounted for
- zero invalid token refs
- zero invalid asset refs
- zero flora violations

## CLI

```bash
python3 .claude/skills/asset-placement-strategy/scripts/run_asset_placement.py \
  --wireframes-dir .claude/wireframes \
  --manifest frontend/public/assets/kerala-rage-kr-solidarity-manifest.json \
  --hero-registry frontend/public/assets/kr-solidarity-hero-registry.json \
  --asset-root frontend/public/assets/kr-solidarity
```

## Output Contract

### 1) Resolved XML

All successfully resolved TODO slots are rewritten to:

```xml
<slot ... status="resolved">
  asset:KR-SOLID-022
</slot>
```

### 2) Per-screen report

Each `screens[]` entry includes:
- `screen`, `wireframe`
- `placements[]`
- `unresolved_slots[]`
- `score`
- `score_breakdown`
- `diagnostics`

### 3) Aggregate report (`placement_report.json`)

Top-level fields:
- `metadata`
- `total_assets`
- `manifest_coverage`
- `used_assets`
- `unused_assets`
- `proposed_additional_placements`
- `screens`
- `aggregate_score`
- `compliance`
- `diagnostics`

## Compliance Fields

`compliance` includes:
- `all_assets_accounted_for`
- `no_unresolved_slots`
- `all_placed_assets_valid`
- `zero_flora_lockdown`
- `token_compliance_pct`
- `token_compliance`
- `pass`

## Troubleshooting

### Score below 90

- Check `screens[].score_breakdown` for weak category.
- Review `diagnostics.invalid_tokens` for non `--sys-*` refs.
- Review `diagnostics.invalid_asset_refs` for missing IDs.
- Review `screens[].unresolved_slots` for unresolvable TODO constraints.

### Unused assets remain high

- Inspect `proposed_additional_placements`.
- Add compatible slots in wireframes where reuse proposals exist.
- Relax over-constrained TODO hints (`aspect`, `layer`, `semantic_weight`) when justified.

### Flora gate failure

- Inspect `diagnostics.flora_violations` for matched terms.
- Replace violating asset with compliant candidate.

## Best Practices

1. Keep TODO hints explicit (`category`, `layer`, `aspect`, `scale`).
2. Reserve explicit `asset_id` hints for intentional locks.
3. Run this skill before `component-builder` to avoid late-stage drift.
4. Keep wireframe `z_layer` intent stable to preserve deterministic scoring.

## Integration

Workflow chain:
`wireframe-annotator` -> `asset-placement-strategy` -> `ui-design-evaluator` -> `component-builder`

## Related Skills

- [wireframe-annotator](../wireframe-annotator/SKILL.md)
- [manifest-reconciler](../manifest-reconciler/SKILL.md)
- [ui-design-evaluator](../ui-design-evaluator/SKILL.md)
- [component-builder](../component-builder/SKILL.md)

Last Updated: 2026-03-08 | Version: 6.4.0
