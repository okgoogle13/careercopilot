# Model Optimization Guide: Nano Banana Pro vs. Gemini 3.1 Pro

This guide specifies technical differences in prompt engineering required to maximize asset quality across different generative models.

## Comparison Overview

| Feature | Nano Banana Pro (Generation) | Gemini 3.1 Pro (Vision & Logic) |
|---------|-----------------------------|---------------------------------|
| **Primary Strength** | Graphic clarity, stencil textures. | Contextual reasoning, style analysis. |
| **Complexity** | Prefers high-contrast, simple forms. | Handles complex metaphors and lighting. |
| **Word Count** | Short to medium (75-150 words). | Can process long, exhaustive specs. |
| **Color Handling** | Exact hex codes are extremely effective. | Understands semantic names better. |
| **Technical Spec** | Focus on ratio, resolution, grit. | Focus on composition, mood, brand score. |

---

## 🍌 Nano Banana Pro Optimization

Nano Banana Pro responds best to **technical descriptors** and **direct visual commands**.

### Key Patterns:
- **Direct Hex Injection**: Use `--sys-color-solidarityRed-base (#F14714)` explicitly.
- **Texture Stacking**: Mention "Gritty spray-paint", "stencil overspray", and "wheat-paste ripple" early in the prompt.
- **Sharp Edges**: Use terms like "Razor-sharp stencil cut", "Vector-like definition", and "Zero-blur".

### Example Prompt Logic:
> "Stencil art of [Subject]. Melbourne laneway style. Base #0F0F0F, Accents #F14714 and #DAF674. Asymmetric radii. 16:9 Aspect Ratio."

---

## ♊ Gemini 3.1 Pro Optimization

Gemini 3.1 Pro is superior for **vision evaluation** and **multi-layered composition** drafting.

### Key Patterns:
- **Metaphorical Weight**: Describe the *mood* (e.g., "Industrial strength meeting traditional craft") to influence the subtle composition.
- **Variable Axis Support**: Explicitly request font axes if the model supports text rendering (e.g., "Libre Bodoni at max weight 900").
- **Vision Refinement**: Use as a critic. "Analyze this image against the Kerala Rage Solidarity Mode spec. Score contrast, color accuracy, and industrial motif clarity."

### Example Refinement Logic:
> "Describe a hero composition that balances Kerala houseboat ripples with Melbourne industrial scaffolding. Use the 'melancholy longing' motion pattern as a structural guide for the layout flow."

---

## Technical Specifications

| Asset Category | Target Resolution | Recommended Model | Focus Areas |
|----------------|-------------------|-------------------|-------------|
| **Hero Illustration** | 1920×1080 (16:9) | Nano Banana Pro | Contrast, Grit, Balance |
| **Icon Set** | 256×256 (1:1) | Nano Banana Pro | Silhouette, Clarity |
| **Texture/BG** | 2048×2048 | Nano Banana Pro | Repeatability, Subtlety |
| **Composition Spec** | N/A | Gemini 3.1 Pro | Logic, Narrative, Brand |
