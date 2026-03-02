# Wireframe: Settings (Screen)

<layout>
```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "SYSTEM PARAMETERS" (Headline)                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ CATEGORY: IDENTITY                                    │  │
│  │ Stone Container                                         │  │
│  │                                                       │  │
│  │ - [ Setting 1 ] Pebble Toggle                         │  │
│  │ - [ Setting 2 ] Pebble Input                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│ Z-0: {kr-asset-screenprint-substrate} (5% opacity)          │
└─────────────────────────────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `inkGold` (Category Labels), `worker-ash` (Substance)
- **Shapes**: `radius-stone` (Group Wrapper), `radius-pebble` (Toggles)
- **Typography**: `Headline` (48px, Sora)
</tokens>

<assets>
- **Textures**: `screenprint-substrate` (Z-0)
- **Motifs**: none.
- **Register**: Trust
</assets>

<components>
- **SettingsGroup** (stone)
  - Role: Logically related setting items.
- **PebbleToggle** (pebble)
  - Role: Boolean switch.
- **PebbleSelect** (pebble)
  - Role: Dropdown/Selection.
</components>

<annotations>
1 | toggle_logic       | Action: onClick → PATCH /api/settings; State: on (inkGold), off (ash).
2 | input_validation   | Action: onBlur → validate; State: default, focus, error.
3 | section_header     | Style: uppercase Sora; Color: inkGold; Border-Bottom: 1px activistAsh.
4 | reset_btn          | Action: onClick → confirm → revert all; Style: radius-pebble; Border: 1px solidarityRed.
</annotations>

<notes>
- Goal: Configure privacy, notification, and system preferences.
</notes>
