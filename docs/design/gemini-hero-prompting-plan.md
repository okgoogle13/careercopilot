# Gemini Nano Banana Pro — Hero Composition Prompting Plan

**Version:** 1.0.0  
**Target Model:** Gemini 2.0 Flash / Gemini Pro  
**System Version:** Kerala Rage v6.0  
**Last Updated:** 2026-02-12

---

## Executive Summary

This plan defines a **production-ready prompting strategy** for generating layered hero compositions using Gemini models, aligned with the Kerala Rage v6.0 manifest structure. It emphasizes modularity, explicit constraints, and batch-generation workflows.

---

## Part 1: Core Prompting Strategy

### Gemini Optimization Principles

Gemini models perform optimally when prompts:

1. **Are modular and structured** — Use clear sections with headers
2. **Repeat constraints explicitly** — Don't rely on context carryover
3. **Embed export metadata** — Include file paths and naming conventions
4. **Declare layer logic clearly** — State z-order and composition rules
5. **Avoid poetic language** — Use technical, unambiguous instructions

### Anti-Patterns to Avoid

❌ Long narrative descriptions  
❌ Implicit style references  
❌ "Make it look good" instructions  
❌ Mixing layer logic with aesthetic direction  
❌ Omitting export specifications

---

## Part 2: Production Prompt Template

### Base Template (Hero Composition)

```
PROJECT: Kerala Rage – kr-solidarity
SYSTEM VERSION: v6.0
STYLE: Screenprint illustration, Melbourne laneway texture, anti-colonial aesthetic
EXECUTION: Dark-only, English-only

OBJECTIVE:
Generate a layered hero composition combining:
- 1 spiritual OR resistance foreground asset
- 1 cultural mid-layer asset (optional)
- 1 atmospheric overlay
- 1 substrate base

LAYER ORDER (bottom to top):
1. Substrate (charcoal paper texture OR Melbourne laneway)
2. Atmospheric overlay (abstract solidarity OR paint splash)
3. [Optional] Cultural mid-layer (Kerala elephant OR landscape)
4. Foreground anchor (Shiva statue OR Bhagat Singh OR Tipu Sultan)

STYLE CONSTRAINTS:
- Screenprint ink texture (rough edges, visible grain)
- Charcoal base #1A1714
- Solidarity red #C84032 (accent only)
- Muted gold #D4A84B (highlights only)
- NO gradients
- NO glossy effects
- NO monarchy symbols
- NO bureaucracy (passports, visas, IDs)
- NO corporate stock aesthetic
- NO Aboriginal art patterns (placards only in-situ)

TYPOGRAPHY SPACE:
Reserve 35–45% negative space in upper-left quadrant for hero typography overlay.
Typography will be overlaid post-generation.

COMPOSITION RULES:
- Maximum 1 devotional (spiritual) asset per composition
- Maximum 1 portrait (resistance) asset per composition
- Street assets (placards/graffiti) must be mid-layer only, NOT above devotional
- Substrate layer is MANDATORY

EXPORT REQUIREMENTS:
- Resolution: 2560x1440
- Aspect ratio: 16:9
- Format: High-resolution PNG
- Safe margin: 120px all edges
- File name: kr-solidarity__hero__[motif-combo]__v1.png
- Save to: /assets/kr-solidarity/heroes/

SMALL UI SAFE: No (hero-only scale)

OUTPUT: Single flattened composition with all layers merged.
```

---

## Part 3: Batch Generation Workflow

### Step 1: Define Hero Registry

Create a JSON registry of desired hero compositions:

