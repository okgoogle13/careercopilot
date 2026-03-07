# KR Solidarity: Component Catalog (v6.1)

> **Part of the [KR Solidarity Design Canon](01_CANON.md)**
> **Topic:** Documentation of the UI Kit primitives and interactive objects.
> **Archetypes:** Strike / March / Megaphone / Placard / Scaffold / Substrate — see `archetypes.md`

---

## 1. Action Anchors (Strike Archetype)

Defiance-driven interactive targets with M3 Expressive "Solidarity Spring" logic.
Shape: `shape.blockRiot03` (32px 2px 2px 2px) base → `shape.blockRiot02` (20px 4px 12px 2px) active.

### `Strike` (formerly KeralaRageButton / Pebble)
- **Archetype:** `Strike` — `--shape-blockRiot03`
- **Shape Morph:** hover/press → `--shape-blockRiot02` (`typeSpringSlam` 600ms)
- **Primary Color:** `inkGold` bg / `charcoal-bg` text.
- **Defiance Variant:** `solidarityRed` bg / `charcoal-bg` text (high-authority actions).
- **Secondary Variant:** Transparent bg / `worker-ash` text / `concrete-grey` border.
- **Motion:** Hover expands `wght` by +200 and scales elements by 1.1x.
- **Component files:** `Strike.tsx` (canonical), `KeralaRageButton.tsx` (second surface), `Pebble.tsx` (@deprecated)

### `NativeAnchor` (Symbolic — Substrate/Strike hybrid)
- **Category:** Symbolic / Narrative Anchor.
- **Archetype:** `Substrate` for frame → `Strike` for interactive trigger.
- **Shape:** `--shape-megaphoneCut01` (organic frame) with `sentryAvatar` glow disk.
- **Atmosphere Flags:** Halo (Z-2), Grit (Z-3), Blueprint (Z-1).

---

## 2. Information Containers (Placard / Scaffold Archetypes)

### `Placard` (formerly ActionCard / Stone)
- **Archetype:** `Placard` — `--shape-placardTorn01` (`48% 52% 58% 42% / 55% 45% 60% 40%`)
- **Shape Morph:** selected/focused → `--shape-blockRiot02` (`dragSettle` 800ms)
- **Surface:** `charcoalBackground` with layered grit texture.
- **Shadow:** Sharp, high-contrast elevation (`--sys-shadow-elevation2Stone`).
- **Usage:** Opportunity feed, Skill analysis, Kanban items, content framing.
- **Component files:** `Placard.tsx` (canonical), `SolidarityCard.tsx`, `Stone.tsx` (@deprecated)

### `Scaffold` layout panels (formerly StructuralPanel / Slab / Cabinet)
- **Archetype:** `Scaffold` — `--shape-blockRiot02` (`20px 4px 12px 2px`) — **immutable, no morph**
- **Usage:** Dashboard navigation, sidebar, data tables, layout organisation, kanban boards.
- **Motion:** none (Scaffold does not morph or animate).
- **Component files:** `Cabinet.tsx` (@deprecated)

### `AnalysisTile` (Scaffold archetype, data-dense)
- **Archetype:** `Scaffold` — `--shape-blockRiot01` (`8px 2px 8px 2px`)
- **Typography:** `JetBrains Mono` for metadata weight.
- **Surface:** `blueprint-grey` borders at 1px.

---

## 3. Input & Form Elements (Scaffold Archetype)

### `ScaffoldInput` + `ScaffoldArea` (formerly TacticalInput / Lens)
- **Archetype:** `Scaffold` — `--shape-blockRiot02` (`20px 4px 12px 2px`) — immutable
- **Surface:** `charcoal-bg` with `concrete-grey` border.
- **Focus State:** Border and label shift to `inkGold` (the "Reveal" glow).
- **Motion:** Label slams upward on focus. Container shape does NOT morph.
- **Component files:** `ScaffoldInput.tsx` (canonical), `Lens.tsx` (@deprecated)

### `March` Select (formerly Jar)
- **Archetype:** `March` — `--shape-blockRiot01` closed → `--shape-pebbleSurge01` open
- **Shape Morph:** closed `8px 2px 8px 2px` → open `20px 8px 12px 32px` (`dragSettle` 800ms)
- **Component files:** `March.tsx` (canonical), `Jar.tsx` (@deprecated)

---

## 4. Interruptions (Megaphone Archetype)

### `Megaphone` Modal (formerly Cabinet)
- **Archetype:** `Megaphone` — uses `Placard` (placardTorn01) as inner container
- **Motion:** Entrance `typeSpringSlam` (600ms, cubic-bezier(0.34, 1.56, 0.64, 1))
- **Close button:** `Strike` ghost variant.
- **Component files:** `Megaphone.tsx` (canonical), `Cabinet.tsx` (@deprecated)

---

## 5. State & Feedback Logic

### The "Bot View" (Structural Analysis)
- **Trigger:** High-detail technical review.
- **Effect:** Surface opacities drop to 50%, highlighting `blueprint-grid` (Z-1) in `solidarityRed`.

### The "Dry Ink" Transition
- **Loading State:** Strike morphs to `shape.pillMarch01` while loading (`typeSpringSlam`). Skeleton shimmer across `worker-ash` gradients.
- **Empty State:** High-contrast `stencil-yellow` typography + broken magnifying glass motif (`KR-UI-020`).

### `VerificationStamp` (The Stamp — no archetype)
- **Category:** Functional feedback asset.
- **Motion:** `onSuccess` — scale 2.0 → 1.0 with -15deg rotation (overshoot).
- **Content:** "VERIFIED" or "DEPOSITED" (Latin-script only).

---

**Last Updated:** 2026-03-07
**Design System Version:** v6.1 (Shape System)
**Implementation:** `frontend/src/components/ui/*.tsx` — See `Strike.tsx`, `Placard.tsx`, `ScaffoldInput.tsx`, `March.tsx`, `Megaphone.tsx`
