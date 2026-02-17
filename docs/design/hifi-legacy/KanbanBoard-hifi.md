# KanbanBoard Hi-Fi Blueprint

## Layout Regions
- **Campaign Headline**: High-authority status title.
- **Unified Columns**: A horizontal scroll container for status columns.
- **Mission Cards**: Draggable/interactive `SolidarityCard` components.

## Typography
- **Page Headline**: `Fraunces Energetic`, 48px, `font-weight: 800`.
- **Column Header**: `Fraunces Restrained`, 24px, `uppercase`, `tracking-tighter`.
- **Card Role Title**: `Work Sans`, 16px, `font-weight: 600`.
- **Card Metadata**: `JetBrains Mono`, 12px, `text-paper-white/50`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Columns**: `bg-asphalt-black/40`, `border-white/5`.
- **Active Card**: `border-ink-gold`, `shadow-ink-glow`.
- **Column Accents**: Status-specific colored labels (`solidarity-green` for resolved, `solidarity-red` for blocked).

## Spacing
- **Column Gap**: `gap-6`.
- **Column Padding**: `p-4`.
- **Card Margin**: `mb-4`.

## Motion
- **Column Entry**: Columns slide in from `x: 20` -> `x: 0` with a linear-spring.
- **Card Drag**: Elevated shadow and slight scale (`1.05x`) during drag.
- **Blueprint Fade**: The `blueprint-grid` background enters at `opacity-6`.

## Motif Slots
- `{KR-UI-004}` Blueprint grid overlay (transparent) for technical grid patterns **[REQUIRES GENERATION]**
- `{KR-SOLID-029}` Paint splash - dynamic expressive overlay
- `{KR-UI-002}` Halo disk (plain + gauge version) for radiant circle elements
