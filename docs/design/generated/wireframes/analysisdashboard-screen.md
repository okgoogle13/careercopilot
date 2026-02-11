# Wireframe: AnalysisDashboard (Screen)

<layout>
```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "IDENTIFIED SKILL SETS" (Headline)                         │
│                                                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│    │ Skill A  │  │ Skill B  │  │ Skill C  │               │
│    │ Stone    │  │ Stone    │  │ Stone    │               │
│    └──────────┘  └──────────┘  └──────────┘               │
│                                           Z-1               │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│    │ Skill D  │  │ Skill E  │  │ Skill F  │               │
│    │ Stone    │  │ Stone    │  │ Stone    │               │
│    └──────────┘  └──────────┘  └──────────┘               │
│                                                             │
│ Z-0: {kr-asset-blueprint-grid} (12% opacity)                │
└─────────────────────────────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `inkGold` (Data Viz), `charcoalBackground` (Base)
- **Shapes**: `radius-stone` (Skill Tiles)
- **Typography**: `Headline` (48px, Sora)
</tokens>

<assets>
- **Textures**: `blueprint-grid` (Z-0)
- **Motifs**: `botanical-motif` (small accents on high-mastery skills)
- **Register**: Possibility
</assets>

<components>
- **SkillTile** (stone)
  - Role: Individual skill visualization.
  - Assets: Botanical motif for 'Elite' skills.
- **MasteryVisualizer** (complex)
  - Role: Radial/Hex graph inside tile.
</components>

<annotations>
1 | skill_grid        | Layout: mobile=2col, desktop=3col or 4col; Gutter: 16px.
2 | tile_interaction  | Action: onClick → show detailed breakdown modal; onHover → scale 105%.
3 | botanical_accent  | Condition: Mastery > 90%; Position: top-right corner of tile.
4 | grid_foundation   | Style: blueprint-grid (Z-0); Opacity: 12%.
</annotations>

<notes>
- Goal: Visualize extracted skills and identify gaps.
</notes>
