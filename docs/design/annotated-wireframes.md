# Northcote Laneway Navigator: Consolidated Design Specs

> **Purpose**: Definitive instruction set for the Contemporary Australian UI. Merges street-art aesthetics, density-aware tokens, and M3 Expressive motion into a prompt-ready manifest.

---

## 🎨 Global Directives (Non-Negotiables)

### 1. Urban Atmosphere

- **The Void**: `Asphalt Black` (#1A1714) - Use Noise overlays (5% opacity) for concrete texture.
- **Lighting**: "Firefly" bioluminescent pulses contrast with high-drama poster silhouettes.
- **Surfacing**: Organic asymmetry (`radius-pebble`, `radius-leaf`) over clean paper-white cards.

### 2. The Laneway Stack

- **The Proclaimer**: **Sora Variable**. Thin for elegance, thick for street-poster impact.
- **The Navigator**: **Plus Jakarta Sans**. All-rounder for clarity and modern UI.
- **The Analyst**: **JetBrains Mono**. For anything that requires dissection or measurement.

---

## 📄 Site Integration Specs

### PAGE 1: Landing ("The Resurrection")

_Density: High Drama (Poster Style)_

- **Aesthetic**: Peter Drew "AUSSIE" style silhouettes. Large wheat-paste textures.
- **Typography**: Sora 300 Italic (Hero Display), 96px.
- **Assets**: `ASSET-16` (Wattle) as a subtle framing accent (not specimen). `ASSET-7` (Fireflies) for depth.
- **Interaction**: "The Bloom" - Hero headline gains weight on scroll or hover.

### PAGE 4: Ingestion ("The Deposit")

_Density: High Clarity (Precise)_

- **Aesthetic**: Recycled paper texture. Minimal decoration.
- **Typography**: JetBrains Mono for all data tags. Plus Jakarta Sans for instructions.
- **Assets**: `ASSET-14` (Skeleton) as a whisper-quiet background watermark (4% opacity).
- **Interaction**: `ASSET-8` (Success Stamp) with viscous overshoot easing.

### PAGE 5: Analysis ("The Audit")

_Density: High Clarity (Precise)_

- **Aesthetic**: Measurement grids overlaying data surfaces.
- **Typography**: Sora 700 for key metrics. JetBrains Mono for technical labels.
- **Assets**: `ASSET-15` (Compass) as a functioning gauge.
- **Logic**: Use `radius-stone` for metric containers to maintain organic feel in a data view.

### PAGE 7: Kanban ("The Cultivation")

_Density: Standard (Workflow)_

- **Aesthetic**: A "Greenhouse" layout integrated into a laneway alley.
- **Typography**: Plus Jakarta Sans 16px (Body Large) on cards.
- **Assets**: `ASSET-19` (Eucalyptus Stems) as vertical column dividers.
- **Motion**: Cards "hang" and sway slightly via CSS transforms.

---

## 🛠 Asset mapping (Laneway Context)

| Asset ID   | Description        | Laneway Role              | Behavior                     |
| :--------- | :----------------- | :------------------------ | :--------------------------- |
| `ASSET-6`  | Kookaburra Sentry  | Urban Companion (perched) | Randomized alertness (tilt)  |
| `ASSET-7`  | Firefly Sprite     | Laneway Bioluminescence   | Breathe & Pulse (Atmosphere) |
| `ASSET-8`  | Fossil Stamp       | Archival Approval         | Viscous Slam (Feedback)      |
| `ASSET-15` | Brass Compass      | Navigation Aid            | Rotates on focal/data shifts |
| `ASSET-17` | Eucalyptus Ceiling | Overhead Canopy           | Foreground Blur (Depth)      |
| `ASSET-19` | Eucalyptus Column  | Structural Separator      | Organic framing              |
