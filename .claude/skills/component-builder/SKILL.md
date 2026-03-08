---
name: component-builder
description: React 18 component builder focused on data-slot properties and speculative asset resolution.
metadata:
  version: 5.0.0
  tags:
    - react
    - pipeline
    - zustand
---

## INPUT
- `enriched_spec`: JSON from spec-generator

## OUTPUT
React 18 function components with:
- Zustand `useStore` hooks
- Tailwind v4 CSS vars ONLY: `bg-[--sys-substrate]`
- **CRITICAL**: Props per slot, NO asset imports:

```jsx
function HeroCard({ ctaAssetId }) {
  return <div data-slot="cta_background" data-asset-id={ctaAssetId} />
}
```
