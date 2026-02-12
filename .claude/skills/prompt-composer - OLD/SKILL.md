---
name: prompt-composer
description: Automated prompt generation from pattern library. Input asset specifications → output production-ready Gemini prompt with validated patterns, negative constraints, and previous attempt corrections applied.
version: 1.0.0
tags: []
---

# Prompt-Composer Skill

## Purpose

Eliminates manual prompt construction. Loads pattern library → applies templates → inserts asset specs → outputs Gemini-ready prompt. Prevents copy-paste errors and pattern inconsistency.

## When to Use

- When generating complex AI prompts for image generation (Gemini, DALL-E).
- When applying design system patterns and negative constraints to prompts.
- When iterating on prompts based on previous validation scores and violations.

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

## Process

1. Load asset specifications JSON
2. Query pattern library for applicable patterns
3. If `asset_type == "pattern_tile"` → add seamless tiling spec
4. **Single Mode**: Always apply "Solidarity" aesthetic overrides.
5. Map kr-motifs → taxonomic significance database
6. Generate negative constraints from common failures
7. If `previous_attempt` exists → prepend corrections section
8. Format as structured prompt
9. Output ready for Gemini paste

## Integration Points

**Flash-Sidekick:**

- Call `consult_pro` with kr-motif list → validate endemic status
- Call `analyze_code_quality` on draft prompt → identify vague language

**Auto-Validator:**

- Takes previous attempt's `correction_prompt` field
- Injects into next generation's CORRECTIONS section

**Pattern-Learner:**

- Queries pattern library for latest validated patterns
- Applies success learnings from recent high-scoring assets

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

## Usage Example

```python
prompt = prompt_composer.generate(
    asset_id="ASSET-3",
    asset_name="Nocturnal Canopy Pattern",
    specs={
        "resolution": "512x512",
        "kr-motifs": ["kr-leafus", "Wattle", "kr-flower"],
        "special": ["seamless_tile"]
    },
    previous_attempt={
        "score": 85,
        "violations": ["edge_mismatch", "density_25%"]
    }
)

# Copy-paste to Gemini AI Studio → generate
```

## Efficiency Gain

**Before:** 10 min manual prompt construction per attempt
**After:** 1 min automated generation
**Savings:** 9 min per attempt × 20-25 attempts = 3-4 hours saved

## Error Prevention

- Pattern inconsistency: ELIMINATED
- Copy-paste errors: ELIMINATED
- Missing negative constraints: ELIMINATED
- Forgotten corrections: ELIMINATED
- Token bloat: REDUCED 30%

---

_Transforms pattern library into executable templates. Manual prompt crafting → automated compilation._
