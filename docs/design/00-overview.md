Here’s a contemporary, street-art-aligned rewrite that keeps the spirit but drops the Victorian cabinet vibe.

---

# Northcote Design System – Contemporary Australian

> **Navigation**: [Tokens](01-tokens.md) · [Typography](02-typography.md) · [Components](03-components.md) · [Voice](04-voice.md) · [Assets](05-assets.md) · [Wireframes](06-wireframes.md) [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)

---

## System Identity: The Laneway Navigator

**We are not building a dashboard. We are building a living navigation surface for migrants, POC, and career‑changers moving through systems not built for them.** [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)

CareerCopilot is a curated digital workspace where a user’s professional history is treated not as “data,” but as a living ecosystem of experiences, skills, and stories that keep evolving. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/71e47c55-6a62-408b-a42b-69ec9db60ba8/README.md)

The visual language sits at the intersection of:

- **Peter Drew street art** — bold silhouettes, poster-like contrast, unapologetic messages. [artmeetsscience](https://www.artmeetsscience.co/art-forms-in-nature-ernst-haeckel/)
- **Material 3 Expressive** — semantic tokens, springy motion, accessible dark UI. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)
- **Australian endemic species** — Kookaburra, Waratah, Banksia, Eucalyptus, Wattle as living guardians and symbols, not preserved specimens. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)

---

## Core Identity

- **Contemporary, not nostalgic** — no sepia, no faux‑Victorian museum cabinets. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)
- **Living, not preserved** — present‑tense, active scenes rather than “specimens on display.” [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)
- **Bold, not subtle** — high contrast, strong shapes, legible hierarchy. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)
- **Migrant‑centred, not system‑centred** — interfaces are built around the person navigating Centrelink, selection criteria, and hiring barriers, not around HR workflows. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/47446d17-47bd-4d14-ba14-c7869503af06/AGENTS.md)

---

## Single Mode, Three Densities

We’ve retired the Gallery vs Laboratory split. There is **one unified contemporary mode**, expressed at different densities:

| Density          | Use                                     | Visual Language                                          |
| ---------------- | --------------------------------------- | -------------------------------------------------------- |
| **High Drama**   | Landing, hero moments, key empty states | Large species silhouettes, big type, strong contrast     |
| **Standard**     | Dashboards, lists, navigation           | Clean surfaces, species accents, clear hierarchy         |
| **High Clarity** | Data review, parsing, ATS analysis      | Minimal species, high contrast, strong alignment, labels |

- **High Drama** frames the user as the protagonist in a Melbourne context (laneways, power lines, urban plants). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)
- **Standard** keeps the species present at the edges as companions rather than decoration. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3e96ba46-4b4b-44ae-8fdc-8981f704fb27/05-assets.md)
- **High Clarity** leans on tokens, grids, and color states for legibility; species drop back to margins or small icons. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/7cb97ada-65a0-4882-a47d-07e4dff0aef1/annotated-wireframes.md)

---

## Core Directives (Non‑Negotiables)

### A. Anti‑Slop Protocol

| Banned                                    | Required                                                                                                                                                                                                                                             |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Generic `border-radius: 8px`              | **Organic asymmetry** using our radius tokens (pebble/stone/leaf). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md)            |
| Pure black / white (`#000000`, `#FFFFFF`) | **Asphalt Black** `#1A1714`, **Paper White** `#F5F0E8`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/3c4a620b-da4a-462e-bacc-412a0775f24c/01-tokens.md)                       |
| Arbitrary hex colors                      | **Semantic tokens** from `tokens.json` and `northcote.css`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)                    |
| Generic sans (Roboto/Arial)               | **Space Grotesk** (headers), **Inter** (body), **JetBrains Mono** (data). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/03227b1a-986b-47ff-8d23-86257e7e16b8/02-typography.md) |
| Heavy hard shadows                        | **Soft, layered elevation** using tokenized shadow levels. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/4afd3171-d177-47e4-81e0-4050adcaca29/tokens.json)                     |

---

### B. Species & Context Rules

- **Australian endemic only** — Kookaburra, Waratah, Banksia, Eucalyptus, Wattle, Echidna, etc. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)
- **Living context** — species appear on power lines, street signs, community noticeboards, and urban gardens, not pinned in cabinets. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)
- **Anti‑colonial framing**:
  - No “specimen”, “cabinet”, “naturalist”, or Federation‑era romance. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)
  - Concentric circles, journey lines, and earth tones can be used as **universal geometric references**, never as imitation of specific First Nations styles. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)
- **Common name first** — “KOOKABURRA” before any Latin names. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/74141548/2c98fa71-c817-49f8-957d-da13857f9ca1/northcote-design-principles.md)

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
