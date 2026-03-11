# Token Enforcement Rules

This reference is the quick rulebook for `token-enforcement`.

## Canonical Sources

Allowed source of truth only:

- `frontend/src/design/tokens/tokens.json`
- `frontend/src/design/styles/design-tokens.css`

## Required Semantic Prefixes

Migration code must use:

- `--sys-color-*`
- `--sys-shape-*`
- `--sys-type-*`

## Hard Fail Patterns

- `#abc`, `#aabbcc`, `#aabbccdd`
- `rgb(...)`, `rgba(...)`
- `hsl(...)`, `hsla(...)`
- hardcoded font families such as `Inter`, `Roboto`, `Arial`
- deprecated token names:
  - `labWrenMetalBlue`
  - `GumLeafGreen`
  - `WattleGold`
  - `inkGreen`
- deprecated archetype names in new migration code:
  - `Jar`
  - `Cabinet`
  - `Seed`
  - `Leaf`

## Notes

- Passing this skill means structural token compliance only.
- Screens can still fail visual quality or typography quality after token enforcement passes.
