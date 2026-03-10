# Design Token Maintenance Guide

This document explains the token validation and build system that ensures design tokens remain complete and consistent across your Kerala Rage design system.

---

## Overview

**Single Source of Truth**: `frontend/src/design/tokens/tokens.json`

This canonical token file is:
- Written in **DTCG format** (Design Token Community Group standard)
- Contains all Kerala Rage semantic colors, typography, motion, shapes, shadows, and compliance rules
- Automatically compiled into CSS variables via `scripts/build-m3-tokens.py`
- Validated for consistency via `scripts/design-validation/validate-tokens.py`

**Deprecated**: `design-system/tokens.json` (old Material Design 3 backup - no longer maintained)

---

## File Structure

```
frontend/src/design/tokens/
  └── tokens.json                    # Primary source (DTCG format)
     ├── sys.color                   # 13 Kerala Rage semantic colors
     ├── sys.type                    # Typography, scale, emotional patterns
     ├── sys.motion                  # M3 Expressive curves + semantic patterns
     ├── sys.shape                   # Organic shape tokens
     ├── sys.shadow                  # Elevation + special effects
     ├── sys.motifs                  # Cultural reference sources
     └── sys.compliance              # Anti-slop protocol rules

frontend/src/design/styles/
  └── design-tokens.css              # Auto-generated (DO NOT EDIT)
     └── --sys-color-*               # CSS custom properties
     └── --sys-color-*-steps-N       # Tonal variations
     └── --sys-color-*-usage-N       # Semantic metadata

scripts/design-validation/
  └── validate-tokens.py             # Enhanced validator (5 checks)

scripts/
  └── build-m3-tokens.py             # Compiler: tokens.json → design-tokens.css
```

---

## Token Validation Checks

The enhanced validator runs **5 comprehensive checks**:

### 1️⃣ DTCG Compliance
Verifies `$value` and `$type` fields are present on all tokens.

```
✅ Missing $type for token at sys.color.invalidToken (has $value) — CAUGHT
```

