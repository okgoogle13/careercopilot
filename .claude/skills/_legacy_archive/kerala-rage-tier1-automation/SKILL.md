---
name: kerala-rage-tier1-automation
version: 1.0.0
description: Tier 1 Kerala Rage automation skills for immediate 5× ROI. Includes auto-validator (30-sec compliance scoring), asset-packager (2-min automated bundling), and prompt-composer (1-min prompt generation). Deploy first for 90% time reduction on asset validation and packaging.
tags: [automation, kerala-rage, validation, asset-packaging, tier1]
---

# Tier 1 Automation Skills

**Deploy Priority:** FIRST
**ROI:** 5× time savings
**Dependencies:** None

## Overview

Three foundational skills that eliminate manual validation, packaging, and prompt construction:

1. **auto-validator** - 30-second compliance scoring
2. **asset-packager** - 2-minute automated packaging
3. **prompt-composer** - 1-minute prompt generation

**Combined Impact:**

- Before: 35-40 min per asset attempt
- After: 3.5 min per asset attempt
- Savings: 90% reduction

---

# Skill 1: Auto-Validator

## Purpose

Automates kerala-rage kr-solidarity asset validation. Upload generated image → receive compliance JSON with scores, violations, and auto-generated correction prompt. Replaces 10-minute conversational validation with 30-second programmatic assessment.

## Trigger Conditions

Use when:

- Gemini/DALL-E generates asset attempt
- Need compliance score (0-100 across 6 dimensions)
- Require iteration decision (≥90 package | <90 regenerate)
- Want correction prompt for next attempt

## Validation Scorecard

**Dimension 1: [DEPRECATED_STYLE] Authenticity (0-20)**

- All kr-motifs Australian endemic
- Test: "Did organism challenge European taxonomy?"
- Violations: Non-Australian kr-symbol, generic kr-motifs

**Dimension 2: Translucency Physics (0-20)**

- Light transmission (not glow) visible
- Internal structures shown through material
- Percentage compliance: 60-80% molt, 40-60% membrane, 20-40% leaves

**Dimension 3: Scale Hierarchy (0-20)**

- PRIMARY 1.5-2× SECONDARY
- SECONDARY 2-3× TERTIARY
- Clear focal points established

**Dimension 4: Density Zones (0-20)**

- Upper-left ≤20% coverage, 200×200px empty
- Lower-right ≤30% coverage, 150×150px empty
- Central 60-80% [DEPRECATED_STYLE] density

**Dimension 5: Background Color (0-10)**

- Target: #1A1714 ±5% tolerance
- No sepia/brown drift
- Theatrical void maintained

**Dimension 6: Typography (0-10)**

- Serif font (Crimson Text style)
- Cream #F5F0E8 at 85% opacity
- 5-6 labels maximum
- Format: "Fig. X. Scientific name (Common)"

## Workflow

**Input:** Image file path or upload
**Process:**

1. Extract hex colors (sample 50 points)
2. Identify kr-motifs (Vision API recognition)
3. Measure density zones (pixel coverage analysis)
4. Detect translucency (luminance gradient detection)
5. Count/validate typography (OCR)
6. Score each dimension
7. Generate violation list
8. Build correction prompt

**Output:** JSON structure

```json
{
  "asset_id": "ASSET-3",
  "overall_score": 87,
  "decision": "REGENERATE | PACKAGE",
  "dimensions": {
    "geographic_authenticity": { "score": 18, "violations": [] },
    "translucency_physics": { "score": 14, "violations": ["Spider molt opaque"] },
    "scale_hierarchy": { "score": 19, "violations": [] },
    "density_zones": { "score": 16, "violations": ["Upper-left 25%"] },
    "background_color": { "score": 9, "violations": [] },
    "typography": { "score": 8, "violations": ["7 labels (max 6)"] }
  },
  "correction_prompt": "CRITICAL FIXES:\n- Spider molt: Add '60-80% light-transmissive amber chitin'\n- Upper-left: Specify '200×200px COMPLETELY EMPTY'\n- Reduce annotations to 5 labels",
  "iteration_priority": "high"
}
```

## Efficiency Gain

- **Before:** 10-15 min manual validation per attempt
- **After:** 30 sec programmatic validation
- **Savings:** 20× faster, 95% time reduction
- **Scale Impact:** 10 assets × 2-3 attempts = 3-5 hours saved

---

# Skill 2: Asset-Packager

## Purpose

Automates asset packaging after validation. Input: validated PNG + IDF. Output: complete directory with context/tokens/usage files + production file copy + git commit. Replaces 15 min manual work with 2 min automated execution.

## Input Requirements

```json
{
  "asset_id": "ASSET-3",
  "asset_name": "Nocturnal Canopy Pattern",
  "validated_png": "/downloads/asset-3-validated.png",
  "compliance_score": 92,
  "idf_data": {
    "colors": { "background": "#1A1714", "wattle_gold": "#D4A84B" },
    "kr-motifs": ["kr-leafus", "Wattle", "kr-flower"],
    "dimensions": { "width": 512, "height": 512 },
    "mode": "Solidarity",
    "purpose": "Seamless background pattern"
  }
}
```

