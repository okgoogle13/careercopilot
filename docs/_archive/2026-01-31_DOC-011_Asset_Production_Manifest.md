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
2.  **Laboratory Paper White Texture (Image 7)** — Mode-critical texture
3.  **The Curio Wallpaper (Image 1)** — Primary stage

### Phase 2: Specimen Series (Day 2)
4.  **Core Botanicals from Image 10** — Waratah, Wattle priority
5.  **The Anatomical Grid (Image 11)** — Laboratory motif + texture
6.  **The Navigators (Images 18, 19)** — Wayfinding icons

### Phase 3: Enrichment (Day 3+)
7.  **Eucalyptus Specimen (Image 6)** — Accent botanical
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
- `motif-gallery-sentry-kookaburra-1024.png`
- `motif-laboratory-navigator-technical.svg`
- `texture-laboratory-paper-white-tile.jpg`
- `texture-gallery-curio-wallpaper-2048.jpg`

---

## 3. Processing Notes

*   **Transparency:** All specimen extractions must have transparent backgrounds unless they are full-canvas textures.
*   **Watercolor Edges:** Watercolor bleeds must be preserved at the edges; avoid harsh masking that creates a "cut-out" digital look.
*   **Color Validation:** All production assets must have their values validated or corrected against the Northcote Curio token palette (e.g., `waratahCrimson`, `wattleGold`, `specimenNight`).
*   **Resolution:** Hero assets should be provided at multiple resolutions (512px, 1024px, 2048px) to support responsive layouts.
