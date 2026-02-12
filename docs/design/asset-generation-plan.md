# Kerala Rage Asset Generation Implementation Plan

> **Purpose**: Executable prompting strategy to generate missing system primitive assets  
> **Version**: 1.0  
> **Last Updated**: February 12, 2026  
> **Based on**: Gap analysis from ChatGPT + manifest v5.0.0

---

## Executive Summary

**Gap identified**: 8 missing system primitive asset types blocking full implementation of 11 wireframe pages.

**Strategy**: Use **DALL-E** for controlled/geometric assets (70% of gaps) and **Imagen 3** for textural/expressive assets (30% of gaps).

**Timeline**: 3 phases, prioritized by page blocking impact.

---

## Tool Selection Matrix

| Asset Type | Tool | Rationale |
|------------|------|-----------|
| **Substrate textures** | Imagen 3 | [DEPRECATED_STYLE] grain, material authenticity, seamless tiling |
| **Wheat-paste tears** | DALL-E | Controlled edge shapes, transparent backgrounds, consistent style |
| **Halo disks** | DALL-E | Geometric precision, gauge tick marks, repeatable |
| **Grit particles** | DALL-E | Small sprites, transparent backgrounds, batch consistency |
| **Solidarity seal** | Imagen 3 | Expressive ink spread, screenprint authenticity, [DEPRECATED_STYLE] impact |

---

## Phase 1: Critical Path (P0) — Substrate + Halo Disk

**Blocks**: All 11 pages  
**Assets to generate**: 4 total

### 1A. Charcoal Paper Base (Imagen 3)

**Asset ID**: `KR-SOLID-034`  
**Category**: texture  
**Layer**: substrate  
**File path**: `/assets/kr-solidarity/texture/kr-asset-charcoal-paper.webp`

**Imagen 3 Prompt**:
```
Matte charcoal paper texture for dark UI background, color #1A1714, 
subtle paper fiber grain visible at high resolution, screenprint-friendly 
surface, no text, no symbols, no gradients, no lighting hotspots, 
seamless tileable texture, weathered brick texture feel, 16:9 aspect ratio, 
minimal contrast variation, authentic material photography style
```

**Generation settings**:
- Aspect ratio: 16:9
- Output format: WebP
- Target size: <100KB (optimize post-generation)
- Safety: Low (material texture)

