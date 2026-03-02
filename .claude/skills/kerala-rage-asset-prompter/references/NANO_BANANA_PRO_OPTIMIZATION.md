# Nano Banana Pro Prompt Optimization Guide

This guide defines specific patterns for getting the best results from the **Nano Banana Pro** image generation model when working within the Kerala Rage design system.

## Model Characteristics

**Nano Banana Pro** excels at:
- High-contrast, graphic styles (stencils, linocut).
- Deep blacks (#0F0F0F) and vibrant, flat colors.
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
- `Base: #0F0F0F (Matte Black)`
- `Accents: #F14714 (Solidarity Red), #DAF674 (Ink Gold), #F6E748 (Stencil Yellow)`
- `UI/Secondary: #1A1A1A (Deep Ash)`

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
> "Melbourne laneway street art stencil illustration of a classic W-class tram silhouette. Style: Kerala Rage Solidarity Mode. Colors: Deep matte black background #0F0F0F, chassis in Solidarity Red #F14714, industrial highlights in Stencil Yellow #F6E748. Sharp, stencilled edges, gritty spray-paint texture, overlapping geometric slabs as secondary layers. Asymmetric stone radii. Optimized for Nano Banana Pro, 1:1 aspect ratio."

### The "Disruptive" Abstract Hero
> "Abstract composition of overlapping industrial metal slabs and stencilled textures. Style: Contemporary Melbourne urban grit. Colors: #0F0F0F base, highlight elements in #DAF674 (Ink Gold) and #F14714. Sharp shadows, high-contrast silhouette. Asymmetric radii (pebble and slab). Incorporate subtle JetBrains Mono decorative code markers. Optimized for Nano Banana Pro, 16:9 hero layout."
