# Strategic Execution Guide: Kerala Rage Asset Gaps

**Source**: Hero Engine Strategic Report
**Status**: Asset Gap Closure Phase 1
**Date**: 2026-02-24

---

## Executive Summary

This document operationalizes recommendations from the Strategic Report into executable asset generation prompts and implementation tasks. The three primary gaps are:

1. **Atmospheric "Melbourne Grit" Overlays** (Film grain, wet pavement, urban steam)
2. **Substrate Variety** (3+ distinct backgrounds: rusted iron, weathered brick, night-sky-over-pylon)
3. **Contemporary Resistance Portraits** (Modern activist silhouettes, not historical)

---

## Phase 1: Melbourne Grit Overlays (KR-GRIT-001 → KR-GRIT-003)

### Gap Analysis
Currently, hero compositions rely on `auto` or abstract noise. Need specific **atmospheric connective tissue** to unify high-contrast portraits with substrates.

### Generated Prompts (Nano Banana Pro)

#### KR-GRIT-001: Film Grain Overlay
```
Generate a high-resolution film grain texture suitable as an atmospheric overlay.
Style: 1970s documentary photography grain, analog film stock aesthetic.
Colors: Grayscale only, neutral tones across #333333 to #CCCCCC range.
Texture: Fine-tooth grain pattern, consistent density, zero focal points.
Dimensions: 2048×2048px, seamless tileable pattern.
Use: Screen-blend overlay at 15-20% opacity over hero compositions.
Optimized for: Nano Banana Pro, archive-quality legibility.
```

**Prompt Execution**:
```bash
npx ts-node tools/scripts/gemini-hero-generator.ts generate-texture "asset_id:KR-GRIT-001" "texture:film-grain-1970s" "style:documentary-analog"
```

---

#### KR-GRIT-002: Wet Pavement Reflections
```
Generate an atmospheric texture of wet Melbourne laneway pavement after rain.
Style: Urban street photography, reflective surfaces, pooled water with light ripples.
Colors: Base #1A1A1A (charcoal), reflections in `--sys-color-labWrenMetalBlue-base` (#48B3DA), hints of `--sys-color-stencilYellow-base` (#F6E748) streetlight.
Texture: Subtle ripples, reflection distortion, broken light patterns, high-contrast edge definition.
Dimensions: 2048×2048px, seamless tileable.
Use: Overlay at 25-30% opacity to add urban grit and reflective depth.
Optimized for: Nano Banana Pro, realistic pavement authenticity.
```

**Prompt Execution**:
```bash
npx ts-node tools/scripts/gemini-hero-generator.ts generate-texture "asset_id:KR-GRIT-002" "texture:wet-pavement" "style:melbourne-laneway"
```

---

#### KR-GRIT-003: Urban Steam & Aerosol Haze
```
Generate an atmospheric haze layer simulating urban steam, aerosol spray, or industrial fog.
Style: Melbourne street art environment, diffuse light through particulate air.
Colors: Base transparent (alpha 0.1-0.3), tinted with `--sys-color-solidarityRed-base` (#F14714) at 10% saturation, shadows in `--sys-color-charcoalBackground-base` (#0F0F0F).
Texture: Soft diffusion, organic particle swirls, zero hard edges, dreamlike quality.
Dimensions: 2048×2048px, seamless tileable.
Use: Overlay at 10-15% opacity for atmospheric depth and dreamy separation.
Optimized for: Nano Banana Pro, subtle environmental storytelling.
```

**Prompt Execution**:
```bash
npx ts-node tools/scripts/gemini-hero-generator.ts generate-texture "asset_id:KR-GRIT-003" "texture:urban-steam-haze" "style:industrial-environment"
```

---

## Phase 2: Substrate Variety (KR-SUB-002 → KR-SUB-004)

### Gap Analysis
Current compositions rely heavily on `KR-SUB-001`. Need 3 distinct "Massive Scale" backgrounds with different urban/cultural textures.

