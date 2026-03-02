<<<<<<< HEAD
# Northcote Curio Design System

> **Navigation**: [Tokens](01-tokens.md) · [Typography](02-typography.md) · [Components](03-components.md) · [Voice](04-voice.md) · [Assets](05-assets.md) · [Wireframes](06-wireframes.md)

---

## System Identity: The Field Station

**We are not building a dashboard. We are building a Victorian naturalist's field station, discovered in the Australian bush at twilight.**

CareerCopilot is a curated digital workspace where a user's professional history is treated not as "data," but as a precious biological specimen.

### The Central Duality

| Mode           | The Gallery (Wonder)                                     | The Laboratory (Rigor)                                      |
| -------------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| **Context**    | Landing, Dashboard, Opportunity Feed                     | Ingestion, Analysis, Parsing                                |
| **Vibe**       | Candlelit conservatory at night                          | Well-lit examination table                                  |
| **Visuals**    | Vintage tourism posters, gouache Waratahs on dark velvet | Da Vinci anatomical sketches, grid lines, brass instruments |
| **Motif**      | Kookaburra "Sentry"                                      | **NO FLOWERS** — structural truths only                     |
| **Typography** | Libre Bodoni + Fraunces                                  | Work Sans + JetBrains Mono                                  |

---

## Core Directives (The "Non-Negotiables")

### A. The "Anti-Slop" Protocol

| Banned                              | Required                                              |
| ----------------------------------- | ----------------------------------------------------- |
| Symmetric `border-radius: 8px`      | **Organic Asymmetry** `24px 8px 20px 4px`             |
| Pure black/white (`#000`, `#FFF`)   | **Specimen Night** `#1A1714`, **Parchment** `#F5F0E8` |
| Generic sans-serifs (Inter, Roboto) | **Work Sans** (body), **JetBrains Mono** (data)       |
| Hard drop shadows                   | **Ink Pools** — diffuse, ambient, grounding           |

### B. The Mode Separation Law

- **Gallery Rule**: Botanical motifs (Waratahs, Banksias) belong _only_ in emotional spaces
- **Laboratory Rule**: **NO FLOWERS** in analysis. Grid lines, measurement markings, monoline vectors only.

### C. The "Viscous Breeze" Physics

- **Motion**: `cubic-bezier(0.34, 1.56, 0.64, 1)` — gentle overshoot and settle
- **Duration**: `600ms` — slow, deliberate (not snappy)
- **The Bloom**: Hover states _inflate_ — weight increases, elements lift `translateY(-2px)`
=======
# Kerala Rage Design System – The Solidarity System

> **Navigation**: [Overview](00-overview.md) · [Brand Brief](KERALA_RAGE_BRAND_BRIEF.md) · [Tokens](01-tokens.md) · [Typography](02-typography.md) · [Components](03-components.md) · [Voice](04-voice.md) · [Assets](05-assets.md) · [Wireframes](06-wireframes.md)

---

## System Identity: The Solidarity Press

**We are not building a dashboard. We are building a living manifesto for migrants, POC, and career-changers moving through systems not built for them.**

CareerCopilot is a tactical digital workspace where a user’s professional journey is treated as a collective history of resilience. The visual language is rooted in:

**1. Street Art & Resistance (PRIMARY)**

- **Peter Drew Influence**: Bold silhouettes, high-contrast stencils, and wheat-paste textures.
- **Gritty Substrate**: Surfaces that feel like charcoal paper or weathered laneway walls.
- **Solidarity Messaging**: Unapologetic, human-centric, and peers-to-peer.

**2. Screenprint Aesthetics (FOUNDATION)**

- Visible registration marks, halftone patterns, and ink displacement.
- High weight contrasts and visceral colors (Ink Gold, Solidarity Red).

**3. Australian Contemporary Context (COLLECTIVE)**

- Endemic species as solidarity mascots (Signal, Solidarity) rendered in high-contrast stencils.
- Palette inspired by the collision of Kerala’s vibrant light and Melbourne’s urban grit.

---

## Core Directives (Non-Negotiables)

### A. Anti-Slop Protocol

- **Banned**: Generic `border-radius: 8px`, pure white surfaces, corporate blue, and bureaucratic "passport" imagery.
- **Required**: [DEPRECATED_STYLE] asymmetry (Slab, Stone, Pebble), `charcoalBackground` (#1A1A1A), and semantic token usage.

### B. Urban Context & Species as Mascot

- Species appear as stencils or screenprinted motifs, never as naturalistic "museum" specimens.
- High contrast, bold silhouettes, and placement in "the urban void."

### C. Motion: The Stencil Slam

- Motion should feel like heavy paper responding to a printing press.
- **The Slam**: Headers and posters hit the surface with a dramatic overshoot.
- **Hover = Bloom**: Elements lift and gain typographic weight, suggesting a "wet ink" expansion.
>>>>>>> restoration-KR-Rage-Figma-v2.0

---

## Architecture Summary

<<<<<<< HEAD
| Layer         | Technology                                       |
| ------------- | ------------------------------------------------ |
| Frontend      | React 19 + Tailwind CSS (with curio tokens)      |
| Design Engine | CSS Variables for mode switching                 |
| Backend       | Supabase (PostgreSQL + JSONB)                    |
| Primary Intel | **Gemini 3.0 Pro via Design Flash Sidekick MCP** |
| Review Intel  | Claude 3.7 / 4.5 (Historical / Optional Review)  |
| Testing       | Playwright (E2E), Storybook (visual regression)  |

---

## Quick Reference

```
MASTER PALETTE:
├── Background    Specimen Night  #1A1714
├── Primary       Wattle Gold     #D4A84B
├── Accent        Waratah Crimson #C45C4B
├── Container     Eucalypt Smoke  #2C2723
├── Muted         Flannel Flower  #A8A097
└── Text          Parchment       #F5F0E8
```
=======
| Layer         | Technology                                              |
| ------------- | ------------------------------------------------------- |
| Frontend      | React + Tailwind/CSS Modules with Kerala Rage tokens.   |
| Design Engine | `tokens.json` + `kerala-rage.css` (M3 Expressive base). |
| Intel         | Gemini 3.x (Flash + Pro) orchestrated via Genkit flows. |

---

## Master Palette (Solidarity Mode)

| Token                   | Hex       | Vibe                  |
| ----------------------- | --------- | --------------------- |
| **Charcoal Background** | `#1A1A1A` | The raw substrate.    |
| **Ink Gold**           | `#E6B34D` | Internal radiance.    |
| **Solidarity Red**         | `#D94A4A` | Tactical heat.        |
| **Signal Green**        | `#50C878` | Hybrid identity life. |
| **Paper White**         | `#F5F0E8` | High-contrast ink.    |

---

**Last Updated**: 2026-02-08
**Target Architecture**: Gemini 3.x / Antigravity / Contemporary Australian Design System
>>>>>>> restoration-KR-Rage-Figma-v2.0