```json
{
  "batch_id": "hero-gen-001",
  "date": "2026-02-12",
  "compositions": [
    {
      "id": "devotional-anchor-hero",
      "layers": [
        { "type": "substrate", "asset": "Melbourne laneway" },
        { "type": "atmospheric", "asset": "Abstract solidarity" },
        { "type": "spiritual", "asset": "Shiva statue" }
      ],
      "filename": "kr-solidarity__hero__devotional-anchor__v1.png"
    },
    {
      "id": "resistance-portrait-hero",
      "layers": [
        { "type": "substrate", "asset": "Charcoal paper" },
        { "type": "atmospheric", "asset": "Paint splash" },
        { "type": "resistance", "asset": "Bhagat Singh" }
      ],
      "filename": "kr-solidarity__hero__resistance-portrait__v1.png"
    },
    {
      "id": "layered-solidarity-hero",
      "layers": [
        { "type": "substrate", "asset": "Melbourne laneway" },
        { "type": "atmospheric", "asset": "Abstract solidarity" },
        { "type": "cultural", "asset": "Kerala landscape" },
        { "type": "resistance", "asset": "First Nations placard" }
      ],
      "filename": "kr-solidarity__hero__layered-solidarity__v1.png"
    }
  ]
}
```

### Step 2: Generate Prompts Programmatically

Use the template above and inject specific layer configurations from the registry.

**Example Python script:**

```python
import json

template = """
[Base template from Part 2]

SPECIFIC CONFIGURATION:
Substrate: {substrate}
Atmospheric: {atmospheric}
{optional_layers}
Foreground: {foreground}

Output filename: {filename}
"""

with open('hero-registry.json') as f:
    registry = json.load(f)

for comp in registry['compositions']:
    layers = comp['layers']
    prompt = template.format(
        substrate=next(l['asset'] for l in layers if l['type'] == 'substrate'),
        atmospheric=next(l['asset'] for l in layers if l['type'] == 'atmospheric'),
        foreground=next((l['asset'] for l in layers if l['type'] in ['spiritual', 'resistance']), 'None'),
        optional_layers='\n'.join([f"{l['type'].title()}: {l['asset']}" 
                                   for l in layers if l['type'] == 'cultural']),
        filename=comp['filename']
    )
    
    # Send to Gemini API
    print(f"Generating: {comp['id']}")
    # ... API call here
```

### Step 3: Validation Checklist

After generation, verify each output:

- [ ] Contains substrate layer
- [ ] No multiple devotional assets
- [ ] No multiple portrait assets
- [ ] Street assets positioned correctly
- [ ] Typography space preserved (35-45% negative)
- [ ] Resolution matches 2560x1440
- [ ] Filename matches convention
- [ ] No forbidden imagery present

---

## Part 4: Variant Templates

### Variant A: Devotional-Focused Hero

```
FOREGROUND PRIORITY: Spiritual/mythic anchor
RECOMMENDED ASSETS:
- Shiva statue (KR-SOLID-002)
- Devotional cultural anchor (KR-SOLID-001)

ATMOSPHERIC: Minimal, 20-30% opacity
CULTURAL: Optional, used for grounding only
```

### Variant B: Resistance-Focused Hero

```
FOREGROUND PRIORITY: Historical/activist figure
RECOMMENDED ASSETS:
- Bhagat Singh (KR-SOLID-005)
- Tipu Sultan (KR-SOLID-006)
- Turbaned man (KR-SOLID-007)

ATMOSPHERIC: Bold, 40-50% opacity with multiply blend
STREET: Placard mid-layer acceptable
```

### Variant C: Cultural-Grounded Hero

```
FOREGROUND PRIORITY: Kerala symbol or landscape
RECOMMENDED ASSETS:
- Kerala elephant (KR-SOLID-009)
- Kerala landscape (KR-SOLID-010)

ATMOSPHERIC: Strong, 50-60% opacity
DEVOTIONAL/RESISTANCE: Optional overlay at reduced opacity
```

---

## Part 5: Manifest v6.0 Integration

### Asset Group Filtering

When selecting assets from manifest v6.0:

```javascript
// Filter identity assets only (exclude UI primitives)
const identityAssets = manifest.assets.filter(
  asset => asset.asset_group === 'identity'
);

// Filter by layer for composition
const substrateOptions = identityAssets.filter(
  asset => asset.layer === 'substrate'
);

const spiritualOptions = identityAssets.filter(
  asset => asset.layer === 'spiritual'
);
```