### Generated Prompts (Nano Banana Pro)

#### KR-SUB-002: Rusted Corrugated Iron (Industrial)
```
Generate a high-contrast image of aged, rusted corrugated metal sheet wall.
Style: Melbourne industrial warehouse aesthetic, weathered rust layers, oxidation patterns.
Colors: Dominant `--sys-color-charcoalBackground-steps` (#0F0F0F to #323232 range), rust in `--sys-color-solidarityRed-steps` (#A02F0F to #FF6B3D range), metallic highlights in `--sys-color-concreteGrey-base` (#A39B8F).
Texture: Heavy corrosion, peeling paint, grit overlay, uneven weathering, zero corporate polish.
Dimensions: 16:9 aspect ratio, 2560×1440px, suitable as hero background substrate.
Use: Full-bleed background for resistance/industrial-themed heroes.
Optimized for: Nano Banana Pro, authentic urban decay.
```

**Prompt Execution**:
```bash
npx ts-node tools/scripts/gemini-hero-generator.ts generate-substrate "asset_id:KR-SUB-002" "substrate:industrial-rust" "style:warehouse-decay"
```

---

#### KR-SUB-003: Weathered Brick & Plaster (Urban)
```
Generate a high-contrast image of old, weathered brick wall with peeling plaster and graffiti remnants.
Style: Melbourne laneway street art context, urban fabric, historic building wall.
Colors: Base reds and browns in `--sys-color-solidarityOrange-steps` (#5C3A1E to #FA E2D0), underlying charcoal in `--sys-color-charcoalBackground-steps`, faded yellow in `--sys-color-stencilYellow-steps` (#9A8F1F to #FFFCC8).
Texture: Decaying plaster pockets, brick texture variation, graffiti ghosts (remnants of old paint), weathering salt blooms, cultural storytelling through wear.
Dimensions: 16:9 aspect ratio, 2560×1440px.
Use: Medium-contrast background layer for cultural/community-focused heroes.
Optimized for: Nano Banana Pro, heritage urban authenticity.
```

**Prompt Execution**:
```bash
npx ts-node tools/scripts/gemini-hero-generator.ts generate-substrate "asset_id:KR-SUB-003" "substrate:urban-brick-plaster" "style:laneway-heritage"
```

---

#### KR-SUB-004: Night Sky Over Industrial Pylon (Futuristic)
```
Generate a high-contrast image of night sky with industrial infrastructure silhouette (electrical pylon, transmission tower).
Style: Futuristic Melbourne skyline, tech-infrastructure meets environmental concern, starlit atmosphere.
Colors: Night sky in deep `--sys-color-charcoalBackground-steps` (#0F0F0F, #242424), pylon silhouette in solid black, stars scattered in `--sys-color-inkGold-base` (#DAF674) and `--sys-color-stencilYellow-base` (#F6E748), hint of dawn on horizon in `--sys-color-solidarityRed-steps-4` (#FF9470).
Texture: Soft star field, crisp pylon outline, atmospheric haze at horizon, zero clouds, contemplative mood.
Dimensions: 16:9 aspect ratio, 2560×1440px.
Use: Dark, introspective background for future-forward or environmental themes.
Optimized for: Nano Banana Pro, dystopian-yet-hopeful tone.
```

**Prompt Execution**:
```bash
npx ts-node tools/scripts/gemini-hero-generator.ts generate-substrate "asset_id:KR-SUB-004" "substrate:night-pylon-sky" "style:futuristic-infrastructure"
```

---

## Phase 3: Contemporary Resistance Portraits (KR-PORT-001 → KR-PORT-003)

### Gap Analysis
Current portraits are historically heavy (independence leaders, historical figures). Need **modern Resistance layer** with contemporary activism context.

### Generated Prompts (Nano Banana Pro)

