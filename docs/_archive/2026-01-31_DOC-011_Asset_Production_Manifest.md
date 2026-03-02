# DOC-011: Asset Production Manifest

**Document ID:** DOC-011-PRODUCTION-MANIFEST
**Version:** 1.0
**Status:** DEFINITIVE
**Context:** The operational workflow for processing assets, including priority queue, deliverables, and naming conventions.

---

## 1. Extraction Priority Queue

For efficient execution, process assets in this sequence:

### Phase 1: Foundation (Day 1)
1.  **The Sentry (Image 5)** — Hero mascot, emotional anchor
<<<<<<< HEAD
2.  **Laboratory Parchment Texture (Image 7)** — Mode-critical texture
3.  **The Curio Wallpaper (Image 1)** — Primary stage

### Phase 2: Specimen Series (Day 2)
4.  **Core Botanicals from Image 10** — Waratah, Wattle priority
5.  **The Anatomical Grid (Image 11)** — Laboratory motif + texture
6.  **The Navigators (Images 18, 19)** — Wayfinding icons

### Phase 3: Enrichment (Day 3+)
7.  **Eucalyptus Specimen (Image 6)** — Accent botanical
=======
2.  **kr-dark Paper White Texture (Image 7)** — Mode-critical texture
3.  **The kr-solidarity Wallpaper (Image 1)** — Primary stage

### Phase 2: kr-motif Series (Day 2)
4.  **Core Botanicals from Image 10** — [DEPRECATED_STYLE], Wattle priority
5.  **The Anatomical Grid (Image 11)** — kr-dark motif + texture
6.  **The Navigators (Images 18, 19)** — Wayfinding icons

### Phase 3: Enrichment (Day 3+)
7.  **kr-leafus kr-motif (Image 6)** — Accent [DEPRECATED_STYLE]
>>>>>>> restoration-KR-Rage-Figma-v2.0
8.  **Nocturnal Garden Tile (Image 3)** — Secondary background
9.  **The Dryandra (Image 8)** — Hero decorative
10. **Remaining extractions as needed**

---

## 2. Deliverables & Naming Conventions

Each extraction should produce these deliverables:

| Deliverable | Format | Naming Convention |
|-------------|--------|-------------------|
| Primary asset | PNG with transparency | `motif-{mode}-{name}-{size}.png` |
| Shadow variant | PNG with `elevation.shadow.rest` applied | `motif-{mode}-{name}-{size}-shadow.png` |
| Vector trace (where applicable) | SVG with CSS custom property fills | `motif-{mode}-{name}.svg` |
| Source documentation | Markdown | `motif-{mode}-{name}.md` |

### File Naming Examples:
<<<<<<< HEAD
- `motif-gallery-sentry-kookaburra-1024.png`
- `motif-laboratory-navigator-technical.svg`
- `texture-laboratory-parchment-tile.jpg`
- `texture-gallery-curio-wallpaper-2048.jpg`
=======
- `motif-kr-dark-sentry-kr-shiva-1024.png`
- `motif-kr-dark-navigator-technical.svg`
- `texture-kr-dark-paper-white-tile.jpg`
- `texture-kr-dark-kr-solidarity-wallpaper-2048.jpg`
>>>>>>> restoration-KR-Rage-Figma-v2.0

---

## 3. Processing Notes

<<<<<<< HEAD
*   **Transparency:** All specimen extractions must have transparent backgrounds unless they are full-canvas textures.
*   **Watercolor Edges:** Watercolor bleeds must be preserved at the edges; avoid harsh masking that creates a "cut-out" digital look.
*   **Color Validation:** All production assets must have their values validated or corrected against the Northcote Curio token palette (e.g., `waratahCrimson`, `wattleGold`, `specimenNight`).
=======
*   **Transparency:** All kr-motif extractions must have transparent backgrounds unless they are full-canvas textures.
*   **Watercolor Edges:** Watercolor bleeds must be preserved at the edges; avoid harsh masking that creates a "cut-out" digital look.
*   **Color Validation:** All production assets must have their values validated or corrected against the kerala-rage kr-solidarity token palette (e.g., `waratahCrimson`, `kr-ink-gold`, `kr-charcoal`).
>>>>>>> restoration-KR-Rage-Figma-v2.0
*   **Resolution:** Hero assets should be provided at multiple resolutions (512px, 1024px, 2048px) to support responsive layouts.
