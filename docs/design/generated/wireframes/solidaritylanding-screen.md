# Wireframe: SolidarityLanding (Screen)

<layout>
```text
┌─────────────────────────────────────────────────────────────┐
│ Z-2: {kr-asset-wheat-paste-tear} (top-right)                │
│                                                             │
│  Z-3: {kr-asset-screenprint-grit} (scattered particles)     │
│                                                             │
│         ┌─────────────────────────────────┐                │
│         │    "THE SOLIDARITY"             │  Z-1           │
│         │    "MANIFESTO"                  │                │
│         │    Slab Container               │                │
│         └─────────────────────────────────┘                │
│                                                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│    │ Build    │  │ Archive  │  │ Resist   │  Z-1          │
│    │ Stone    │  │ Stone    │  │ Stone    │               │
│    └──────────┘  └──────────┘  └──────────┘               │
│                                                             │
│                  ┌─────────────────┐                       │
│                  │ Enter / Pebble  │  Z-2                  │
│                  └─────────────────┘                       │
│                                                             │
│ Z-2: {kr-asset-halo-disk} (bottom-left, baruGold)          │
│                                                             │
│ Z-0: {kr-asset-screenprint-substrate} (25% opacity)         │
└─────────────────────────────────────────────────────────────┘
```
</layout>

<tokens>
- **Background**: `charcoalBackground` (#1A1A1A) + `screenprint-substrate` (25% opacity)
- **Primary Ink**: `baruGold` (#DAF674)
- **Typography Ink**: `kr-leafusAsh` (#DAF6B3)
- **Shapes**: `radius-slab` (Hero), `radius-stone` (Cards), `radius-pebble` (Button)
- **Typography**: `Display Hero` (144px, Recursive), `Headline` (48px, Sora), `Subhead` (24px, Inter)
</tokens>

<assets>
- **Motifs**: `wheat-paste-tear` (Z-2), `halo-disk` (Z-2, bottom-left)
- **Textures**: `screenprint-substrate` (Z-0), `screenprint-grit` (Z-3)
- **Emotional Register**: Defiance
</assets>

<components>
- **ManifestoHero** (slab)
  - Role: Primary manifesto statement container.
  - Assets: None (contained text only).
- **SolidarityCard** (stone)
  - Role: Feature highlights (Build, Archive, Resist).
  - Assets: Subtle background grit.
- **ActionButton** (pebble)
  - Role: Main entry point ("Enter").
  - Assets: Motion glow on hover.
</components>

<annotations>
1 | hero_title        | Content: "THE SOLIDARITY MANIFESTO"; Style: Display Hero (900 Slam); Alignment: centered.
2 | card_group        | Layout: mobile=1col, desktop=3col; Gutter: 24px.
3 | btn_enter         | Action: onClick → nav /auth; Style: radius-pebble; Color: baruGold.
4 | grit_ambient      | Style: opacity pulse (8s loop); Z-Index: Z-3 (highest).
5 | substrate_texture | Style: matte charcoal; Opacity: 25%; Z-Index: Z-0 (lowest).
6 | halo_disk         | Color: baruGold; Opacity: 60%; Position: bottom-left.
</annotations>

<notes>
- Emotional Register: Defiance.
- Flow: Read Manifesto → Enter Collective.
- Symbolic Anchor: Optional bhagat-singh-reference.png in corner.
</notes>
