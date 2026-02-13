# ProfileSettings Hi-Fi Blueprint

## Layout Regions
- **Identity Header**: Centralized avatar and display name area with atmospheric backing.
- **Engagement Stats**: A horizontal row of high-density `InfoStone` components.
- **Badge Archive**: A grid of `BadgePebble` items representing earned [DEPRECATED_STYLE]/technical marks.

## Typography
- **Identity Headline**: `Fraunces Energetic`, 48px, `font-weight: 800`, `text-paper-white`.
- **Stat Value**: `JetBrains Mono`, 32px, `font-weight: 800`, `text-ink-gold`.
- **Stat Label**: `Work Sans`, 14px, `font-weight: 500`, `text-paper-white/50`, `uppercase`.
- **Bio Text**: `Work Sans`, 16px, `italic`, `text-paper-white/70`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Info Blocks**: `bg-asphalt-black/50`, `border-white/5`, `shadow-viscous`.
- **Active Badge**: `shadow-ink-glow`, `border-ink-gold/40`.
- **Halo Glow**: Radial gradient `from-ink-gold/20 to-transparent`.

## Spacing
- **Avatar Size**: `w-32 h-32` (Desktop), `w-24 h-24` (Mobile).
- **Identity Margin**: `mb-12`.
- **Stats Gap**: `gap-6`.
- **Grid Gutter**: `gap-4` (Badges).

## Motion
- **Avatar Entry**: The avatar and its halo motif scale in (`scale: 0.8` -> `1.0`) with a dampening spring.
- **Stats Count-up**: Engagement stats animate from `0` to the target value on enter.
- **Badge Tilt**: Badges have a subtle 3D tilt effect on hover using `framer-motion`.

## Motif Slots
- `{KR-UI-002}` Halo disk (plain + gauge version) for radiant circle elements **[REQUIRES GENERATION]**
- `{KR-SOLID-033}` Melbourne Laneway texture - real-world substrate base
- `{KR-UI-007}` Screenprint stamp 'VERIFIED' (transparent) for approval indicators
