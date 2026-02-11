# Kerala Rage Asset Generation — Imagen 3 Prompts

> **Tool**: Google Imagen 3 (via AI Studio)  
> **Asset Count**: 3 assets  
> **Estimated Time**: 30-45 minutes  
> **Priority**: 2 CRITICAL, 1 MEDIUM

---

## Why Imagen 3 for These Assets

Imagen 3 excels at:
- ✅ Authentic material textures (paper grain, charcoal, ink)
- ✅ Organic, non-digital aesthetics
- ✅ Seamless tileable patterns
- ✅ Photorealistic material photography
- ✅ Expressive screenprint effects

---

## Generation Order (Recommended)

1. **Charcoal Paper Base** (CRITICAL) → Blocks all 11 pages
2. **Screenprint Grain Overlay** (CRITICAL) → Blocks all 11 pages
3. **Ink Slam Mark** (MEDIUM) → Blocks 2 pages (can wait)

---

## Asset 1: Charcoal Paper Base

**Manifest ID**: `KR-SOLID-034`  
**Priority**: CRITICAL  
**File path**: `/assets/kr-solidarity/texture/kr-asset-charcoal-paper.webp`

### Imagen 3 Prompt
```
Matte charcoal paper texture for dark UI background, color #1A1714, 
subtle paper fiber grain visible at high resolution, screenprint-friendly 
surface, no text, no symbols, no gradients, no lighting hotspots, 
seamless tileable texture, weathered brick texture feel, 16:9 aspect ratio, 
minimal contrast variation, authentic material photography style
```

### Generation Settings (AI Studio)
- **Aspect ratio**: 16:9 (landscape)
- **Output format**: PNG (convert to WebP after)
- **Safety settings**: Low (material texture, no sensitive content)
- **Number of images**: Generate 2-3 variations, pick best

### Design Context Reference
From Kerala Rage Brand Brief:
- **Substrate philosophy**: "Charcoal substrate (#1A1A1A) — matte, tactile, non-reflective"
- **Texture goal**: "Weathered brick texture, screenprint canvas"
- **Anti-slop rule**: "No perfect digital gradients, no stock photo lighting"

