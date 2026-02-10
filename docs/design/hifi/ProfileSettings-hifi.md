# ProfileSettings Hi-Fi Blueprint

## Layout Regions
- **Identity Header**: Centralized avatar and display name area with atmospheric backing.
- **Engagement Stats**: A horizontal row of high-density `InfoStone` components.
- **Badge Archive**: A grid of `BadgePebble` items representing earned botanical/technical marks.

## Typography
- **Identity Headline**: `Fraunces Energetic`, 48px, `font-weight: 800`, `text-paper-white`.
- **Stat Value**: `JetBrains Mono`, 32px, `font-weight: 800`, `text-wattle-gold`.
- **Stat Label**: `Work Sans`, 14px, `font-weight: 500`, `text-paper-white/50`, `uppercase`.
- **Bio Text**: `Work Sans`, 16px, `italic`, `text-paper-white/70`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Info Blocks**: `bg-asphalt-black/50`, `border-white/5`, `shadow-viscous`.
- **Active Badge**: `shadow-wattle-glow`, `border-wattle-gold/40`.
- **Halo Glow**: Radial gradient `from-wattle-gold/20 to-transparent`.

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
- `// TODO[asset]: Halo Disk Motif (Z-1, behind avatar, 40% opacity)`.
- `// TODO[asset]: Screenprint Substrate overlay (Z-0, 15% opacity)`.
- `// TODO[asset]: Botanical Badge icons for specific skill achievements.`.
