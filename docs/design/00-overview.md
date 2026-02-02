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

---

## Architecture Summary

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
