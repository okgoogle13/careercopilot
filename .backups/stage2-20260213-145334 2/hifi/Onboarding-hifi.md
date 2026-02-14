# Onboarding Hi-Fi Blueprint

## Layout Regions
- **Path Selection**: A horizontally centered layout featuring three high-fidelity `SolidarityCard` components.
- **Atmospheric Foundation**: A technical substrate with a blueprint-style grid overlay.

## Typography
- **Page Headline**: `Fraunces Energetic`, 72px (mobile: 48px), `font-weight: 800`.
- **Card Titles**: `Fraunces Restrained`, 32px, `font-weight: 700`.
- **Card Descriptions**: `Work Sans`, 16px, `text-paper-white/70`, `leading-relaxed`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Cards**: `bg-asphalt-black` (solid) with a subtle `border-white/5` and `shadow-viscous`.
- **Active Selection**: `border-ink-gold` with a `shadow-ink-glow`.

## Spacing
- **Card Grid Gap**: `gap-12` (Desktop), `gap-6` (Mobile).
- **Headline Margin**: `mb-24`.
- **Comfortable Padding**: Cards use `p-10`.

## Motion
- **Path Entry**: The three selection cards stagger in from `y: 20` -> `y: 0` with a 0.1s stagger.
- **Hover Lift**: Cards elevate slightly (`y: -8`) on hover to indicate interactivity.
- **Blueprint Fade**: The `blueprint-grid` substrate enters at `opacity: 0` and fades to `opacity: 8%` over 2s.

## Motif Slots
- `- {KR-UI-004} Blueprint grid overlay (transparent) for technical grid patterns) **[REQUIRES GENERATION]**
- `- {KR-UI-004} Blueprint grid overlay (transparent) for technical grid patterns)
