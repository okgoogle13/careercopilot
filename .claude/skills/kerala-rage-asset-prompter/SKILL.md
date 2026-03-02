---
name: kerala-rage-asset-prompter
description: Specialized prompt engineering for generating high-fidelity Kerala Rage assets for Gemini 3.1 Pro and Nano Banana Pro models. Use when needing new hero illustrations, icons, or decorative textures aligned with the "Solidarity Mode" aesthetic.
metadata:
  version: 1.1.0
  category: design
  tags: [design, prompts, kerala-rage, gemini, image-gen, melbourne-aesthetic]
  dependencies:
    - kerala-rage-brand-enforcer
---

# Kerala Rage Asset Prompter

## Purpose

The `kerala-rage-asset-prompter` skill bridges abstract architectural requirements and high-fidelity visual generation. It specializes in crafting precise, brand-aligned prompts for image generation models (specifically **Nano Banana Pro**) and vision-logic models (**Gemini 3.1 Pro**).

## When to Use

- **Asset Generation**: When needing new hero illustrations, icons, or decorative textures.
- **Brand Transition**: When transforming a low-fidelity wireframe into a high-fidelity visual concept.
- **Cultural Motif Drafting**: When generating industrial or collective motifs (Melbourne Tram silhouettes, Kerala elephants) in a "Melbourne Laneway" stencil style.
- **Vision Review**: When performing brand-compliance vision analysis on generated images using Gemini 3.1 Pro.

## Capabilities

- **Semantic Prompt Synthesis**: Translates high-level requests into technical prompts incorporating specific color tokens (e.g., `--sys-color-solidarityRed-base`) and typography descriptors.
- **Model Optimization**: Adapts prompt weighting and technical parameters specifically for Nano Banana Pro (generation) and Gemini 3.1 Pro (analysis).
- **Brand Enforcement**: Enforces "Solidarity Mode" aesthetics, including mandatory color palettes, gritty textures, and industrial/cultural motifs.
- **Asset Categorization**: Generates category-specific technical specs for Hero Illustrations, Icons, Textures, and Industrial Motif Studies.
- **Vision-Based Refinement**: Provides guidance for refining assets via iterative vision analysis (Gemini 3.1 Pro).

## Usage Workflow

### Step 1: Define Asset Intent
Specify the asset type (Hero, Icon, Texture), subject matter, and intended placement (e.g., "Dashboard header").

### Step 2: Generate Optimized Prompt
The skill synthesizes brand guardrails, model-specific syntax, and technical specs.
- **Command**: "Generate a Hero Illustration prompt for a Tram Silhouette in Kerala Rage style for Nano Banana Pro."

### Step 3: Generation & Review
- Use the prompt in Nano Banana Pro.
- (Recommended) Pass the result to Gemini 3.1 Pro for vision analysis.
- **Command**: "Analyze this generated image against the Solidarity Mode spec. Suggest refinements for contrast and color accuracy."

### Step 4: Refinement
Incorporate vision feedback into a refined prompt and re-run.

## Brand Guardrails (Production Spec)

