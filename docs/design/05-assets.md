# Asset System

> Part of [Northcote Curio Design System](00-overview.md)

---

## Transformation Philosophy

Asset preparation is **Victorian specimen preparation**. We exaggerate radial symmetry, structural order, and material contrast to create "Anatomical Extremes."

1. **The Void**: Backgrounds are pure matte charcoal-black (#1A1714).
2. **The Lens**: Geometric Naturalism (Haeckelian spirals and symmetry).
3. **The Light**: Surgical Chiaroscuro (Single source, high contrast).

---

## Master Asset Registry

### Phase 1: Foundation Assets

| Asset                                | Category  | Mode       | Score  | Status         |
| :----------------------------------- | :-------- | :--------- | :----- | :------------- |
| **Asset 1: The Curio Wallpaper**     | `plate`   | Gallery    | 94/100 | ✅ Validated   |
| **Asset 2: The Sentry (Kookaburra)** | `fauna`   | Gallery    | 94/100 | ✅ Validated   |
| **Asset 3: Laboratory Parchment**    | `texture` | Laboratory | -      | 🔄 In Progress |

### Phase 2: Specimen Series (Verticals)

| Asset                               | Category   | Mode    | Score  | Status       |
| :---------------------------------- | :--------- | :------ | :----- | :----------- |
| **Asset 4: Eucalyptus & Echidna**   | `specimen` | Gallery | 90/100 | ✅ Validated |
| **Asset 5: Wattle & Jewel Beetle**  | `specimen` | Gallery | -      | ⏳ Pending   |
| **Asset 7: The Navigators (Icons)** | `ui`       | Both    | -      | ⏳ Pending   |

### Phase 3: UI & Enrichment

| Asset                                  | Category  | Mode    | Score  | Status       |
| :------------------------------------- | :-------- | :------ | :----- | :----------- |
| **Asset 6: Banksia Geometric Spinner** | `ui`      | Both    | -      | ⏳ Pending   |
| **Asset 8: Nocturnal Garden Tile**     | `texture` | Gallery | -      | ⏳ Pending   |
| **Asset 9: Banksia Pot Still Life**    | `plate`   | Gallery | 92/100 | ✅ Validated |

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
**Target Architecture**: Google AI Studio / Nano Banana Pro
