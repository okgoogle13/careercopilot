# KR Solidarity: System Infrastructure (v6.0)

> **Part of the [KR Solidarity Design Canon](01_CANON.md)**
> **Topic:** Documentation of the technical bridge from design to code.

---

## 1. The Solidarity Palette (v3.2)

Our palette is limited, high-salience, and grounded in the screenprint ink-hit aesthetic.

| Token | CSS Variable | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Solidarity Charcoal** | `--sys-color-charcoal-bg` | `#1A1714` | **The Substrate** — Matte background. |
| **Ink Gold** | `--sys-color-solidarity-gold` | `#DAF674` | **The Radiance** — Focus, primary actions, halos. |
| **Solidarity Crimson** | `--sys-color-solidarity-crimson` | `#F14714` | **The Resistance** — Critical alerts, navigation peaks. |
| **Activist Smoke** | `--sys-color-smoke-green` | `#48DA8B` | **The Life** — Growth metrics, secondary highlights. |
| **Signal Green** | `--sys-color-signal-green` | `#48F0E5` | **The Pulse** — Success states, technical links. |
| **Worker Ash** | `--sys-color-worker-ash` | `#DAF6B3` | **The Ink** — High-contrast typography on dark. |
| **Stencil Yellow** | `--sys-color-stencil-yellow` | `#F6E748` | **The Attention** — Stencil phrases, key alerts. |
| **Concrete Grey** | `--sys-color-concrete-grey` | `#A39B8F` | **The Grit** — Dividers, borders, urban context. |

---

## 2. Typography Strategy (v4.0)

Blending street-poster impact with Material 3 Expressive motion. All fonts use `font-optical-sizing: auto`.

| Role | Font Family | Usage |
| :--- | :--- | :--- |
| **Primary** | Work Sans | Main UI, body text, functional labels. |
| **Display** | Fraunces | Emotional subheads, variable width moments. |
| **Proclamation** | Libre Bodoni | Authoritative hero lines, editorial headers. |
| **Technical** | JetBrains Mono | Data breakdown, metadata, annotations. |
| **Curator** | Caveat | Personal notes, handwritten accents. |
| **Hero Hit** | Nabla | **Restricted:** One word per hero view (e.g., "COLLECTIVE"). |

### Variable Axes & Emotional Patterns
- **Solidarity Slam:** `wght: 900`, `wdth: 125`, `letter-spacing: -0.02em`.
- **Melancholy Breath:** `wght: 475`, `wdth: 98`, subtle oscillation (4s breath).
- **Labor Pressure:** `wght: 800`, `wdth: 75`, tight tracking (for constraint/scarcity).

---

## 3. Shape Archetypes (v5.1)

Rejects machine-perfect geometry. Use specialized radii tokens for asymmetric defiance.

| Archetype | Token | Value (Asymmetric) | Application |
| :--- | :--- | :--- | :--- |
| **Pebble** | `radius-pebble` | `16px 8px 12px 20px` | Active buttons, pill tags, nav. |
| **Stone** | `radius-stone` | `42% 58% 45% 55% / 48% 62% 38% 52%` | Expressive cards, hero anchors. |
| **Slab** | `radius-slab` | `48% 52% 58% 42% / 55% 45% 60% 40%` | Large sections, foundational blocks. |
| **Sentry** | `sentryAvatar` | `98%` | Avatars. **Banned:** `border-radius: 50%`. |
| **Torn Edge** | `tornEdgeClipPath` | `polygon(0% 10px, 5% 0px, ...)` | Wheat-paste section breaks. |

---

## 4. Motion Patterns (The Spring-Slam)

All transitions must respect `prefers-reduced-motion`.

- **M3 Expressive Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **The Slam (600ms):** Headlines hit the substrate with an overshoot from Z-3 to Z-2.
- **The Drag Settle (800ms):** Heavy settling for Kanban cards (viscous breeze).
- **The Water Ripple (3000ms):** Subtle background motif on Analysis screens (reflective).
- **The Ink Bloom (Hover):** Transition weight from 400 → 600 while scaling down scale(0.98).

---

**Last Updated:** 2026-03-06
**Registry Version:** v1.0.0 (Solidarity Mode)
