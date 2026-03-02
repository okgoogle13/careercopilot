<<<<<<< HEAD
# Typography

> Part of [Northcote Curio Design System](00-overview.md)

---

## The Federation Typography Stack

_A marriage of the broadsheet poster and the field notebook._

| Role                 | Font                            | Usage                          | Weight                   |
| -------------------- | ------------------------------- | ------------------------------ | ------------------------ |
| **The Proclamation** | Libre Bodoni / Playfair Display | Gallery headers, hero moments  | Condensed, high-contrast |
| **The Bloom**        | Fraunces Variable               | Sub-headers, emotional accents | Variable axes            |
| **The Field Note**   | Work Sans                       | Body text, UI elements         | 400 / 600                |
| **The Annotation**   | JetBrains Mono                  | Laboratory data, JSON output   | 500                      |

---

## Typography by Mode

### Gallery Mode

```css
font-family: "Fraunces", serif;
font-weight: 700;
font-variation-settings:
  "SOFT" 0,
  "WONK" 0.8;
color: var(--color-primary); /* Wattle Gold */
```

### Laboratory Mode

```css
font-family: "JetBrains Mono", monospace;
font-weight: 500;
color: var(--color-muted); /* Flannel Flower */
```

---

## Variable Font Axes (Fraunces)

Fraunces has expressive axes that **respond to user interaction**:

| State  | SOFT | WONK | Weight | Effect                       |
| ------ | :--: | :--: | :----: | ---------------------------- |
| Rest   |  50  |  0   |  400   | Neutral, composed            |
| Hover  |  30  | 0.5  |  600   | Curious, leaning in          |
| Active |  0   |  1   |  700   | Fully "wonky", hand-lettered |
| Focus  |  0   |  1   |  800   | Maximum expressiveness       |

### Interactive Typography CSS

```css
/* Rest State */
font-family: "Fraunces", serif;
font-weight: 600;
font-variation-settings:
  "SOFT" 50,
  "WONK" 0;

/* Hover State */
font-weight: 700;
font-variation-settings:
  "SOFT" 30,
  "WONK" 0.5;
transition: font-variation-settings 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## Size Contrast (Proclamation Maximalism)

**Principle**: Use **5x or greater** size ratios in Gallery hero moments.

```css
.hero-proclamation {
  font-family: "Libre Bodoni", serif;
  font-stretch: condensed;
  font-size: 240px;
  line-height: 0.9;
  color: var(--color-primary);
}

.hero-supporting {
  font-family: "Work Sans", sans-serif;
  font-size: 48px; /* 5x ratio */
  font-weight: 400;
  color: var(--color-text);
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
}
```

---

<<<<<<< HEAD
## Typography Pairing with Voice Tiers

| Tier             | Context                      | Typography         |
| ---------------- | ---------------------------- | ------------------ |
| T1 (Functional)  | Buttons, navigation          | Work Sans 600      |
| T2 (Personality) | Success states, empty states | Fraunces with WONK |
| T3 (Immersion)   | Lab analysis, tooltips       | JetBrains Mono     |

See [Voice & Microcopy](04-voice.md) for the full tier system.
=======
## 4. Typographic Principles

1. **Extreme Variable Contrast**: Enforce 9× weight ratio (100 vs 900) and 6× size ratio (12px vs 72px+).
2. **Optical Sizing**: `font-optical-sizing: auto` is mandatory for all roles.
3. **No Slop**: Absolutely NO Inter (standard), NO Recursive (deprecated), NO Sora, NO Plus Jakarta Sans.
>>>>>>> restoration-KR-Rage-Figma-v2.0
