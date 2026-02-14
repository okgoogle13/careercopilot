# StudioDesigner Hi-Fi Blueprint

## Layout Regions
- **Design Bar**: A horizontal toolbar for layout and manipulation tools.
- **Asset Reservoir (Left)**: A vertical stone list of draggable [DEPRECATED_STYLE] and technical motifs.
- **Assembly Canvas**: A multi-layered high-fidelity stone area with a dynamic blueprint grid.

## Typography
- **Tool Labels**: `JetBrains Mono`, 11px, `uppercase`, `text-paper-white/50`.
- **Asset Titles**: `Work Sans`, 14px, `font-weight: 500`.
- **Canvas Metadata**: `JetBrains Mono`, 12px, `text-ink-gold/60`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Canvas**: `bg-asphalt-black`, `border-white/5`, `shadow-viscous`.
- **Grid Lines**: `border-ink-gold/10` (Dynamic based on zoom).
- **Selection Box**: `border-ink-gold` (1px solid), `bg-ink-gold/5`.

## Spacing
- **Toolbar Height**: `h-14`.
- **Asset Grid Gap**: `gap-4`.
- **Canvas Margin**: `m-8`.

## Motion
- **Motif Drag**: Dragged items show a "ghost" motif at 50% opacity.
- **Snapping**: Motifs "snap" to the blueprint grid with a high-stiffness spring.
- **Grit Ambient**: Background `screenprint-grit` has a low-frequency fractal animation for "living texture".

## Motif Slots
- `- {KR-UI-004} Blueprint grid overlay (transparent) for technical grid patterns) **[REQUIRES GENERATION]**
- `- {KR-UI-003} Screenprint grit particles (tile + sprite set) for floating texture) **[REQUIRES GENERATION]**
- `// TODO[asset]: [DEPRECATED_STYLE] Motif reservoir items.`.
