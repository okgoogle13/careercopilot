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
}
```

---

## Typography Pairing with Voice Tiers

| Tier             | Context                      | Typography         |
| ---------------- | ---------------------------- | ------------------ |
| T1 (Functional)  | Buttons, navigation          | Work Sans 600      |
| T2 (Personality) | Success states, empty states | Fraunces with WONK |
| T3 (Immersion)   | Lab analysis, tooltips       | JetBrains Mono     |

See [Voice & Microcopy](04-voice.md) for the full tier system.