### Mandatory Palette
- **Canvas**: `--sys-color-charcoalBackground-base` (#1A1A1A / #0F0F0F)
- **Primary Energy**: `--sys-color-solidarityRed-base` (#F14714)
- **Radiance**: `--sys-color-inkGold-base` (#DAF674)
- **Attention**: `--sys-color-stencilYellow-base` (#F6E748)

### Aesthetic Markers
- **Texture**: Melbourne laneway grit, wheat-paste ripples, stencilled spray-paint.
- **Shape**: Asymmetric radii (`radius-stone`, `radius-slab`, `radius-pebble`). **BANNED: Perfect circles.**
- **Hierarchy**: Extreme variable contrast (9× weight ratio, 6× size ratio).

## Best Practices

- **Specificity**: Name the specific urban or cultural subject (e.g., "Melbourne W-class tram" rather than just "vehicle").
- **Token Injection**: Use the semantic token names in descriptions to guide AI "understanding" of role.
- **Weighting**: In Nano Banana Pro, use `(keyword:1.2)` for emphasis on specific brand anchors like "Solidarity Red".
- **Avoid Slop**: Explicitly ban "soft gradients", "pastel colors", "floral patterns", and "corporate symmetry".

## Troubleshooting

- **Issue: Output is too 'pretty/clean'**: Increase "urban grit" and "stencil overspray" weights.
- **Issue: Colors look washed out**: Ensure the prompt explicitly mentions "Deep matte base #0F0F0F" and "Solidarity Red #F14714".
- **Issue: Non-brand motifs appearing**: Re-iterate "Industrial and Cultural motifs ONLY" and "Zero bureaucracy symbols".

## Worked Examples

### Example 1: W-Class Tram Stencil Hero (16:9)
> "**Prompt**: High-contrast stencil illustration of a classic Melbourne W-class tram, Melbourne laneway street art style. Colors: Background `--sys-color-charcoalBackground-base` (#0F0F0F), Accents `--sys-color-solidarityRed-base` (#F14714) and `--sys-color-inkGold-base` (#DAF674). Gritty spray-paint texture, overlapping geometric slabs with asymmetric stone radii. Sharp shadows, 'Solidarity Mode' disruptive aesthetic. Optimized for Nano Banana Pro, 16:9 aspect ratio, hyper-defined edges."

### Example 2: Workers Council Icon (1:1)
> "**Prompt**: Industrial stencil-cut silhouette icon of a clenched fist holding a heavy-duty wrench. Style: Hand-stamped Melbourne urban activist aesthetic. Colors: Foreground `--sys-color-worker-ash-base` (#DAF6B3), Background #000000. Imperfect hand-cut 'radius-pebble' edges, slight ink bleed, high legibility at small scale. Optimized for Nano Banana Pro, 1:1."

### Example 3: Wheat-Paste Texture (Background)
> "**Prompt**: Abstract background texture of weathered wheat-paste posters over charcoal brick. Style: Melbourne laneway urban grit. Palette: Subtle gradients of `--sys-color-charcoalBackground-steps` (#0F0F0F to #323232). Aesthetic: Torn paper edges, heavy paper tooth, ink drip, zero focus points. Optimized for Nano Banana Pro, 2k resolution."

### Example 4: Proclamation Hero (Typography Study)
> "**Prompt**: Typographic hero statement 'ALWAYS WAS' in `--sys-type-fontFamilies-proclamation` (Libre Bodoni). Style: Poster slam impact. Colors: #F14714 text on #0F0F0F base. Extreme 9x weight contrast against micro metadata text in `--sys-type-fontFamilies-mono`. Overlapping geometric slabs. Optimized for Gemini 3.1 Pro vision spec."

### Example 5: Backwater Ripple Accent (Melancholy Mode)
> "**Prompt**: Stylized graphic study of water ripples inspired by Kerala backwaters. Style: Melancholy longing, reflective urban mood. Colors: Base #0F0F0F, Ripples in `--sys-color-labWrenMetalBlue-base` (#48B3DA). Soft-yet-defined edges, layering of semi-transparent planes. Optimized for Nano Banana Pro."

## Related Files

- [BRAND_TOKENS_REFERENCE.md](./references/BRAND_TOKENS_REFERENCE.md) - Technical token mapping.
- [MODEL_OPTIMIZATION_GUIDE.md](./references/MODEL_OPTIMIZATION_GUIDE.md) - Nano vs Gemini specs.
- [PROMPT_TEMPLATES.md](./references/PROMPT_TEMPLATES.md) - Reusable structures.
- [tokens.json](../../../frontend/src/design/tokens/tokens.json) - Source of truth for brand variables.
- [kerala-rage-brand-enforcer](../kerala-rage-brand-enforcer/SKILL.md) - Compliance checking skill.
