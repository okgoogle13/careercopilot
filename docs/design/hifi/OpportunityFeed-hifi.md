# OpportunityFeed Hi-Fi Blueprint

## Layout Regions
- **Feed Headline**: Persistent high-fidelity title at the top.
- **Mission Stream**: A vertical stack of `OpportunityItem` (Stone) components.
- **Filter Bar**: A sticky horizontal bar with `ActionButton` (Pebble) chips for status filtering.

## Typography
- **Feed Headline**: `Fraunces Energetic`, 48px, `font-weight: 800`.
- **Item Role Title**: `Fraunces Restrained`, 20px, `font-weight: 700`.
- **Organization Label**: `Work Sans`, 14px, `uppercase`, `text-paper-white/60`.
- **Priority Badge**: `JetBrains Mono`, 12px, `font-weight: 700`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Standard Item**: `bg-asphalt-black/50`, `border-white/5`.
- **High Priority Item**: `border-solidarity-red/40`, `bg-solidarity-red/5`.
- **Selection Accent**: `text-ink-gold`.

## Spacing
- **Vertical Stack Gap**: `space-y-4`.
- **Item Padding**: `p-6`.
- **Feed Gutter**: `px-6` (Mobile), `px-12` (Desktop).

## Motion
- **Stream Entry**: Items slide and fade in with an `opacity` + `y` spring transition.
- **Priority Pulse**: High-priority items have a subtle, slow `border-color` pulse.
- **List Interaction**: Items lift slightly (`y: -4`) on hover.

## Motif Slots
- `// TODO[asset]: Halo Disk Motif behind High Priority items (Z-1, 60% opacity)`
- `// TODO[asset]: Screenprint Substrate Texture backdrop (10% opacity)`
- `// TODO[asset]: Status-specific botanical icons for list items.`
