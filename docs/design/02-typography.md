# Typography: The Solidarity Manifesto

> Part of [Kerala Rage Design System – Contemporary Australian](00-overview.md)

---

## 1. The Solidarity Stack

A marriage of street poster impact and high-legibility UI, built for the "Contemporary Australian" context.

| Role         | Font Family       | Usage                           |
| ------------ | ----------------- | ------------------------------- |
| **Display**  | Bebas Neue        | Hero headlines, big metrics.    |
| **Header**   | Sora Variable     | Page titles, expressive nav.    |
| **Body**     | Plus Jakarta Sans | Primary copy, forms, UI labels. |
| **Metadata** | JetBrains Mono    | Technical data, annotations.    |

---

## 2. Usage Specifications

### Display (The Stencil)

```css
.display-large {
  font-family: "Bebas Neue", sans-serif;
  font-size: 4rem;
  line-height: 0.9;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--kr-paper-white);
}
```

_Use Case_: Landing page headings, major section transitions.

### Headline (The Call to Action)

```css
.headline-large {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 2rem;
  line-height: 1.2;
  color: var(--kr-paper-white);
}
```

_Use Case_: Page titles, card headers.

### Body (The Narrative)

```css
.body-medium {
  font-family: "Plus Jakarta Sans", sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--kr-paper-white);
}
```

_Use Case_: All standard text, descriptions, and user input.

### Metadata (The Blueprint)

```css
.metadata {
  font-family: "JetBrains Mono", monospace;
  font-weight: 400;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  color: var(--kr-baru-gold); /* Often used for emphasis in data */
}
```

_Use Case_: Timestamps, IDs, structural annotations.

---

## 3. Typographic Principles

1. **Extreme Contrast**: Pair Bebas Neue (Display) with Plus Jakarta Sans (Body) for maximum focal impact.
2. **Ink Awareness**: Use high weight (700+) for headlines to simulate "thick ink" on the charcoal substrate.
3. **No Slop**: Avoid generic serif or sans-serif defaults. Every font choice must feel intentional and aligned with the "Street Art" philosophy.
