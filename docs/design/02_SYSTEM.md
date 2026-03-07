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

## 3. Shape System (v6.1)

Rejects machine-perfect geometry. All radii are drawn from the base scale or the shape library. **Never use hardcoded pixel values.** See `01_CANON.md §2.C` for the Four Laws.

---

### 3.1 Base Shape Scale

A neutral, non-semantic radius scale. These tokens are the atoms from which all `shape.*` tokens are composed.

| Token | CSS Variable | Value | M3 Equivalent |
| :--- | :--- | :--- | :--- |
| `radius.none` | `--sys-radius-none` | `0` | None |
| `radius.xs` | `--sys-radius-xs` | `2px` | Extra Small |
| `radius.sm` | `--sys-radius-sm` | `4px` | Small |
| `radius.md` | `--sys-radius-md` | `8px` | Medium |
| `radius.lg` | `--sys-radius-lg` | `12px` | Large (lower) |
| `radius.xl` | `--sys-radius-xl` | `20px` | Large |
| `radius.xxl` | `--sys-radius-xxl` | `32px` | Extra Large |
| `radius.xxxl` | `--sys-radius-xxxl` | `48px` | Extra Extra Large |
| `radius.full` | `--sys-radius-full` | `9999px` | Full (pill). **Never use `50%`.** |

---

### 3.2 Non-Semantic Shape Library

Reusable, named shapes. Each shape carries no inherent meaning — archetypes assign meaning. A shape may appear in multiple archetype contexts.

| Token | CSS Variable | Border-Radius Definition | Allowed Tier |
| :--- | :--- | :--- | :--- |
| `shape.block01` | `--sys-shape-block01` | `radius.md radius.xs radius.md radius.xs` → `8px 2px 8px 2px` | **Core UI** |
| `shape.block02` | `--sys-shape-block02` | `radius.xl radius.sm radius.lg radius.xs` → `20px 4px 12px 2px` | **Core UI** |
| `shape.block03` | `--sys-shape-block03` | `radius.xxl radius.xs radius.xs radius.xs` → `32px 2px 2px 2px` | **Core UI** |
| `shape.pill01` | `--sys-shape-pill01` | `radius.full` → `9999px` (all corners) | **Core UI** |
| `shape.pebble01` | `--sys-shape-pebble01` | `radius.xl radius.md radius.lg radius.xxl` → `20px 8px 12px 32px` | **Core UI** |
| `shape.stone01` | `--sys-shape-stone01` | `42% 58% 45% 55% / 48% 62% 38% 52%` (organic % radii) | **Core UI** |
| `shape.slab01` | `--sys-shape-slab01` | `48% 52% 58% 42% / 55% 45% 60% 40%` (organic % radii) | **Core UI** |
| `shape.blob01` | `--sys-shape-blob01` | `60% 40% 30% 70% / 60% 30% 70% 40%` | **Decorative** |
| `shape.blob02` | `--sys-shape-blob02` | `40% 60% 70% 30% / 40% 50% 60% 50%` | **Decorative** |

> **Tier rules:** **Core UI** shapes are available to all archetype contexts. **Decorative** shapes (`shape.blob*`) are restricted to Substrate archetype, avatar masks, and hero frame backgrounds. All other uses require explicit whitelist.

**Legacy tokens** (`radius-stone`, `radius-slab`, `radius-pebble`, `sentryAvatar`, `tornEdgeClipPath`) remain valid. They map to their `shape.*` equivalents and will be gradually migrated.

---

### 3.3 Semantic Action Archetypes & Morph States

Each archetype defines a shape palette (not a single locked shape) and morph states tied to interaction and environmental change. Shape is not semantic — it is contextual.

| Archetype | Base Shape | Active / Selected | In-Progress | Ambient | Motion Coupling |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Strike** | `shape.block03` | `shape.block02` | `shape.pill01` | — | `typeSpringSlam` (600ms) |
| **March** | `shape.block01` | `shape.pebble01` | `shape.block02` | — | `dragSettle` (800ms) |
| **Megaphone** | `shape.stone01` | `shape.stone01` | `shape.slab01` | `shape.blob01` | `typeSpringSlam` (600ms) |
| **Placard** | `shape.slab01` | `shape.block02` | `shape.block03` | — | `dragSettle` (800ms) |
| **Scaffold** | `shape.block01` | `shape.block01` | `shape.block01` | — | none (static) |
| **Substrate** | `shape.blob02` | — | — | `shape.blob01` | `waterRipple` (3000ms) |

**Morph trigger rules (M3-aligned, KR-adapted):**
- **Interaction morph**: Shape changes between `base` and `active` on press/hover (deliberate tension — sharp vs round).
- **Progress morph**: Shape transitions to `inProgress` variant during loading or async operations. The container shows the work in motion.
- **Ambient morph**: Background/atmospheric elements use `ambient` variant with slow `waterRipple` or `melancholyBreath` motion. Never blocking UI.
- **Scaffold never morphs**: Layout structure is immutable. Only content elements carry shape energy.
- **Substrate is the organic layer**: `shape.blob*` lives here. Environmental, not interactive.

---

### 3.4 Anti-Slop Rules for Shape

- All `border-radius` values in component code **must** reference `--sys-radius-*` or `--sys-shape-*` CSS variables. No hardcoded `px` values.
- `border-radius: 50%` is **banned**. Use `--sys-radius-full` or `sentryAvatar` (`98%`).
- `shape.blob*` tokens are **banned** outside Substrate archetype, avatar masks, and hero frames, unless explicitly documented as a whitelist exception.
- Scaffold (`shape.block01`) does **not** morph. If your layout element is changing shape on interaction, it is not a Scaffold — reassign its archetype.
- No shape may have all four corners identical unless the shape token explicitly defines it (e.g., `shape.pill01`). Uniform corner-radius is the Institutional Squelch.

---

**Classic Named Geometries (retained for legacy and naming clarity):**

| Name | Mapped Token | Shape Token Equivalent |
| :--- | :--- | :--- |
| **Pebble** | `radius-pebble` | `shape.pebble01` |
| **Stone** | `radius-stone` | `shape.stone01` |
| **Slab** | `radius-slab` | `shape.slab01` |
| **Sentry Avatar** | `sentryAvatar` (`98%`) | No equivalent (use direct) |
| **Torn Edge** | `tornEdgeClipPath` | No equivalent (clip-path, not radius) |

---

## 4. Motion Patterns (The Spring-Slam)

All transitions must respect `prefers-reduced-motion`.

- **M3 Expressive Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **The Slam (600ms):** Headlines hit the substrate with an overshoot from Z-3 to Z-2.
- **The Drag Settle (800ms):** Heavy settling for Kanban cards (viscous breeze).
- **The Water Ripple (3000ms):** Subtle background motif on Analysis screens (reflective).
- **The Ink Bloom (Hover):** Transition weight from 400 → 600 while scaling down scale(0.98).

---

**Last Updated:** 2026-03-07
**Registry Version:** v1.1.0 (Solidarity Mode — Shape System)
