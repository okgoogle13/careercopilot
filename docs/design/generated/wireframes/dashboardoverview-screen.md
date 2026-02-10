# Wireframe: DashboardOverview (Screen)

<layout>
```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "COMMAND CENTRE" (Headline)                                │
│                                                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│    │ Active   │  │ Success  │  │ Impact   │               │
│    │ Slab     │  │ Slab     │  │ Slab     │               │
│    └──────────┘  └──────────┘  └──────────┘               │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ RECENT DEVELOPMENTS                                   │  │
│  │ Stone Container (Z-1)                                 │  │
│  │                                                       │  │
│  │ - [Event 1]                                           │  │
│  │ - [Event 2]                                           │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│ Z-0: {kr-asset-blueprint-grid} (8% opacity)                 │
└─────────────────────────────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `baruGold` (Headline), `white` (Substance)
- **Shapes**: `radius-slab` (Stat Summary), `radius-stone` (Event Feed)
- **Typography**: `Headline` (48px, Sora)
</tokens>

<assets>
- **Textures**: `blueprint-grid` (Z-0)
- **Motifs**: `screenprint-grit` (ambient overlay)
- **Register**: Direct Action
</assets>

<components>
- **StatSlab** (slab)
  - Role: High-level metric display.
- **ActivityFeed** (stone)
  - Role: List of recent record changes.
</components>

<annotations>
1 | metric_value      | Style: Recursive 900 Slam; Color: baruGold; Size: 72px.
2 | event_item        | Behavior: onHover → underline; onClick → nav to event source.
3 | layout_grid       | Breakpoints: mobile=1col, desktop=2col (stats top, feed bottom).
4 | grit_ambient      | Style: static noise overlay (5% opacity); Z-Index: Z-3.
</annotations>

<notes>
- Goal: High-level situational awareness for the user.
</notes>