**Validation criteria**:
- ✅ No visible seams when tiled
- ✅ Grain visible but not distracting at 100% opacity
- ✅ Color matches `charcoalBackground` (#1A1A1A ±5%)
- ✅ No accidental symbols/text artifacts

---

### 1B. Screenprint Grain Overlay (Imagen 3)

**Asset ID**: `KR-SOLID-035`  
**Category**: texture  
**Layer**: atmospheric  
**File path**: `/assets/kr-solidarity/texture/kr-asset-screenprint-grain.webp`

**Imagen 3 Prompt**:
```
Screenprint ink grain overlay texture, subtle misregistration speckle, 
fine grit particles, charcoal base color, low contrast, no shapes, 
no text, designed to overlay at 8-15% opacity, seamless tileable, 
16:9 aspect ratio, authentic screenprint press texture, minimal noise
```

**Generation settings**:
- Aspect ratio: 16:9
- Output format: WebP
- Target size: <50KB
- Safety: Low

**Validation criteria**:
- ✅ Looks good at 8-15% opacity over charcoal
- ✅ No distracting patterns when tiled
- ✅ Grain density appropriate for UI (not too busy)

---

### 1C. Halo Disk Plain (DALL-E)

**Asset ID**: `KR-SOLID-036`  
**Category**: ui  
**Layer**: atmospheric  
**File path**: `/assets/kr-solidarity/ui/kr-asset-halo-disk-plain.png`

**DALL-E Prompt**:
```
Minimal halo disk graphic in screenprint style, imperfect circular form 
with hand-drawn quality, muted gold ink color #DAF674, subtle grain texture, 
no religious iconography, no text, no symbols inside circle, transparent 
background, 1:1 square format, simple radiant glow effect, 
contemporary Australian design aesthetic
```

**Generation settings**:
- Aspect ratio: 1:1 (square)
- Style: Natural (not vivid)
- Output: PNG with transparency
- Size: 512x512px minimum

**Validation criteria**:
- ✅ Transparent background
- ✅ Gold color matches `inkGold` token
- ✅ Circle is imperfect (not perfect geometry)
- ✅ No religious symbols
- ✅ Scales well 60px-300px

---

### 1D. Halo Disk Gauge (DALL-E)

**Asset ID**: `KR-SOLID-037`  
**Category**: ui  
**Layer**: atmospheric  
**File path**: `/assets/kr-solidarity/ui/kr-asset-halo-disk-gauge.png`

**DALL-E Prompt**:
```
Minimal halo disk gauge in screenprint style, imperfect ring with 
simple tick marks around perimeter, muted gold ink #DAF674, subtle grain, 
no numbers, no text, transparent background, 1:1 square, designed for 
needle rotation animation 0-100 degrees, contemporary minimalist gauge design
```

**Generation settings**:
- Aspect ratio: 1:1
- Style: Natural
- Output: PNG with transparency
- Size: 512x512px minimum

**Validation criteria**:
- ✅ Transparent background
- ✅ Tick marks evenly distributed (8-12 marks)
- ✅ Center point clear for needle pivot
- ✅ Works as functional gauge at 180-200px diameter

**Post-generation task**: Create needle SVG overlay separately (CSS-driven rotation).

---

## Phase 2: High Priority (P1) — Wheat-Paste + Grit

**Blocks**: 6 pages (Landing, Auth, Opportunity Feed, Kanban, Dashboard)  
**Assets to generate**: 3 total

### 2A. Wheat-Paste Tear Corner (DALL-E)

**Asset ID**: `KR-SOLID-038`  
**Category**: motif  
**Layer**: atmospheric  
**File path**: `/assets/kr-solidarity/motif/kr-asset-wheat-paste-tear-corner.png`

**DALL-E Prompt**:
```
Torn wheat-paste poster corner edge, irregular ripped paper silhouette 
with visible layered paper fibers, screenprint aesthetic, limited palette 
of off-white aged paper with faint red and gold ink residue, no readable text, 
transparent background, large corner framing element, 1:1 square format, 
street art poster texture, Melbourne laneway aesthetic
```

**Generation settings**:
- Aspect ratio: 1:1
- Style: Natural
- Output: PNG with transparency
- Size: 1024x1024px (needs to be large for corner framing)

**Validation criteria**:
- ✅ Transparent background
- ✅ Torn edge looks [DEPRECATED_STYLE] (not cut)
- ✅ Paper layers visible
- ✅ No readable text or symbols
- ✅ Scales well at 320-400px width

**Usage notes**: Generate 2 variations (top-right and bottom-left orientations) by flipping/rotating.

---

### 2B. Wheat-Paste Header Strip (DALL-E)

**Asset ID**: `KR-SOLID-039`  
**Category**: motif  
**Layer**: atmospheric  
**File path**: `/assets/kr-solidarity/motif/kr-asset-wheat-paste-strip.png`

**DALL-E Prompt**:
```
Horizontal torn wheat-paste strip, 60px visual height, irregular torn 
top and bottom edges, subtle paper grain, no text, transparent background, 
designed as repeating column header decoration, 4:1 wide aspect ratio, 
aged poster paper texture, minimal ink residue, street art aesthetic
```

**Generation settings**:
- Aspect ratio: Custom (aim for ~800x200px)
- Style: Natural
- Output: PNG with transparency

**Validation criteria**:
- ✅ Transparent background
- ✅ Horizontal orientation
- ✅ Top and bottom edges both torn
- ✅ Can tile horizontally without obvious seams
- ✅ Works at 60px height

---

### 2C. Grit Particles Sprite Pack (DALL-E)

**Asset ID**: `KR-SOLID-040`  
**Category**: ui  
**Layer**: atmospheric  
**File path**: `/assets/kr-solidarity/ui/kr-asset-grit-particles.png`

**DALL-E Prompt**:
```
Set of 12 small screenprint grit particles arranged in grid, 
black and gold ink flecks and specks, transparent background, 
designed for UI particle animation, minimal and subtle, no symbols, 
no text, various sizes 8-16px, authentic screenprint press debris, 
square format with particles evenly distributed
```

**Generation settings**:
- Aspect ratio: 1:1
- Style: Natural
- Output: PNG with transparency
- Size: 512x512px (will be sliced into individual sprites)

**Validation criteria**:
- ✅ Transparent background
- ✅ 8-12 distinct particles
- ✅ Variety in size and shape
- ✅ No recognizable symbols
- ✅ Each particle works at 8-16px scale

**Post-generation task**: Slice into individual sprite PNGs (8-12 files) for CSS animation.

---

## Phase 3: Medium Priority (P2) — Solidarity Seal

**Blocks**: 2 pages (Ingestion, Studio Designer)  
**Assets to generate**: 1 total

### 3A. Ink Slam Mark / Solidarity Seal (Imagen 3)

**Asset ID**: `KR-SOLID-041`  
**Category**: ui  
**Layer**: atmospheric  
**File path**: `/assets/kr-solidarity/ui/kr-asset-ink-slam-mark.png`

**Imagen 3 Prompt**:
```
Bold screenprint ink slam mark, abstract circular impact shape with 
paint spread and misregistration, solidarity red ink #F14714 with 
gold edge bleed #DAF674, no official stamp design, no text, no insignia, 
no bureaucratic elements, transparent background, 1:1 square, 
expressive hand-pressed screenprint aesthetic, [DEPRECATED_STYLE] ink spread, 
contemporary activist graphic design
```

**Generation settings**:
- Aspect ratio: 1:1
- Output: PNG with transparency
- Size: 512x512px minimum
- Safety: Low

**Validation criteria**:
- ✅ Transparent background
- ✅ No text or official insignia
- ✅ Red and gold colors match tokens
- ✅ [DEPRECATED_STYLE], hand-pressed feel (not digital/perfect)
- ✅ Works at 120-160px diameter
- ✅ Reads as "solidarity mark" not "government stamp"

**Animation spec** (for implementation):
```css
@keyframes inkSlamMark {
  0% { transform: scale(2) rotate(-30deg); opacity: 0; }
  60% { transform: scale(0.95) rotate(-3deg); opacity: 1; }
  100% { transform: scale(1) rotate(-5deg); opacity: 1; }
}
```

---

## Batch Generation Workflow

### Step 1: Generate all DALL-E assets first (5 assets)
**Why**: DALL-E is faster, more predictable, handles transparency well

**Order**:
1. Halo disk plain (1C)
2. Halo disk gauge (1D)
3. Wheat-paste corner (2A)
4. Wheat-paste strip (2B)
5. Grit particles (2C)

**Estimated time**: 15-20 minutes total

---

### Step 2: Generate Imagen 3 assets (3 assets)
**Why**: Slower, requires more iteration, better for textures

**Order**:
1. Charcoal paper (1A) — CRITICAL
2. Screenprint grain (1B) — CRITICAL
3. Ink slam mark (3A) — Can wait

**Estimated time**: 30-45 minutes total (including iterations)

---

### Step 3: Post-processing pipeline

For each generated asset:

1. **Optimize file size**:
   ```bash
   # WebP conversion for textures
   cwebp -q 85 input.png -o output.webp
   
   # PNG optimization for UI elements
   pngquant --quality=85-95 input.png -o output.png
   ```

2. **Validate dimensions**:
   - Textures: 16:9 ratio, minimum 1920x1080px
   - UI elements: Square, minimum 512x512px
   - Strips: Custom, minimum 800px width

3. **Test tiling** (textures only):
   - Open in Figma/Photoshop
   - Create 3x3 grid
   - Check for visible seams

4. **Color validation**:
   - Sample dominant colors
   - Compare to design tokens
   - Adjust if >10% deviation

---

## Manifest Update Template

After generating each asset, add to manifest:

```json
{
  "id": "KR-SOLID-0XX",
  "name": "[Asset Name]",
  "category": "[texture|ui|motif]",
  "layer": "[substrate|atmospheric]",
  "aspect_ratio": "[ratio]",
  "file_path": "/assets/kr-solidarity/[category]/kr-asset-[name].webp",
  "priority": "CRITICAL|HIGH|MEDIUM",
  "semantics": {
    "functional_role": "[role]",
    "semantic_weight": "[weight]",
    "layering_role": "[layer-role]"
  },
  "usage_rules": {
    "scale_suitability": ["hero", "section", "card"],
    "small_ui_safe": true|false
  },
  "layering_compatibility": {
    "can_overlay_with": ["substrate", "atmospheric"],
    "cannot_overlay_with": []
  }
}
```

---

## Asset Placement Document Updates

After generation, update `06b-asset-placement.md`:

### Global Find-Replace Operations

| Old Token | New Reference | Manifest ID |
|-----------|---------------|-------------|
| `{kr-asset-charcoal-paper}` | `KR-SOLID-034` | Charcoal Paper Base |
| `{kr-asset-screenprint-grain}` | `KR-SOLID-035` | Screenprint Grain Overlay |
| `{kr-asset-field-grid}` | *Keep as placeholder* | Not generated (CSS-based) |
| `{kr-asset-field-layout}` | *Keep as placeholder* | Not generated (CSS-based) |
| `{kr-asset-halo-disk}` | `KR-SOLID-036` (plain) or `KR-SOLID-037` (gauge) | Context-dependent |
| `{kr-asset-wheat-paste-tear}` | `KR-SOLID-038` (corner) or `KR-SOLID-039` (strip) | Context-dependent |
| `{kr-asset-screenprint-grit}` | `KR-SOLID-040` | Grit Particles Pack |
| `{kr-asset-ink-slam-mark}` | `KR-SOLID-041` | Solidarity Seal |

---

## Quality Assurance Checklist

Before marking any asset as "complete":

### Visual QA
- [ ] Matches design system aesthetic (screenprint, street art, solidarity)
- [ ] No accidental bureaucratic elements (stamps, forms, official seals)
- [ ] Colors align with design tokens (±10% tolerance)
- [ ] Transparent backgrounds clean (no white halos)

### Technical QA
- [ ] File size within limits (textures <100KB, UI <50KB)
- [ ] Correct aspect ratio
- [ ] Minimum resolution met
- [ ] WebP/PNG format as specified

### Functional QA
- [ ] Works at specified opacity ranges
- [ ] Scales appropriately (test at min/max sizes)
- [ ] Tiles seamlessly (textures only)
- [ ] No visual artifacts at target sizes

### Narrative QA
- [ ] Avoids bureaucratic/institutional aesthetics
- [ ] Reinforces solidarity/resistance themes
- [ ] Culturally appropriate (no appropriation)
- [ ] Aligns with "anti-slop" protocol

---

## Risk Mitigation

### Risk 1: DALL-E generates text artifacts
**Mitigation**: Explicitly state "no text" in every prompt, regenerate if text appears

### Risk 2: Imagen 3 produces non-tileable textures
**Mitigation**: Use "seamless tileable" in prompt, test tiling before approval, regenerate if seams visible

### Risk 3: Colors don't match design tokens
**Mitigation**: Include hex codes in prompts, color-correct in post-processing if needed

### Risk 4: Transparent backgrounds have artifacts
**Mitigation**: Use PNG format, check alpha channel, manually clean in Photoshop if needed

### Risk 5: Assets feel "too AI" (slop aesthetic)
**Mitigation**: Iterate 2-3 times per asset, prioritize authentic material photography style for textures

---

## Success Metrics

**Phase 1 complete when**:
- ✅ All 11 pages can use real substrate (not placeholder)
- ✅ Halo disk works functionally as gauge on Page 5
- ✅ No placeholder tokens for substrate/halo in any wireframe

**Phase 2 complete when**:
- ✅ Landing, Dashboard, Opportunity Feed have real wheat-paste tears
- ✅ Grit particles animate smoothly on 6 pages
- ✅ Kanban columns have real header strips

**Phase 3 complete when**:
- ✅ Ingestion and Studio Designer have real solidarity seal
- ✅ Slam animation works with real asset
- ✅ Zero placeholder tokens remain in `06b-asset-placement.md`

---

## Next Actions

1. **Immediate**: Generate Phase 1 assets (charcoal paper + halo disks)
2. **Day 2**: Generate Phase 2 assets (wheat-paste + grit)
3. **Day 3**: Generate Phase 3 asset (solidarity seal)
4. **Day 4**: Update manifest + asset placement doc
5. **Day 5**: QA all assets, regenerate any failures

---

**Document Status**: Ready for execution  
**Estimated Total Time**: 2-3 hours (generation + QA)  
**Blocking Dependencies**: None (can start immediately)
