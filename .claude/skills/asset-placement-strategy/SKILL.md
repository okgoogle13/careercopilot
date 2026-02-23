---
name: asset-placement-strategy
description: Wireframe-driven placement strategy for Kerala Rage assets with strict semantic token usage and deterministic placement scoring.
metadata:
  legacy_frontmatter:
    version: 2.0.0
    tags:
    - design
    - layout
    - wireframe
---

# Asset Placement Strategy

## Purpose
Place KR assets (Seeds, Pebbles, Lenses, Stones, motifs, hero overlays) against annotated wireframes with explicit, testable constraints.

## Inputs
```json
{
  "wireframe_doc": "docs/design/annotated-wireframes.md",
  "status_doc": "docs/design/wireframe-status.md",
  "manifest": "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json",
  "hero_registry": "frontend/public/assets/kr-solidarity-hero-registry.json",
  "target_screens": ["Landing", "Analysis", "Dashboard"]
}
```

## Hard Placement Rules
1. Use semantic tokens only:
- Color: `--sys-color-*`
- Typography: `--sys-type-*`
- Do not introduce hardcoded hex in implementation scope.
2. Respect wireframe layer intent:
- `Z-0`: substrate/base texture
- `Z-1..Z-2`: atmospheric/motif overlays
- `Z-3+`: foreground highlights and hero focal cues
3. Every placed asset must map to a valid manifest entry.
4. If wireframes include `TODO[asset]`, produce explicit tokenized replacements.
5. Hero surfaces must include intentional depth and lighting/halo logic where specified.

## Placement Scoring (100)
- Wireframe alignment and z-order correctness: 35
- Token compliance (`--sys-*` only): 25
- Manifest-valid asset mapping: 20
- Hero depth and halo/lighting intent: 20

Pass threshold: `>= 90`.

## Output Contract
```json
{
  "screen": "Landing",
  "score": 93,
  "placements": [
    {
      "slot": "hero_background",
      "asset_id": "KR-SOLID-034",
      "z_index": 0,
      "token_refs": ["--sys-color-charcoalBackground-base"],
      "status": "applied"
    }
  ],
  "unresolved": [],
  "notes": []
}
```

## Validation Checklist
- [ ] No hardcoded hex values added in target implementation files
- [ ] All referenced assets exist in manifest and filesystem
- [ ] No unresolved `TODO[asset]` markers for audited targets
- [ ] Hero sections include layered depth with documented intent
- [ ] Final score `>= 90`
