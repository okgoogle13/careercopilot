# Kerala Rage Asset Generation — DALL-E Prompts

> **Tool**: DALL-E 3  
> **Asset Count**: 5 assets  
> **Estimated Time**: 15-20 minutes  
> **Priority**: Mixed (2 CRITICAL, 3 HIGH)

---

## Why DALL-E for These Assets

DALL-E excels at:
- ✅ Geometric precision (halo disks, gauge tick marks)
- ✅ Transparent backgrounds (essential for UI overlays)
- ✅ Controlled edge shapes (wheat-paste tears)
- ✅ Batch consistency (grit particle sprites)
- ✅ Fast iteration cycles

---

## Generation Order (Recommended)

1. **Halo Disk Plain** (CRITICAL) → Blocks all 11 pages
2. **Halo Disk Gauge** (CRITICAL) → Blocks Page 5 (Analysis Dashboard)
3. **Wheat-Paste Tear Corner** (HIGH) → Blocks 6 pages
4. **Wheat-Paste Header Strip** (HIGH) → Blocks Page 7 (Kanban)
5. **Grit Particles Pack** (HIGH) → Blocks 6 pages

---

## Asset 1: Halo Disk Plain

**Manifest ID**: `KR-SOLID-036`  
**Priority**: CRITICAL  
**File path**: `/assets/kr-solidarity/ui/kr-asset-halo-disk-plain.png`

### DALL-E Prompt
```
Minimal halo disk graphic in screenprint style, imperfect circular form 
with hand-drawn quality, muted gold ink color #DAF674, subtle grain texture, 
no religious iconography, no text, no symbols inside circle, transparent 
background, 1:1 square format, simple radiant glow effect, 
contemporary Australian design aesthetic
```

### Generation Settings
- **Aspect ratio**: 1:1 (square)
- **Style**: Natural (not vivid)
- **Quality**: Standard
- **Output**: Download as PNG

