# SplitScreenEditor Hi-Fi Blueprint

## Layout Regions
- **Tool Toolbar**: A thin vertical or horizontal strip for high-frequency actions.
- **Side-by-Side Canvas**: High-fidelity `EditorPanel` and `PreviewPanel` (Stone) separated by a tactile divider.
- **Technical Substrate**: A dark background with a dominant blueprint grid for precision context.

## Typography
- **Editor Text**: `JetBrains Mono`, 14px, `font-weight: 400`, `leading-tight`.
- **Panel Tabs**: `JetBrains Mono`, 11px, `uppercase`, `tracking-widest`.
- **Metadata Output**: `JetBrains Mono`, 12px, `text-paper-white/40`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Panels**: `bg-asphalt-black/80`, `border-white/5`.
- **Divider**: `bg-ink-gold` (2px tactile line).
- **Active Tab**: `text-ink-gold`.

## Spacing
- **Panel Gutter**: `0px` (Shared divider), `gap-4` for external padding.
- **Toolbar Width**: `w-16` (Desktop).
- **Console Height**: `h-32` (Bottom reveal).

## Motion
- **Divider Hover**: The `ink-gold` divider glows and thickens slightly when interactive.
- **Preview Refresh**: Right panel has a subtle `blur-sm` -> `opacity` fade on data re-render.
- **Tool Hover**: `ToolPebble` icons lift on hover (`y: -2`) and show a tool-tip.

## Motif Slots
- `- {KR-UI-004} Blueprint grid overlay (transparent) for technical grid patterns) **[REQUIRES GENERATION]**
- `- {KR-UI-004} Blueprint grid overlay (transparent) for technical grid patterns)
- `// TODO[asset]: Grid Line decorative motifs for panel corners.`
