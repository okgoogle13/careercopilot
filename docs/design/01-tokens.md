Here’s a contemporary, single‑mode rewrite that stays true to your new palette and philosophy.

---

# Design Tokens

> Part of [Northcote Design System – Contemporary Australian](00-overview.md) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)

---

## Color Palette

_Contemporary Australian street art on a dark Melbourne laneway, not a Victorian cabinet._ [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md)

### Core Tokens

| Token             | Hex       | CSS Variable        | Usage                                                              |
| ----------------- | --------- | ------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Asphalt Black** | `#1A1714` | `--color-surface`   | **The Foundation** — warm charred urban substrate (not pure black) |
| **Wattle Gold**   | `#D4A84B` | `--color-primary`   | **The Protagonist** — primary actions, focus, visibility           |
| **Waratah Red**   | `#C45C4B` | `--color-accent`    | **The Urgency** — alerts, warnings, critical states                |
| **Concrete Grey** | `#A39B8F` | `--color-container` | **The Container** — cards, panels, neutral scaffolding             |
| **Muted Neutral** | `#A39B8F` | `--color-muted`     | **The Detail** — metadata, secondary text                          |
| **Paper White**   | `#F5F0E8` | `--color-text`      | **The Ink** — primary text contrast on dark surfaces               | [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md) |

We keep the **dark UI**: background = Asphalt Black, text = Paper White, with Wattle Gold and Waratah Red as the main signal colors. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)

### Tonal Stacks

#### Wattle Gold Family (Primary)

| Token         | Hex       | Variable                | Usage                |
| ------------- | --------- | ----------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wattle Shadow | `#8B7A35` | `--color-primary-dark`  | Borders, dark states |
| Wattle Base   | `#D4A84B` | `--color-primary`       | Primary actions      |
| Wattle Glow   | `#E8C963` | `--color-primary-light` | Hover, highlights    |
| Wattle Bloom  | `#F5DDAA` | `--color-primary-pale`  | Subtle accents       | [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md) |

#### Waratah Family (Accent)

| Token         | Hex       | Variable               | Usage             |
| ------------- | --------- | ---------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Waratah Stem  | `#7A3A2E` | `--color-accent-dark`  | Error/danger dark |
| Waratah Base  | `#C45C4B` | `--color-accent`       | Standard accent   |
| Waratah Glow  | `#E07865` | `--color-accent-light` | Hover on accent   |
| Waratah Bloom | `#F5A89A` | `--color-accent-pale`  | Soft warnings     | [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md) |

---

## Border Radius (Organic Asymmetry)

_Eroded kerb stones, not CAD‑perfect rectangles._ [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md)

| Archetype  | Token           | Value                | Usage           |
| ---------- | --------------- | -------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pebble** | `radius-pebble` | `20px 6px 16px 28px` | Buttons, FABs   |
| **Stone**  | `radius-stone`  | `16px 4px 12px 24px` | Cards, Modals   |
| **Leaf**   | `radius-leaf`   | `24px 8px 20px 4px`  | Hero containers |
| **Seed**   | `radius-seed`   | `8px 4px 10px 6px`   | Tags, pills     | [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md) |

Use these instead of symmetric `border-radius: 8px`.

---

## Motion (Viscous Breeze)

| Property  | Value                               | Purpose          |
| --------- | ----------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Curve** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Gentle overshoot |
| **Base**  | 250–400ms (M3 duration tokens)      | Deliberate, calm |
| **Lift**  | `translateY(-2px)`                  | Hover elevation  | [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md) |

### The Bloom Effect

On hover, elements don’t just change color — they **inflate** slightly:

- `font-weight`: +100 (or next weight step)
- Optional: `font-variation-settings`: `'SOFT' +30` where supported
- `transform`: `translateY(-2px)` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md)

This keeps motion feeling like **posters flexing in a breeze**, not cartoon bounces.

---

## Typography

_A compact toolkit for contemporary Australian UI and data._ [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/03227b1a-986b-47ff-8d23-86257e7e16b8/02-typography.md)

| Token       | Font Family    | Usage                          |
| ----------- | -------------- | ------------------------------ |
| **Display** | Bebas Neue     | Hero headings, big labels      |
| **Headers** | Space Grotesk  | Section titles, navigation     |
| **Body**    | Inter          | Body text, forms, UI copy      |
| **Data**    | JetBrains Mono | Code, scores, technical labels |

Size and line‑height follow the Material 3 type scale defined in `tokens.json` (display/headline/title/body, large/medium/small). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)

---

## Atmosphere (Replaces Dual Mode)

We now use **one unified contemporary mode**, tuned by density instead of a Gallery vs Laboratory split: [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)

- **High Drama**: hero sections, first‑time landing, big empty states
  - Large species silhouettes, strong contrast, bold type.
- **Standard**: dashboards, feeds, navigation
  - Clean surfaces, species accents, comfortable density.
- **High Clarity**: ATS analysis, parsing, detail review
  - Minimal decoration, high contrast, clear grids and labels. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/7cb97ada-65a0-4882-a47d-07e4dff0aef1/annotated-wireframes.md)

Textures (noise, subtle gradients) should support content, not push a vintage or sepia aesthetic.

---

## Metadata Tokens (Asset Classification)

_Used when tagging/generated assets or configuring asset pipelines._ [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/7f8b9906-8330-4792-a66e-33da8a4c40b7/asset-analysis-complete.md)

| Category               | Tokens                                                           |
| ---------------------- | ---------------------------------------------------------------- |
| **Motif Types**        | `species`, `geometric`, `interface`                              |
| **Translucency Bands** | `opaque`, `translucent` (40–60%), `diaphanous` (60–80%)          |
| **Scale Hierarchy**    | `primary` (hero), `secondary` (supporting), `tertiary` (texture) |

Values mirror your earlier scheme but shift the language away from “specimen” toward **living subjects**.

---

## Grid & Annotation System

_Technical tokens for any “inspection” or detail views._ [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/efa04425-d50c-4611-bc01-ab05d271c694/annotated-wireframes.md)

| Token                     | Value                       | Usage                                   |
| ------------------------- | --------------------------- | --------------------------------------- |
| **Grid Unit (Primary)**   | `10mm` (100px)              | Major structural snap points            |
| **Grid Unit (Secondary)** | `1mm` (10px)                | Minor alignment                         |
| **Snap Tolerance**        | `4px`                       | Interaction magnet radius               |
| **Leader Line Weight**    | `0.5pt`                     | Minimal label connectors                |
| **Data Point Radius**     | `2px`                       | Measurement anchors                     |
| **Annotation Gap**        | `12px`                      | Distance between label and target       |
| **Grid Color**            | `rgba(163, 155, 143, 0.15)` | Faint lines using `--color-muted`       |
| **Instruction Highlight** | `rgba(212, 168, 75, 0.4)`   | Active snap / hover state (Wattle Gold) |

---

**Last Updated**: 2026‑02‑05
**Target Architecture**: Gemini 3.x / Antigravity / Contemporary Australian Design System [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)
