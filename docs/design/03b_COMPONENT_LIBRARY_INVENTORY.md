# KR Solidarity: Component Library Inventory (v6.1)

> **Part of the [KR Solidarity Design Canon](01_CANON.md)**
> **Topic:** Target-state inventory of canonical library components, shared wrappers, and transition-status surfaces.
> **Purpose:** Provide one current reference for what belongs in the component library, what still lives in transition, and what should not be promoted.

---

## Authority Order

Use this file as the inventory layer, not the sole design authority.

1. [01_CANON.md](01_CANON.md)
2. [02_SYSTEM.md](02_SYSTEM.md)
3. [03_COMPONENTS.md](03_COMPONENTS.md)
4. Runtime owners under `frontend/src/components/**`, `frontend/src/layouts/**`, and `frontend/src/features/**`
5. Active sync worklists:
   - [`../project/active/primitive-sync-targets.json`](../project/active/primitive-sync-targets.json)
   - [`../project/active/shared-wrapper-targets.json`](../project/active/shared-wrapper-targets.json)

Rules:
- Lead with plain UI names, not archetype names.
- Treat `features/*` and `layouts/*` as runtime truth when they disagree with older inventory outputs.
- Do not treat generated inventories as canonical unless they are reconciled back into this document.

---

## Status Vocabulary

| Status | Meaning |
| :--- | :--- |
| `canonical` | Approved target-state library surface |
| `transitional` | Still in use, but expected to be renamed, merged, or normalized |
| `prototype-only` | Figma or screen-reference surface, not a promoted runtime library component |
| `deprecated` | Compatibility-only surface; do not use in new work |
| `support-only` | Internal helper, atmospheric asset, or non-public implementation detail |

---

## 1. Core Public Primitives

These are the public names new docs and new code should use.

| Public UI Name | Internal Archetype | Canonical Runtime Surface | Target-State Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `Button` | `Strike` | `frontend/src/components/ui/Strike.tsx` | `canonical` | Legacy names like `KeralaRageButton` should phase out of public vocabulary |
| `Card` | `Placard` | `frontend/src/components/ui/Placard.tsx` | `canonical` | Use for content and emphasis containers |
| `Panel` / `LayoutPanel` | `Scaffold` | structural layout shells | `canonical` | Inventory owner should be normalized per concrete runtime file |
| `Input` | `Scaffold` | `frontend/src/components/ui/ScaffoldInput.tsx` | `canonical` | Includes standard input surface |
| `Textarea` | `Scaffold` | `frontend/src/components/ui/ScaffoldInput.tsx` (`ScaffoldArea`) | `canonical` | Public docs should use `Textarea`, not branded aliases |
| `Select` | `March` | `frontend/src/components/ui/March.tsx` | `canonical` | Target-state public name remains `Select` |
| `Dialog` / `Modal` | `Megaphone` | `frontend/src/components/ui/Megaphone.tsx` | `canonical` | Public docs should avoid using `Megaphone` as the component noun |
| `Surface` / `BackgroundLayer` | `Substrate` | atmospheric/background implementations | `support-only` | Never treat as a route or feature component |

---

## 2. Transitional Primitive Surfaces

These are runtime files or names that still exist but should not remain the long-term public vocabulary.

| Current Surface | Intended Public Name | Current Path | Status | Transition Note |
| :--- | :--- | :--- | :--- | :--- |
| `KeralaRageButton` | `Button` | `frontend/src/components/ui/KeralaRageButton.tsx` | `transitional` | Keep for compatibility until all call sites normalize |
| `ActionButton` | `Button` or branded variant | `frontend/src/components/kerala-rage/ActionButton.tsx` | `transitional` | Clarify whether this survives as a branded specialization |
| `M3ExpressiveComponents` | mapped public primitives | `frontend/src/components/ui/M3ExpressiveComponents.tsx` | `transitional` | Requires explicit `--md-*` to `--kr-*` mapping policy |
| `StatusBadge` | `StatusBadge` | `frontend/src/components/ui/StatusBadge/` | `canonical` | Confirm whether folder exports are already stable enough to mark canonical |
| `Logo` | `Logo` | `frontend/src/components/ui/Logo.tsx` | `canonical` | Public primitive, but not an interactive control |
| `BannerTexture` | `BackgroundLayer` / asset helper | `frontend/src/components/kerala-rage/BannerTexture.tsx` | `support-only` | Atmospheric layer, not a public component primitive |

