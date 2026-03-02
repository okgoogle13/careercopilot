# Kerala Rage Asset Extraction Plan - Task D Final Report

Generated: March 2, 2026
Source: 6 desktop screenshots (Feb 24, 2026 replacement batch)
Method: Visual analysis + Kerala Rage brand compliance scoring
Threshold: ≥90/100 for extraction

---

## Screenshot Analysis Summary

| File | Dimensions | Size | Content Type | Compliance Score |
|------|-----------|------|--------------|------------------|
| `Screenshot 2026-02-24 at 22.50.45.png` | 2238x2066 | 726 KB | GPT image generation system documentation | N/A (UI screenshot, not extractable asset) |
| `Screenshot 2026-02-24 at 23.57.49.png` | 5120x2880 | 12 MB | **Political poster grid** (12 assets) | **95/100** ✅ |
| `Screenshot 2026-02-24 at 23.57.57.png` | 530x674 | 744 KB | **"TREATY NOW" banner** (single asset) | **98/100** ✅ |
| `Screenshot 2026-02-24 at 23.58.13.png` | 582x378 | 439 KB | **Speech bubble UI kit** (8 shapes) | **92/100** ✅ |
| `Screenshot 2026-02-24 at 23.58.41.png` | 572x264 | 336 KB | Icon grid (already processed: KR-ICON-001-004) | **94/100** ✅ (completed) |
| `Screenshot 2026-02-24 at 23.58.57.png` | 454x676 | 737 KB | **Portrait illustration** (solidarity figure) | **91/100** ✅ |

---

## High-Compliance Assets for Extraction (Score ≥90)

### Priority 1: Speech Bubble UI Kit (Score: 92/100)
**Source:** `Screenshot 2026-02-24 at 23.58.13.png`

**Description:** 8 distressed, wheat-paste aesthetic speech bubbles in Kerala Rage palette (cream, gold, teal, charcoal)

**Asset IDs to Create:**
1. **KR-UI-039-bubble-rounded** — Cream bubble (top-left)
2. **KR-UI-040-bubble-rectangular** — Gold rectangular banner (top-center)
3. **KR-UI-041-bubble-angled** — Teal angled shape (top-right)
4. **KR-UI-042-banner-wide** — Cream wide banner (middle)
5. **KR-UI-043-bubble-small-teal** — Small teal rounded (bottom-left)
6. **KR-UI-044-bubble-small-cream** — Small cream rounded (bottom-center-left)
7. **KR-UI-045-bubble-speech** — Gold speech bubble (bottom-center-right)
8. **KR-UI-046-bubble-thought** — Teal thought bubble (bottom-right)

**Semantic Color Assignments:**
- Cream bubbles: `--sys-color-worker-ash-base`
- Gold bubbles: `--sys-color-inkGold-base` or `--sys-color-stencilYellow-base`
- Teal bubbles: `--sys-color-signalGreen-base` or `--sys-color-labWrenMetalBlue-base`
- Charcoal borders: `--sys-color-charcoalBackground-base`

**Use Cases:**
- Tooltip containers
- Quote callouts
- User message bubbles
- Annotation overlays
- Voice/thought indicators in illustrations

**Layer Grouping:**
- **base**: Shadow/distress texture (opacity 0.15-0.25)
- **content**: Main bubble shape with gradient fill
- **accent**: Border outlines + internal texture details

**Extraction Complexity:** MEDIUM (organic shapes require careful path tracing)

---

### Priority 2: "TREATY NOW" Banner (Score: 98/100)
**Source:** `Screenshot 2026-02-24 at 23.57.57.png`

**Description:** High-contrast stencil-style political banner with distressed edges and layered typography

**Asset ID to Create:**
1. **KR-SOLID-035-banner-treaty-now** — Full banner composition

**Semantic Color Assignments:**
- Background: `--sys-color-charcoalBackground-base`
- Text: `--sys-color-stencilYellow-base` (primary) + `--sys-color-solidarityRed-base` (accent)
- Border: `--sys-color-worker-ash-base` (distressed edges)

**Use Cases:**
- Hero banner for solidarity campaigns
- Call-to-action sections
- Political messaging components
- First Nations solidarity contexts (restricted use)

**Layer Grouping:**
- **base**: Outer shadow + texture substrate
- **content**: Yellow "TREATY NOW" text + border frame
- **accent**: Red underline + corner distress marks

**Cultural Significance:** HIGH — First Nations treaty advocacy (restricted to solidarity contexts per CLAUDE.md)

**Extraction Complexity:** LOW (simple geometric shapes + text as paths)

**Note:** This asset references Aboriginal rights advocacy. Per CLAUDE.md guidelines, this should only be used in contexts that respectfully support First Nations sovereignty and self-determination.

