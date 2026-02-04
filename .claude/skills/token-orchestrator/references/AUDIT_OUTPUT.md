# Sample Audit Output Formats

Reference guide for understanding script outputs.

## Contents
- [audit_structure.py](#audit_structurepy)
- [audit_tailwind.py](#audit_tailwindpy)
- [validate_palette_mcp.py](#validate_palette_mcppy)
- [check_mode_parity.py](#check_mode_paritypy)
- [analyze-m3-styling-consistency.sh](#analyze-m3-styling-consistencysh)

---

## audit_structure.py

**Success output**:
```
✓ All tokens have $value and $type
✓ Valid color formats (hex, rgb, hsl)
✓ Dimension values have units
✓ No circular alias references
✓ WCAG AA contrast ratios met

✅ Structure validation passed
Exit code: 0
```

**Error output**:
```
❌ Missing $value property: color.primary.wattleGold
❌ Invalid dimension (no units): spacing.16 = 16
❌ Circular reference detected: color.alias.primary → color.alias.base → color.alias.primary
⚠️  Low contrast (3.2:1): parchment on eucalyptSmoke (requires 4.5:1)

❌ Structure validation failed
Exit code: 1
```

---

## audit_tailwind.py

**Success output**:
```
✓ All getValue() paths resolve correctly
✓ All $value properties extracted successfully

✅ Tailwind integration validated
Exit code: 0
```

**Error output**:
```
❌ Token path not found: color.semantic.wattle-gold.value
   → Should be: color.semantic.primary.wattleGold
❌ getValue() returned undefined: spacing.16.$value
   → Should be: spacing.16
⚠️  Case mismatch: eucalypt-smoke vs eucalyptSmoke

❌ Found 3 getValue() errors
Exit code: 1
```

---

## validate_palette_mcp.py

**Output**:
```
📊 Northcote Palette Compliance Score: 87/100

Dimension Scores:
✓ Geographic Authenticity: 95/100 (Australian botanical names)
✓ Translucency Physics: 90/100 (Glassmorphism present)
✓ Scale Hierarchy: 85/100 (Display→body typography)
⚠️ Density Zones: 72/100 (Gallery/Lab contrast needs work)
✓ Background Color: 100/100 (#1A1714 specimen night)
✓ Typography: 88/100 (Fraunces, Libre Bodoni, Work Sans)

Violations:
❌ Electric blue detected: button.accent = #0080FF
⚠️ Pure black used: border.divider = #000000 (use specimenNight)

Exit code: 0 (score >= 85)
```

---

## check_mode_parity.py

**Success output**:
```
✓ All Gallery tokens have Laboratory equivalents
✓ All Laboratory tokens have Gallery equivalents
✓ Type consistency maintained

✅ Mode parity: 100% (347/347 tokens matched)
Exit code: 0
```

**Error output**:
```
⚠️  Missing Laboratory equivalents (2):
  color.surface.laboratory.eucalyptSmokeHighest
  color.status.laboratory.banksiaOrange

⚠️  Type mismatch (1):
  gallery.cardShadow: shadow
  laboratory.cardShadow: color

📊 Mode parity: 98% (340/347 tokens matched)
Exit code: 2
```

---

## analyze-m3-styling-consistency.sh

**Output**:
```
Component: src/components/Button.tsx
  Hardcoded colors: 3
    Line 45: background: #D4A84B;
    Line 52: color: rgb(26, 23, 20);
    Line 58: border: 1px solid rgba(212, 168, 75, 0.12);
  Hardcoded spacing: 2
    Line 47: padding: 16px;
    Line 63: margin: 24px 32px;
  Token usage: 12/17 (71%)

Component: src/components/Card.tsx
  Hardcoded colors: 0
  Hardcoded spacing: 0
  Token usage: 23/23 (100%)

Summary:
  Total components scanned: 47
  Components with hardcoded values: 12
  Average token usage: 89%
```
