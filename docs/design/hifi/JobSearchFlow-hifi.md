# JobSearchFlow Hi-Fi Blueprint

## Layout Regions
- **Search Header**: Persistent `SearchBar` (Pebble) for real-time keyword filtering.
- **Split Exploration Area**:
  - **Sidebar (Left)**: `FilterSidebar` (Stone) for categorical refinement.
  - **Results Area (Right)**: Vertical stream of `ResultItem` (Stone) components.
- **Blueprint Foundation**: Substrate with a persistent technical grid.

## Typography
- **Search Label**: `JetBrains Mono`, 12px, `uppercase`, `text-paper-white/40`.
- **Item Title**: `Fraunces Restrained`, 20px, `font-weight: 700`.
- **Metadata Labels**: `Work Sans`, 14px, `font-weight: 400`, `text-paper-white/50`.
- **Empty State Text**: `Fraunces Restrained`, 24px, `italic`, `text-paper-white/20`.

## Color
- **Substrate**: `bg-asphalt-black`.
- **Sidebar**: `bg-asphalt-black/50`, `border-r`, `border-white/5`.
- **Results**: `bg-asphalt-black`.
- **Highlight**: `text-ink-gold`.

## Spacing
- **Sidebar Width**: `w-80` (Desktop), `hidden` (Mobile - replaced by Drawer).
- **Results Gap**: `space-y-3`.
- **Padding**: Sidebar `p-6`, Result Item `p-5`.

## Motion
- **Sidebar Slide**: Sidebar slides in from `x: -100%` on mobile drawer open.
- **Result Stagger**: New results cascade in with a `0.05s` stagger delay.
- **Micro-interaction**: Search bar focus triggers a subtle `ink-gold` outer glow.

## Motif Slots
- `- {KR-UI-004} Blueprint grid overlay (transparent) for technical grid patterns) **[REQUIRES GENERATION]**
- `// TODO[asset]: Solidarity-Icon-Pack (Filter, Sort, Search)`.
- `- {KR-SOLID-033} Melbourne Laneway texture - real-world substrate base)
