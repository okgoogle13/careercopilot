# Asset System

> Part of [Northcote Curio Design System](00-overview.md)

---

## Transformation Philosophy

Asset preparation is **Victorian specimen preparation**. We exaggerate radial symmetry, structural order, and material contrast to create "Anatomical Extremes."

1. **The Void**: Backgrounds are pure matte charcoal-black (#1A1714).
2. **The Lens**: Geometric Naturalism (Haeckelian spirals and symmetry).
3. **The Light**: Surgical Chiaroscuro (Single source, high contrast).

---

## Canonical Source of Truth

The **Primary Asset Registry** for all production tools and agents is:
👉 [northcote-curio-manifest.json](file:///Users/okgoogle13/Desktop/careercopilot/assets/northcote-curio-manifest.json)

For detailed prompting logic and aesthetic compliance, refer to:
👉 [Asset Generation Prompting Strategy.md](file:///Users/okgoogle13/Desktop/careercopilot/Asset%20Generation%20Prompting%20Strategy.md)

---

## Master Asset Registry

### Phase 1: Foundation Assets

| Asset                                 | Category  | Mode    | Role       | Status         |
| :------------------------------------ | :-------- | :------ | :--------- | :------------- |
| **Asset 1: The Curio Wallpaper**      | `plate`   | Gallery | Background | ✅ Refined     |
| **Asset 2: The Sentry Kookaburra**    | `fauna`   | Gallery | Mascot     | ✅ Refined     |
| **Asset 3: Nocturnal Canopy Pattern** | `texture` | Gallery | Secondary  | 🔄 In Progress |

### Phase 2: Specimen Series (Anatomical Extremes)

| Asset                              | Category   | Mode    | Scale   | Status     |
| :--------------------------------- | :--------- | :------ | :------ | :--------- |
| **Asset 4: Wattle & Jewel Beetle** | `specimen` | Gallery | Primary | ⏳ Pending |
| **Asset 5: Eucalyptus & Echidna**  | `specimen` | Gallery | Primary | ✅ Refined |
| **Asset 9: Waratah Hero Closeup**  | `plate`    | Gallery | Hero    | ⏳ Pending |

### Phase 3: Utility & Enrichment

| Asset                                   | Category | Mode       | Use Case   | Status     |
| :-------------------------------------- | :------- | :--------- | :--------- | :--------- |
| **Asset 6: Banksia Pot & Stromatolite** | `plate`  | Gallery    | Still Life | ⏳ Pending |
| **Asset 7: Firefly Sprite**             | `ui`     | Gallery    | Animation  | ⏳ Pending |
| **Asset 8: Fossil Verification Mark**   | `ui`     | Laboratory | Stamp      | ⏳ Pending |
| **Asset 10: Banksia Geometric Spinner** | `ui`     | Both       | Loading    | ⏳ Pending |

---

## Naming Convention

All filenames must follow the machine-readable format:
`northcote-{category}-{subject}-{variant}-{version}.{ext}`

**Categories**: `botanical`, `fauna`, `specimen`, `texture`, `ui`, `plate`

---

## Processing Rules

| Rule             | Requirement                                                          |
| :--------------- | :------------------------------------------------------------------- |
| **Transparency** | Use `.png` for specimens with transparent backgrounds.               |
| **Edges**        | Preserve watercolor bleed or sharp specimen edges; no generic masks. |
| **Black Point**  | Base background must be `#1A1714`.                                   |
| **Resolution**   | Generate at Maximum/Ultra (2048px+) for museum-quality detail.       |

---

## Key Specimen Status

### The Sentry (Asset 2)

**Status**: Validated (94/100).
**Refinement**: Blue feathers desaturated to Slate-Grey. Form defined by watercolor washes on paper grain texture.

### Eucalyptus & Echidna (Asset 4)

**Status**: Validated (90/100).
**Refinement**: Backlit eucalyptus leaves showing subsurface scattering. Radial echidna spine burst (circular artifacts, not living animals).

### Banksia Spinner (Asset 6)

**Status**: Pending.
**Requirement**: Strictly 90-degree orthographic projection. Perfect Fibonacci spiral of seed follicles. Solid pure black (#000000).

---

**Last Updated**: 2026-02-01
**Target Architecture**: Gemini 2.0+ / Design Flash Sidekick MCP
