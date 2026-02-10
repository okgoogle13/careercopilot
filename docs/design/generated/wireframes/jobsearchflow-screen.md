# Wireframe: JobSearchFlow (Screen)

<layout>
```text
┌──────────────────────────────────────┐
│  [ SEARCH THE COLLECTIVE ]           │
│  Pebble Search Bar                   │
├───────┬──────────────────────────────┤
│       │                              │
│FILTER │  RESULTS (Z-1 Stone Items)   │
│STONE  │                              │
│       │                              │
├───────┴──────────────────────────────┤
│ Z-0: {kr-asset-blueprint-grid}       │
└──────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `baruGold` (Interaction), `kr-leafusAsh` (Subhead)
- **Shapes**: `radius-stone` (Sidebar/Items), `radius-pebble` (Inputs)
- **Typography**: `Subhead` (24px, Inter)
</tokens>

<assets>
- **Textures**: `blueprint-grid` (8% opacity)
- **Icon set**: `Solidarity-Icon-Pack` (filter, sort, search)
</assets>

<components>
- **SearchBar** (pebble)
  - Role: Keyword input.
- **FilterSidebar** (stone)
  - Role: Refine search options.
- **ResultItem** (stone)
  - Role: Job result summary.
</components>

<annotations>
1 | search_input      | Action: onKeyUp (debounce 300ms) → filter results; Style: radius-pebble.
2 | filter_toggle     | Behavior: multi-select; onToggle → refresh feed.
3 | result_click      | Action: onClick → nav /opportunity/:id.
4 | empty_state       | Content: "No Front Lines Found"; Style: italic leafusAsh.
</annotations>

<notes>
- Goal: Granular tactical search of the job database.
</notes>
