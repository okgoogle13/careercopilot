# Foundational Component Specs: Stone, Pebble, Slab

This document defines the technical specifications for the three core geometric primitives of the Kerala Rage design system.

## 1. The Stone (radius-stone)
The workhorse container for data, content cards, and navigation items.

- **Geometry**: `border-radius: 12px` (radius-stone)
- **Background**: `surface.container` (#2C2723) or `surface.containerLow` (#211F1C)
- **Border**: `1px solid outline.variant` (#49454F)
- **Elevation**: `shadow.viscous` (Custom multi-layered shadow using gumLeafGreen tint)
- **Variants**:
  - **Standard**: Opaque background.
  - **Ghost**: Transparent background, 1px gold border.
  - **Active**: Scale 105%, baruGold border-glow.

## 2. The Pebble (radius-pebble)
Small, interactive elements like buttons, chips, and inputs.

- **Geometry**: `border-radius: 24px` (radius-pebble / Capsule)
- **Background**: `primary.DEFAULT` (#D4A84B / Baru Gold) for primary actions.
- **Typography**: `Recursive 800 Solidarity` (14px-16px).
- **Interactions**:
  - **Hover**: 2px waratahRed underline or glow disk expansion.
  - **Active**: 4px baruGold halo shadow.

## 3. The Slab (radius-slab)
Large structural blocks for headlines, hero sections, and category headers.

- **Geometry**: `border-radius: 4px` (radius-slab / Sharp but softened)
- **Background**: `surface.containerHighest` (#41403B)
- **Typography**: `Display Hero` (Recursive 900 Slam, 72px-144px).
- **Z-Layering**: Always Z-1.

## Global Tokens Mapping
- **Ink (Baru Gold)**: `#D4A84B`
- **Ink (Waratah Red)**: `#C45C4B`
- **Ink (Leafus Ash)**: `#F5DDAA`
- **Substrate (Asphalt)**: `#1A1714`