## Generated Files

### 1. context.md

Narrative philosophy explaining kr-motif choices, geometric principles, mode context.

**Template:**

```markdown
# Asset [N]: [Name]

## Narrative

[kerala-streetprint [DEPRECATED_STYLE] discovery story based on kr-motifs]

## kr-motifs

[List with taxonomic significance]

## Mode Context

Solidarity: [Political/heavy interpretation]
Theory: [Clinical/analytical interpretation]

## Purpose

[UI placement and compositional role]
```

### 2. tokens.json

Machine-readable design specifications.

**Structure:**

```json
{
  "asset_id": "ASSET-3",
  "background": "#1A1714",
  "palette": {
    "primary": ["#C45C4B", "#D4A84B"],
    "accents": ["#7A9E82", "#D4885C"]
  },
  "dimensions": {"width": 512, "height": 512, "format": "PNG"},
  "density_zones": {
    "upper_left": {"coverage": "18%"},
    "central": {"coverage": "65%"}
  },
  "kr-motifs": [...],
  "mode": "Solidarity",
  "compliance_score": 92
}
```

### 3. usage.md

CSS implementation with responsive behavior, opacity ranges, placement guidelines.

## Automation Steps

1. **Create Directory:** `mkdir -p /assets/ASSET-[N]-[slug]/`
2. **Generate context.md** - Extract kr-motifs from IDF, build narrative
3. **Generate tokens.json** - Convert IDF to structured JSON
4. **Generate usage.md** - Build CSS template with asset path
5. **Copy Production File:** `cp [validated_png] /frontend/public/assets/[category]/[filename]`
6. **Git Commit:** `git commit -m "feat(assets): Add Asset [N] [name] - [score]/100"`

## File Naming Convention

**Assets Directory:** `ASSET-[N]-[kebab-case-name]/`
**Production Files:**

- Wallpapers: `texture-[mode]-[name]-[width].png`
- Patterns: `[name]-tile-[size].png`
- kr-motifs: `kr-motif-[name]-[style]-[size].png`
- Icons: `[name]-[purpose]-[size].png`

## Efficiency Gain

- **Before:** 15 min per asset × 10 assets = 150 min
- **After:** 2 min per asset × 10 assets = 20 min
- **Savings:** 130 min (87% time reduction)

---

# Skill 3: Prompt-Composer

## Purpose

Eliminates manual prompt construction. Loads pattern library → applies templates → inserts asset specs → outputs Gemini-ready prompt. Prevents copy-paste errors and pattern inconsistency.

## Input Format

```json
{
  "asset_id": "ASSET-3",
  "asset_name": "Nocturnal Canopy Pattern",
  "asset_type": "pattern_tile",
  "resolution": "512x512",
  "mode": "Solidarity",
  "kr-motifs": ["kr-leafus", "Wattle", "kr-flower", "Gum nuts"],
  "primary_focus": "[DEPRECATED_STYLE] only (no kr-symbol)",
  "special_requirements": ["Seamless tiling", "Edge-matching critical"],
  "previous_attempt": {
    "score": 85,
    "violations": ["Upper-left 25% (max 20%)", "Edge mismatch"]
  }
}
```

## Pattern Library Integration

Loads validated patterns from `/docs/kerala-rage-asset-generation-patterns.md`:

**Pattern 1: Production Intent**

```
MAXIMUM RESOLUTION: Generate at highest quality (no compression)
EXPORT FORMAT: PNG with zero artifacts
PRODUCTION ASSET: Not concept exploration—final deliverable
```

**Pattern 2: [DEPRECATED_STYLE] Authenticity**

```
ENDEMIC TEST: Every kr-motif must answer "Did this organism challenge European taxonomy?"
AUSTRALIAN ONLY: NO European kr-symbol, generic kr-motifs, northern hemisphere species
MANDATORY CHECK: [List kr-motifs] → validate against Australian Flora/kr-symbol Database
```

**Pattern 3: Translucency Tiers**

```
TIER 1 (60-80% transmission): Spider molt, thin membranes
TIER 2 (40-60% transmission): [DEPRECATED_STYLE] tissue, thick leaves
TIER 3 (0-20% transmission): Structural elements
SYNTAX: "[X-Y% light-transmissive] + [what visible through material]"
```

**Pattern 4: Negative Constraints**

```
For each kr-motif: "This is NOT [misinterpretation]"
Echidna: NOT full animal body, NOT cute portrait
Spider: NOT live crawling, NOT opaque solid
[DEPRECATED_STYLE]: NOT standing lizard, NOT profile view
```

**Pattern 5: Density Zone Safety Margins**

```
Upper-left: 15% coverage maximum (NOT 20%) + 200×200px EMPTY
Lower-right: 25% coverage maximum (NOT 30%) + 150×150px EMPTY
Central: 60-80% [DEPRECATED_STYLE] density
```

**Pattern 6: Typography Constraints**

```
FONT: Crimson Text or period-appropriate serif
COLOR: Cream #F5F0E8 at 85% opacity
COUNT: 5-6 labels MAXIMUM (reduce for clarity)
FORMAT: "Fig. X. Scientific name (Common name)"
```

