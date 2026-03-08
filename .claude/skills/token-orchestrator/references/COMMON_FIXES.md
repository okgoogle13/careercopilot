# Common Token Error Fixes

## Contents
- [getValue() undefined errors](#1-cannot-read-properties-of-undefined)
- [Case mismatch issues](#2-case-mismatch-kebab-case-vs-camelcase)
- [Type mismatches](#3-type-mismatch-number-vs-string)
- [Incorrect nesting](#4-incorrect-nesting)
- [Hardcoded value replacements](#5-hardcoded-values-in-components)
- [Missing token definitions](#6-missing-token-definitions)

---

## 1. "Cannot read properties of undefined (reading '$value')"

**Cause**: Token path doesn't exist or getValue() can't extract `$value`

**Diagnosis**:
```bash
# Check if token exists
grep -r "wattleGlow" frontend/src/design/tokens/tokens.json

# Run path audit
python scripts/audit_tailwind.py
```

**Before** (broken):
```typescript
// tailwind.config.ts
const colors = {
  primary: getValue('color.semantic.wattle-gold.value')
}
```

**Error**: `Cannot read properties of undefined (reading '$value')`

**After** (fixed):
```typescript
const colors = {
  primary: getValue('color.semantic.primary.kr-ink-gold')
}
```

**Result**: Resolves to `#D4A84B` correctly

**Fix getValue() helper**:

```typescript
const getValue = (path: string): any => {
  const keys = path.split('.')
  let value: any = tokens

  for (const key of keys) {
    if (!value?.[key]) {
      console.warn(`⚠️  Token not found: ${path}`)
      return path // Fallback to path string
    }
    value = value[key]
  }

  // Extract $value if DTCG format
  return value?.$value ?? value
}
```

---

## 2. Case Mismatch (kebab-case vs camelCase)

**Before** (broken):
```typescript
getValue('color.semantic.wattle-gold')
```

**Error**: Token not found

**After** (fixed):
```typescript
getValue('color.semantic.primary.kr-ink-gold')
```

Token keys use camelCase in DTCG format. Run `audit_tailwind.py` to find all mismatches.

---

## 3. Type Mismatch (number vs string)

**Before** (broken):
```json
{
  "spacing": {
    "16": 16
  }
}
```

**Error**: Dimension values must be strings with units

**After** (fixed):
```json
{
  "spacing": {
    "16": {
      "$value": "16px",
      "$type": "dimension"
    }
  }
}
```

All dimension values must be strings with units.

---

## 4. Incorrect Nesting

**Before** (broken):
```typescript
getValue('spacing.16.value')
getValue('spacing.16.$value')
```

**After** (fixed):
```typescript
getValue('spacing.16')
```

The `$value` property is extracted automatically. Don't include it in the path.

---

## 5. Hardcoded Values in Components

**Before** (hardcoded):
```css
/* Bad */
background: #D4A84B;
padding: 16px;
box-shadow: 0 4px 24px rgba(20, 18, 16, 0.5);
```

**After** (using tokens):
```css
/* Good */
background: var(--sys-color-wattle-gold);
padding: var(--sys-spacing-4);
box-shadow: var(--sys-elevation-rest);
```

Run `analyze-m3-styling-consistency.sh` to find all hardcoded values.

---

## 6. Missing Token Definitions

**Error**: `Token path not found: color.status.kr-dark.ghostGum`

**Fix**: Add to tokens.json:
```json
{
  "color": {
    "status": {
      "kr-dark": {
        "ghostGum": {
          "$value": "--sys-color-worker-ash",
          "$type": "color",
          "$description": "Success state (Corymbia aparrerinja)"
        }
      }
    }
  }
}
```

Then verify:
```bash
python scripts/audit_tailwind.py
```
