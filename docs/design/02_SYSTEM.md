# KR Solidarity: System Infrastructure (v6.0)

> **Part of the [KR Solidarity Design Canon](01_CANON.md)**
> **Topic:** Documentation of the technical bridge from design to code.

---

## 1. The Solidarity Palette (v3.2)

Our palette is limited, high-salience, and grounded in the screenprint ink-hit aesthetic.

| Token | CSS Variable | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Solidarity Charcoal** | `--sys-color-charcoalBackground-base` | `#1A1714` | **The Substrate** — Matte background. |
| **Ink Gold** | `--sys-color-inkGold-base` | `#DAF674` | **The Radiance** — Focus, primary actions, halos. |
| **Solidarity Crimson** | `--sys-color-solidarityRed-base` | `#F14714` | **The Resistance** — Critical alerts, navigation peaks. |
| **Activist Smoke** | `--sys-color-kr-activistSmokeGreen-base` | `#48DA8B` | **The Life** — Growth metrics, secondary highlights. |
| **Signal Green** | `--sys-color-signalGreen-base` | `#48F0E5` | **The Pulse** — Success states, technical links. |
| **Worker Ash** | `--sys-color-worker-ash-base` | `#DAF6B3` | **The Ink** — High-contrast typography on dark. |
| **Stencil Yellow** | `--sys-color-stencilYellow-base` | `#F6E748` | **The Attention** — Stencil phrases, key alerts. |
| **Protest Metal Blue** | `--sys-color-protestMetalBlue-base` | `#48B3DA` | **The Cool Accent** — charts, metadata, water-ripple secondary accents. |
| **Concrete Grey** | `--sys-color-concreteGrey-base` | `#A39B8F` | **The Grit** — Dividers, borders, urban context. |
| **Paper White** | `--sys-color-paperWhite-base` | `#F5F0E8` | **The Poster Base** — high-contrast highlights and editorial poster moments. |

---

## 2. Typography Strategy (v4.0)

Blending street-poster impact with Material 3 Expressive motion. All fonts use `font-optical-sizing: auto`.

Operational implementation standard:
- see [06_TYPOGRAPHY_STANDARDS.md](06_TYPOGRAPHY_STANDARDS.md) for role mapping, hierarchy rules, axis usage, accessibility constraints, and audit guidance

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
| `shape.blockRiot01` | `--sys-shape-blockRiot01` | `radius.md radius.xs radius.md radius.xs` → `8px 2px 8px 2px` | **Core UI** |
| `shape.blockRiot02` | `--sys-shape-blockRiot02` | `radius.xl radius.sm radius.lg radius.xs` → `20px 4px 12px 2px` | **Core UI** |
| `shape.blockRiot03` | `--sys-shape-blockRiot03` | `radius.xxl radius.xs radius.xs radius.xs` → `32px 2px 2px 2px` | **Core UI** |
| `shape.pillMarch01` | `--sys-shape-pillMarch01` | `radius.full` → `9999px` (all corners) | **Core UI** |
| `shape.marchSurge01` | `--sys-shape-marchSurge01` | `radius.xl radius.md radius.lg radius.xxl` → `20px 8px 12px 32px` | **Core UI** |
| `shape.megaphoneBase01` | `--sys-shape-megaphoneBase01` | `42% 58% 45% 55% / 48% 62% 38% 52%` (organic % radii) | **Core UI** |
| `shape.placardBase01` | `--sys-shape-placardBase01` | `48% 52% 58% 42% / 55% 45% 60% 40%` (organic % radii) | **Core UI** |
| `shape.substrateTile01` | `--sys-shape-substrateTile01` | `60% 40% 30% 70% / 60% 30% 70% 40%` | **Decorative** |
| `shape.substrateTile02` | `--sys-shape-substrateTile02` | `40% 60% 70% 30% / 40% 50% 60% 50%` | **Decorative** |

> **Tier rules:** **Core UI** shapes are available to all archetype contexts. **Decorative** shapes (`shape.substrateTile*`) are restricted to Substrate archetype, avatar masks, and hero frame backgrounds. All other uses require explicit whitelist.

**Compatibility aliases** remain valid for one release only. Prefer `--sys-shape-megaphoneCut01`, `--sys-shape-placardTorn01`, `--sys-shape-marchSurge01`, `sentryAvatar`, and `tornEdgeClipPath`.

---

### 3.3 Semantic Action Archetypes & Morph States

Each archetype defines a shape palette (not a single locked shape) and morph states tied to interaction and environmental change. Shape is not semantic — it is contextual.

| Archetype | Base Shape | Active / Selected | In-Progress | Ambient | Motion Coupling |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Strike** | `shape.blockRiot03` | `shape.blockRiot02` | `shape.pillMarch01` | — | `typeSpringSlam` (600ms) |
| **March** | `shape.blockRiot01` | `shape.marchSurge01` | `shape.blockRiot02` | — | `dragSettle` (800ms) |
| **Megaphone** | `shape.megaphoneCut01` | `shape.megaphoneCut01` | `shape.placardTorn01` | `shape.substrateTile01` | `typeSpringSlam` (600ms) |
| **Placard** | `shape.placardTorn01` | `shape.blockRiot02` | `shape.blockRiot03` | — | `dragSettle` (800ms) |
| **Scaffold** | `shape.blockRiot01` | `shape.blockRiot01` | `shape.blockRiot01` | — | none (static) |
| **Substrate** | `shape.substrateTile02` | — | — | `shape.substrateTile01` | `waterRipple` (3000ms) |

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
- `shape.substrateTile*` tokens are **banned** outside Substrate archetype, avatar masks, and hero frames, unless explicitly documented as a whitelist exception.
- Scaffold (`shape.blockRiot01`) does **not** morph. If your layout element is changing shape on interaction, it is not a Scaffold — reassign its archetype.
- No shape may have all four corners identical unless the shape token explicitly defines it (e.g., `shape.pill01`). Uniform corner-radius is the Institutional Squelch.

---

**Classic Named Geometries (retained for legacy and naming clarity):**

| Name | Mapped Token | Shape Token Equivalent |
| :--- | :--- | :--- |
| **March Open** | `radius-marchOpen` | `shape.marchSurge01` |
| **Megaphone Base** | `radius-megaphoneBase` | `shape.megaphoneCut01` |
| **Placard Base** | `radius-placardBase` | `shape.placardTorn01` |
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