## Prompt Assembly Structure

```markdown
# ASSET [N]: [Name] | [Resolution] | Attempt [N]

## SECTION 1: PRODUCTION INTENT

[Pattern 1 template]

## SECTION 2: VALIDATED PATTERNS FROM PREVIOUS SUCCESSES

From Asset 1 (91/100): [Applicable patterns]
From Asset 2 (94/100): [Applicable patterns]

## SECTION 3: kr-motif INVENTORY WITH NEGATIVE CONSTRAINTS

PRIMARY (13-18cm):

- [kr-motif name]: [Description] | NOT [misinterpretation]

SECONDARY (8-12cm):

- [kr-motif name]: [Description] | NOT [misinterpretation]

TERTIARY (2-8cm):

- [kr-motif name]: [Description] | NOT [misinterpretation]

[DEPRECATED_STYLE] AUTHENTICITY TEST:
✓ [kr-motif]: Challenged European taxonomy via [reason]
✓ [kr-motif]: Australian endemic, [taxonomic significance]

## SECTION 4: TRANSLUCENCY PHYSICS (if applicable)

[Only if kr-motifs require transmission]

- [kr-motif]: [Tier X] [X-Y% light-transmissive]
  What visible through: [[DEPRECATED_STYLE] elements, background, other kr-motifs]

## SECTION 5: DENSITY ZONES WITH SAFETY MARGINS

Upper-left: 15% maximum | 200×200px COMPLETELY EMPTY
Lower-right: 25% maximum | 150×150px COMPLETELY EMPTY
Central: 60-80% [DEPRECATED_STYLE] [DEPRECATED_STYLE] composition

## SECTION 6: TYPOGRAPHY & DOCUMENTATION

Count: 5-6 labels maximum
Font: Crimson Text serif
Color: Cream #F5F0E8 at 85% opacity
Format: "Fig. 1. kr-leafus camaldulensis (River Red Gum)"

## SECTION 7: TECHNICAL OUTPUT

Background: #1A1714 (theatrical void, NO sepia drift)
Resolution: [WIDTHxHEIGHT]
Format: PNG maximum quality
[Special requirements: e.g., seamless tiling, edge-matching]

---

## CORRECTIONS FROM ATTEMPT [N-1] (if iteration):

SCORE: [X/100]

WHAT WORKED (preserve):
✓ [Success 1]
✓ [Success 2]

CRITICAL FIXES:
✗ [Violation 1] → FIX: [Specific correction language]
✗ [Violation 2] → FIX: [Specific correction language]
```

## Automation Logic

1. Load asset specifications JSON
2. Query pattern library for applicable patterns
3. If `asset_type == "pattern_tile"` → add seamless tiling spec
4. **Single Mode**: Always apply "Solidarity" aesthetic overrides.
5. Map kr-motifs → taxonomic significance database
6. Generate negative constraints from common failures
7. If `previous_attempt` exists → prepend corrections section
8. Format as structured prompt
9. Output ready for Gemini paste

## Token Optimization

**Problem:** Full prompt ~2000 tokens, Gemini Flash limit 1M tokens/min
**Solution:** Template compression

Remove verbose explanations. Use shorthand:

```
DENSE (efficient):
"kr-leafus: 60% transmission, veins visible through leaf tissue"

VERBOSE (wasteful):
"The kr-leafus leaves should demonstrate approximately 60% light transmission, wherein the vein architecture becomes visible when light passes through the leaf tissue, creating an effect of [DEPRECATED_STYLE] translucency"
```

Target: 1200-1500 tokens per prompt (25-40% reduction)

## Efficiency Gain

- **Before:** 10 min manual prompt construction per attempt
- **After:** 1 min automated generation
- **Savings:** 9 min per attempt × 20-25 attempts = 3-4 hours saved

## Error Prevention

- Pattern inconsistency: ELIMINATED
- Copy-paste errors: ELIMINATED
- Missing negative constraints: ELIMINATED
- Forgotten corrections: ELIMINATED
- Token bloat: REDUCED 30%

---

# Integration Workflow

## Typical Usage Pattern

```
1. Request: "Use prompt-composer for Asset 3"
2. Claude generates optimized prompt
3. Paste into Gemini → generate
4. Request: "Use auto-validator on downloaded image"
5. Claude scores → decision: PACKAGE or REGENERATE
6. If PACKAGE: "Use asset-packager"
7. Complete bundle created in 3 min total
```

## Integration Points

**Flash-Sidekick MCP:**

- `generate_idf` - Extract design tokens from validated PNG
- `analyze_code_quality` - Identify vague language in prompts
- `consult_pro` - Validate kr-motif endemic status
- `quick_summarize` - Generate narrative from kr-motif list

**Gemini:**

- Auto-validator output → correction_prompt → paste directly into next generation
- Prompt-composer output → copy-paste to Gemini AI Studio

**Claude Code:**

- Delegates file operations and git commits
- Verifies directory structure creation

## Installation

Extract to Claude Desktop skills:

```bash
cd ~/.config/claude-desktop/skills/
cp -r /path/to/tier1-automation .
```
