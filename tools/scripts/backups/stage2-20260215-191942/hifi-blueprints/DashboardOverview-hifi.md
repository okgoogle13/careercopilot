# DashboardOverview Hi-Fi Blueprint

## Layout Regions
- **Command Header**: high-fidelity `ManifestoSlab` for page context.
- **Metric Grid**: Responsive 4-column display of mission-critical tactical data.
- **Historical Activity Feed**: Large-format stone container for event logs.

## Typography
- **Page Title**: `Fraunces Energetic`, 64px (roughly `text-5xl` to `text-6xl`), `font-weight: 800`.
- **Metric Labels**: `JetBrains Mono`, 12px, `uppercase`, `tracking-widest`, `text-paper-white/40`.
- **Metric Values**: `Fraunces Restrained`, 48px (roughly `text-4xl` to `text-5xl`), `tracking-tighter`.
- **Feed Text**: `Work Sans`, 16px-24px (`text-base` to `text-2xl`), `font-weight: 300`, `text-paper-white/30`.

> [!NOTE]
> Metric labels and feed text must meet WCAG AA contrast on `asphalt-black` and use sizes ≥ 12px/16px equivalents.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Metrics**:
  - Neutral: `paper-white`
  - Warning/Alignment: `ink-gold`
  - Ready/Mission: `solidarity-red`
  - Success/Score: `solidarity-green`
- **Cards**: `bg-asphalt-black`, `border-white/5`, `shadow-viscous`.

## Spacing
- **Gutter**: `gap-6` (Grid), `gap-12` (Vertical sections).
- **Metric Padding**: `p-6` (SolidarityCard).
- **Feed Padding**: `p-12`.

## Motion
- **Metric Stagger**: Cards enter with `y: 10` -> `y: 0` and a `0.1s` stagger delay using a calibrated spring.
- **Value Reveal**: Metric values animate from `0` to target.
- **Substrate Pulse**: Subtle radial glows behind high-priority metrics.
    - *Constraint*: Glow must not obscure text and should remain at very low opacity (≤ 10%).

## Accessibility & Reduced Motion
- **Global Constraint**: All motion must respect `prefers-reduced-motion` by simplifying to opacity-only.
- **Value Animation Fallback**: When reduced motion is on, skip number tweening and use a simple fade-in.

## Motif Slots
- `{KR-SOLID-033}` Melbourne Laneway texture - real-world substrate base (Z-0, 5% opacity)
- `{KR-SOLID-033}` Melbourne Laneway texture - real-world substrate base
- `{KR-UI-002}` Halo disk (plain + gauge version) for radiant circle elements
