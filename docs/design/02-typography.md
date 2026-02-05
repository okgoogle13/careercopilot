Here’s a contemporary, single‑mode rewrite for your typography doc that matches the new system.

---

# Typography

> Part of [Northcote Design System – Contemporary Australian](00-overview.md) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)

---

## The Contemporary Typography Stack

_A marriage of street poster impact and clear, modern UI._ [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/03227b1a-986b-47ff-8d23-86257e7e16b8/02-typography.md)

| Role        | Font           | Usage                          |
| ----------- | -------------- | ------------------------------ |
| **Display** | Bebas Neue     | Hero headings, big labels      |
| **Headers** | Space Grotesk  | Page titles, section headers   |
| **Body**    | Inter          | Body text, forms, UI elements  |
| **Data**    | JetBrains Mono | Scores, code, technical labels |

- **Bebas Neue** carries the Peter Drew poster energy for big, loud statements. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)
- **Space Grotesk** keeps headings contemporary and legible.
- **Inter** is the neutral workhorse for forms and copy.
- **JetBrains Mono** anchors anything numeric, structured, or “machine‑like.” [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/03227b1a-986b-47ff-8d23-86257e7e16b8/02-typography.md)

---

## Base Usage

### Display / Hero (Street Poster)

```css
.hero-display {
  font-family: "Bebas Neue", system-ui, sans-serif;
  font-size: 3.5rem; /* maps to display-large */
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--color-text); /* Paper White on Asphalt Black */
}
```

Use for landing headlines, section intros, and key empty states. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)

### Headers

```css
h1,
h2,
h3 {
  font-family: "Space Grotesk", system-ui, sans-serif;
  font-weight: 600;
  color: var(--color-text);
}
```

Keep headings short, declarative, and easy to scan.

### Body

```css
body,
p,
li {
  font-family: "Inter", system-ui, sans-serif;
  font-size: 1rem; /* body-large */
  line-height: 1.5;
  color: var(--color-text);
}
```

Body copy should feel quiet and supportive against the bolder headings. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)

### Data / Code

```css
.code,
.metric,
code,
pre {
  font-family: "JetBrains Mono", SFMono-Regular, Menlo, monospace;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.04em;
  color: var(--color-muted); /* Concrete Grey / muted neutral */
}
```

Use wherever precision and alignment matter (scores, JSON, tokens). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md)

---

## Expressiveness & Motion

We keep some of the expressive feel from your older stack, but simplify:

- **Hover emphasis**: increase weight one step (e.g., 500 → 600) and use `translateY(-2px)` for “bloom.” [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md)
- **Transitions**: align with motion tokens, e.g.:

```css
.nav-link {
  font-family: "Inter", system-ui, sans-serif;
  font-weight: 500;
  transition:
    color var(--duration-medium-2) var(--easing-standard),
    transform var(--duration-medium-2) var(--easing-standard);
}

.nav-link:hover {
  font-weight: 600;
  transform: translateY(-2px);
  color: var(--color-primary); /* Wattle Gold */
}
```

Durations and easing should match `tokens.json` motion values. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)

---

## Size Contrast

Use the Material 3 type scale from `tokens.json` as your baseline: [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)

- **Display Large**: 57px — hero headlines
- **Headline Large**: 32px — page titles
- **Body Large**: 16px — primary copy
- **Body Medium**: 14px — secondary text

Example hero pairing:

```css
.hero-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: 3.5rem; /* ~display-large */
  line-height: 1;
}

.hero-subtitle {
  font-family: "Inter", system-ui, sans-serif;
  font-size: 1rem; /* body-large */
  line-height: 1.5;
}
```

Aim for at least a **3–4× size ratio** between hero title and supporting line to keep things feeling bold without going full Victorian broadsheet. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/03227b1a-986b-47ff-8d23-86257e7e16b8/02-typography.md)

---

## Typography & Voice Tiers

Tie type choices to your voice tiers: [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/8ad7dc28-448f-4f80-8d9e-3ee8a27b89f8/04-voice.md)

| Tier             | Context                              | Typography                                       |
| ---------------- | ------------------------------------ | ------------------------------------------------ |
| T1 (Functional)  | Buttons, nav, form labels            | Inter 500–600                                    |
| T2 (Personality) | Empty states, success, gentle nudges | Space Grotesk 600 or Bebas Neue for short bursts |
| T3 (Data)        | Scores, analysis labels, code        | JetBrains Mono 500                               |

See [Voice & Microcopy](04-voice.md) for the full tier system and examples. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/8ad7dc28-448f-4f80-8d9e-3ee8a27b89f8/04-voice.md)
