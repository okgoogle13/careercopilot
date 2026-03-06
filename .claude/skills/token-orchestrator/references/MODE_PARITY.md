# [ARCHIVE] Mode Parity (Abolished v6.0)

> [!CAUTION]
> **ABOLISHED STATUS**: Mode Parity (Gallery vs Laboratory) was officially abolished in KR Solidarity v6.0.
> The system now enforces a **Single Mode: Solidarity**.
> This document remains for historical auditing purposes only.

---

## Historical Context
The Northcote Curio design system previously operated in two modes representing different emotional states. This was replaced by the unified Kerala Rage "Agit-Prop" aesthetic.

### 1. Mode Philosophy (Legacy)

**Gallery Mode** ("The Front Parlour"):
- Emotional, colorful, wonder-filled
- Warm amber undertones
- Typography: WONK=1, SOFT=50-100
- For: Landing, Opportunities, Dashboard Hero
- Atmosphere: "Nocturnal Garden"

**Laboratory Mode** ("The Back Room"):
- Technical, structural, clinical
- Cool slate undertones
- Typography: WONK=0, SOFT=0-20
- For: Resume Analysis, Skills Extraction, Document Parsing
- Atmosphere: "The Audit"

### 2. Required Equivalents (Legacy)

For each semantic token in Gallery, a Laboratory equivalent must exist with:
- Same semantic purpose
- Different color temperature
- Equivalent contrast ratios

#### Surface Parity Example

```json
{
  "color": {
    "surface": {
      "gallery": {
        "eucalyptSmoke": {
          "$value": "#2C2723",
          "$type": "color",
          "$description": "Primary card surface (warm)"
        }
      },
      "laboratory": {
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

### 3. Checking Parity (Legacy)

```bash
python scripts/check_mode_parity.py
```

**Reports**:
- Missing Laboratory equivalents
- Missing Gallery equivalents
- Type mismatches
- Overall parity percentage (target: 100%)

**Example output**:
```
⚠️  Missing Laboratory equivalents (2):
  color.surface.laboratory.eucalyptSmokeHighest
  color.status.laboratory.banksiaOrange

📊 PARITY: 98% (340/347 tokens matched)
```

---

### 4. Common Parity Violations (Legacy)

#### 1. Missing Laboratory Equivalent

**Problem**:
```json
{
  "gallery": {
    "eucalyptSmokeHighest": { "$value": "#4A433D" }
  },
  "laboratory": {
    // Missing equivalent
  }
}
```

**Fix**: Add Laboratory equivalent with cooler undertone:
```json
{
  "laboratory": {
    "slateSmokeHighest": { "$value": "#3F3D4A" }
  }
}
```

#### 2. Type Mismatch

**Problem**:
```json
{
  "gallery": {
    "cardShadow": { "$value": "0 4px 24px rgba(20,18,16,0.5)", "$type": "shadow" }
  },
  "laboratory": {
    "cardShadow": { "$value": "#252230", "$type": "color" }
  }
}
```

**Fix**: Match types:
```json
{
  "laboratory": {
    "cardShadow": { "$value": "0 4px 24px rgba(22,20,26,0.5)", "$type": "shadow" }
  }
}
```

#### 3. Semantic Mismatch

**Problem**: Gallery token represents "success" but Laboratory equivalent represents "warning"

**Fix**: Ensure semantic alignment across modes. Success states should map to success states.
