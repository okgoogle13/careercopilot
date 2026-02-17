# Authentication Hi-Fi Blueprint

## Layout Regions
- **Verification Portal**: Centered stone container (480px) for login/registration actions.
- **Background Substrate**: Full-screen textured backdrop with atmospheric halo effects.

## Typography
- **Verification Title**: `Fraunces Energetic`, 72px (mobile: 48px), `font-weight: 800`.
- **Form Labels**: `JetBrains Mono`, 12px, `uppercase`, `text-paper-white/50`.
- **Input Text**: `Work Sans`, 16px, `text-paper-white`.
- **Link Buttons**: `Work Sans`, 14px, `underline`, `text-ink-gold`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Portal Card**: `bg-asphalt-black` (solid) with `border-ink-gold/20` and `shadow-viscous`.
- **Primary CTA**: `bg-ink-gold` with `text-asphalt-black`.

## Spacing
- **Container Gap**: `gap-8` between title and form.
- **Form Row Gap**: `gap-6`.
- **Padding**: Card uses `p-12` (Desktop), `p-8` (Mobile).

## Motion
- **Entry**: The `AuthContainer` settles from `y: 40` -> `y: 0` with a heavy spring.
- **Micro-interactions**: Subtle `ink-gold` border glow on input focus.
- **Halo Pulse**: The `halo-disk` motif behind the card has a long-period (8s) subtle opacity pulse (40-60%).

## Motif Slots
- `- {KR-UI-002} Halo disk (plain + gauge version) for radiant circle elements) **[REQUIRES GENERATION]**
- `- {KR-SOLID-033} Melbourne Laneway texture - real-world substrate base)
- `- {KR-UI-003} Screenprint grit particles (tile + sprite set) for floating texture) **[REQUIRES GENERATION]**
