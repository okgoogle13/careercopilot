# DOC-009 Token Gap Analysis

**Purpose**: Formalize "Ghost Tokens" found in the wild (DOC-008 specs that don't exist in code).

## 1. Typography Gaps

### `typography.scale.displayHero`

- **Context**: Page 1 (Landing) - Main "Resurrection" text.
- **Spec**: kr-serif-bold, 96px, 700 weight.
- **Current State**: Missing. Uses `displayLarge` (48px) or custom overrides.
- **Action**: Add to `tokens.json`.

### `typography.scale.metricDisplay`

- **Context**: Page 5 (Analysis) & Page 7 (Kanban) - Big Numbers.
- **Spec**: Work Sans or JetBrains Mono, 120px-200px, **200 (Thin) Weight**.
- **Current State**: Missing. Code uses `font-bold` (700) or generic large text.
- **Action**: Add to `tokens.json` with explicit `fontWeight: 200`.

## 2. Color/Mode Gaps

### `color.semantic.surface.kr-dark.slateSmoke`

- **Context**: Page 4 (Drop Zone) & Page 5 (Cards).
- **Spec**: Distinct "kr-dark" dark mode background, cooler/bluer than kr-dark charcoal.
- **Current State**: Ambiguous. Code often reuses `concrete-grey` (kr-dark).
- **Action**: Define explicit Lab palette to prevent mode contamination.

### `color.semantic.border.kr-dark.charcoalSlate`

- **Context**: Page 4 Drop Zone Border.
- **Spec**: Technical border color.
- **Action**: Define explicit token.

## 3. Shape Gaps

### `shape.organicAsymmetry.seed`

- **Context**: Page 6 (Match Badges).
- **Spec**: Small, organic shape for badges.
- **Current State**: Uses `radius-pebble` or `rounded-full`.
- **Action**: Verify if `radius-seed` exists (it seems to be in `tokens.json` as `8px 4px 10px 6px` - need to verify usage).