### 2️⃣ Semantic Color Completeness
Ensures all 8 required Kerala Rage semantic colors exist:
- `charcoalBackground` (#1A1A1A)
- `solidarityRed` (#F14714)
- `kr-charcoalRed` (#F14844)
- `kr-activistSmokeGreen` (#48DA8B)
- `signalGreen` (#48F0E5)
- `inkGold` (#DAF674)
- `stencilYellow` (#F6E748)
- `worker-ash` (#DAF6B3)

```
✅ Color 'solidarityRed' base value mismatch: got #FF0000, expected #F14714 — CAUGHT
```

### 3️⃣ Typography System
Verifies required font families exist:
- `primary`: Work Sans
- `display`: Fraunces
- `mono`: JetBrains Mono

### 4️⃣ Circular References
Detects infinite loops in token aliases (e.g., Token A → Token B → Token A).

### 5️⃣ CSS Variable Consistency
**Most critical check**: Verifies all token values are present and match in `design-tokens.css`:
- Base colors (`--sys-color-{name}-base`)
- Tonal steps (`--sys-color-{name}-steps-0` through `steps-6`)
- Usage metadata (`--sys-color-{name}-usage-0` through `usage-3`)

```
✅ Missing CSS variable: --sys-color-solidarityRed-base — CAUGHT
✅ CSS step mismatch: --sys-color-solidarityRed-steps-2 = #FF00FF, expected #F14714 — CAUGHT
```

---

## How to Use

### Manual Validation

**Check tokens completeness:**
```bash
npm run tokens:validate
```

**Rebuild CSS from tokens:**
```bash
npm run tokens:build
```

**Build + Validate (recommended):**
```bash
npm run tokens:check
```

### When Editing Tokens

1. **Edit** `frontend/src/design/tokens/tokens.json`
2. **Rebuild** CSS: `npm run tokens:build`
3. **Validate**: `npm run tokens:validate`
4. **Stage** the rebuilt `design-tokens.css` file
5. **Commit** both files together

❌ **Never edit** `design-tokens.css` directly — it will be overwritten.

### Pre-commit Automation

The system **automatically**:
1. Detects changes to `frontend/src/design/tokens/tokens.json`
2. Runs `npm run tokens:build` to regenerate CSS
3. Runs `npm run tokens:validate` to check consistency
4. Auto-stages the rebuilt `design-tokens.css` file
5. **Blocks the commit** if validation fails

You'll see:
```
📋 Design tokens changed. Running validation and rebuild...
🔨 Rebuilding design tokens...
✅ Validating tokens...
✅ CSS variables rebuilt and validated. Added to staging.
```

If validation fails:
```
❌ Token validation failed. Aborting commit.
```

---

## Token Structure Reference

### Color Token Example

```json
{
  "solidarityRed": {
    "base": {
      "$value": "#F14714",
      "$type": "color",
      "$description": "Resistance heat; primary CTA energy..."
    },
    "steps": {
      "$value": ["#A02F0F", "#C03811", "#F14714", "#FF6B3D", "#FF9470", "#FFB999"],
      "$type": "colorFamily",
      "$description": "Shadow → primary → highlight progression..."
    },
    "usage": {
      "$value": ["primaryCTA", "urgentEmphasis", "screenprintInk", "haloAccents"],
      "$type": "string[]",
      "$description": "Primary buttons, key icon hits, small glows."
    }
  }
}
```

**Generates:**
```css
--sys-color-solidarityRed-base: #F14714;
--sys-color-solidarityRed-steps-0: #A02F0F;
--sys-color-solidarityRed-steps-1: #C03811;
--sys-color-solidarityRed-steps-2: #F14714;
--sys-color-solidarityRed-steps-3: #FF6B3D;
--sys-color-solidarityRed-steps-4: #FF9470;
--sys-color-solidarityRed-steps-5: #FFB999;
--sys-color-solidarityRed-usage-0: primaryCTA;
--sys-color-solidarityRed-usage-1: urgentEmphasis;
--sys-color-solidarityRed-usage-2: screenprintInk;
--sys-color-solidarityRed-usage-3: haloAccents;
```

---

## Configuration Files

### `.pre-commit-config.yaml`
Defines the `token-builder-validator` hook that:
- Triggers on changes to `frontend/src/design/tokens/tokens.json`
- Runs `npm run tokens:build` + `npm run tokens:validate`
- Runs at the `pre-commit` stage

### `.husky/pre-commit`
Orchestrates the full pre-commit workflow:
1. Detects token changes
2. Rebuilds CSS
3. Validates tokens
4. Auto-stages the rebuilt CSS file
5. Runs all other pre-commit hooks via `pre-commit` framework

---

## Troubleshooting

### ❌ "CSS variables complete but values mismatch"

**Cause**: `tokens.json` was edited but CSS wasn't rebuilt.

**Fix**:
```bash
npm run tokens:build
git add frontend/src/design/styles/design-tokens.css
```

### ❌ "Missing CSS variable: --sys-color-solidarityRed-base"

**Cause**: `build-m3-tokens.py` didn't run or failed.

**Fix**:
```bash
python3 scripts/build-m3-tokens.py  # Check for errors
npm run tokens:validate            # Verify
```

### ❌ "Semantic color missing"

**Cause**: A required color was deleted or renamed.

**Fix**: Add it back to `tokens.json` or update the validator's `REQUIRED_SEMANTIC_COLORS` dict.

### ❌ Pre-commit hook blocked my commit

This is intentional — tokens must remain consistent. Fix validation errors:

```bash
npm run tokens:check               # Identify errors
# Edit frontend/src/design/tokens/tokens.json
npm run tokens:build && npm run tokens:validate
git add frontend/src/design/tokens/tokens.json frontend/src/design/styles/design-tokens.css
git commit -m "..."
```

---

## Integration with Components

All React components consume tokens via CSS custom properties:

```tsx
// components/ui/Button.tsx
export const Button = ({ variant = "primary" }) => (
  <button
    style={{
      backgroundColor: "var(--sys-color-solidarityRed-base)",
      color: "var(--sys-color-worker-ash-base)",
    }}
  >
    Click me
  </button>
);
```

CSS:
```css
.button-primary {
  background-color: var(--sys-color-solidarityRed-base);
  color: var(--sys-color-worker-ash-base);
  box-shadow: var(--sys-shadow-elevation2Placard);
  border-radius: var(--sys-shape-radius-marchOpen);
}
```

**Never use hardcoded colors** — always reference token CSS variables.

---

## Next Steps

- ✅ All tokens are now validated automatically on commit
- ✅ CSS is rebuilt from tokens.json on each change
- ✅ Developers can run `npm run tokens:check` anytime
- ✅ Stale files have been removed (design-system/tokens.json deprecated)

**Maintenance**: Add new semantic colors to `tokens.json`, then update the validator's `REQUIRED_SEMANTIC_COLORS` dict if needed.

---

_Tokens are law. CSS variables (`--sys-color-*`) are the source of truth. Solidarity mode only._
