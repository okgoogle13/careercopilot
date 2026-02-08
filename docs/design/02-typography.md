Here’s a contemporary, single‑mode rewrite for your typography doc that matches the new system.

---

# Typography

> Part of [kerala-rage Design System – Contemporary Australian](00-overview.md) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/kerala-rage-design-principles.md)

---

## The Contemporary Typography Stack

_A marriage of street poster impact and clear, modern UI._ [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/03227b1a-986b-47ff-8d23-86257e7e16b8/02-typography.md)

| Role        | Font                           | Usage                          |
| ----------- | ------------------------------ | ------------------------------ |
| **Display** | Sora Variable (100-800)        | Hero headings, big labels      |
| **Headers** | Plus Jakarta Sans Variable     | Page titles, section headers   |
| **Body**    | Plus Jakarta Sans Variable     | Body text, forms, UI elements  |
| **Data**    | JetBrains Mono                 | Scores, code, technical labels |

- **Sora Variable** carries the Peter Drew poster energy with extreme weight range (100-800) for dramatic contrast. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/kerala-rage-design-principles.md)
- **Plus Jakarta Sans Variable** is the M3 Expressive workhorse (200-800) for modern, professional typography with extreme weight versatility.
- **JetBrains Mono** anchors anything numeric, structured, or "machine‑like." [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/03227b1a-986b-47ff-8d23-86257e7e16b8/02-typography.md)

---

## Base Usage

### Display / Hero (Street Poster)

```css
.hero-display {
  font-family: "Sora Variable", system-ui, sans-serif;
  font-weight: 300; /* Thin, elegant */
  font-size: 3.5rem; /* maps to display-large */
  line-height: 1;
  letter-spacing: -0.02em;
  font-optical-sizing: auto; /* REQUIRED for M3 Expressive */
  color: var(--color-text); /* Paper White on Asphalt Black */
}
```

Use for landing headlines, section intros, and key empty states. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)

### Headers

```css
h1,
h2,
h3 {
  font-family: "Plus Jakarta Sans Variable", system-ui, sans-serif;
  font-weight: 600;
  font-optical-sizing: auto;
  color: var(--color-text);
}
```

Keep headings short, declarative, and easy to scan.

### Body

```css
body,
p,
li {
  font-family: "Plus Jakarta Sans Variable", system-ui, sans-serif;
  font-size: 1rem; /* body-large */
  font-weight: 400;
  line-height: 1.5;
  font-optical-sizing: auto;
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

## Variable Fonts (M3 Expressive Required)

Material Design 3 Expressive requires variable fonts with fluid weight transitions and optical sizing.

### Font Variation Settings

Variable fonts allow smooth weight transitions without loading multiple font files:

```css
.expressive-heading {
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-variation-settings: "wght" 800;
  font-optical-sizing: auto; /* REQUIRED */
  transition: font-variation-settings 300ms var(--easing-standard);
}

.expressive-heading:hover {
  font-variation-settings: "wght" 900; /* Becomes bolder on hover */
}
```

### Optical Sizing

Optical sizing automatically adjusts font details for readability at different sizes. M3 Expressive **REQUIRES** this:

- At small sizes (12px): Serifs wider, contrast adjusted for clarity
- At large sizes (57px): Serifs thinner, contrast maximized for drama

```css
:root {
  font-optical-sizing: auto; /* Enable globally */
}

.expressive-headline {
  font-family: "Sora Variable", sans-serif;
  font-size: 57px;
  font-weight: 300;
  font-optical-sizing: auto; /* Sora adjusts finesse for large display */
}

.expressive-body {
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-size: 14px;
  font-weight: 400;
  font-optical-sizing: auto; /* Adjusts for small text legibility */
}
```

---

## Extreme Weight Contrasts (M3 Expressive)

M3 Expressive demands **dramatic weight contrasts** (3x+ ratio minimum):

```css
/* ❌ WEAK - 1.2x ratio (AVOID) */
.timid {
  font-weight: 500;
}
.timid-hover {
  font-weight: 600;
}

/* ✅ M3 EXPRESSIVE - 3x ratio */
.hero-title {
  font-family: "Sora Variable", sans-serif;
  font-weight: 300;  /* Thin, elegant */
  font-size: 57px;   /* display-large */
}

.hero-subtitle {
  font-family: "Plus Jakarta Sans Variable", sans-serif;
  font-weight: 700;  /* Bold, grounded */
  font-size: 14px;   /* body-medium */
}

/* Weight ratio: 700/300 = 2.33x + Size ratio: 57/14 = 4x = EXPRESSIVE */
```

### Hover Emphasis (Extreme Contrast)

Use variable font axes for smooth weight transitions:

```css
.nav-link {
  font-family: "Plus Jakarta Sans Variable", system-ui, sans-serif;
  font-weight: 300;
  transition:
    font-variation-settings var(--duration-medium-2) var(--easing-standard),
    color var(--duration-medium-2) var(--easing-standard),
    transform var(--duration-medium-2) var(--easing-standard);
}

.nav-link:hover {
  font-weight: 900; /* 3x weight increase */
  transform: translateY(-2px);
  color: var(--color-primary); /* Wattle Gold */
}
```

Durations and easing should match `tokens.json` motion values. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)

---

## M3 Expressive Type Scale Mapping

Use the Material 3 Expressive semantic type scale from `tokens.json`: [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)

| M3 Semantic Token     | Size | Weight | Font                       | Use Case               |
|-----------------------|------|--------|----------------------------|------------------------|
| `display-large`       | 57px | 300    | Sora Variable              | Hero headlines         |
| `headline-large`      | 32px | 600    | Plus Jakarta Sans Variable | Page titles            |
| `body-large`          | 16px | 400    | Plus Jakarta Sans Variable | Primary copy           |
| `body-medium`         | 14px | 400    | Plus Jakarta Sans Variable | Secondary text         |
| `label-large`         | 14px | 600    | Plus Jakarta Sans Variable | Button labels          |

### Size Contrast

Aim for at least a **3–4× size ratio** between hero title and supporting line:

```css
.hero-title {
  font-family: "Sora Variable", sans-serif;
  font-weight: 300;
  font-size: 3.5rem; /* ~display-large, 57px */
  line-height: 1;
}

.hero-subtitle {
  font-family: "Plus Jakarta Sans Variable", system-ui, sans-serif;
  font-weight: 400;
  font-size: 1rem; /* body-large, 16px */
  line-height: 1.5;
}

/* Size ratio: 57/16 = 3.5x — Bold without going full kerala-streetprint broadsheet */
```

---

## Typography & Voice Tiers

Tie type choices to your voice tiers: [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/8ad7dc28-448f-4f80-8d9e-3ee8a27b89f8/04-voice.md)

| Tier             | Context                              | Typography                                       |
| ---------------- | ------------------------------------ | ------------------------------------------------ |
| T1 (Functional)  | Buttons, nav, form labels            | Plus Jakarta Sans Variable 500–600               |
| T2 (Personality) | Empty states, success, gentle nudges | Sora Variable 600–800 for short bursts           |
| T3 (Data)        | Scores, analysis labels, code        | JetBrains Mono 500                               |

See [Voice & Microcopy](04-voice.md) for the full tier system and examples. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/8ad7dc28-448f-4f80-8d9e-3ee8a27b89f8/04-voice.md)