---

## 3. Shared Wrappers And Library-Owned Layout Surfaces

These are not page features. They are reusable shells or wrappers that shape route-level composition.

| Surface | Path | Target-State Status | Scope | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `MigratedRouteLayout` | `frontend/src/layouts/MigratedRouteLayout.tsx` | `canonical` | route shell | Should be treated as the primary authenticated wrapper when active |
| `SolidaritySidebar` | `frontend/src/layouts/shared/SolidaritySidebar.tsx` | `canonical` | navigation shell | Must not ship with hardcoded user data |
| `Footer` | `frontend/src/layouts/shared/Footer.tsx` | `canonical` | shared shell | Normalize any arbitrary Tailwind values into theme/tokens where needed |
| `PublicLayout` | currently inline in `frontend/src/App.tsx` | `transitional` | public shell | Extract to `layouts/PublicLayout.tsx` if retained long term |

---

## 4. Feature-Owned Shared Composites

These surfaces may be reused, but they are still primarily owned by a feature area rather than the base UI kit.

| Surface Type | Likely Owner | Target-State Status | Promotion Rule |
| :--- | :--- | :--- | :--- |
| hero compositions | `features/landing` + `components/kerala-rage` | `transitional` | Promote only if used across multiple routes without feature-specific assumptions |
| analysis composites | `features/analysis` | `feature-owned` | Do not promote to library without generic props and stable contracts |
| application drafting composites | `features/applications` | `feature-owned` | Promote only if they stop depending on job-specific workflow context |
| onboarding composites | `features/onboarding` | `feature-owned` | Treat as product flow components, not base library |

---

## 5. Excluded From Library Target State

These should not be counted as target-state library components even if they are useful references.

| Surface Class | Why Excluded |
| :--- | :--- |
| `frontend/src/screens/**` paired screen files | design/reference authority, not base runtime library surfaces |
| route entry pages tied to one workflow | route-level product surfaces, not shared library primitives |
| prototype `/kr/*` surfaces | experimental or reference-only until explicitly promoted |
| generated inventories not reconciled here | operational snapshots, not canonical inventory |

---

## 6. Synchronization Inputs

Use these sources to keep this inventory current:

| Source | Use |
| :--- | :--- |
| [03_COMPONENTS.md](03_COMPONENTS.md) | canonical public names and archetype mappings |
| [`../project/active/primitive-sync-targets.json`](../project/active/primitive-sync-targets.json) | primitive sync status, Figma equivalents, blocking issues |
| [`../project/active/shared-wrapper-targets.json`](../project/active/shared-wrapper-targets.json) | shared wrapper status and correctness issues |
| `docs/design/component-library-inventory.json` | machine-readable target-state inventory for dashboarding and tooling |
| `registry/index.json` | publishable registry surface list for source-code distribution |
| `frontend/component-inventory.json` | generated current-state scan; useful, but must be reconciled before promotion |
| `docs/design/layered-component-blueprint.json` | layer grouping reference; useful for seeding inventory buckets |

---

## 7. Open Inventory Decisions

These need explicit decisions before the inventory can be called complete:

1. Should `KeralaRageButton.tsx` remain as a compatibility shim or be fully absorbed by `Strike.tsx`?
2. Should `ActionButton.tsx` remain a branded specialization or collapse into the canonical `Button` family?
3. Which layout shell is the long-term public wrapper for authenticated routes: `MigratedRouteLayout` only, or a second normalized shell?
4. Does `M3ExpressiveComponents.tsx` survive as a compatibility bridge, or does it get decomposed into KR-native primitives only?
5. Which feature composites are eligible for promotion into shared library status?

---

## 8. Completion Criteria

This inventory is complete when:

- every public primitive has one canonical runtime surface
- every shared wrapper has an explicit target-state status
- transitional and deprecated names are explicitly recorded
- feature-owned composites are separated from base library primitives
- generated inventories can be regenerated without changing target-state decisions unexpectedly

---

**Last Updated:** 2026-04-07
**Design System Version:** v6.1
**Status:** Scaffolded source-of-truth inventory; requires reconciliation pass against live runtime surfaces
