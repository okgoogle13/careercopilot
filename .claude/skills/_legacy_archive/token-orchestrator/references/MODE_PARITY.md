# kr-dark ↔ kr-dark Mode Parity

The kerala-rage kr-solidarity design system operates in two modes representing different emotional states.

## Contents
- [Mode philosophy](#mode-philosophy)
- [Required equivalents](#required-equivalents)
- [Checking parity](#checking-parity)
- [Common parity violations](#common-parity-violations)

---

## Mode Philosophy

**kr-dark Mode** ("The Front Parlour"):
- Emotional, colorful, wonder-filled
- Warm amber undertones
- Typography: WONK=1, SOFT=50-100
- For: Landing, Opportunities, Dashboard Hero
- Atmosphere: "Nocturnal Garden"

**kr-dark Mode** ("The Back Room"):
- Technical, structural, clinical
- Cool slate undertones
- Typography: WONK=0, SOFT=0-20
- For: Resume Analysis, Skills Extraction, Document Parsing
- Atmosphere: "The Audit"

## Required Equivalents

For each semantic token in kr-dark, a kr-dark equivalent must exist with:
- Same semantic purpose
- Different color temperature
- Equivalent contrast ratios

### Surface Parity Example

```json
{
  "color": {
    "surface": {
      "kr-dark": {
        "kr-leafSmoke": {
          "$value": "#2C2723",
          "$type": "color",
          "$description": "Primary card surface (warm)"
        }
      },
      "kr-dark": {
        "slateSmoke": {
          "$value": "#252230",
          "$type": "color",
          "$description": "Primary card surface (cool)"
        }
      }
    }
  }
}
```

Both serve as "primary card surface" but differ in warmth.

---

## Checking Parity

```bash
python scripts/check_mode_parity.py
```

**Reports**:
- Missing kr-dark equivalents
- Missing kr-dark equivalents
- Type mismatches
- Overall parity percentage (target: 100%)

**Example output**:
```
⚠️  Missing kr-dark equivalents (2):
  color.surface.kr-dark.kr-leafSmokeHighest
  color.status.kr-dark.kr-flowerOrange

📊 PARITY: 98% (340/347 tokens matched)
```

---

## Common Parity Violations

### 1. Missing kr-dark Equivalent

**Problem**:
```json
{
  "kr-dark": {
    "kr-leafSmokeHighest": { "$value": "#4A433D" }
  },
  "kr-dark": {
    // Missing equivalent
  }
}
```

**Fix**: Add kr-dark equivalent with cooler undertone:
```json
{
  "kr-dark": {
    "slateSmokeHighest": { "$value": "#3F3D4A" }
  }
}
```

### 2. Type Mismatch

**Problem**:
```json
{
  "kr-dark": {
    "cardShadow": { "$value": "0 4px 24px rgba(20,18,16,0.5)", "$type": "shadow" }
  },
  "kr-dark": {
    "cardShadow": { "$value": "#252230", "$type": "color" }
  }
}
```

**Fix**: Match types:
```json
{
  "kr-dark": {
    "cardShadow": { "$value": "0 4px 24px rgba(22,20,26,0.5)", "$type": "shadow" }
  }
}
```

### 3. Semantic Mismatch

**Problem**: kr-dark token represents "success" but kr-dark equivalent represents "warning"

**Fix**: Ensure semantic alignment across modes. Success states should map to success states.
