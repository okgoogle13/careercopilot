# Wireframe: SplitScreenEditor (Screen)

<layout>
```text
┌────────┬──────────────────┬──────────────────┐
│        │                  │                  │
│ TOOLS  │    LEFT PANEL    │   RIGHT PANEL    │
│ STONE  │    (Z-1 Stone)   │   (Z-1 Stone)    │
│ (Z-2)  │    CODE / DATA   │   VIEW / RESULT  │
│        │                  │                  │
├────────┴──────────────────┴──────────────────┤
│ Z-0: {kr-asset-blueprint-grid} (12% opacity) │
└──────────────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `baruGold` (Line/Border), `kr-leafusAsh` (Text)
- **Shapes**: `radius-stone` (Panels), `radius-pebble` (Tool Icons)
- **Typography**: `Metadata` (12px, JetBrains Mono)
</tokens>

<assets>
- **Textures**: `blueprint-grid` (Z-0)
- **Motifs**: none (purely functional)
- **Register**: Possibility
</assets>

<components>
- **EditorPanel** (stone)
  - Role: Code/Data editing area.
- **PreviewPanel** (stone)
  - Role: Visual result display.
- **ToolPebble** (pebble)
  - Role: Action icons (Save, Run, Debug).
</components>

<annotations>
1 | split_pane        | Behavior: resizable horizontal; divider=baruGold (2px).
2 | left_panel        | Content: monospaced code; Syntax: YAML/JSON; State: editing, readonly.
3 | right_panel       | Content: visual preview (Component/Canvas); State: default, loading, error.
4 | save_btn          | Action: onClick → POST /api/save; Style: radius-pebble; Location: top toolbar.
</annotations>

<notes>
- Goal: Detailed technical editing of solidarity blueprints.
</notes>
