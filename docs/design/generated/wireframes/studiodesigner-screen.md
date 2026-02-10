# Wireframe: StudioDesigner (Screen)

<layout>
```text
┌──────────────────────────────────────┐
│  [ TOOLBAR PEBBLES ]                 │
├────────┬─────────────────────────────┤
│        │                             │
│ ASSETS │    CANVAS (Z-1 Stone)       │
│ STONE  │                             │
│        │                             │
├────────┴─────────────────────────────┤
│ Z-0: {kr-asset-blueprint-grid}       │
└──────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `baruGold` (Grid/Border), `white` (Substance)
- **Shapes**: `radius-stone` (Canvas/Library), `radius-pebble` (Tools)
- **Typography**: `Subhead` (24px, Inter)
</tokens>

<assets>
- **Textures**: `blueprint-grid` (Z-0)
- **Motifs**: `screenprint-grit` (ambient)
- **Register**: Possibility
</assets>

<components>
- **DesignerCanvas** (stone)
  - Role: Main visual assembly area.
- **AssetLibrary** (stone)
  - Role: List of draggable motifs/components.
- **ToolbarAction** (pebble)
  - Role: Selection, Pan, Zoom.
</components>

<annotations>
1 | canvas_drag        | Behavior: drag-and-drop from library; snap-to-grid=blueprint-grid.
2 | asset_preview      | Style: radius-stone thumbnails; onHover → show metadata.
3 | zoom_control       | Style: radius-pebble; Action: onScale → update canvas-transform.
4 | export_btn        | Action: onClick → generate manifest; Style: radius-pebble; Color: baruGold.
</annotations>

<notes>
- Goal: Visual layout and asset placement for collective manifestos.
</notes>
