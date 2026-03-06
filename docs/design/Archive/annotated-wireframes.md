# [DEPRECATED] Kerala Rage Solidarity: Consolidated Design Specs (v5.0)

> [!CAUTION]
> This document is **DEPRECATED**. All content has been consolidated and modernized in the **[SOLIDARITY_SPEC_V5.md](SOLIDARITY_SPEC_V5.md)** canonical source of truth. Please use the v5 spec for all implementation/validation.

---

[Rest of document preserved for legacy reference below...]

# Kerala Rage Solidarity: Consolidated Design Specs (v5.0)

> **Purpose**: Definitive instruction set for the KR Solidarity UI. Merges migrant-rage aesthetics, resistance portraiture, and M3 Expressive motion into a prompt-ready manifest.

---

## 🎨 Global Directives (Non-Negotiables)

### 1. Resistance Atmosphere

- **The Substrate**: `charcoal-night` (#0F0F0F) - Use wheat-paste noise overlays (5% opacity) for laneway texture.
- **Lighting**: "Halo" disk pulses contrast with high-drama stencil silhouettes.
- **Surfacing**: Asymmetric radii (`Stone`, `Slab`, `Pebble`) over charcoal-night surfaces. NEVER white backgrounds.

### 2. The Solidarity Stack

- **The Proclaimer**: **Fraunces Variable**. Use `WONK: 1` and `SOFT: 50` for street-poster impact.
- **The Navigator**: **Work Sans Variable**. All-rounder for clarity and modern UI functional tags.
- **The Proclamation**: **Libre Bodoni**. For authoritative headers and editorial interruptions.
- **The Analyst**: **JetBrains Mono**. For anything that requires dissection or measurement.

---

## 📄 Site Integration Specs

### PAGE 1: Landing ("The Manifesto")

_Density: High Drama (Poster Style)_

- **Aesthetic**: Resistance portraiture silhouettes. Large wheat-paste textures.
- **Typography**: Fraunces 900 (Hero Display), 96px.
- **Assets**: `KR-SOLID-024` (Bhagat Singh) as a bold hero silhouette. `KR-SOLID-009` (Atmospheric Gritty Overlay) for texture depth.
- **Interaction**: "The Collective Breath" - Hero headline gains `wdth` (Width) on scroll.

### PAGE 4: Ingestion ("The Deposit")

_Density: High Clarity (Precise)_

- **Aesthetic**: Recycled industrial paper texture. Minimal decoration. Industrial rivet dividers.
- **Typography**: JetBrains Mono for all data tags. Work Sans for instructions.
- **Assets**: `KR-SOLID-038` (Industrial Substrate) as a whisper-quiet background watermark (4% opacity).
- **Interaction**: `KR-SOLID-030` (Treaty Now Poster) slam effect with viscous overshoot easing.

### PAGE 5: Analysis ("The Audit")

_Density: High Clarity (Precise)_

- **Aesthetic**: Industrial measurement grids overlaying charcoal surfaces.
- **Typography**: Libre Bodoni for key metrics. JetBrains Mono for technical labels.
- **Assets**: `KR-SOLID-031` (Kerala Elephant) as a cultural anchor motif.
- **Logic**: Use `radius-stone` for metric containers to maintain intentional asymmetry in a data view.

### PAGE 7: Kanban ("The Resistance")

_Density: Standard (Workflow)_

- **Aesthetic**: A workflow organized as posters on a Melbourne laneway wall.
- **Typography**: Work Sans 16px (Body Large) on cards.
- **Assets**: `KR-SOLID-033` (Shiva Statue Street) as a guardian motif in the header.
- **Motion**: Cards "sway" slightly via CSS transitions when dragged.

---

## 🛠 Asset mapping (Solidarity Context)

| Asset ID   | Description          | Solidarity Role           | Behavior                     |
| :--------- | :------------------- | :------------------------ | :--------------------------- |
| `KR-SOLID-024` | Bhagat Singh Portrait | Resistance Hero           | Subtle flicker (Static pulse)|
| `KR-SOLID-009` | Gritty Dust Overlay  | Laneway Substrate         | Static Grain (Atmosphere)    |
| `KR-SOLID-030` | Treaty Now Poster    | Solidarity Approval       | Viscous Slam (Feedback)      |
| `KR-SOLID-031` | Kerala Elephant V1   | Cultural Anchor           | Floating/Ambient Presence    |
| `KR-SOLID-022` | Shiva Statue Street  | Guardian Motif            | Parallax depth shift         |
| `KR-SOLID-038` | Industrial Substrate  | Structural Background     | High-contrast texture        |
