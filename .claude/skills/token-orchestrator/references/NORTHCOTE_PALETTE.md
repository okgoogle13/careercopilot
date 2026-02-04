# Northcote Curio Reference Palette

Victorian Naturalist Field Station • Australian Botanical Metaphor

## Contents
- [Primary colors](#primary-wattle-gold---acacia-pycnantha)
- [Tertiary colors](#tertiary-waratah-crimson---telopea-speciosissima)
- [Status colors](#status-colors)
- [Surfaces](#surfaces)
- [Forbidden colors](#forbidden-colors)
- [Derivation rules](#derivation-rules)
- [Usage examples](#usage-examples)

---

## Primary (Wattle Gold - Acacia pycnantha)
- `wattleShadow`: `#8B7A35` - Deep ochre, borders
- `wattleGold`: `#D4A84B` - Primary actions
- `wattleGlow`: `#E8C963` - Hover states
- `wattleBloom`: `#F5DDAA` - Subtle accents

## Tertiary (Waratah Crimson - Telopea speciosissima)
- `waratahStem`: `#7A3A2E` - Error states
- `waratahCrimson`: `#C45C4B` - Alerts, notifications
- `waratahGlow`: `#E07865` - Urgent hover
- `waratahBloom`: `#F5A89A` - Subtle warnings

## Status Colors

### Gallery Mode (Botanical)
- `ghostGum`: `#7A9E82` - Success (Corymbia aparrerinja)
- `nativeViolet`: `#9B8AAD` - Progress (Viola hederacea)
- `banksiaOrange`: `#D4885C` - Warning (Banksia serrata)

### Laboratory Mode (Clinical)
- `clinicalSage`: `#6B9E7A` - Success (cooler diagnostic)
- `clinicalAlert`: `#B85450` - Alert (diagnostic red)
- `clinicalNeutral`: `#8A8895` - Neutral/missing

## Surfaces

### Gallery Mode (Warm)
- `specimenNight`: `#1A1714` - Deepest base
- `charcoalBark`: `#141210` - Warm ironbark
- `eucalyptSmoke`: `#2C2723` - Primary card surface

### Laboratory Mode (Cool)
- `charcoalSlate`: `#16141A` - Clinical base
- `slateSmoke`: `#252230` - Cool card surface

### Shared
- `parchment`: `#F5F0E8` - Primary text on dark
- `flannelFlower`: `#A8A097` - Secondary text (Actinotus helianthi)

---

## Forbidden Colors

❌ **Electric Blue**: `#0080FF` and variants  
❌ **Neon Purple**: `#9D4EDD` and variants  
❌ **Cyan**: `#00FFFF` and variants  
❌ **Pure Black**: `#000000` (use `specimenNight`)  
❌ **Pure White**: `#FFFFFF` (use `parchment`)

---

## Derivation Rules

- ±20% lightness variation allowed from base colors
- Must maintain warm earth tone aesthetic
- Gallery mode: amber/golden undertones
- Laboratory mode: cooler slate undertones
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
