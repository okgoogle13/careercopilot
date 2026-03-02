# Wireframe: KanbanBoard (Screen)

<layout>
```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "CAMPAIGN PROGRESS" (Headline)                             │
│                                                             │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │ TO-DO    │ ACTIVE   │ BLOCKED  │ RESOLVED │             │
│  │ {Stone}  │ {Stone}  │ {Stone}  │ {Stone}  │             │
│  │          │          │          │          │             │
│  │ [Card]   │ [Card]   │ [Card]   │ [Card]   │             │
│  │          │          │          │          │             │
│  └──────────┴──────────┴──────────┴──────────┘             │
│                                                             │
│ Z-0: {kr-asset-blueprint-grid} (6% opacity)                 │
└─────────────────────────────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `inkGold` (Headers), `worker-ash` (Cards)
- **Shapes**: `radius-stone` (Columns/Cards), `radius-pebble` (Action Buttons)
- **Typography**: `Headline` (48px, Sora)
</tokens>

<assets>
- **Textures**: `blueprint-grid` (Z-0)
- **Motifs**: `[DEPRECATED_STYLE]-motif` (accents on completed/resolved cards)
- **Register**: Direct Action
</assets>

<components>
- **KanbanColumn** (stone)
  - Role: Vertical status container.
- **KanbanCard** (stone)
  - Role: Task/Engagement summary.
  - Assets: priority indicator (dot).
</components>

<annotations>
1 | column_header     | Style: uppercase; Weight: 800; Color: inkGold.
2 | card_drag         | Action: onDragStart → set active; onDrop → update status; State: dragging, idle.
3 | add_btn           | Action: onClick → open New Task modal; Style: radius-pebble.
4 | column_scroll     | Behavior: independent vertical overflow; Scrollbar: hidden/minimal.
</annotations>

<notes>
- Goal: Manage the execution of specific solidarity campaigns.
</notes>