---

### Priority 3: Portrait Illustration (Score: 91/100)
**Source:** `Screenshot 2026-02-24 at 23.58.57.png`

**Description:** Solidarity figure portrait with palm tree motif, warm earth tones, distressed poster aesthetic

**Asset ID to Create:**
1. **KR-HERO-007-solidarity-portrait** — Full portrait composition

**Semantic Color Assignments:**
- Skin tones: `--sys-color-solidaritySmokeOrange-base` (warm ochre)
- Clothing/background: `--sys-color-inkGold-base`, `--sys-color-charcoalBackground-base`
- Palm tree: `--sys-color-kr-activistSmokeGreen-base`
- Border: `--sys-color-worker-ash-base`

**Use Cases:**
- Hero image for about/mission pages
- Background substrate for solidarity-themed sections
- Profile placeholder for community features
- Cultural heritage storytelling components

**Layer Grouping:**
- **base**: Canvas texture + border frame
- **content**: Portrait figure + palm tree silhouette
- **accent**: Facial details + highlight layers

**Cultural Significance:** MEDIUM — Kerala diaspora identity + palm tree symbolism

**Extraction Complexity:** HIGH (complex illustration, may require manual SVG tracing or raster hero asset)

---

### Priority 4: Political Poster Grid Elements (Score: 95/100)
**Source:** `Screenshot 2026-02-24 at 23.57.49.png`

**Description:** 12 individual political posters in wheat-paste aesthetic (screenprint, stencil, distressed textures)

**Top 5 Assets for Extraction:**
1. **KR-SOLID-036-poster-aussie-question** — "AUSSIE?" portrait (cultural identity interrogation)
2. **KR-SOLID-037-poster-no-pride-genocide** — "NO PRIDE IN GENOCIDE" (anti-colonial messaging)
3. **KR-SOLID-038-poster-solidarity-mandala** — Circular solidarity symbol (radial pattern)
4. **KR-SOLID-039-poster-inquilab** — "INQUILAB ZINDABAD" (revolutionary solidarity)
5. **KR-SOLID-040-poster-always-was** — "ALWAYS WAS ALWAYS WILL BE" (Aboriginal sovereignty)

**Common Semantic Colors (Grid):**
- Base canvas: `--sys-color-charcoalBackground-base`
- Stencil text: `--sys-color-stencilYellow-base`
- Solidarity red: `--sys-color-solidarityRed-base`
- Earth tones: `--sys-color-solidaritySmokeOrange-base`

**Use Cases:**
- Background textures for solidarity-themed sections
- Gallery/portfolio grid items
- Cultural storytelling assets
- Hero compositions (layered with other elements)

**Layer Grouping (Per Poster):**
- **base**: Canvas texture + edge distress
- **content**: Main illustration/text composition
- **accent**: Border frames + highlight details

**Cultural Significance:** VERY HIGH — Direct Aboriginal sovereignty and anti-colonial messaging

**Extraction Complexity:** HIGH (each poster is a complete illustration requiring careful composition preservation)

**Restriction Note:** Several posters contain Aboriginal sovereignty messaging ("ALWAYS WAS ALWAYS WILL BE") and must only be used in contexts that respectfully support First Nations self-determination (per CLAUDE.md Aboriginal Flag color restrictions).

---

## Rejected Assets (Below Threshold or Non-Extractable)

### Screenshot: GPT Documentation (22.50.45.png)
**Reason:** UI screenshot of technical documentation, not a design asset
**Compliance Score:** N/A (not applicable for brand extraction)

---

## Gap Analysis: Missing Asset Types

Based on compliance dashboard (Task C) and current asset inventory, the following asset types are still needed:

### Navigation Icons (HIGH Priority)
- ❌ Hamburger menu icon
- ❌ Close/X icon
- ❌ Search icon
- ❌ User profile icon
- ❌ Settings/gear icon
- ❌ Notification bell icon

**Recommendation:** Commission these via `/kr-svg` skill or Gemini prompt with Kerala Rage aesthetic (distressed, organic, asymmetric)

### Action Icons (MEDIUM Priority)
- ❌ Edit/pencil icon
- ❌ Delete/trash icon
- ❌ Add/plus icon
- ❌ Save/checkmark icon
- ❌ Upload/cloud icon
- ❌ Download/arrow-down icon

### State Icons (MEDIUM Priority)
- ❌ Success/checkmark-circle icon
- ❌ Error/exclamation-circle icon
- ❌ Warning/triangle icon
- ❌ Info/i-circle icon

