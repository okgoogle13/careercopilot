# Wireframe: ApplicationFormFlow (Screen)

<layout>
```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "SUBMIT ENGAGEMENT" (Headline)                             │
│                                                             │
│              ┌─────────────────────────┐                   │
│              │                         │                   │
│              │    STEP 1: MOTIVATION   │                   │
│              │    Stone Container      │                   │
│              │                         │                   │
│              │    [ TEXT AREA ]        │                   │
│              │    Pebble Input         │                   │
│              │                         │                   │
│              └─────────────────────────┘                   │
│                                                             │
│              ┌─────────────────────────┐                   │
│              │  {kr-asset-halo-disk}   │                   │
│              │  (Behind Submit button) │                   │
│              └─────────────────────────┘                   │
│                                                             │
│ Z-0: {kr-asset-screenprint-substrate} (10% opacity)         │
└─────────────────────────────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `inkGold` (Labels), `white` (Input text)
- **Shapes**: `radius-stone` (Form Container), `radius-pebble` (Inputs/Button)
- **Typography**: `Headline` (48px, Sora)
</tokens>

<assets>
- **Textures**: `screenprint-substrate` (Z-0)
- **Motifs**: `halo-disk` (Z-1, behind primary action)
- **Register**: Trust
</assets>

<components>
- **FormContainer** (stone)
  - Role: Multi-step form wrapper.
- **PebbleInput** (pebble)
  - Role: Text/Data entry fields.
- **StepIndicator** (dots)
  - Role: Visual progress.
</components>

<annotations>
1 | text_area         | Action: onChange → validate length; State: default, focus, error; Max-Chars: 1000.
2 | btn_next          | Action: onClick → validate + next step; Style: radius-pebble; Animation: Slide.
3 | btn_submit        | Action: onClick → POST /api/applications; Style: radius-pebble; Color: inkGold.
4 | success_overlay    | State: visible on code 201; content: "Engagement Recorded"; Style: full-screen blur with botanical motif.
</annotations>

<notes>
- Goal: Submit formal engagement request for a role.
</notes>
