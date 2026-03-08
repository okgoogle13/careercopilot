# Nano Banana Pro Prompt Optimization Guide

This guide defines specific patterns for getting the best results from the **Nano Banana Pro** image generation model when working within the Kerala Rage design system.

## Model Characteristics

**Nano Banana Pro** excels at:
- High-contrast, graphic styles (stencils, linocut).
- Deep blacks (--sys-color-charcoal-background) and vibrant, flat colors.
- Complex geometric compositions with sharp edges.
- Textural "grit" and "spray-paint" effects.

## Prompt Structure Template

```
[Style Marker], [Subject], [Environment/Context]. [Color Specs]. [Aesthetic Details]. [Technical Specs].
```

### 1. Style Markers
- `Melbourne laneway street art stencil` (Forces gritty, urban look)
- `Layered contemporary Australian graphic art` (Ensures overlapping slabs)
- `Industrial stencil-cut typography background` (Good for decorative text)

### 2. Color Specs (Mandatory)
Always specify the exact hex codes:
- `Base: --sys-color-charcoal-background (Matte Black)`
- `Accents: --sys-color-solidarity-red (Solidarity Red), --sys-color-ink-gold (Ink Gold), --sys-color-stencil-yellow (Stencil Yellow)`
- `UI/Secondary: --sys-color-charcoal-background (Deep Ash)`

### 3. Aesthetic Details
- `Asymmetric radii: Stone, Slab, and Pebble shapes`
- `Stencilled spray-paint textures with subtle overspray`
- `Overlapping semi-transparent geometric planes`
- `Extreme high-contrast lighting (Solidarity Mode)`

### 4. Technical Specs
- `Aspect Ratio: 16:9 (Hero), 1:1 (Icon)`
- `Reference: Gemini 3.1 Pro Vision Optimized`
- `Quality: Hyper-defined vector-like edges, zero blur`

## Gold Standard Prompts

### The "Workers Council" Tram Motif
> "Melbourne laneway street art stencil illustration of a classic W-class tram silhouette. Style: Kerala Rage Solidarity Mode. Colors: Deep matte black background --sys-color-charcoal-background, chassis in Solidarity Red --sys-color-solidarity-red, industrial highlights in Stencil Yellow --sys-color-stencil-yellow. Sharp, stencilled edges, gritty spray-paint texture, overlapping geometric slabs as secondary layers. Asymmetric stone radii. Optimized for Nano Banana Pro, 1:1 aspect ratio."

### The "Disruptive" Abstract Hero
> "Abstract composition of overlapping industrial metal slabs and stencilled textures. Style: Contemporary Melbourne urban grit. Colors: --sys-color-charcoal-background base, highlight elements in --sys-color-ink-gold (Ink Gold) and --sys-color-solidarity-red. Sharp shadows, high-contrast silhouette. Asymmetric radii (pebble and slab). Incorporate subtle JetBrains Mono decorative code markers. Optimized for Nano Banana Pro, 16:9 hero layout."
