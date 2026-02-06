Here’s a contemporary, street-art-aligned rewrite that keeps the spirit but drops the Victorian cabinet vibe.

---

# Northcote Design System – Contemporary Australian

> **Navigation**: [Tokens](01-tokens.md) · [Typography](02-typography.md) · [Components](03-components.md) · [Voice](04-voice.md) · [Assets](05-assets.md) · [Wireframes](06-wireframes.md) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)

---

## System Identity: The Laneway Navigator

**We are not building a dashboard. We are building a living navigation surface for migrants, POC, and career‑changers moving through systems not built for them.** [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)

CareerCopilot is a curated digital workspace where a user’s professional history is treated not as “data,” but as a living ecosystem of experiences, skills, and stories that keep evolving. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/71e47c55-6a62-408b-a42b-69ec9db60ba8/README.md)

The visual language is rooted in:

**1. Peter Drew Street Art (PRIMARY)**
- Bold silhouettes, poster-like contrast, unapologetic messaging
- Wheat-paste aesthetic, rough textures, urban grit
- Political clarity, direct communication, no subtlety
- Reference: AUSSIE poster campaign (screen-printed, hand-pasted, community-driven)

**2. Material 3 Expressive (FOUNDATION)**
- Semantic tokens, spring physics, accessible dark UI. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)
- Extreme weight contrasts, variable fonts, organic asymmetry

**3. Australian Context (ACCENT)**
- Endemic species (Kookaburra, Waratah) as companions, not centerpieces
- Earthy palette (ochre, wattle gold, gum leaf green)
- Melbourne urban setting (laneways, trams, street culture)

---

## Core Identity

- **Contemporary, not nostalgic** — no sepia, no faux‑Victorian museum cabinets. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)
- **Living, not preserved** — present‑tense, active scenes rather than “specimens on display.” [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)
- **Bold, not subtle** — high contrast, strong shapes, legible hierarchy. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)
- **Migrant‑centred, not system‑centred** — interfaces are built around the person navigating Centrelink, selection criteria, and hiring barriers, not around HR workflows. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/47446d17-47bd-4d14-ba14-c7869503af06/AGENTS.md)

---

## Single Mode, Three Densities

We’ve retired the Gallery vs Laboratory split. There is **one unified contemporary mode**, expressed at different densities:

| Density          | Use                                     | Visual Language                                                    |
| ---------------- | --------------------------------------- | ------------------------------------------------------------------ |
| **High Drama**   | Landing, hero moments, key empty states | Large poster-style silhouettes, urban textures, bold type contrast |
| **Standard**     | Dashboards, lists, navigation           | Clean surfaces, subtle urban accents, clear hierarchy              |
| **High Clarity** | Data review, parsing, ATS analysis      | Minimal decoration, high contrast, strong alignment, data-focused  |

**Species Usage by Density**:
- **High Drama**: Optional large silhouette as background element (10% of layouts)
- **Standard**: Small icons at margins (< 5% of surface area)
- **High Clarity**: No species imagery (tokens and data only)

---

## Core Directives (Non‑Negotiables)

### A. Anti‑Slop Protocol

| Banned                                    | Required                                                                                                                                                                                                                                             |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Generic `border-radius: 8px`              | **Organic asymmetry** using radius tokens with variation: `radius-pebble` (20px 6px 16px 28px), `radius-stone` (16px 4px 12px 24px), `radius-leaf` (24px 8px 20px 4px) — 4 different corners. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md) |
| Pure black / white (`#000000`, `#FFFFFF`) | **Asphalt Black** `#1A1714`, **Paper White** `#F5F0E8`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md)                       |
| Arbitrary hex colors                      | **Semantic tokens** from `tokens.json` and `northcote.css`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)                    |
| Generic sans (Roboto/Arial/Inter alone)   | **Sora Variable** (display), **Plus Jakarta Sans Variable** (headers/body), **JetBrains Mono** (data). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/03227b1a-986b-47ff-8d23-86257e7e16b8/02-typography.md) |
| Heavy hard shadows                        | **Soft, layered elevation** using tokenized shadow levels. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)                     |

**Urban Textures**:
- Concrete grain backgrounds (subtle noise, 5% opacity)
- Paper texture overlays (recycled poster feel)
- Asphalt gradients (not flat fills)

---

### B. Urban Context & Species as Accents

**Primary Visual Language** — Melbourne street art culture:
- Laneway murals, wheatpaste posters, stencil graffiti
- Community noticeboards, street signs, concrete textures
- Peter Drew AUSSIE poster aesthetic — bold silhouettes, high contrast, unapologetic messages

**Species as Accents** — Australian endemic flora/fauna appear:
- At margins and edges (not center-stage)
- Small icons and companion elements (not heroes)
- Urban context (on power lines, street signs, fences) when used
- Common names first (KOOKABURRA before Latin)
- Never as specimens, cabinets, or naturalist collections

**Anti‑colonial framing**:
- No "specimen", "cabinet", "naturalist", or Federation‑era romance
- Concentric circles, journey lines, and earth tones as **universal geometric references**, never as imitation of specific First Nations styles

---

### C. Motion: The Viscous Breeze

- **Primary curve**: `cubic-bezier(0.34, 1.56, 0.64, 1)` — gentle overshoot then settle. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md)
- **Durations**: 250–400ms as per Material 3 Expressive duration tokens. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)
- **Hover = Bloom**:
  - Slight lift `translateY(-2px)`.
  - Weight or emphasis increases (stronger contrast, subtle scale). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md)
- Motion should feel like **breathing street posters**, not bouncy toys.

---

## Architecture Summary

| Layer         | Technology                                                                                                                                                                                                                                                           |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend      | React + Tailwind (or CSS Modules) with Northcote tokens applied. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/47446d17-47bd-4d14-ba14-c7869503af06/AGENTS.md)                                 |
| Design Engine | `design-system/tokens.json` + `design-system/northcote.css` (Material 3 Expressive structure). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json) |
| Backend       | FastAPI / Genkit / Firestore stack as per project README. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/47446d17-47bd-4d14-ba14-c7869503af06/AGENTS.md)                                        |
| Primary Intel | Gemini 3.x (Flash + Pro) orchestrated via Genkit flows. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/47446d17-47bd-4d14-ba14-c7869503af06/AGENTS.md)                                          |
| Sidekicks     | Design system sidekick for visual/token compliance where available. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/47446d17-47bd-4d14-ba14-c7869503af06/AGENTS.md)                              |
| Testing       | Playwright visual checks + Jest/pytest for behavior. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/47446d17-47bd-4d14-ba14-c7869503af06/AGENTS.md)                                             |

---

## Master Palette (Contemporary)

```txt
MASTER PALETTE (DARK THEME)
├── Background    Asphalt Black   #1A1714
├── Text          Paper White     #F5F0E8
├── Primary       Wattle Gold     #D4A84B
├── Secondary     Waratah Red     #C45C4B
├── Tertiary      Ochre Earth     #B8733D
├── Neutral       Concrete Grey   #A39B8F
└── Accent        Gum Leaf Green  #6B7F6E
```

Use the **semantic tokens** for implementation; the hex values exist for reference and asset generation prompts, not for hard‑coding into components.
