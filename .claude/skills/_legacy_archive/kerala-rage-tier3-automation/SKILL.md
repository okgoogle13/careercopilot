---
name: kerala-rage-tier3-automation
version: 1.0.0
description: Tier 3 Kerala Rage quality and learning skills. Includes vision-scorer-mcp (deterministic compliance scoring), token-injector (automated CSS variable injection), and pattern-learner (self-improving pattern database). Deploy after Tier 2 for continuous quality improvement and pattern learning.
tags: [automation, kerala-rage, quality-assurance, learning, tier3]
---

# Tier 3 Automation Skills

**Deploy Priority:** THIRD
**ROI:** Quality + Learning
**Dependencies:** Tier 1 & 2 skills

## Overview

Three advanced skills that enable deterministic quality measurement and continuous learning:

1. **vision-scorer-mcp** - Deterministic compliance scoring
2. **token-injector** - Automated CSS variable injection
3. **pattern-learner** - Self-improving pattern database

**Combined Impact:**

- Validation: 10 min → 8 sec (deterministic)
- Token injection: 30 min → 2 min (93% reduction)
- Pattern library: Self-improving with each success

---

# Skill 1: Vision-Scorer MCP Server

## Purpose

Add to Design System Sidekick MCP server. Provides programmatic asset validation via Gemini Vision API.

## New MCP Tools

### 1. `score_asset_compliance`

**Input:**

```json
{
  "image_path": "/path/to/asset.png",
  "asset_id": "ASSET-3",
  "target_score": 90
}
```

**Process:**

1. Load image via Vision API
2. Extract colors (sample 50 points → hex codes)
3. Identify kr-motifs (Vision recognition + [DEPRECATED_STYLE] DB lookup)
4. Measure density zones (pixel coverage analysis)
5. Detect translucency (luminance gradient analysis)
6. OCR typography (count labels, verify font/color)
7. Score 6 dimensions (0-20 each)

**Output:**

```json
{
  "overall_score": 87,
  "decision": "REGENERATE",
  "dimensions": {
    "geographic_authenticity": 18,
    "translucency_physics": 14,
    "scale_hierarchy": 19,
    "density_zones": 16,
    "background_color": 9,
    "typography": 8
  },
  "violations": [
    "Spider molt appears opaque (no transmission)",
    "Upper-left density 25% (exceeds 20% threshold)"
  ],
  "correction_prompt": "CRITICAL FIXES:\n- Spider: '60-80% light-transmissive amber chitin'\n- Upper-left: '200×200px COMPLETELY EMPTY'"
}
```

### 2. `extract_visual_tokens`

**Input:** Image path
**Output:** Design tokens JSON

```json
{
  "colors": {
    "background": "#1A1714",
    "dominant": ["#C45C4B", "#D4A84B"],
    "accents": ["#7A9E82", "#D4885C"]
  },
  "kr-motifs": [
    { "name": "[DEPRECATED_STYLE]", "size_cm": 15, "position": "upper_right" },
    { "name": "[DEPRECATED_STYLE]", "size_cm": 18, "position": "center" }
  ],
  "density": {
    "upper_left": 18,
    "lower_right": 28,
    "central": 70
  }
}
```

### 3. `compare_attempts`

**Input:** Array of attempt image paths
**Output:** Iteration analysis

```json
{
  "progression": [
    { "attempt": 1, "score": 68, "key_failure": "[DEPRECATED_STYLE] violations" },
    { "attempt": 2, "score": 87, "key_failure": "Density zones" },
    { "attempt": 3, "score": 92, "decision": "PACKAGE" }
  ],
  "pattern_learnings": [
    "Adding negative constraints improved kr-motif accuracy",
    "Density zone pixel specs more effective than percentages"
  ]
}
```

## Implementation

**File:** `/servers/design_system_sidekick.py`

**Add Vision API Integration:**

```python
import google.generativeai as genai

class VisionScorer:
    def score_asset_compliance(self, image_path, asset_id, target_score):
        # Load image
        image = genai.upload_file(image_path)

        # Vision analysis prompt
        prompt = """
        Analyze this kerala-rage kr-solidarity asset:

        1. Extract hex colors (background + palette)
        2. Identify kr-motifs (names + sizes)
        3. Measure density zones (upper-left, lower-right, central %)
        4. Detect translucency (which kr-motifs show transmission?)
        5. Count typography labels

        Return structured JSON.
        """

        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content([prompt, image])

        # Parse response → score dimensions
        data = parse_vision_response(response.text)
        scores = calculate_dimension_scores(data)

        return {
            "overall_score": sum(scores.values()),
            "dimensions": scores,
            "decision": "PACKAGE" if sum(scores.values()) >= target_score else "REGENERATE"
        }
```

## Integration

**Claude Desktop Config:**

```json
{
  "mcpServers": {
    "design-system-sidekick": {
      "command": "python3",
      "args": ["/path/to/design_system_sidekick.py"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}"
      }
    }
  }
}
```

