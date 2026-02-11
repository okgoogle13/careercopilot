# SolidarityLanding Hi-Fi Blueprint

## Layout Regions
- **Hero / Manifesto**: The emotional center. Large-scale typography and high-contrast visuals.
- **Content / Features**: Grid-based display of mission pillars and skill highlights.
- **Footer**: Low-density sign-off with essential links.

## Typography
- **Hero Title**: `Fraunces Energetic`, 144px (mobile: 72px), `font-weight: 800`. High tracking-tighter for a "crushed ink" feel.
- **Body Content**: `Work Sans`, 18px, `font-weight: 400`, `leading-loose`.
- **CTA Labels**: `JetBrains Mono`, 14px, `uppercase`, `letter-spacing: 0.1em`.

## Color
- **Substrate**: `bg-asphalt-black`. 
- **Hero Text**: `text-solidarity-red` (Title) and `text-paper-white/80` (Body).
- **Cards**: `bg-asphalt-black` with `border-white/10` and `shadow-viscous`.

## Spacing
- **Gutter**: 24px (Desktop), 16px (Mobile).
- **Hero Padding**: `py-32` (Desktop), `py-16` (Mobile).
- **Card Padding**: `SolidarityCard` standard (`p-6`).

## Motion
- **Entry**: Manifesto cards emerge with `y: 20` -> `y: 0` and `opacity: 1` using a viscous spring (`stiffness: 320, damping: 26`).
- **Reduced Motion**: Fallback to simple `opacity` fade (0.3s).
- **Stagger**: All high-level cards use a `0.1s` stagger delay.

## Motif Slots
- `// TODO[asset]: Hero Elephant Motif (top-right, opacity-20)`
- `// TODO[asset]: Torn Edge Substrate (full-width bottom edge)`
- `// TODO[asset]: Screenprint Grit Overlay (global)`
