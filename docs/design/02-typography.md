# Typography: The Solidarity Manifesto

> Part of [Kerala Rage Design System – Contemporary Australian](00-overview.md)

---

## 1. The ExpressiveStack

A high-performance typography system blending street-poster impact with Material 3 Expressive motion.

| Role | Font Family | Usage |
|------|-------------|-------|
| **Primary** | Work Sans | Main UI, body text, labels. |
| **Display** | Fraunces | Emotional headers, subheads. |
| **Proclamation** | Libre Bodoni | Authoritative hero statements. |
| **Mono** | JetBrains Mono | Technical data, annotations. |
| **Curator** | Caveat | Handwritten accents, notes. |
| **Accent** | Nabla | Restricted hero moments only. |

---

## 2. Strict Nabla Usage Policy

To maintain brand integrity and trust, the **Nabla** font is restricted to specific editorial moments.

### ✅ ALLOWED:
- **Dashboard Overview ("The Collective"):** 1–2 words only in hero title (e.g., "Collective", "Rage").
- **Ingestion ("The Deposition"):** Success stamp word only (e.g., "DEPOSITED").
- **Manifesto Heroes:** Single accent word.

### ❌ FORBIDDEN:
- **Authentication ("The Verification"):** Undermines trust/security.
- **Analysis Dashboard:** Too "structural"; use Proclamation/Bloom/Mono only.
- **Settings ("The Archive Vault"):** Creates UI noise.

---

## 3. Usage Specifications

### Proclamation (The Manifesto)

```css
.text-proclamation {
  font-family: "Libre Bodoni", serif;
  font-weight: 700;
  font-stretch: condensed;
  letter-spacing: -0.03em;
}
```

### Display (The Emotional Bloom)

```css
.text-bloom {
  font-family: "Fraunces", serif;
  font-variation-settings: "SOFT" 50, "WONK" 1, "wght" 500;
}
```

### Primary (The Field Note)

```css
.text-body {
  font-family: "Work Sans", sans-serif;
  font-weight: 400;
}
```

### Nabla Hero (The Hit)

```css
.text-nabla-hero {
  font-family: "Nabla", system-ui;
  font-palette: --nabla-solidarity;
}
```

---

## 4. Typographic Principles

1. **Extreme Variable Contrast**: Enforce 9× weight ratio (100 vs 900) and 6× size ratio (12px vs 72px+).
2. **Optical Sizing**: `font-optical-sizing: auto` is mandatory for all roles.
3. **No Slop**: Absolutely NO Inter (standard), NO Recursive (deprecated), NO Sora, NO Plus Jakarta Sans.
