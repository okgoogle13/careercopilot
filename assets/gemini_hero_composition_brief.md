# Gemini Hero Composition Generation Brief

**Date**: 2026-02-26
**Project**: Kerala Rage kr-solidarity Design System
**Task**: Generate layered hero compositions using cataloged assets
**Model**: Gemini 3.1 Pro (vision + composition capabilities)

---

## Context

You are compositing multi-layer hero images for the **kerala-rage kr-solidarity** design system. This system expresses contemporary activism through Kerala diaspora + Melbourne/Naarm aesthetics.

### Design Identity

- **Mode**: Solidarity (unified resistance, contemporary activism)
- **Aesthetic**: Melbourne laneway grit + Kerala heritage + First Nations solidarity
- **Palette**: kr-ink-gold (#D4A84B), waratahRed (#C45C4B), ochreEarth (#B8733D), gumLeafGreen (#6B7F6E), asphaltBlack (#1A1714), paperWhite (#F5F0E8)
- **Typography**: Extreme contrast (Fraunces headlines, Work Sans body)
- **Treatment**: Textured, gritty, atmospheric — NOT clean vector

---

## Asset Inventory (Post-Triage)

### Newly Cataloged (Priority for Hero Use)

1. **KR-LAND-001**: Flinders Street Station at night (kr-ink-gold illumination, star field)
2. **KR-GRIT-001-V2**: Asphalt grain texture (atmospheric overlay)
3. **KR-GRIT-002-V2**: Wet pavement reflections (blue + gold)
4. **KR-PORT-001-V2**: Activist fist with radiant burst (kr-ink-gold/waratahRed)
5. **KR-PORT-002-V2**: Collective hands tricolor (solidarity gesture)
6. **KR-SUB-005**: Night pylon sunset (variant substrate)

### Existing Canonical Assets (Approved for Layering)

**Substrate Layer** (base):
- KR-SUB-001: Melbourne Laneway Texture
- KR-SUB-002: Rusted Corrugated Iron
- KR-SUB-003: Weathered Brick & Plaster
- KR-SUB-004: Night Sky Over Industrial Pylon

**Atmospheric Layer** (connective glue):
- KR-SOLID-001: Abstract solidarity ChatGPT
- KR-SOLID-002: Abstract solidarity DALL-E
- KR-GRIT-003: Urban Steam & Aerosol Haze

**Resistance Layer** (focal):
- KR-RES-001: Bhagat Singh
- KR-RES-002: Tipu Sultan
- KR-RES-003: Turbaned Man

**Cultural Layer** (heritage):
- KR-CUL-001: Kerala Elephant
- KR-CUL-002: Kerala Landscape

**Spiritual Layer** (anchor):
- KR-SPIR-001: Devotional Cultural Anchor
- KR-SPIR-002: Shiva Statue

---

## Hero Composition Patterns

### Pattern A: Industrial Resistance (3 layers)
```
[BASE] Substrate (rusted iron / weathered brick)
[MID] Resistance focal (activist silhouette / collective hands)
[TOP] Atmospheric glue (wet pavement / film grain) — 15-30% opacity
```

**Example**: KR-PORT-002-V2 over KR-SUB-002 with KR-GRIT-002-V2 overlay

### Pattern B: Landmark Identity (4 layers)
```
[BASE] Landmark substrate (Flinders Street Station)
[L2] Atmospheric fog/grain (asphalt texture / urban steam)
[L3] Cultural or spiritual element (elephant / devotional)
[L4] Resistance element (subtle, 40-60% opacity)
```

**Example**: KR-LAND-001 + KR-GRIT-001-V2 + KR-CUL-001 + KR-PORT-001-V2 (faded)

### Pattern C: Tricolor Solidarity (4 layers)
```
[BASE] Substrate texture
[L2] waratahRed resistance element (left position, 65% opacity)
[L3] kr-ink-gold cultural element (right position, 55% opacity)
[L4] gumLeafGreen atmospheric glue (full cover, 12% opacity)
```

**Example**: KR-SUB-003 + KR-PORT-001-V2 (left) + KR-CUL-002 (right) + KR-GRIT-003 (overlay)

---

## Composition Requirements

### Layer Structure (M3 Expressive Standard)
- **Minimum**: 3 layers
- **Target**: 4+ layers (67% of compositions should have >= 4 layers)
- **Maximum**: 5 layers (avoid visual clutter)

### Blend Modes
- **Substrate**: `normal`, 100% opacity
- **Resistance/Cultural/Spiritual**: `multiply` or `normal`, 60-100% opacity
- **Atmospheric**: `screen`, `overlay`, `color-dodge`, 10-30% opacity

### Color Compliance
- **ALL compositions must use semantic kr-solidarity palette**
- No purple gradients, no clinical blues, no generic cyberpunk neon
- Dominant tones: kr-ink-gold, waratahRed, asphaltBlack
- Accent: gumLeafGreen, ochreEarth

### Grit & Texture
- **Mandatory**: Atmospheric grain/texture layer on all compositions
- Avoid clean vector aesthetics
- Melbourne laneway grit = subtle noise, film grain, urban decay

---

## Typography Integration (For Reference)

Each hero composition supports M3 Expressive typography with variable font axis manipulation:

**Pressure State** (defiance):
- wght: 900, wdth: 75
- Headline: "Workers Rise", "Solidarity Across Borders"

**Solidarity State** (collective):
- wght: 800, wdth: 120
- Headline: "Intersectional Futures", "Between Two Worlds"

**Melancholy State** (reflection):
- wght: 475, wdth: 97.5
- Headline: "Legacy of Resistance", "Heritage as Resistance"

**Motion**: M3 Expressive bezier [0.34, 1.56, 0.64, 1]

---

## Gemini Generation Instructions

### Step 1: Select Asset Combination
Choose 3-5 assets from the inventory above that create semantic cohesion:
- **Substrate**: Melbourne identity (laneway, brick, iron, landmark)
- **Focal**: Resistance or cultural icon (hands, fist, elephant, devotional)
- **Atmospheric**: Grit/connective layer (grain, reflections, steam)

### Step 2: Determine Layer Order & Opacity
```json
{
  "layers": [
    {"type": "substrate", "asset_id": "KR-SUB-002", "z_index": 0, "opacity": 1.0, "blend_mode": "normal"},
    {"type": "resistance", "asset_id": "KR-PORT-002-V2", "z_index": 1, "opacity": 0.75, "blend_mode": "multiply"},
    {"type": "atmospheric", "asset_id": "KR-GRIT-002-V2", "z_index": 2, "opacity": 0.25, "blend_mode": "screen"}
  ]
}
```

### Step 3: Apply Solidarity Palette
- Ensure kr-ink-gold or waratahRed are dominant visible colors
- Avoid color shifts that introduce off-palette hues
- Melbourne grit = desaturated, earthy tones with metallic accents

### Step 4: Composite & Export
- Output format: PNG, 1920x1080 (16:9) or 1440x1920 (3:4 portrait)
- Ensure atmospheric texture is visible but subtle
- Verify no clean vector aesthetic remains

---

## Requested Compositions (Priority Order)

### 1. **Melbourne Solidarity Hero** (Pattern B)
- **Layers**: KR-LAND-001 (base) + KR-GRIT-001-V2 (fog) + KR-PORT-002-V2 (hands, 60% opacity, center)
- **Palette**: kr-ink-gold dominant, asphaltBlack substrate
- **Typography**: "Intersectional Futures" (solidarity state)
- **Output**: `kr-hero-melbourne-solidarity-001.png`

### 2. **Industrial Collective Hero** (Pattern A)
- **Layers**: KR-SUB-002 (rusted iron) + KR-PORT-001-V2 (fist radiance) + KR-GRIT-002-V2 (wet pavement, 20%)
- **Palette**: waratahRed + kr-ink-gold burst, industrial decay substrate
- **Typography**: "Workers Rise" (pressure state)
- **Output**: `kr-hero-industrial-collective-002.png`

### 3. **Cultural Anchor Hero** (Pattern C)
- **Layers**: KR-SUB-003 (brick) + KR-CUL-001 (elephant, left, 65%) + KR-SPIR-001 (devotional, right, 55%) + KR-GRIT-003 (steam, 12%)
- **Palette**: ochreEarth + gumLeafGreen balance
- **Typography**: "Cultural Roots, Global Struggle" (melancholy state)
- **Output**: `kr-hero-cultural-anchor-003.png`

### 4. **Night Contemplation Hero** (Pattern B, 4 layers)
- **Layers**: KR-SUB-005 (night pylon sunset) + KR-GRIT-001-V2 (grain, 15%) + KR-SPIR-002 (Shiva, 80%) + KR-PORT-001-V2 (faint fist, 40%, background)
- **Palette**: kr-ink-gold sunset + waratahRed sky, spiritual focus
- **Typography**: "Between Two Worlds" (reflection state)
- **Output**: `kr-hero-night-contemplation-004.png`

---

## Success Criteria

✅ All compositions use exclusively kr-solidarity palette
✅ 75%+ of compositions have >= 4 layers
✅ Atmospheric texture layer is present and visible (but subtle)
✅ No clean vector aesthetics — Melbourne grit is mandatory
✅ Blend modes create visual cohesion (not jarring contrasts)
✅ Semantic narrative is clear (resistance + culture + Melbourne identity)

---

## Handover to Gemini

**Input Assets Directory**: `/Users/okgoogle13/Projects/careercopilot/frontend/public/assets/kr-solidarity/`

**Output Directory**: `/Users/okgoogle13/Projects/careercopilot/frontend/public/assets/kr-solidarity/heroes/`

**Manifest Update**: After generation, update `kerala-rage-kr-solidarity-manifest.json` and `kr-solidarity-hero-registry.json` with new composition metadata.

**Next Steps**:
1. Gemini generates 4 hero compositions following patterns above
2. Visual validation via `/auto-validator` skill
3. Metadata enrichment via `/asset-metadata-enricher`
4. Manifest update via `/manifest-reconciler`
5. Deployment to staging

---

**End of Brief**
