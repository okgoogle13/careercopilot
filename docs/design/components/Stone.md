# Stone Primitive (Canonical Reference)

The **Stone** is the heavy, foundational container of the Kerala Rage design system. It represents the "Materiality" of our digital naturalism—solid, textured, and technically reliable.

## Components using the Stone Pattern
- `SolidarityCard`
- `UnifiedPane`
- `OpportunityItem`
- `UnifiedColumn`

## Pattern Constants

### 1. Morphology
- **Radii:** `rounded-stone` ([DEPRECATED_STYLE], asymmetric softness).
- **Shadows:** `shadow-viscous` (Deep, physical presence).
- **Border:** Subtle `border-white/5` (Internal) or `ink-gold` (External/Active).

### 2. Motion (The Settle)
Stones do not "bounce"; they **settle**.
- **Entry:** Spring-based `y: 10` -> `y: 0`.
- **Hover:** Subtle lift (`y: -4`, `scale: 1.01`) only if interactive.
- **Spring Specs:** `stiffness: 320, damping: 26`.
- **Accessibility:** Always wrap animations in `useReducedMotion()` checks.

### 3. Accessibility
- **Focus:** Must use `focus-within:ring-2` with `ring-ink-gold` and a dark offset.
- **Semantics:** Use `<article>`, `<section>`, or `<div>` with appropriate ARIA roles.

## Variants

| Variant | Context | Styling |
| :--- | :--- | :--- |
| `standard` | Default background for content blocks. | `bg-asphalt-black`, `shadow-viscous` |
| `ghost` | Secondary content with high definition but low "weight". | `bg-transparent`, `border-ink-gold` |
| `active` | Highlighted state or high-priority items. | `shadow-ink-glow`, `scale-[1.02]` |

## Hi-Fi Lifecycle
1. **Lo-Fi:** Functional container with standard padding and color.
2. **Hi-Fi Stage 1:** Addition of `tone` and `density` hooks in the API.
3. **Hi-Fi Stage 2:** Mapping tones to [DEPRECATED_STYLE] color tokens and densities to expressive spacing.
4. **Final Polish:** Addition of the `screenprint-grit` textural overlay (Z-0).