#### KR-PORT-001: Youth Activist Silhouette (Fist)
```
Generate an abstract silhouette illustration of a young activist with raised fist.
Style: Stencil art, Melbourne street art aesthetic, modern protest symbolism.
Colors: Foreground silhouette in solid `--sys-color-solidarityRed-base` (#F14714) or `--sys-color-worker-ash-base` (#DAF6B3), background transparent.
Details: Simplified features (no facial details), suggested hoodie/cap outline, emphatic fist posture, halo of light/energy around figure.
Dimensions: Portrait aspect (3:4), 1440×1920px, seamless background for layering.
Use: Resistance Portrait layer (Z-1, multiply blend) over substrates.
Optimized for: Nano Banana Pro, iconic activism symbolism.
```

**Prompt Execution**:
```bash
npx ts-node tools/scripts/gemini-hero-generator.ts generate-portrait "asset_id:KR-PORT-001" "portrait:activist-fist-silhouette" "style:stencil-protest"
```

---

#### KR-PORT-002: Workers Collective Hand (Solidarity)
```
Generate an abstract illustration of multiple interlinked hands in solidarity.
Style: Woodcut print aesthetic, solidarity/collective action symbolism, modern workers' rights context.
Colors: Foreground hands in layered tones: `--sys-color-solidarityRed-base` (#F14714), `--sys-color-worker-ash-base` (#DAF6B3), `--sys-color-inkGold-base` (#DAF674).
Details: 3-4 hands interlocking, expressive line work, no faces, emphasize connection and collective power, slight geometric distortion.
Dimensions: Portrait aspect (3:4), 1440×1920px.
Use: Resistance Portrait layer for labor solidarity themes.
Optimized for: Nano Banana Pro, modern workers' movement.
```

**Prompt Execution**:
```bash
npx ts-node tools/scripts/gemini-hero-generator.ts generate-portrait "asset_id:KR-PORT-002" "portrait:collective-hands-solidarity" "style:woodcut-activism"
```

---

#### KR-PORT-003: Digital Native Activist (Tech Resistance)
```
Generate an abstract silhouette of a tech-savvy activist figure with digital/technological elements.
Style: Modern street art + digital culture, cyberpunk-activist hybrid, Melbourne tech community context.
Colors: Figure in `--sys-color-charcoalBackground-base` (#0F0F0F), digital accents in `--sys-color-signalGreen-base` (#48F0E5) and `--sys-color-stencilYellow-base` (#F6E748).
Details: Figure silhouette with suggested laptop/device, circuit-board-inspired line work, holographic aesthetic suggestions, no photorealism.
Dimensions: Portrait aspect (3:4), 1440×1920px.
Use: Resistance Portrait layer for tech/digital activism themes.
Optimized for: Nano Banana Pro, contemporary digital activism.
```

**Prompt Execution**:
```bash
npx ts-node tools/scripts/gemini-hero-generator.ts generate-portrait "asset_id:KR-PORT-003" "portrait:digital-activist" "style:cyberpunk-street-art"
```

---

## Phase 4: Execution Workflow (Hero Engine CLI)

### Prerequisites
Ensure `.env.local` contains valid `GEMINI_API_KEY`:
```bash
echo $GEMINI_API_KEY  # Verify API key is set
```

### Batch Generation Command
Execute all assets in one batch (recommended for efficiency):

```bash
# Generate all grit overlays
npx ts-node tools/scripts/gemini-hero-generator.ts generate-texture "asset_id:KR-GRIT-001" "texture:film-grain" && \
npx ts-node tools/scripts/gemini-hero-generator.ts generate-texture "asset_id:KR-GRIT-002" "texture:wet-pavement" && \
npx ts-node tools/scripts/gemini-hero-generator.ts generate-texture "asset_id:KR-GRIT-003" "texture:urban-steam"

# Generate all substrates
npx ts-node tools/scripts/gemini-hero-generator.ts generate-substrate "asset_id:KR-SUB-002" "substrate:rust" && \
npx ts-node tools/scripts/gemini-hero-generator.ts generate-substrate "asset_id:KR-SUB-003" "substrate:brick" && \
npx ts-node tools/scripts/gemini-hero-generator.ts generate-substrate "asset_id:KR-SUB-004" "substrate:pylon-sky"

# Generate all portraits
npx ts-node tools/scripts/gemini-hero-generator.ts generate-portrait "asset_id:KR-PORT-001" "portrait:activist-fist" && \
npx ts-node tools/scripts/gemini-hero-generator.ts generate-portrait "asset_id:KR-PORT-002" "portrait:hands-solidarity" && \
npx ts-node tools/scripts/gemini-hero-generator.ts generate-portrait "asset_id:KR-PORT-003" "portrait:digital-activist"
```