## Token Efficiency

- **Gemini Vision:** ~1500 tokens per analysis
- **Cost:** $0.002 per image (Flash model)
- **Speed:** 5-8 seconds per validation

vs Manual: 10 minutes conversational validation

## Advantages

- Deterministic scoring (not subjective)
- Structured JSON output (feeds dashboards)
- Pattern learning across iterations
- 95% time reduction

---

# Skill 2: Token-Injector

## Function

Input: `tokens.json` + target CSS files
Output: Updated stylesheets with CSS variables

## Process

1. Parse `tokens.json` from asset packages
2. Generate CSS custom properties
3. Inject into `:root` or component scope
4. Replace hardcoded values with `var()` references
5. Validate no broken references

## Token Mapping

**tokens.json:**

```json
{
  "background": "#1A1714",
  "palette": {
    "waratah_crimson": "#C45C4B",
    "wattle_gold": "#D4A84B",
    "kr-leafus_sage": "#7A9E82"
  }
}
```

**Generated CSS:**

```css
:root {
  --color-kr-motif-night: #1a1714;
  --color-[DEPRECATED_STYLE]-crimson: #c45c4b;
  --color-wattle-gold: #d4a84b;
  --color-kr-leafus-sage: #7a9e82;
}
```

## Replacement Logic

**Before:**

```css
.card {
  background: #1a1714;
  border: 1px solid #c45c4b;
}
```

**After:**

```css
.card {
  background: var(--color-kr-motif-night);
  border: 1px solid var(--color-[DEPRECATED_STYLE]-crimson);
}
```

## Batch Mode

Process all asset `tokens.json` files:

```bash
token-injector --input /assets/*/tokens.json --output /frontend/src/styles/kerala-rage-tokens.css
```

## Integration

- **Asset-Packager:** Generates source `tokens.json`
- **Claude Code:** Executes injection on target files
- **Stylelint:** Validates output

## Efficiency

- **Before:** 30 min manual find-replace per component
- **After:** 2 min automated injection
- **Savings:** 93% reduction

---

# Skill 3: Pattern-Learner

## Trigger

Asset scores ≥95/100

## Process

1. Diff current prompt vs previous attempts
2. Extract language that drove compliance improvement
3. Abstract reusable pattern from specific instance
4. Tag effectiveness (high/medium/low based on first-attempt success)
5. Update `/docs/kerala-rage-asset-generation-patterns.md`

## Example Learning

**Input:**

- Asset 4 (Wattle + Beetle) scored 96/100 on first attempt
- Previous generic metallic prompts failed (opaque flat paint)
- Success prompt: "Faceted geometric surface with prismatic color shift green→gold→copper"

**Extracted Pattern:**

```markdown
## Pattern: Metallic Iridescence (Asset 4, 96/100)

**Context:** Any metallic insect carapace rendering

**Effective Language:**
"Faceted geometric surface" + "prismatic color shift [color1→color2→color3]"

**Why It Works:**
Specifies viewing angle dependence (not flat metallic paint)

**Effectiveness:** HIGH (validated 1st attempt)

**Apply To:**

- Jewel beetles, metallic spiders, iridescent wings
```

## Pattern Structure

```markdown
## Pattern: [Name] (Asset [N], [Score]/100)

**Context:** [When to use this pattern]

**Effective Language:** [Exact prompt syntax]

**Why It Works:** [Technical explanation]

**Effectiveness:** [HIGH|MEDIUM|LOW]

**Apply To:** [Use cases]

**Avoid:** [Common failure modes]
```

## Integration

- **Prompt-Composer:** Queries pattern library before generation
- **Flash-Sidekick:** `consult_pro` analyzes prompt diffs for pattern extraction
- **Auto-Validator:** Scores trigger pattern learning

## Self-Improvement Loop

1. Asset validates ≥95 → trigger learning
2. Extract patterns → update library
3. Next asset uses updated patterns
4. Success reinforces pattern (effectiveness++)
5. Failure demotes pattern (effectiveness--)

## Database Evolution

- **Week 1:** 5 patterns (from Assets 1-2)
- **Week 2:** 12 patterns (from Assets 3-6)
- **Week 4:** 25+ patterns (self-reinforcing)

**Result:** Each new asset easier than previous due to pattern accumulation

## Efficiency

**Without Learning:**

- Asset 10 requires same trial-error as Asset 1
- No institutional knowledge accumulation

**With Learning:**

- Asset 10 leverages 9 previous successes
- First-attempt success rate increases exponentially

---

# Installation

Extract to Claude Desktop skills:

```bash
cd ~/.config/claude-desktop/skills/
cp -r /path/to/tier3-automation .
```

For vision-scorer MCP server, update Design System Sidekick configuration in Claude Desktop config.

Restart Claude Desktop.

---

_Deterministic scoring + automated tokens + self-learning patterns. Manual quality control → continuous improvement._
