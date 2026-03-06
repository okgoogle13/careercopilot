# KR Solidarity: Component Catalog (v6.0)

> **Part of the [KR Solidarity Design Canon](01_CANON.md)**
> **Topic:** Documentation of the UI Kit primitives and interactive objects.

---

## 1. Action Anchors (Buttons)

Defiance-driven interactive targets with M3 Expressive "Solidarity Spring" logic.

### `KeralaRageButton` (The Pebble)
- **Archetype:** `radius-pebble`.
- **Primary Color:** `inkGold` bg / `charcoal-bg` text.
- **Defiance Variant:** `solidarityRed` bg / `charcoal-bg` text (for high-authority actions).
- **Secondary Variant:** Transparent bg / `worker-ash` text / `concrete-grey` border.
- **Motion:** Hover expands `wght` by +200 and scales elements by 1.1x.

### `NativeAnchor` (The Stone)
- **Category:** Symbolic / Narrative Anchor.
- **Archetype:** `radius-stone`.
- **Atmosphere Flags:**
  - **Halo:** Radiant glow disk (Z-2).
  - **Grit:** Screenprint dust particles (Z-3).
  - **Blueprint:** Technical grid overlay (Z-1).
- **Registers:**
  - **Defiance:** High-contrast `solidarityRed` / `inkGold` glow.
  - **Reflection:** Subtle `signalGreen` / `worker-ash` atmosphere.
  - **Archive:** Monochromatic `concrete-grey` / `blueprint-grey` grounding.

---

## 2. Information Containers (Cards)

### `ActionCard` (The Stone)
- **Archetype:** `radius-stone`.
- **Surface:** `charcoalBackground` with layered grit texture.
- **Shadow:** Sharp, high-contrast elevation (4px 4px 0px `concrete-grey`).
- **Usage:** Opportunity feed, Skill analysis, Kanban items.

### `StructuralPanel` (The Slab)
- **Archetype:** `radius-slab`.
- **Usage:** Dashboard navigation, sidebar, layout organization.

### `AnalysisTile` (The Seed)
- **Archetype:** `radius-seed` (8px-ish asymmetrical).
- **Typography:** `JetBrains Mono` for metadata weight.
- **Surface:** `blueprint-grey` borders at 1px.

---

## 3. Input & Data Objects

### `TacticalInput` (The Lens)
- **Archetype:** `radius-slab`.
- **Surface:** `charcoal-bg` with `concrete-grey` border.
- **Focus State:** Border and label shift to `inkGold` (the "Reveal" glow).
- **Motion:** Label "slams" upward on focus.

### `VerificationStamp` (The Stamp)
- **Category:** Functional feedback asset.
- **Motion:** `onSuccess` - scale 2.0 → 1.0 with -15deg rotation (overshoot).
- **Content:** "VERIFIED" or "DEPOSITED" (Latin-script only).

---

## 4. State & Feedback Logic

### The "Bot View" (Structural Analysis)
- **Trigger:** High-detail technical review.
- **Effect:** Surface opacities drop to 50%, highlighting `blueprint-grid` (Z-1) in `solidarityRed`.

### The "Dry Ink" Transition
- **Loading State:** Elements use `loading-skeleton` shimmer (Z-3) across `worker-ash` gradients.
- **Empty State:** High-contrast `stencil-yellow` typography + broken magnifying glass motif (`KR-UI-020`).

---

**Last Updated:** 2026-03-06
**Implementation:** `frontend/src/components/ui/*.tsx`
