# Kerala Rage Brand Tokens Reference

This reference maps natural language brand descriptions to the technical system tokens defined in `tokens.json`. Use these variables in prompts to ensure the AI understands the semantic weight of each choice.

## Color Tokens (Solidarity Mode)

| Brand Name | Hex Code | System Token Variable | Usage Context |
|------------|----------|-----------------------|---------------|
| **Charcoal Base** | `#0F0F0F` | `--sys-color-charcoalBackground-base` | Fondational canvas, matte surfaces. |
| **Solidarity Red** | `#F14714` | `--sys-color-solidarityRed-base` | Resistance energy, primary CTA, ink hits. |
| **Ink Gold** | `#DAF674` | `--sys-color-inkGold-base` | Temple radiance, ornamental highlights. |
| **Stencil Yellow** | `#F6E748` | `--sys-color-stencilYellow-base` | High-salience UI markers, attention phrases. |
| **Worker Ash** | `#DAF6B3` | `--sys-color-worker-ash-base` | Readability on dark, body text outlines. |
| **Activist Smoke Green**| `#48DA8B` | `--sys-color-kr-activistSmokeGreen-base` | Kerala backwaters, landscape accents. |
| **Signal Green** | `#48F0E5` | `--sys-color-signalGreen-base` | Hybrid identity pop, ink splash moments. |

> [!IMPORTANT]
> **BANNED**: Never use white backgrounds (`#FFFFFF`). Always anchor on Charcoal steps.

## Typography Tokens

| Role | Font Family | Variable | Aesthetic Description |
|------|-------------|----------|-----------------------|
| **Proclamation** | Libre Bodoni | `--sys-type-fontFamilies-proclamation` | Sharp, high-contrast, authoritative. |
| **Display** | Fraunces | `--sys-type-fontFamilies-display` | Expressive, soft-yet-wonky, artisanal. |
| **Accent** | Nabla | `--sys-type-fontFamilies-colorAccent` | Blocky, isometric color font (COLRv1). |
| **Mono** | JetBrains Mono| `--sys-type-fontFamilies-mono` | Technical, annotations, structured data. |
| **Curator** | Caveat | `--sys-type-fontFamilies-curator` | Handwritten, loose, humanistic notes. |

## Shape & Aesthetic Tokens

- **Shape (Megaphone)**: `--shape-megaphoneCut01` (Asymmetric, organic, rejects perfect geometry).
- **Shape (Placard)**: `--shape-placardTorn01` (Heavy, grounded containers).
- **Motion (Expressive)**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (M3 Expressive overshoot).

## Motif Strategy

- **Industrial**: Scaffolding, W-class trams, brickwork stencils, heavy tools.
- **Cultural**: Kerala elephant (stencil-style), Houseboat ripples, Melbourne tram silhouettes.
- **Street**: Wheat-paste textures, torn edge clip-paths (`--sys-shape-tornEdgeClipPath`).
