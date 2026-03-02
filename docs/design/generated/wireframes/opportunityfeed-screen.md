# Wireframe: OpportunityFeed (Screen)

<layout>
```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "OPEN FRONT LINES" (Headline)                              │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ HIGH PRIORITY ACTION                                  │  │
│  │ Stone Item + {kr-asset-halo-disk}                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Regular Item                                          │  │
│  │ Stone Item                                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│ Z-0: {kr-asset-screenprint-substrate} (10% opacity)         │
└─────────────────────────────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `inkGold` (Accent), `solidarityRed` (Priority)
- **Shapes**: `radius-stone` (Feed Items)
- **Typography**: `Headline` (48px, Sora)
</tokens>

<assets>
- **Textures**: `screenprint-substrate` (Z-0)
- **Motifs**: `halo-disk` (Z-1, for High Priority)
- **Register**: Direct Action
</assets>

<components>
- **OpportunityItem** (stone)
  - Role: Individual job/engagement summary.
  - Assets: Priority halo (optional).
- **PriorityBadge** (pebble)
  - Role: Status indicator (High, Urgent).
</components>

<annotations>
1 | feed_list         | Layout: vertical stack; Spacing: 12px; Scroll: infinite.
2 | item_priority     | Style: border-color=solidarityRed; backdrop=halo-disk (60% opacity).
3 | item_click        | Action: onClick → nav to Detail screen.
4 | filter_chip       | Style: radius-pebble; State: selected (inkGold), default (ash).
</annotations>

<notes>
- Goal: Discover and act on high-impact roles.
</notes>