### Post-Generation Checklist
- [ ] Transparent background (no white halo artifacts)
- [ ] Gold color matches `inkGold` token (#DAF674 ±10%)
- [ ] Circle is imperfect (not perfect geometry)
- [ ] No religious symbols visible
- [ ] Scales well 60px-300px (test at both extremes)

### Usage Context
- **Pages**: 2 (Auth), 4 (Ingestion), 11 (Dashboard)
- **Opacity**: 30-100% depending on page
- **Z-index**: Z-1 or Z-2
- **Behavior**: Static anchor or subtle rotation on focus

---

## Asset 2: Halo Disk Gauge

**Manifest ID**: `KR-SOLID-037`  
**Priority**: CRITICAL  
**File path**: `/assets/kr-solidarity/ui/kr-asset-halo-disk-gauge.png`

### DALL-E Prompt
```
Minimal halo disk gauge in screenprint style, imperfect ring with 
simple tick marks around perimeter, muted gold ink #DAF674, subtle grain, 
no numbers, no text, transparent background, 1:1 square, designed for 
needle rotation animation 0-100 degrees, contemporary minimalist gauge design
```

### Generation Settings
- **Aspect ratio**: 1:1
- **Style**: Natural
- **Quality**: Standard
- **Output**: Download as PNG

### Post-Generation Checklist
- [ ] Transparent background
- [ ] Tick marks evenly distributed (8-12 marks ideal)
- [ ] Center point clear for needle pivot
- [ ] Works as functional gauge at 180-200px diameter
- [ ] No numbers or text on tick marks

### Usage Context
- **Pages**: 5 (Analysis Dashboard) — FUNCTIONAL GAUGE
- **Size**: 200px diameter
- **Z-index**: Z-2
- **Behavior**: Needle rotation animated based on score value (0-100° range)

### Implementation Note
You'll need to create a separate needle SVG overlay (CSS-driven rotation). The halo disk gauge is the static background.

---

## Asset 3: Wheat-Paste Tear Corner

**Manifest ID**: `KR-SOLID-038`  
**Priority**: HIGH  
**File path**: `/assets/kr-solidarity/motif/kr-asset-wheat-paste-tear-corner.png`

### DALL-E Prompt
```
Torn wheat-paste poster corner edge, irregular ripped paper silhouette 
with visible layered paper fibers, screenprint aesthetic, limited palette 
of off-white aged paper with faint red and gold ink residue, no readable text, 
transparent background, large corner framing element, 1:1 square format, 
street art poster texture, Melbourne laneway aesthetic
```

### Generation Settings
- **Aspect ratio**: 1:1
- **Style**: Natural
- **Quality**: HD (this needs to be large)
- **Output**: Download as PNG

### Post-Generation Checklist
- [ ] Transparent background
- [ ] Torn edge looks [DEPRECATED_STYLE] (not cut with scissors)
- [ ] Paper layers visible at edges
- [ ] No readable text or recognizable symbols
- [ ] Scales well at 320-400px width
- [ ] Ink residue subtle (not dominant)

### Usage Context
- **Pages**: 1 (Landing), 6 (Opportunity Feed), 11 (Dashboard)
- **Position**: Top-right or bottom-left corners
- **Size**: 320-400px width
- **Z-index**: Z-2
- **Behavior**: Parallax on scroll (0.1-0.15x speed)

### Variation Strategy
Generate once, then create 2 variations by:
- Flipping horizontally for opposite corner
- Rotating slightly for visual variety

---

## Asset 4: Wheat-Paste Header Strip

**Manifest ID**: `KR-SOLID-039`  
**Priority**: HIGH  
**File path**: `/assets/kr-solidarity/motif/kr-asset-wheat-paste-strip.png`

### DALL-E Prompt
```
Horizontal torn wheat-paste strip, 60px visual height, irregular torn 
top and bottom edges, subtle paper grain, no text, transparent background, 
designed as repeating column header decoration, 4:1 wide aspect ratio, 
aged poster paper texture, minimal ink residue, street art aesthetic
```

### Generation Settings
- **Aspect ratio**: Custom (request landscape/wide)
- **Style**: Natural
- **Quality**: Standard
- **Output**: Download as PNG

### Post-Generation Checklist
- [ ] Transparent background
- [ ] Horizontal orientation
- [ ] Top AND bottom edges both torn
- [ ] Can tile horizontally without obvious seams
- [ ] Works at 60px height
- [ ] No text or symbols

### Usage Context
- **Pages**: 7 (Kanban Board) — column headers
- **Position**: Top of each Kanban column (4 columns total)
- **Size**: 60px height, full column width
- **Z-index**: Z-2
- **Behavior**: Static column header decoration

### Implementation Note
You may need to generate 2-3 variations to avoid repetition across 4 columns.

---

## Asset 5: Grit Particles Sprite Pack

**Manifest ID**: `KR-SOLID-040`  
**Priority**: HIGH  
**File path**: `/assets/kr-solidarity/ui/kr-asset-grit-particles.png`

### DALL-E Prompt
```
Set of 12 small screenprint grit particles arranged in grid, 
black and gold ink flecks and specks, transparent background, 
designed for UI particle animation, minimal and subtle, no symbols, 
no text, various sizes 8-16px, authentic screenprint press debris, 
square format with particles evenly distributed
```

### Generation Settings
- **Aspect ratio**: 1:1
- **Style**: Natural
- **Quality**: Standard
- **Output**: Download as PNG

### Post-Generation Checklist
- [ ] Transparent background
- [ ] 8-12 distinct particles visible
- [ ] Variety in size and shape
- [ ] No recognizable symbols or text
- [ ] Each particle works at 8-16px scale
- [ ] Evenly distributed in grid

### Usage Context
- **Pages**: 1 (Landing), 2 (Auth), 6 (Opportunity Feed), 7 (Kanban), 11 (Dashboard)
- **Size**: 8-16px per particle
- **Instances**: 6-16 particles per page
- **Z-index**: Z-3
- **Behavior**: Float + opacity pulse animation (8-12s loop, staggered)

### Post-Processing Required
After generation:
1. Open in image editor (Photoshop/Figma)
2. Slice into 8-12 individual sprite PNGs
3. Name as `grit-particle-01.png` through `grit-particle-12.png`
4. Optimize each file to <5KB

### Animation Reference
```css
@keyframes gritFloat {
  0%, 100% { transform: translate(0, 0); opacity: 0.4; }
  50% { transform: translate(var(--drift-x), var(--drift-y)); opacity: 0.8; }
}

.grit-particle {
  animation: gritFloat 8s ease-in-out infinite;
  animation-delay: calc(var(--particle-index) * 0.3s);
}
```

---

## Batch Workflow for DALL-E

### Step 1: Generate All 5 Assets
Open DALL-E, generate in order listed above (15-20 min total)

### Step 2: Download & Organize
```
/assets/kr-solidarity/
├── ui/
│   ├── kr-asset-halo-disk-plain.png
│   ├── kr-asset-halo-disk-gauge.png
│   └── kr-asset-grit-particles.png
└── motif/
    ├── kr-asset-wheat-paste-tear-corner.png
    └── kr-asset-wheat-paste-strip.png
```

### Step 3: Optimize File Sizes
```bash
# PNG optimization (target <50KB for UI elements)
pngquant --quality=85-95 *.png --ext .png --force
```

### Step 4: Validate Transparency
- Open each PNG in preview/browser
- Check for white halo artifacts around edges
- Re-export with alpha channel if needed

---

## Common DALL-E Issues & Fixes

### Issue 1: Text appears in wheat-paste tears
**Fix**: Regenerate with emphasis on "no readable text, no symbols"

### Issue 2: Halo disk too perfect/digital
**Fix**: Add "hand-drawn quality, imperfect circle" to prompt

### Issue 3: Grit particles too large
**Fix**: Specify "8-16px scale" more explicitly, regenerate

### Issue 4: Transparent background has white halo
**Fix**: Download as PNG, manually remove white in Photoshop using "Select > Color Range"

### Issue 5: Colors don't match tokens
**Fix**: Color-correct in post-processing:
- Gold: #DAF674
- Red: #F14714
- Off-white: #F5F2EB

---

## Quality Gates (Before Approval)

Each asset must pass:

### Visual QA
- [ ] Matches Kerala Rage screenprint aesthetic
- [ ] No bureaucratic elements
- [ ] Colors align with design tokens

### Technical QA
- [ ] File size <50KB (UI elements)
- [ ] Transparent background clean
- [ ] Correct aspect ratio

### Functional QA
- [ ] Scales appropriately (test min/max sizes)
- [ ] Works at specified opacity
- [ ] No visual artifacts

---

## Manifest Update Template

After generating, add to `kerala-rage-kr-solidarity-manifest.json`:

```json
{
  "id": "KR-SOLID-0XX",
  "name": "[Asset Name]",
  "category": "ui|motif",
  "layer": "atmospheric",
  "aspect_ratio": "1:1",
  "file_path": "/assets/kr-solidarity/[category]/kr-asset-[name].png",
  "priority": "CRITICAL|HIGH",
  "semantics": {
    "functional_role": "[role]",
    "semantic_weight": "geometric|expressive",
    "layering_role": "overlay|mid-layer"
  },
  "usage_rules": {
    "scale_suitability": ["hero", "section", "card"],
    "small_ui_safe": true
  },
  "layering_compatibility": {
    "can_overlay_with": ["substrate", "atmospheric"],
    "cannot_overlay_with": []
  }
}
```

---

**Total DALL-E Assets**: 5  
**Estimated Time**: 15-20 minutes  
**Next Step**: See `asset-generation-imagen3.md` for texture assets
