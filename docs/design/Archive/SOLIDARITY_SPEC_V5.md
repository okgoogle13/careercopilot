# KR Solidarity: The Definitive Wireframe & Asset Specification (v5.0)

> **Status**: 🟢 Canonical Source of Truth
> **Last Updated**: 2026-03-06
> **Version**: 5.0.2 (Flow Guidance & Zero-Flora Alignment)

---

## 1. Identity & Manifesto

**Philosophy**: Agit-Prop / Migrant Worker Solidarity / Viscous Fluidity.
**Core Tenet**: Design is a weapon. Aesthetics serve the worker/migrant, not the colonial curator.
**Visual Language**: Brutalist Typography, High-Contrast Palette, Wheat-Paste/Torn Edges, Stencil.

---

## 2. Global Design Directives

### The Substrate (Z-0)
Every page begins with a dark, textured canvas. **Never use pure white backgrounds.**
- **Primary Substrate**: `{KR-SOLID-038}` (Melbourne Laneway) or `{KR-UI-005}` (Charcoal Paper).
- **Secondary Substrate**: `{KR-SOLID-021}` (Flinders St Night) for hero moments.
- **Overlay**: 4-12% opacity `blueprint-grid` `{KR-UI-004}` for analytical depth.

### Shape Language (The Fluid Brutalist Archetypes)
Standard geometric perfection is rejected in favor of "Fluid Brutalism". Components use specialized CSS variables:

| Archetype | Token Reference | Border Radius (Logic) | Component Type |
| :--- | :--- | :--- | :--- |
| **Pebble** | `--sys-shape-radius-pebble` | `16px 8px 12px 20px` | Buttons, primary interactive. |
| **Stone** | `--sys-shape-radius-stone`| `42% 58% 45% 55% / 48% 62% 38% 52%` | Standard cards, feature containers. |
| **Slab** | `--sys-shape-radius-slab` | `48% 52% 58% 42% / 55% 45% 60% 40%` | Structural panels, sections. |
| **Seed** | `--sys-shape-radius-seed` | `8px 4px 10px 6px` | Badges, tags, micro-UI. |

---

## 3. The Solidarity Stack

### Typography (Variable Axis Core)
Must use `.woff2` variable font files. Optical sizing MUST be enabled.

| Role | Font | Variable Axis Priority | Optical Sizing |
| :--- | :--- | :--- | :--- |
| **Workhorse** | **Work Sans** | `wght` (100–900), `GRAD` (hover pulse) | `auto` |
| **Expressive** | **Fraunces** | `SOFT` (100), `WONK` (1), `opsz`, `wght` | `auto` |
| **Proclamation**| **Libre Bodoni** | Static/Variable high-contrast serif | `auto` |
| **Technical** | **JetBrains Mono** | Code, data, technical metadata | `none` |
| **Signature** | **Caveat** | Handwritten flourishes, annotations | `auto` |
| **Icon Accent** | **Nabla** | Icon-scale only. Palette: `--nabla-solidarity` | `n/a` |

**Forbidden**: Inter (display), Roboto, Lora, Crimson Text, Space Grotesk.

---

## 4. Token Architecture (Production Reference)

### Semantic Color Mapping (`--sys-color-*`)
Use these specific token groups defined in `design-tokens.css`:

| Category | Token Root | Value | Solidarity Purpose |
| :--- | :--- | :--- | :--- |
| **Floor** | `--sys-color-charcoalBackground-base` | `#1A1714` | Global floor substrate |
| **Accent 1** | `--sys-color-solidarityRed-base` | `#F14714` | Primary Action / Defiance |
| **Accent 2** | `--sys-color-inkGold-base` | `#DAF674` | Optimism / Focal points |
| **Accent 3** | `--sys-color-stencilYellow-base` | `#F6E748` | Attention / Street Stencil |
| **Body** | `--sys-color-worker-ash-base` | `#DAF6B3` | High-readability content |

