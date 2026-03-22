# KR Solidarity: Component Catalog (v6.1)

> **Part of the [KR Solidarity Design Canon](01_CANON.md)**
> **Topic:** Documentation of the UI Kit primitives and interactive objects.
> **Policy:** Use plain UI names first. Treat KR archetype names as internal design mappings.
> **Internal mappings:** see [01_CANON.md](01_CANON.md), [02_SYSTEM.md](02_SYSTEM.md), and `frontend/src/design/tokens/archetypes.ts`

---

## Naming Rule

This catalog uses:

- **Plain UI names** for the public component vocabulary
- **Archetype names** only as secondary/internal mappings
- **Deprecated aliases** only for compatibility notes

Canonical public names for new docs and new code:

| Public UI Name | Internal Archetype | Current Runtime Surface | Deprecated / Legacy Aliases |
| :--- | :--- | :--- | :--- |
| `Button` | `Strike` | `Strike.tsx` | `KeralaRageButton`, `Pebble` |
| `Card` | `Placard` | `Placard.tsx` | `ActionCard`, `SolidarityCard`, `Stone` |
| `Panel` / `LayoutPanel` | `Scaffold` | structural layout shells | `StructuralPanel`, `Slab`, `Cabinet` |
| `Input` | `Scaffold` | `ScaffoldInput.tsx` | `TacticalInput`, `Lens` |
| `Textarea` | `Scaffold` | `ScaffoldArea` | `Lens` variants |
| `Select` | `March` | `March.tsx` | `Jar` |
| `Dialog` / `Modal` | `Megaphone` | `Megaphone.tsx` | `Cabinet` |
| `Surface` / `BackgroundLayer` | `Substrate` | atmospheric/background use only | none |

Rule:
- route and product docs should never use archetype names as architectural nouns
- component docs should lead with plain UI names
- archetype names belong in token, motion, and identity discussions

---

## 1. Buttons (`Strike` internal archetype)

Primary actions use the public name `Button`. Internally, they map to the `Strike` archetype.
Shape: `shape.blockRiot03` base → `shape.blockRiot02` active.

### `Button` (`Strike`)
- **Internal mapping:** `Strike` — `--shape-blockRiot03`
- **Shape Morph:** hover/press → `--shape-blockRiot02` (`typeSpringSlam` 600ms)
- **Primary Color:** `inkGold` bg / `charcoal-bg` text.
- **Defiance Variant:** `solidarityRed` bg / `charcoal-bg` text (high-authority actions).
- **Secondary Variant:** Transparent bg / `worker-ash` text / `concrete-grey` border.
- **Motion:** Hover expands `wght` by +200 and scales elements by 1.1x.
- **Current runtime surface:** `Strike.tsx`
- **Deprecated aliases:** `KeralaRageButton.tsx`, `Pebble.tsx`

### `NativeAnchor` (symbolic surface)
- **Category:** Symbolic / Narrative Anchor.
- **Internal mapping:** `Substrate` for frame → `Strike` for interactive trigger.
- **Shape:** `--shape-megaphoneCut01` (organic frame) with `sentryAvatar` glow disk.
- **Atmosphere Flags:** Halo (Z-2), Grit (Z-3), Blueprint (Z-1).

---

## 2. Cards and Panels (`Placard` / `Scaffold` internal archetypes)

### `Card` (`Placard`)
- **Internal mapping:** `Placard` — `--shape-placardTorn01`
- **Shape Morph:** selected/focused → `--shape-blockRiot02` (`dragSettle` 800ms)
- **Surface:** `charcoalBackground` with layered grit texture.
- **Shadow:** Sharp, high-contrast elevation (`--sys-shadow-elevation2Placard`).
- **Usage:** Opportunity feed, Skill analysis, Kanban items, content framing.
- **Current runtime surface:** `Placard.tsx`
- **Deprecated aliases:** `ActionCard`, `SolidarityCard`, `Stone`

### `Panel` / `LayoutPanel` (`Scaffold`)
- **Internal mapping:** `Scaffold`
- **Base geometry:** structural scaffold tokens are immutable; they do not morph on interaction.
- **Usage:** Dashboard navigation, sidebar, data tables, layout organisation, kanban boards.
- **Motion:** none (Scaffold does not morph or animate).
- **Deprecated aliases:** `StructuralPanel`, `Slab`, `Cabinet`

### `AnalysisTile` (`Scaffold`)
- **Internal mapping:** `Scaffold` — `--shape-blockRiot01`
- **Typography:** `JetBrains Mono` for metadata weight.
- **Surface:** `blueprint-grey` borders at 1px.

---

## 3. Inputs and Selectors (`Scaffold` / `March` internal archetypes)

### `Input` and `Textarea` (`Scaffold`)
- **Internal mapping:** `Scaffold`
- **Surface:** `charcoal-bg` with `concrete-grey` border.
- **Focus State:** Border and label shift to `inkGold` (the "Reveal" glow).
- **Motion:** Label slams upward on focus. Container shape does NOT morph.
- **Current runtime surfaces:** `ScaffoldInput.tsx`, `ScaffoldArea`
- **Deprecated aliases:** `TacticalInput`, `Lens`

### `Select` (`March`)
- **Internal mapping:** `March`
- **Shape Morph:** closed `8px 2px 8px 2px` → open `20px 8px 12px 32px` (`dragSettle` 800ms)
- **Current runtime surface:** `March.tsx`
- **Deprecated aliases:** `Jar`

---

## 4. Dialogs and Interruptions (`Megaphone` internal archetype)

### `Dialog` / `Modal` (`Megaphone`)
- **Internal mapping:** `Megaphone` — uses `Placard` as inner container
- **Motion:** Entrance `typeSpringSlam` (600ms, cubic-bezier(0.34, 1.56, 0.64, 1))
- **Close button:** `Button` (`Strike`) ghost variant
- **Current runtime surface:** `Megaphone.tsx`
- **Deprecated aliases:** `Cabinet`

---

## 5. Surfaces and Background Layers (`Substrate` internal archetype)

### `Surface` / `BackgroundLayer` (`Substrate`)
- **Internal mapping:** `Substrate`
- **Usage:** atmospheric and decorative background layers only
- **Restriction:** not a public interaction primitive and never a route or feature noun
- **Typical use:** background textures, hero environment, ambient motion layers

---

## 6. State & Feedback Logic

### The "Bot View" (Structural Analysis)
- **Trigger:** High-detail technical review.
- **Effect:** Surface opacities drop to 50%, highlighting `blueprint-grid` (Z-1) in `solidarityRed`.

### The "Dry Ink" Transition
- **Loading State:** `Button` (`Strike`) morphs to `shape.pillMarch01` while loading (`typeSpringSlam`). Skeleton shimmer across `worker-ash` gradients.
- **Empty State:** High-contrast `stencil-yellow` typography + broken magnifying glass motif (`KR-UI-020`).

### `VerificationStamp` (The Stamp — no archetype)
- **Category:** Functional feedback asset.
- **Motion:** `onSuccess` — scale 2.0 → 1.0 with -15deg rotation (overshoot).
- **Content:** "VERIFIED" or "DEPOSITED" (Latin-script only).

---

**Last Updated:** 2026-03-07
**Design System Version:** v6.1 (Shape System)
**Implementation:** `frontend/src/components/ui/*.tsx` — current runtime surfaces still use branded file names during transition (`Strike.tsx`, `Placard.tsx`, `ScaffoldInput.tsx`, `March.tsx`, `Megaphone.tsx`)
