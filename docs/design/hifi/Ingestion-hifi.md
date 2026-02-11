# Ingestion Hi-Fi Blueprint

## Layout Regions
- **Ingestion Slab**: A high-impact hero headline for page context.
- **Blueprint Dropzone**: A high-fidelity interactive area for file uploads.
- **Tactical Progress Bar**: A linear indicator for scan/upload status.

## Typography
- **Page Headline**: `Fraunces Energetic`, 72px (mobile: 48px), `font-weight: 800`.
- **Dropzone Text**: `Work Sans`, 18px, `font-weight: 500`, `text-paper-white/60`.
- **Action Label**: `JetBrains Mono`, 14px, `uppercase`, `text-asphalt-black`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Dropzone**: `bg-asphalt-black/40`, `border-dashed`, `border-ink-gold/30`.
- **Dropzone Active**: `bg-ink-gold/5`, `border-ink-gold`, `shadow-ink-glow`.
- **Primary CTA**: `bg-ink-gold` with `text-asphalt-black`.

## Spacing
- **Vertical Stack**: `gap-10`.
- **Dropzone Padding**: `p-20` (Desktop), `p-10` (Mobile).
- **Page Gutter**: `px-12`.

## Motion
- **Entry Pulse**: The Dropzone has a very subtle, slow "breathing" border-opacity pulse (20% -> 40%).
- **Drag Interaction**: Dragging a file over the zone triggers a `scale: 1.02` lift and an immediate `shadow-ink-glow` reveal.
- **Upload Progress**: The progress bar uses a viscous spring for "lurching" forward as data chunks are processed.

## Motif Slots
- `// TODO[asset]: Blueprint Grid overlay constrained to Dropzone (Z-0)`.
- `// TODO[asset]: Halo Disk Motif pulsing behind Dropzone (Z-1)`.
- `// TODO[asset]: Scanning holographic motif for primary CTA button.`
