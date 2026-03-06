---
name: asset-placement-strategy
description: Wireframe-driven placement strategy for KR Solidarity assets with strict semantic token usage and deterministic placement scoring.
metadata:
  version: 6.0.0
  tags:
    - design-system
    - asset-management
    - kr-solidarity
    - migrant-rage
---


# KR Solidarity: Asset Placement Strategy (v6.0)

**Deterministic placement validation for KR Solidarity (Migrant Rage) design system assets.**

## Purpose

Place KR Solidarity assets (motifs, symbols, hero compositions) against annotated screens from [05_FLOWS.md](../../docs/design/05_FLOWS.md) with strict semantic token compliance and deterministic scoring. Validates z-index layering and enforces the **Zero-Flora Lockdown**.

## When to Use

- Implementing KR Solidarity assets from screen matrix into React components.
- Validating asset placement decisions against [04_ASSETS.md](../../docs/design/04_ASSETS.md).
- Ensuring z-index and layering intent matches [05_FLOWS.md](../../docs/design/05_FLOWS.md) specifications.
- Auditing existing implementations for "Flora" violations or hardcoded colors.


## Capabilities

- **Wireframe Slot Parsing**: Extract asset placement slots from annotated wireframes
- **Manifest Validation**: Verify all `asset_id` references exist in canonical manifest
- **Token Compliance Checking**: Enforce `--sys-*` semantic variable usage only
- **Z-Index Validation**: Verify layer assignments (Z-0 through Z-3+) match wireframe intent
- **Hero Composition Analysis**: Validate depth and lighting logic for hero surfaces
- **Deterministic Scoring**: 100-point scale with clear rubric and ≥90 pass threshold
- **Machine-Readable Output**: JSON schema for integration with build pipelines
- **Unresolved Tracking**: Flag TODO[asset] markers and missing asset mappings

## Inputs
```json
{
  "canon_doc": "docs/design/01_CANON.md",
  "flows_doc": "docs/design/05_FLOWS.md",
  "assets_doc": "docs/design/04_ASSETS.md",
  "manifest": "frontend/public/assets/kerala-rage-kr-solidarity-manifest.json",
  "hero_registry": "frontend/public/assets/kr-solidarity-hero-registry.json"
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

## Example: Landing Page Hero Placement

### Input Wireframe Annotation

```markdown
<!-- Landing page hero section -->
HERO_BACKGROUND [Z-0]:
  - Layer: substrate
  - Asset: Devotional composition
  - Token: --sys-color-charcoalBackground-base
  - TODO[asset]: Select from KR-SOLID-021 to KR-SOLID-025

HERO_OVERLAY [Z-1]:
  - Layer: atmospheric
  - Asset: Abstract texture
  - Token: --sys-color-primary-70
  - Opacity: 0.8

HERO_ACCENT [Z-3]:
  - Layer: ui-kit
  - Asset: KR-UI-016
  - Token: --sys-color-kr-ink-gold
  - Placement: corner-accent