### Post-Generation Checklist
- [ ] No visible seams when tiled (test 3x3 grid in Figma)
- [ ] Grain visible but not distracting at 100% opacity
- [ ] Color matches `charcoalBackground` token (#1A1A1A ±5%)
- [ ] No accidental symbols, text, or recognizable shapes
- [ ] Feels like authentic paper, not digital noise
- [ ] File size <100KB after WebP conversion

### Usage Context
- **Pages**: 3, 4, 5, 7, 8, 9, 10 (7 pages total)
- **Opacity**: 100% (base substrate)
- **Z-index**: Z-0
- **Behavior**: Static background, full viewport

### Tiling Test Process
1. Download generated PNG
2. Open in Figma/Photoshop
3. Create 3x3 grid (tile 9 times)
4. Check edges for visible seams
5. If seams visible → regenerate with stronger "seamless tileable" emphasis

### WebP Conversion
```bash
cwebp -q 85 kr-asset-charcoal-paper.png -o kr-asset-charcoal-paper.webp
```

Target: <100KB file size

---

## Asset 2: Screenprint Grain Overlay

**Manifest ID**: `KR-SOLID-035`  
**Priority**: CRITICAL  
**File path**: `/assets/kr-solidarity/texture/kr-asset-screenprint-grain.webp`

### Imagen 3 Prompt
```
Screenprint ink grain overlay texture, subtle misregistration speckle, 
fine grit particles, charcoal base color, low contrast, no shapes, 
no text, designed to overlay at 8-15% opacity, seamless tileable, 
16:9 aspect ratio, authentic screenprint press texture, minimal noise, 
ink grain from manual screenprinting process
```

### Generation Settings (AI Studio)
- **Aspect ratio**: 16:9
- **Output format**: PNG (convert to WebP)
- **Safety settings**: Low
- **Number of images**: Generate 3-4 variations (grain is subtle, needs options)

### Design Context Reference
From Kerala Rage Visual Moodboard:
- **Screenprint logic**: "Visual elements behave like ink layers on paper — high contrast, visible texture, deliberate registration"
- **Grit aesthetic**: "Tactile atmosphere without competing with typography"

### Post-Generation Checklist
- [ ] Looks good at 8-15% opacity over charcoal base
- [ ] No distracting patterns when tiled
- [ ] Grain density appropriate for UI (not too busy)
- [ ] No visible seams in 3x3 tiling test
- [ ] Feels like authentic screenprint texture, not digital noise filter
- [ ] File size <50KB after WebP conversion

### Usage Context
- **Pages**: 1, 2, 6, 11 (4 pages) — atmospheric overlay
- **Opacity**: 8-15% (varies by page)
- **Z-index**: Z-0 or Z-1
- **Behavior**: Static overlay, full viewport

### Opacity Testing
After generation, test at multiple opacities:
- 8% (minimal grain)
- 12% (medium grain)
- 15% (maximum grain)

Pick the version that adds texture without overwhelming content.

---

## Asset 3: Ink Slam Mark / Solidarity Seal

**Manifest ID**: `KR-SOLID-041`  
**Priority**: MEDIUM  
**File path**: `/assets/kr-solidarity/ui/kr-asset-ink-slam-mark.png`

### Imagen 3 Prompt
```
Bold screenprint ink slam mark, abstract circular impact shape with 
paint spread and misregistration, solidarity red ink #F14714 with 
gold edge bleed #DAF674, no official stamp design, no text, no insignia, 
no bureaucratic elements, transparent background, 1:1 square, 
expressive hand-pressed screenprint aesthetic, organic ink spread, 
contemporary activist graphic design, Melbourne street art style
```

### Generation Settings (AI Studio)
- **Aspect ratio**: 1:1 (square)
- **Output format**: PNG (keep as PNG for transparency)
- **Safety settings**: Low
- **Number of images**: Generate 4-5 variations (expressive asset, needs options)

### Design Context Reference
From Asset Placement Guide (renamed):
- **OLD NAME**: "Verification stamp" ❌
- **NEW NAME**: "Ink slam mark / solidarity seal" ✅
- **Rationale**: "Avoid bureaucratic aesthetics, keep solidarity documentation feel"
- **Motion**: "Slam animation — scale 2.0→1.0, rotate -30deg→-5deg (0.4s overshoot)"

### Critical Narrative Rules
**MUST AVOID**:
- ❌ Official government stamp designs
- ❌ Circular border with text
- ❌ Coat of arms or insignia
- ❌ "APPROVED" or "VERIFIED" language
- ❌ Bureaucratic/institutional aesthetics

**MUST INCLUDE**:
- ✅ Organic ink spread (hand-pressed feel)
- ✅ Misregistration (screenprint authenticity)
- ✅ Red + gold color bleed
- ✅ Abstract circular impact shape
- ✅ Contemporary activist aesthetic

### Post-Generation Checklist
- [ ] Transparent background (no white halo)
- [ ] No text or official insignia visible
- [ ] Red (#F14714) and gold (#DAF674) colors present
- [ ] Organic, hand-pressed feel (not digital/perfect)
- [ ] Works at 120-160px diameter
- [ ] Reads as "solidarity mark" not "government stamp"
- [ ] Passes narrative QA (anti-bureaucratic)

### Usage Context
- **Pages**: 4 (Ingestion), 9 (Studio Designer)
- **Size**: 120-140px diameter
- **Z-index**: Z-3
- **Behavior**: Slam animation on success triggers

### Animation Implementation
```css
@keyframes inkSlamMark {
  0% {
    transform: scale(2) rotate(-30deg);
    opacity: 0;
  }
  60% {
    transform: scale(0.95) rotate(-3deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(-5deg);
    opacity: 1;
  }
}

.ink-slam-mark {
  animation: inkSlamMark 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Iteration Strategy
If first generation looks too "official":
1. Regenerate with emphasis on "organic ink spread, no official design"
2. Try adding "Melbourne street art protest poster aesthetic"
3. Reference existing manifest asset **KR-SOLID-029** (Paint Splash) for expressive style

---

## Batch Workflow for Imagen 3

### Step 1: Generate Substrate Textures First (Critical Path)
1. Charcoal paper base (2-3 variations)
2. Screenprint grain overlay (3-4 variations)

**Time**: ~20-30 minutes (including iteration)

### Step 2: Test Tiling & Opacity
Before moving to Asset 3:
1. Test charcoal paper tiling (3x3 grid)
2. Test grain overlay at 8%, 12%, 15% opacity
3. Ensure both work together (grain over charcoal)

**Time**: ~10 minutes

### Step 3: Generate Ink Slam Mark
1. Generate 4-5 variations
2. Pick the most "activist/solidarity" version (least bureaucratic)

**Time**: ~10-15 minutes

---

## Imagen 3-Specific Tips

### Tip 1: Emphasize "Seamless Tileable" for Textures
Imagen 3 sometimes ignores this. If seams appear:
- Regenerate with "perfectly seamless tileable texture" at start of prompt
- Try "designed for CSS background-repeat"

### Tip 2: Use "Authentic Material Photography" for Realism
Helps avoid "AI-generated" look:
- "Authentic material photography style"
- "High-resolution scanned texture"
- "Real paper grain, not digital filter"

### Tip 3: Color Accuracy
Imagen 3 can drift from hex codes. If colors off:
- Include hex codes in prompt: `#1A1714`, `#F14714`, `#DAF674`
- Post-process with color correction if needed
- Use "exact color match" in prompt

### Tip 4: Transparent Backgrounds
For ink slam mark:
- Explicitly request "transparent background, PNG format"
- If white background appears, manually remove in Photoshop
- Use "isolated on transparent background" in prompt

---

## Quality Gates (Before Approval)

Each asset must pass:

### Visual QA
- [ ] Matches Kerala Rage screenprint aesthetic
- [ ] No bureaucratic elements (especially ink slam mark)
- [ ] Colors align with design tokens (±10% tolerance)
- [ ] Authentic material feel (not digital/AI-generated look)

### Technical QA
- [ ] File size within limits (textures <100KB, UI <50KB)
- [ ] Correct aspect ratio (16:9 for textures, 1:1 for seal)
- [ ] Minimum resolution met (1920x1080 for textures, 512x512 for seal)
- [ ] WebP/PNG format as specified

### Functional QA
- [ ] Textures tile seamlessly (3x3 grid test)
- [ ] Grain overlay works at 8-15% opacity
- [ ] Ink slam mark scales 120-160px
- [ ] Transparent backgrounds clean (no halos)

### Narrative QA (Critical for Ink Slam Mark)
- [ ] Avoids bureaucratic/institutional aesthetics
- [ ] Reinforces solidarity/resistance themes
- [ ] Culturally appropriate
- [ ] Aligns with "anti-slop" protocol

---

## Manifest Update Template

After generating, add to `kerala-rage-kr-solidarity-manifest.json`:

```json
{
  "id": "KR-SOLID-034|035|041",
  "name": "[Asset Name]",
  "category": "texture|ui",
  "layer": "substrate|atmospheric",
  "aspect_ratio": "16:9|1:1",
  "file_path": "/assets/kr-solidarity/[category]/kr-asset-[name].webp",
  "priority": "CRITICAL|MEDIUM",
  "semantics": {
    "functional_role": "material-base|background-texture|dynamic-overlay",
    "semantic_weight": "material|atmospheric|expressive",
    "layering_role": "background-base|overlay"
  },
  "usage_rules": {
    "scale_suitability": ["hero-background", "global-overlay"],
    "small_ui_safe": false
  },
  "layering_compatibility": {
    "can_overlay_with": [],
    "cannot_overlay_with": ["substrate"]
  }
}
```

---

## Temporary Substitution Strategy

**While waiting for Imagen 3 assets**, use existing manifest assets:

| Missing Asset | Temporary Substitute | Manifest ID |
|---------------|---------------------|-------------|
| Charcoal paper | Melbourne Laneway texture at 100% | KR-SOLID-033 |
| Screenprint grain | Abstract Solidarity at 10-12% | KR-SOLID-028 |
| Ink slam mark | Paint Splash (rotated) | KR-SOLID-029 |

This allows development to proceed while assets generate.

---

**Total Imagen 3 Assets**: 3  
**Estimated Time**: 30-45 minutes  
**Next Step**: See `asset-generation-dalle.md` for UI/geometric assets
