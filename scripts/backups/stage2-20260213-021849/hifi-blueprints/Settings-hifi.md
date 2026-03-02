# Settings Hi-Fi Blueprint

## Layout Regions
- **System Parameter Header**: Title for administrative/personal context.
- **Categorical Groups**: Vertical stack of `SettingsGroup` (Stone) containers.
- **Action Footer**: Persistent area for Reset/Save actions.

## Typography
- **Page Headline**: `Fraunces Energetic`, 48px, `font-weight: 800`.
- **Category Header**: `Fraunces Restrained`, 24px, `uppercase`, `tracking-tighter`.
- **Setting Label**: `Work Sans`, 16px, `font-weight: 600`.
- **Setting Description**: `Work Sans`, 14px, `text-paper-white/50`.
- **Control Text**: `JetBrains Mono`, 12px, `font-weight: 700`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Groups**: `bg-asphalt-black/50` with `border-white/5`.
- **Interactive Accent**: `text-ink-gold` (Selection) or `text-solidarity-red` (Destructive).
- **Toggle State**: `bg-ink-gold` (On), `bg-white/10` (Off).

## Spacing
- **Group Margin**: `mb-8`.
- **Setting Padding**: `py-4`, `border-b` (except last item).
- **Group Internal Padding**: `p-6`.

## Motion
- **Toggle Flip**: `PebbleToggle` has a high-tension spring switch animation.
- **Page Entrance**: Group containers slide up sequentially with a `0.05s` stagger.
- **Section Expand**: Accordion-style sections use a `height` + `opacity` transition (Viscous).

## Motif Slots
- `- {KR-SOLID-033} Melbourne Laneway texture - real-world substrate base)
- `// TODO[asset]: Context-specific technical icons for setting categories.`.