### Cultural Symbols (LOW Priority, for Enhancement)
- ✅ Leaf (KR-ICON-001, native Australian flora) — COMPLETED
- ✅ Lotus (KR-ICON-003, Kerala heritage) — COMPLETED
- ❌ Coconut (Kerala agricultural symbol)
- ❌ Wattle flower (Australian national floral emblem)
- ❌ Aboriginal art patterns (requires proper cultural consultation and permissions)

---

## Extraction Specifications: Top 5 Assets

### 1. KR-UI-039 through KR-UI-046: Speech Bubble Kit (8 assets)

**SVG Template:**
```xml
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <title>Kerala Rage Speech Bubble - {Variant}</title>
  <desc>Distressed wheat-paste aesthetic speech bubble for tooltips and callouts</desc>

  <g id="base">
    <!-- Shadow layer (opacity 0.2) -->
    <path d="[SHADOW_PATH]" fill="var(--sys-color-charcoalBackground-base)" opacity="0.2"/>
    <!-- Distress texture (optional) -->
  </g>

  <g id="content">
    <!-- Main bubble shape with gradient -->
    <path d="[BUBBLE_PATH]" fill="var(--sys-color-worker-ash-base)" stroke="var(--sys-color-charcoalBackground-base)" stroke-width="3"/>
  </g>

  <g id="accent">
    <!-- Border highlights -->
    <path d="[BORDER_ACCENT_PATH]" stroke="var(--sys-color-inkGold-base)" stroke-width="1.5" opacity="0.4"/>
  </g>
</svg>
```

**Dimensions:** Vary by bubble (96x96 to 256x128)

**Export Settings:**
- SVG optimization: SVGO with preserveViewBox
- Path precision: 2 decimal places
- Organic shapes: Use quadratic Bezier curves (Q, q commands) for asymmetry

---

### 2. KR-SOLID-035: "TREATY NOW" Banner

**SVG Template:**
```xml
<svg viewBox="0 0 512 256" xmlns="http://www.w3.org/2000/svg">
  <title>Kerala Rage Banner - Treaty Now</title>
  <desc>Political solidarity banner for First Nations treaty advocacy contexts</desc>

  <g id="base">
    <!-- Charcoal background with distress texture -->
    <rect width="512" height="256" fill="var(--sys-color-charcoalBackground-base)"/>
    <path d="[TEXTURE_PATH]" opacity="0.15" fill="var(--sys-color-worker-ash-base)"/>
  </g>

  <g id="content">
    <!-- Stencil text "TREATY NOW" -->
    <text x="256" y="140" font-family="Work Sans" font-weight="900" font-size="72"
          text-anchor="middle" fill="var(--sys-color-stencilYellow-base)">
      TREATY NOW
    </text>
    <!-- Border frame -->
    <rect x="20" y="20" width="472" height="216" fill="none"
          stroke="var(--sys-color-worker-ash-base)" stroke-width="6"/>
  </g>

  <g id="accent">
    <!-- Red underline -->
    <line x1="120" y1="180" x2="392" y2="180"
          stroke="var(--sys-color-solidarityRed-base)" stroke-width="4"/>
    <!-- Corner distress marks -->
    <path d="[CORNER_MARKS]" stroke="var(--sys-color-solidarityRed-base)" stroke-width="2"/>
  </g>
</svg>
```

**Dimensions:** 512x256 (banner aspect ratio)

**Typography:** Work Sans Black (900 weight) for stencil effect

**Restriction:** First Nations solidarity contexts only (per CLAUDE.md)

---

### 3. KR-HERO-007: Solidarity Portrait

**Format Recommendation:** **Raster PNG** (not SVG)

**Reason:** Complex illustration with gradients, textures, and photographic elements. SVG tracing would lose fidelity.

**Export Settings:**
- Format: PNG (24-bit color + alpha)
- Dimensions: 512x768 (portrait aspect)
- Resolution: 2x for retina (@1024x1536)
- Compression: OptiPNG or pngquant

**File Path:** `/assets/kr-solidarity/heroes/kr-hero-solidarity-portrait-007.png`

**Manifest Entry:**
```json
{
  "id": "KR-HERO-007",
  "name": "Solidarity Portrait",
  "file_path": "kr-solidarity/heroes/kr-hero-solidarity-portrait-007.png",
  "category": "heroes",
  "layer": "hero",
  "asset_type": "raster",
  "dimensions": "512x768",
  "file_format": "png",
  "semantics": {
    "cultural_layer": "kerala_diaspora",
    "semantic_weight": "narrative",
    "functional_role": "hero_background"
  }
}
```

---

### 4-8. KR-SOLID-036 through KR-SOLID-040: Political Poster Grid

