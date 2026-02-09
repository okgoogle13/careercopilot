# Wireframe: PathSelectionCard

<layout>
+-----------------------------------------------------------+
|                                                           |
|             "TECH WORKER"                                 |
|             (Display Large, 72px, parrotGreen)            |
|                                                           |
|    "Build the digital infrastructure of                   |
|     the collective." (Body, 16px)                         |
|                                                           |
|             [ CHOOSE THIS PATH ]                          |
|             (Pebble, Baru Gold)                           |
|                                                           |
+-----------------------------------------------------------+
</layout>

<tokens>
- **Container**: `bg-charcoal`, `radius-stone`, `w-[320px]`, `p-8`
- **PathTitle**: `text-display-lg`, `font-solidarity-800`, `text-parrot-green`
- **Button**: `bg-baru-gold`, `text-charcoal`, `radius-pebble`
</tokens>

<accessibility>
- **Role**: `region` -> `button`
- **ARIA Label**: `Select Path: {title}`
- **Focus Order**: Title -> Description -> Action Button
</accessibility>

<states>
- **Selected**: Card gains 4px Baru Gold border; scale 1.05.
- **Loading**: Skeleton palm tree motif pulsing behind the card.
- **Error**: "Path Alignment Error" in Waratah Red.
</states>

<assets>
- **Background**: `{kr-asset-blueprint-grid}` at 8% opacity (Z-1).
- **Substrate**: `{kr-asset-charcoal-paper}` at Z-0.
</assets>