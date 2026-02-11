# Wireframe: ProfileSettings (Screen)

<layout>
```text
┌──────────────────────────────────────┐
│  {kr-asset-halo-disk}                │
│  [ AVATAR ] (Center Mask)            │
│                                      │
│  "YOUR COLLECTIVE RECORD"            │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────┐  ┌───────────┐   │
│  │ STATS STONE    │  │ BADGES    │   │
│  └────────────────┘  │ STONE     │   │
│                      └───────────┘   │
│                                      │
├──────────────────────────────────────┤
│ Z-0: {kr-asset-screenprint-substrate}│
└──────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `inkGold` (Stats), `worker-ash` (Labels)
- **Shapes**: `radius-stone` (Info blocks), `radius-pebble` (Edit button)
- **Typography**: `Subhead` (24px, Inter)
</tokens>

<assets>
- **Textures**: `screenprint-substrate` (15% opacity)
- **Motifs**: `halo-disk` (behind avatar), `botanical-motif` (badge icons)
- **Register**: Possibility
</assets>

<components>
- **ProfileAvatar** (complex)
  - Role: User image display with halo glow.
- **InfoStone** (stone)
  - Role: Data display blocks (Bio, Experience).
- **BadgePebble** (pebble)
  - Role: Skill badges.
</components>

<annotations>
1 | avatar_mask       | Style: border-radius=50%; Clip: {kr-asset-halo-disk}.
2 | stat_value        | Style: JetBrains Mono; Color: inkGold; Weight: 800.
3 | btn_edit          | Action: onClick → toggle edit mode; Style: radius-pebble.
4 | badge_hover       | Action: onHover → show badge title/date tooltip.
</annotations>

<notes>
- Goal: Manage personal identity and collective contribution history.
</notes>