### Registry Auto-Update
The Hero Engine automatically:
1. Generates asset via Gemini
2. Validates against kr-solidarity-manifest.json
3. Updates hero-registry.json with composition metadata
4. Registers in asset catalog

---

## Phase 5: Hero Composition Patterns (Pattern A: Street Canon)

### Pattern A: The Street Canon (Recommended for Landing/Dashboard)

**Composition Strategy**:
```json
{
  "pattern": "street-canon",
  "layers": [
    {
      "z_index": 0,
      "asset_id": "KR-SUB-002",  // Rusted corrugated iron (industrial foundation)
      "blend_mode": "normal",
      "opacity": 1.0,
      "role": "substrate"
    },
    {
      "z_index": 1,
      "asset_id": "KR-PORT-001",  // Youth activist fist silhouette
      "blend_mode": "multiply",
      "opacity": 0.75,
      "role": "resistance-portrait",
      "placement": "center"
    },
    {
      "z_index": 2,
      "asset_id": "KR-GRIT-002",  // Wet pavement reflections
      "blend_mode": "screen",
      "opacity": 0.25,
      "role": "atmospheric-glue"
    },
    {
      "z_index": 3,
      "type": "typography",
      "text": "Workers Rise",
      "state": "pressure-high",
      "typography_config": {
        "font_family": "Fraunces",
        "font_weight": 900,
        "font_width": 75,
        "font_size": "72px",
        "color": "--sys-color-solidarityRed-base",
        "letter_spacing": "0em"
      },
      "role": "ui-text-overlay"
    }
  ],
  "color_bleed": {
    "enabled": true,
    "source_asset": "KR-SUB-002",
    "extract_color": "dominant-shadow",
    "apply_to": "typography-halo",
    "blend_mode": "color-burn",
    "opacity": 0.3
  }
}
```

**Execution Command**:
```bash
npx ts-node tools/scripts/gemini-hero-generator.ts compose-pattern "pattern:street-canon" "subtitle:Workers Rise" "mood:solidarity-protest"
```

---

## Implementation Checklist

- [ ] Generate KR-GRIT-001, KR-GRIT-002, KR-GRIT-003 (Melbourne Grit overlays)
- [ ] Generate KR-SUB-002, KR-SUB-003, KR-SUB-004 (Substrate variety)
- [ ] Generate KR-PORT-001, KR-PORT-002, KR-PORT-003 (Contemporary Resistance portraits)
- [ ] Validate all assets in manifest (9 new entries)
- [ ] Test Pattern A: Street Canon composition on Landing page
- [ ] Verify color bleed functionality with Gemini 3.1 Pro vision analysis
- [ ] Register all compositions in hero-registry.json
- [ ] Deploy assets to `frontend/public/assets/kr-solidarity/`

---

## Success Criteria

✅ **Atmospheric Glue**: All 3 grit overlays tested at 15-30% opacity, seamless blend with substrates
✅ **Substrate Variety**: 3 new substrates deployed, each with distinct visual character
✅ **Contemporary Resistance**: Modern activist portraits registered and usable in compositions
✅ **Dynamic Color Bleed**: Substrate dominant colors extracted and applied to typography halos
✅ **Pattern A Validation**: Street Canon pattern tested on 3+ pages with ≥90% visual compliance

---

**Next Phase**: SVG Masking & Kinetic Layers (Phase 6)