```

### Placement Decision

**Selected Assets**:
1. **Background**: `KR-SOLID-022` (Devotional -solidarity, 16:9 aspect ratio)
   - Matches hero container dimensions
   - Aligns with spiritual layer intent
   - Proper substrate positioning

2. **Overlay**: `KR-SOLID-003` (Abstract composition, 3:4 aspect ratio)
   - Adds atmospheric depth
   - Token-compliant opacity overlay
   - Non-conflicting z-index

3. **Accent**: `KR-UI-016` (UI Element, SVG)
   - Corner placement enhances focal point
   - Maintains UI-kit layer separation
   - Decorative role without blocking content

### Output

```json
{
  "screen": "Landing",
  "score": 93,
  "placements": [
    {
      "slot": "hero_background",
      "asset_id": "KR-SOLID-022",
      "z_index": 0,
      "layer": "substrate",
      "aspect_ratio": "16:9",
      "token_refs": ["--sys-color-charcoalBackground-base"],
      "status": "applied",
      "rationale": "Aspect ratio matches hero container; spiritual layer fulfills devotional intent"
    },
    {
      "slot": "hero_overlay",
      "asset_id": "KR-SOLID-003",
      "z_index": 1,
      "layer": "atmospheric",
      "opacity": 0.8,
      "token_refs": ["--sys-color-primary-70"],
      "status": "applied",
      "rationale": "Adds layered depth; token-compliant opacity overlay"
    },
    {
      "slot": "hero_accent",
      "asset_id": "KR-UI-016",
      "z_index": 3,
      "layer": "ui-kit",
      "placement": "corner-accent",
      "token_refs": ["--sys-color-kr-ink-gold"],
      "status": "applied",
      "rationale": "SVG scales without quality loss; UI-kit layer doesn't conflict with hero composition"
    }
  ],
  "unresolved": [],
  "notes": ["All placements pass token compliance check", "Z-index layering aligns with wireframe intent"]
}
```

### Verification Steps

1. ✅ **Token Compliance**: All 3 assets reference only `--sys-color-*` variables
2. ✅ **Manifest Validation**: KR-SOLID-022, KR-SOLID-003, KR-UI-016 all present
3. ✅ **Z-Index Ordering**: 0 → 1 → 3 respects wireframe layer hierarchy
4. ✅ **Hero Depth**: Substrate + atmospheric overlay creates intentional depth
5. ✅ **Score**: 93/100 (passes ≥90 threshold)

---

## Scoring Rubric (100 Points)

### Wireframe Alignment & Z-Order Correctness (35 points)

- **Z-Index Hierarchy** (10 pts): Layers follow wireframe intent
  - Z-0: Substrate/base texture ✓
  - Z-1–2: Atmospheric/motif overlays ✓
  - Z-3+: Foreground highlights, hero cues ✓

- **Asset Fit** (10 pts): Aspect ratio and dimensions match slot
  - Portrait slot → portrait asset ✓
  - Landscape slot → landscape asset ✓
  - Square → square or flexible ✓

- **TODO[asset] Resolution** (10 pts): All placeholders assigned
  - No unresolved markers ✓
  - Each mapped to valid manifest entry ✓
  - Confidence levels documented ✓

- **Layer Separation** (5 pts): No layer conflicts
  - No overlapping same-layer assets ✓
  - Intentional depth relationships ✓

### Token Compliance (25 points)

- **No Hardcoded Colors** (15 pts): Only `--sys-color-*` variables
  - Zero hex values in token_refs ✓
  - Zero RGB values in implementation ✓
  - All variables exist in tokens.json ✓

- **Semantic Correctness** (10 pts): Tokens match asset intent
  - Primary for hero focal points ✓
  - Secondary for accents ✓
  - Neutral for backgrounds ✓

### Manifest-Valid Asset Mapping (20 points)

- **Asset Existence** (10 pts): All asset_id entries present
  - IDs found in manifest ✓
  - File paths verified ✓
  - No orphaned references ✓

- **Category Alignment** (10 pts): Asset category matches slot
  - ui-kit for interface elements ✓
  - Devotional for spiritual heroes ✓
  - Abstract for atmospheric overlays ✓

### Hero Depth & Lighting Intent (20 points)

- **Layered Composition** (10 pts): Multi-layer depth strategy
  - Substrate foundation ✓
  - Atmospheric middle layer ✓
  - UI-kit foreground ✓

- **Lighting & Halo** (10 pts): Intentional focal hierarchy
  - Accent positioning creates visual weight ✓
  - Opacity overlays create depth ✓
  - Contrast supports content legibility ✓

---

## Troubleshooting

### Issue: Placement Score Below 90

**Symptoms**: Validation fails with score 72–89

**Root Causes**:
1. Hardcoded hex/RGB in token_refs (Token compliance failure)
2. Asset not found in manifest (Manifest validation failure)
3. Incorrect z-index or layer assignment (Wireframe alignment failure)
4. Unresolved TODO[asset] markers (Unresolved slots)

**Solution Steps**:

1. **Check Token Refs**
   ```json
   // ❌ Wrong
   "token_refs": ["#D4A84B", "--sys-color-kr-ink-gold"]

   // ✅ Correct
   "token_refs": ["--sys-color-kr-ink-gold"]
   ```

2. **Verify Manifest Entry**
   ```bash
   # Check if asset exists
   grep "KR-SOLID-022" frontend/public/assets/kerala-rage-kr-solidarity-manifest.json
   ```

3. **Review Z-Index Ordering**
   ```json
   // Verify layers don't skip or conflict
   z_index: [0, 1, 3]  // ✓ Valid progression
   z_index: [0, 2, 1]  // ❌ Out of order
   ```

4. **Re-score After Fixes**
   - Expected improvement: +5–10 points per fix
   - Target: ≥90 for production approval

### Issue: Asset Aspect Ratio Mismatch

**Symptoms**: Asset doesn't fill slot, creates dead space or scales poorly

**Solutions**:

1. **Check Wireframe Aspect**
   - Is slot 16:9 or 1:1?
   - Is asset flexible or fixed?

2. **Select Matching Asset**
   ```json
   // Hero slot is 16:9
   // Available assets:
   // - KR-SOLID-022: 16:9 ✓
   // - KR-SOLID-026: 1:1 ✗
   "asset_id": "KR-SOLID-022"
   ```

3. **Document Scaling**
   ```json
   "scaling_note": "Asset 16:9 matches hero container; no cropping needed"
   ```

### Issue: Unresolved TODO[asset] Markers

**Symptoms**: `unresolved` array contains pending assignments

**Causes**:
- Multiple valid candidates (ambiguous choice)
- No matching asset in manifest (gap)
- Wireframe slot under-specified

**Solutions**:

1. **For Ambiguous Choices**: Review confidence levels
   ```json
   "candidates": [
     { "id": "KR-SOLID-022", "confidence": "HIGH", "reason": "16:9, devotional" },
     { "id": "KR-SOLID-021", "confidence": "MEDIUM", "reason": "1:1, devotional" }
   ]
   "selected": "KR-SOLID-022"  // Highest confidence
   ```

2. **For Missing Assets**: File gap in task queue
   ```json
   "unresolved": [
     {
       "slot": "hero_decorative",
       "reason": "No 2:1 landscape asset in manifest",
       "action": "Create new asset in KR-SOLID-038 slot"
     }
   ]
   ```

3. **For Under-Specified Slots**: Add wireframe clarity
   - Work with design team to clarify slot intent
   - Update wireframe with more specific guidance
   - Re-evaluate placement after clarification

### Issue: Token Variable Not Found

**Symptoms**: `--sys-color-custom-value` doesn't exist in tokens.json

**Solutions**:

1. **Check tokens.json**
   ```bash
   grep "custom-value" frontend/src/design/tokens/tokens.json
   ```

2. **Use Valid Semantic Token**
   ```json
   // ❌ Wrong
   "token_refs": ["--sys-color-custom-value"]

   // ✅ Correct
   "token_refs": ["--sys-color-primary-70"]
   ```

3. **For New Tokens**: File design system update
   - Submit token proposal to design team
   - Add to tokens.json and CSS variables
   - Update skill after approval

---

## Best Practices

### 1. Start with Substrate Layer
Always place Z-0 substrate first, then build atmospheric overlays (Z-1–2), then UI accents (Z-3+).

### 2. Token-First Approach
Choose tokens before selecting assets. This ensures visual cohesion and system compliance.

### 3. Progressive Disclosure
Build layered depth intentionally—each layer should add value without obscuring content.

### 4. Manifest as Source of Truth
If an asset isn't in the manifest, don't use it. Request new asset creation instead.

### 5. Document Rationale
Always include rationale for placement choices. This aids design review and future updates.

### 6. Confidence Scoring
Use HIGH/MEDIUM/LOW confidence to flag decisions needing design team approval.

### 7. Test at Multiple Breakpoints
Verify placement strategy works at mobile, tablet, and desktop scales.

### 8. Validate Before Integration
Run full scoring check (score ≥90) before committing to production.

---

## Validation Checklist

- [ ] No hardcoded hex values in token_refs (only `--sys-color-*`)
- [ ] All referenced asset_id entries exist in manifest
- [ ] All unresolved TODO[asset] markers have assignments
- [ ] Hero sections include layered depth with documented intent
- [ ] Z-index ordering respects wireframe layer hierarchy
- [ ] Final score ≥ 90
- [ ] All rationales documented for audit trail
- [ ] Design team approval obtained (if MEDIUM/LOW confidence)

---

## Related Skills

- [wireframe-annotator](../wireframe-annotator/SKILL.md) – Generate annotated wireframes with asset slot specifications
- [token-orchestrator](../token-orchestrator/SKILL.md) – Validate design tokens for DTCG compliance
- [manifest-reconciler](../manifest-reconciler/SKILL.md) – Audit asset manifest for gaps and orphans
- [ui-design-evaluator](../ui-design-evaluator/SKILL.md) – Visual compliance audits for Kerala Rage components
- [component-builder](../component-builder/SKILL.md) – Create production React components with proper asset integration

---

**Last Updated**: 2026-03-06 | **Version**: 6.0.0
