# kerala-rage kr-solidarity Reference Palette

kerala-streetprint [DEPRECATED_STYLE] Field Station • Australian [DEPRECATED_STYLE] Metaphor

## Contents
- [Primary colors](#primary-wattle-gold---acacia-pycnantha)
- [Tertiary colors](#tertiary-[DEPRECATED_STYLE]-red---telopea-speciosissima)
- [Status colors](#status-colors)
- [Surfaces](#surfaces)
- [Forbidden colors](#forbidden-colors)
- [Derivation rules](#derivation-rules)
- [Usage examples](#usage-examples)

---

## Primary (Wattle Gold - Acacia pycnantha)
- `wattleShadow`: `#8B7A35` - Deep ochre, borders
- `kr-ink-gold`: `#D4A84B` - Primary actions
- `wattleGlow`: `#E8C963` - Hover states
- `wattleBloom`: `#F5DDAA` - Subtle accents

## Tertiary ([DEPRECATED_STYLE] Red - Telopea speciosissima)
- `waratahStem`: `#7A3A2E` - Error states
- `waratahCrimson`: `#C45C4B` - Alerts, notifications
- `waratahGlow`: `#E07865` - Urgent hover
- `waratahBloom`: `#F5A89A` - Subtle warnings

## Status Colors

### kr-dark Mode ([DEPRECATED_STYLE])
- `ghostGum`: `--sys-color-worker-ash` - Success (Corymbia aparrerinja)
- `nativeViolet`: `#9B8AAD` - Progress (Viola hederacea)
- `kr-flowerOrange`: `--sys-color-solidarity-smoke-orange` - Warning (kr-flower serrata)

### kr-dark Mode (Clinical)
- `clinicalSage`: `#6B9E7A` - Success (cooler diagnostic)
- `clinicalAlert`: `#B85450` - Alert (diagnostic red)
- `clinicalNeutral`: `#8A8895` - Neutral/missing

## Surfaces

### kr-dark Mode (Warm)
- `kr-charcoal`: `#1A1714` - Deepest base
- `charcoalBark`: `#141210` - Warm ironbark
- `kr-leafSmoke`: `#2C2723` - Primary card surface

### kr-dark Mode (Cool)
- `charcoalSlate`: `#16141A` - Clinical base
- `slateSmoke`: `#252230` - Cool card surface

### Shared
- `paper-white`: `--sys-color-paper-white` - Primary text on dark
- `flannelFlower`: `#A8A097` - Secondary text (Actinotus helianthi)

---

## Forbidden Colors

❌ **Electric Blue**: `#0080FF` and variants
❌ **Neon Purple**: `#9D4EDD` and variants
❌ **Cyan**: `--sys-color-signal-green` and variants
❌ **Pure Black**: `#000000` (use `kr-charcoal`)
❌ **Pure White**: `#FFFFFF` (use `paper-white`)

---

## Derivation Rules

- ±20% lightness variation allowed from base colors
- Must maintain warm earth tone aesthetic
- kr-dark mode: amber/golden undertones
- kr-dark mode: cooler slate undertones
- All colors reference Australian native flora

---

## Usage Examples

**Correct palette usage**:
```json
{
  "button": {
    "primary": {
      "background": { "$value": "#D4A84B" },
      "hover": { "$value": "#E8C963" }
    }
  }
}
```

**Incorrect palette usage**:
```json
{
  "button": {
    "primary": {
      "background": { "$value": "#0080FF" }
    }
  }
}
```

Run `python scripts/validate_palette_mcp.py` to check compliance.