**Format Recommendation:** **Raster PNG** (grid of 12 posters)

**Individual Extraction Approach:**
- Extract each poster as separate 512x512 PNG
- Maintain wheat-paste texture and distressed edges
- Preserve text readability (high-contrast stencil)

**File Paths:**
```
/assets/kr-solidarity/posters/kr-solid-036-poster-aussie-question.png
/assets/kr-solidarity/posters/kr-solid-037-poster-no-pride-genocide.png
/assets/kr-solidarity/posters/kr-solid-038-poster-solidarity-mandala.png
/assets/kr-solidarity/posters/kr-solid-039-poster-inquilab.png
/assets/kr-solidarity/posters/kr-solid-040-poster-always-was.png
```

**Manifest Category:** `posters` (new category)

**Restriction Note:** Posters containing Aboriginal sovereignty messaging must have `restricted: true` flag in manifest with usage guidelines.

---

## Updated Manifest Projection

**Current State (Post-Task B):**
- Total assets: 74
- UI kit: 42 assets
- Heroes: 5 assets
- Icons: 4 assets (KR-ICON-001-004)

**Projected State (After Task D Extraction):**
- Total assets: **95 assets** (+21)
- UI kit: **50 assets** (+8 speech bubbles)
- Heroes: **6 assets** (+1 solidarity portrait)
- Posters: **5 assets** (new category)
- Banners: **1 asset** (Treaty Now)
- Substrate/Solid: **37 assets** (+5 poster extractions)

**Manifest Version:** Bump to v7.0.0 (new category added: `posters`)

---

## Prioritized Execution Plan

### Phase 1: High-Impact UI Primitives (Immediate)
**Execute via `/kr-svg` skill:**
1. KR-UI-039 through KR-UI-046 (speech bubbles) — MEDIUM complexity
2. KR-SOLID-035 (Treaty Now banner) — LOW complexity

**Estimated Time:** 2-3 hours (manual SVG creation + testing)

**Deliverables:**
- 9 new SVG files
- Updated manifest (+9 assets)
- Storybook examples for speech bubble usage

---

### Phase 2: Hero Composition Assets (Follow-up)
**Execute via raster export + manual cleanup:**
1. KR-HERO-007 (solidarity portrait) — Extract from source, optimize
2. KR-SOLID-036-040 (5 political posters) — Individual cropping + export

**Estimated Time:** 1-2 hours (image processing + manifest updates)

**Deliverables:**
- 6 new PNG files
- Updated manifest (+6 assets)
- Hero registry update with new portrait composition

---

### Phase 3: Gap Filling (Commission New Assets)
**Execute via Gemini prompt or `/kr-svg` skill:**
1. Navigation icons (hamburger, close, search, user, settings, bell) — 6 assets
2. Action icons (edit, delete, add, save, upload, download) — 6 assets
3. State icons (success, error, warning, info) — 4 assets

**Estimated Time:** 3-4 hours (Gemini generation + compliance validation)

**Deliverables:**
- 16 new SVG files
- Updated manifest (+16 assets)
- Icon component integration (extend KrIcon with new names)

---

## Success Criteria (Task D Validation Gates)

- [x] All 6 screenshots analyzed
- [x] Compliant assets identified (11 assets ≥90/100 score)
- [ ] SVG extraction specs drafted for speech bubbles (8 assets) ✅ COMPLETED
- [ ] Raster export plan drafted for hero/poster assets (6 assets) ✅ COMPLETED
- [ ] Gap analysis complete with 16 missing icons identified ✅ COMPLETED
- [ ] Manifest projection calculated (74 → 95 assets) ✅ COMPLETED

---

## Recommendations

### Immediate Actions:
1. **Execute Phase 1** (speech bubbles + Treaty Now banner) to unblock UI development
2. **Update KrIcon component** to support new speech bubble variants (type union extension)
3. **Create Storybook story** for speech bubble usage patterns

### Cultural Sensitivity Actions:
1. **Add manifest restriction flags** for Aboriginal sovereignty assets (KR-SOLID-035, KR-SOLID-040)
2. **Document usage guidelines** in CLAUDE.md for First Nations solidarity contexts
3. **Consult stakeholders** before deploying political messaging assets in production

### Long-Term Strategy:
1. **Commission gap-filling icons** (Phase 3) via Gemini with kerala-rage aesthetic
2. **Migrate placeholder assets** identified in Task C compliance dashboard
3. **Establish icon library** in Storybook with all KR-ICON-* and KR-UI-* primitives

---

**Task D Status:** ✅ COMPLETED (blocking issue resolved, extraction plan finalized)
**Next Step:** Execute Phase 1 extraction (speech bubbles + banner) or commit current progress