### Decision Framework: Revelation vs. Defiance
- **Revelation** (Analysis, Data): Legibility P0. Reset radii to `--sys-shape-radius-slab` (4px). Use `JetBrains Mono`.
- **Defiance** (Landing, Marketing): Aesthetic P0. Use erratic `--sys-shape-radius-stone`. Use `Fraunces 900`.

---

## 5. Interactive States & Motion

### The Solidarity Spring
- **Spring**: `cubic-bezier(0.34, 1.56, 1.56, 1)` (Viscous Overshoot).
- **Duration**: `--sys-motion-patterns-typeSpringSlam-duration` (600ms).

### State Behaviors
- **Hover**: `scale(1.03)`, elevation shift to `--sys-shadow-elevation3HoverLift`.
- **Active**: `scale(0.97)`, opacity drop.
- **Focus**: 2px solid `inkGold` outline with 4px offset (`--sys-color-inkGold-usage-3`).

---

## 6. Asset Library Mapping

### UI Primitives (Production Ready SVGs)
| ID | Asset Name | Status | Purpose |
| :--- | :--- | :--- | :--- |
| `{KR-UI-001}` | Wheat Paste Tear | ✅ | Poster rip effect (Z-2) |
| `{KR-UI-002}` | Halo Disk | ✅ | Optimism backdrop / focal point |
| `{KR-UI-003}` | Screenprint Grit | ✅ | Atmospheric noise (Z-3) |
| `{KR-UI-007}` | Screenprint Stamp | ✅ | Success/Verification Slam |

### Canonical Symbolic Anchors (Manifest v6.0.0)
| ID | Name | emotional Register | Constraints |
| :--- | :--- | :--- | :--- |
| `{KR-SOLID-031}` | Treaty Now Poster | Solidarity | Dashboard / Alerts |
| `{KR-SOLID-023}` | Bhagat Singh Portrait | Defiance | Landing Hero |
| `{KR-SOLID-033}` | Kerala Elephant | Revelation | Analysis Panels |

---

## 7. Screen Reference Matrix

| Screen | Register | Shape | Primary Assets | Symbolic Anchor |
| :--- | :--- | :--- | :--- | :--- |
| **Landing** | Defiance | Stone | `{KR-UI-001}`, `{KR-UI-002}` | `{KR-SOLID-023}` |
| **Authentication**| Trust | Stone | `{KR-UI-002}` (minimal) | ❌ Forbidden |
| **Onboarding** | Guidance | Seed + Stone | `{KR-UI-004}` (low-opacity) | ⚠️ Post-P0 |
| **Ingestion** | Gravity | Slab | `{KR-UI-004}`, `{KR-UI-022}` | ❌ Forbidden |
| **Analysis** | Revelation | Stone | `{KR-UI-004}`, `{KR-UI-022}` | `{KR-SOLID-033}` / `013` |
| **Dashboard** | Altitude | Stone | `{KR-UI-001}`, `{KR-UI-002}` | `{KR-SOLID-031}` |

---

## 8. Specialized Flow Guidance

### Onboarding (The Guiding Path)
- **Step Markers**: Use `--sys-shape-radius-seed`. Active steps should glow with `--sys-color-inkGold-base`.
- **Progress Trackers**: Technical and grounded. Avoid "playful" bubbles. Use `JetBrains Mono` for step counts.
- **Trust Elements**: In Authentication/Onboarding, use `--sys-color-charcoalBackground-steps-1` to create soft separation from the global floor.

### Analytical Modes
- **Data Density**: When the user enters "Analytical Mode" (Analysis/Stats), the `--sys-shape-radius-stone` should collapse into `--sys-shape-radius-slab` to maximize screen real estate and convey "Technical Revelation."

---

**Source References**:
- Manifest: `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json` (v6.0.0)
- Registry: `frontend/public/assets/kr-solidarity-hero-registry.json` (v3.1.0)
- Design Tokens: `frontend/src/design/tokens/tokens.json`
