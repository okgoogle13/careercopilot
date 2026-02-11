# Design Tokens: The Solidarity System

> Part of [Kerala Rage Design System – Contemporary Australian](00-overview.md)

---

## 1. Color Palette: "The Screenprint Press"

Visual language inspired by urban resistance, high-contrast stencils, and gritty Melbourne street art.

### Core Solidarity Tokens

| Token                   | Hex       | CSS Variable          | Usage                                                      |
| ----------------------- | --------- | --------------------- | ---------------------------------------------------------- |
| **Charcoal Background** | `#1A1A1A` | `--kr-charcoal-bg`    | **The Substrate** — Raw paper texture background.          |
| **Ink Gold**           | `#E6B34D` | `--kr-ink-gold`      | **The Reveal** — Primary actions, focus, and illumination. |
| **Solidarity Red**         | `#D94A4A` | `--kr-solidarity-red`    | **The Urgency** — Alerts, navigation high-points, energy.  |
| **Signal Green**        | `#50C878` | `--kr-signal-green`   | **The Life** — Growth metrics, success states, vitality.   |
| **Paper White**         | `#F5F0E8` | `--kr-paper-white`    | **The Ink** — Primary high-contrast typography.            |
| **Blueprint Grey**      | `#333333` | `--kr-blueprint-grey` | **The Structure** — Grids, lines, and borders.             |

---

## 2. Shape: "The Street Edge"

Shapes are deliberate, structural, and slightly asymmetric, reflecting hand-cut stencils.

| Token             | Value                | Usage                                |
| ----------------- | -------------------- | ------------------------------------ |
| **radius-slab**   | `4px`                | Large containers, structural panels. |
| **radius-stone**  | `16px 4px 12px 24px` | Action cards, interactive blocks.    |
| **radius-pebble** | `100px`              | Pill buttons, tags, profile icons.   |

---

## 3. Motion: "The Press Response"

Motion should feel like heavy paper responding to pressure or ink being applied.

| Property  | Value                            | Purpose          |
| --------- | -------------------------------- | ---------------- |
| **Curve** | `cubic-bezier(0.3, 0.0, 0.2, 1)` | Fast and precise |
| **Base**  | 150ms – 300ms                    | Urgent, tactile  |
| **Lift**  | `translateY(-4px)`               | Interaction      |

### The "Screenprint Burn"

On interaction, background surfaces may intensify their texture or color density slightly, simulating a "wet ink" effect.

---

## 4. Typography: "The Manifesto Fonts"

| Token        | Font Family        | Usage                           |
| ------------ | ------------------ | ------------------------------- |
| **Display**  | Recursive Variable | Headline stencils, big metrics. |
| **Header**   | Sora Variable      | Section titles, expressive nav. |
| **Body**     | Plus Jakarta Sans  | High-legibility UI copy.        |
| **Metadata** | JetBrains Mono     | Blueprint data, annotations.    |

---

## 5. Atmosphere: "The Collective Density"

Density levels replace "Modes". Every page uses the **Charcoal Background**.

- **Solidarity High** (Hero): Large stencils, high Ink Gold usage, wheat-paste ripples.
- **Solidarity Standard** (UI): Clean grids, blueprint overlays, focused accent colors.
- **Solidarity Minimal** (Data): Maximum legibility, 1px blueprint lines, mono-spaced data priority.

---

**Last Updated**: 2026-02-08
**Target Architecture**: Gemini 3.x / Antigravity / Contemporary Australian Design System
