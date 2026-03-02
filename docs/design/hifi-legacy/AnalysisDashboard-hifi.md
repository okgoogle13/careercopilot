# AnalysisDashboard Hi-Fi Blueprint

## Layout Regions
- **Discovery Header**: High-authority headline regarding identified skill sets.
- **Skill Matrix**: A CSS grid (mobile: 2-col, desktop: 3/4-col) of `SkillTile` (Stone) components.
- **Blueprint Foundation**: Full-screen substrate with technical grid overlay and kr-solidarity visual accents.

## Typography
- **Page Headline**: `Fraunces Energetic`, 48px, `font-weight: 800`.
- **Skill Title**: `Fraunces Restrained`, 20px, `font-weight: 700`.
- **Mastery Percentage**: `JetBrains Mono`, 12px, `font-weight: 700`.
- **Legend Text**: `Work Sans`, 14px, `text-paper-white/50`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Tiles**: `bg-asphalt-black/50` with `border-white/10` and `shadow-viscous`.
- **Mastery Accent**: `text-ink-gold` (Status) or `text-solidarity-green` (Mastery).
- **Elite Indicator**: `text-solidarity-red`.

## Spacing
- **Grid Gutter**: `gap-4`.
- **Tile Padding**: `p-6`.
- **Matrix Margin**: `mt-12`.

## Motion
- **Matrix Reveal**: Skill tiles stagger in with a `scale: 0.95` -> `1.0` + `opacity` transition.
- **Hover Elevation**: Tiles elevate on hover (`y: -6`) and show a `ink-gold` border glow.
- **Mastery Animate**: Radial/Hex mastery graphs animate their fill state over 1.5s (Viscous ease).

## Motif Slots
- `{KR-UI-004}` Blueprint grid overlay (transparent) for technical grid patterns **[REQUIRES GENERATION]**
- `{KR-SOLID-029}` Paint splash - dynamic expressive overlay
- `{KR-UI-002}` Halo disk (plain + gauge version) for radiant circle elements
