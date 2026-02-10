# Wireframe: Onboarding (Screen)

<layout>
```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         "CHOOSE YOUR SOLIDARITY PATH"                       │
│         Display Large (Recursive, 72px)                     │
│                                                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│    │ Tech     │  │ Care     │  │ Creative │               │
│    │ Worker   │  │ Worker   │  │ Worker   │               │
│    │ Stone    │  │ Stone    │  │ Stone    │               │
│    └──────────┘  └──────────┘  └──────────┘               │
│                                                             │
│ Z-0: {kr-asset-blueprint-grid} (8% opacity)                 │
└─────────────────────────────────────────────────────────────┘
```
</layout>

<tokens>
- **Ink**: `baruGold` (Accent), `kr-leafusAsh` (Body)
- **Shapes**: `radius-stone` (Selection Cards)
- **Typography**: `Display Large` (72px, Recursive) for Headline
</tokens>

<assets>
- **Textures**: `blueprint-grid` (8% opacity, Z-0)
- **Register**: Possibility
</assets>

<components>
- **OnboardingHeadline** (text)
  - Role: Page title.
- **PathCard** (stone)
  - Role: Role selection (Tech, Care, Creative).
  - Assets: subtle Role-specific icons (botanical/blueprint).
</components>

<annotations>
1 | page_headline     | Content: "CHOOSE YOUR SOLIDARITY PATH"; Style: Recursive 800; Color: kr-leafusAsh.
2 | card_selection    | Behavior: single select; onHover → border glow; onClick → next step.
3 | layout_grid       | Screen Area: centered horizontal 3-column.
4 | grid_bg           | Style: blueprint-grid; Opacity: 8%; Z-Index: Z-0.
</annotations>

<notes>
- Emotional Register: Possibility.
- Goal: Select user persona for system tailoring.
</notes>
