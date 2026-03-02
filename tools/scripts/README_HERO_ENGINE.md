# Kerala Rage: Hero Asset Engine

The Hero Asset Engine is a sophisticated, multi-layered composition system designed to create atmospheric, parralax-driven backgrounds that adhere to the project's contemporary Australian design canon.

## Core Components

- **`gemini-hero-generator.ts`**: An AI tool that uses Gemini 2.0 Flash to compose new "Heros" by selecting assets from the manifest and suggesting typography/animation settings.
- **`heroComposer.ts`**: The business logic layer that validates compositions against cultural safety rules (e.g., preventing specific motif overlaps).
- **`LayeredHero.tsx`**: The React renderer that handles variable font "pressure", scroll-driven parallax, and blend modes.

## Using the Generator

The generator allows you to create new hero compositions based on templates and context.

### Basic Usage

```bash
# Generate a new hero using the default template
npm run hero:generate

# Generate using a specific template
npm run hero:generate -- deterministic-layered-hero "A resistance-themed background"
```

The generator will:
1. Consult `hero-composer.json` for prompt templates.
2. Read the asset manifest for available layers.
3. Call Gemini to create a valid JSON composition.
4. Update `kr-solidarity.hero-registry.json` automatically.

## Design Canon Rules (Automated)

The engine enforces several rules from the `06b-asset-placement.md` guide:
- **Substrate Requirement**: Every hero must have a Z-0 substrate.
- **Z-Index Controls**: Assets are placed in logical layers (background, motif, UI overlays).
- **Cultural Safety**: 
    - No multiple devotional layers.
    - No street-art motifs directly above devotional motifs.
    - Opacity and blend modes are tuned for "Solidarity Mode" legibility.

## Composition Registry

All available heros are located in:
`frontend/public/assets/kr-solidarity/kr-solidarity.hero-registry.json`

To use a hero in code:
```tsx
const result = composeHero(manifest, registry, 'your-hero-id');
if (result.valid) {
  return <LayeredHero {...result} />;
}
```