### UI Primitive Usage

UI primitives from v6.0 are **NOT** used in hero generation. They are for:
- Dashboard overlays
- Verification stamps  
- Blueprint grids
- Grit particles (micro-interactions)

Keep identity assets separate from UI primitives.

---

## Part 6: Quality Gates

### Pre-Generation Review

1. **Constraint check** — All forbidden imagery rules enforced?
2. **Layer validation** — Composition follows substrate/devotional/portrait rules?
3. **Typography space** — Negative space reserved?
4. **Export metadata** — Filename and path correct?

### Post-Generation Review

1. **Visual audit** — Screenprint aesthetic achieved?
2. **Color validation** — Palette matches (#1A1714, #C84032, #D4A84B)?
3. **Resolution check** — 2560x1440 confirmed?
4. **Manifest update** — Add new hero to manifest with metadata

---

## Part 7: Batch Script (Example)

**File:** `scripts/generate_heroes.py`

```python
#!/usr/bin/env python3
import json
import os
from google import genai

# Load manifest
with open('frontend/public/assets/kerala-rage-kr-solidarity-manifest.json') as f:
    manifest = json.load(f)

# Load hero registry
with open('scripts/hero-registry.json') as f:
    registry = json.load(f)

# Gemini client
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

for composition in registry['compositions']:
    print(f"Generating: {composition['id']}")
    
    # Build prompt from template + composition
    prompt = build_prompt(composition, manifest)
    
    # Generate image
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt
    )
    
    # Save output
    output_path = f"frontend/public/assets/kr-solidarity/heroes/{composition['filename']}"
    save_image(response, output_path)
    
    print(f"✅ Saved: {output_path}")
```

---

## Part 8: Success Metrics

Track these KPIs:

| Metric | Target | Measurement |
|--------|--------|-------------|
| First-pass quality rate | >80% | Manual review |
| Constraint adherence | 100% | Automated validation |
| Typography space preserved | >90% | Automated measurement |
| Batch generation time | <5min/asset | Timer |

---

## Next Steps

1. **Implement hero-registry.json** — Define 5-10 initial compositions
2. **Write validation script** — Automate constraint checking
3. **Generate batch** — Run first production batch
4. **Update manifest** — Add generated heroes to v6.0 manifest
5. **Test integration** — Verify LayeredHero component renders correctly

---

## Appendix A: Complete v6.0 Asset Categories

### Identity Assets (33 total)

| Category | Layer | Count | Example IDs |
|----------|-------|-------|-------------|
| Devotional | spiritual | 4 | KR-SOLID-001 to 004 |
| Portrait | resistance | 4 | KR-SOLID-005 to 008 |
| Symbol | cultural | 2 | KR-SOLID-009 to 010 |
| Abstract | atmospheric | 18 | KR-SOLID-011 to 028 |
| Street | resistance | 3 | KR-SOLID-030 to 032 |
| Texture | substrate | 1 | KR-SOLID-033 |

### UI Primitives (7 total)

| Category | Layer | Count | Example IDs |
|----------|-------|-------|-------------|
| Wheat Paste | ui-structural | 1 | KR-UI-001 |
| Halo | ui-structural | 2 | KR-UI-002 to 003 |
| Grit | atmospheric | 1 | KR-UI-004 |
| Substrate | substrate | 1 | KR-UI-005 |
| Blueprint | ui-structural | 1 | KR-UI-006 |
| Stamp | ui-structural | 1 | KR-UI-007 |

---

## Appendix B: Prompt Length Guidelines

| Model | Max Tokens | Recommended Length |
|-------|------------|-------------------|
| Gemini 2.0 Flash | 1M | 800-1200 tokens |
| Gemini Pro | 2M | 1200-2000 tokens |

Keep prompts focused. Use references to manifest instead of repeating full asset lists.

---

**Document Status:** Production-ready  
**Approval Required:** Design lead sign-off before batch generation  
**Related:** `heroComposer.ts`, `kr-solidarity-manifest.json`, `LayeredHero.tsx`
