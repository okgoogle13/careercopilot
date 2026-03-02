---
name: auto-validator
description: "Programmatic asset compliance validation using vision analysis and Kerala Rage\
  \ scorecard. Eliminates manual validation loops\u2014upload image, receive scored\
  \ JSON with correction prompts in 30 seconds."
---

# Auto-Validator Skill

## Purpose

Automates Kerala Rage asset validation. Upload generated image → receive compliance JSON with scores, violations, and auto-generated correction prompt. Replaces 10-minute conversational validation with 30-second programmatic assessment.

## Trigger Conditions

Use when:
- Gemini/DALL-E generates asset attempt
- Need compliance score (0-100 across 6 dimensions)
- Require iteration decision (≥90 package | <90 regenerate)
- Want correction prompt for next attempt

## Validation Scorecard

**Dimension 1: Semantic Token Usage (0-25)**
- All colors use CSS variables (`--sys-color-*`)
- No hardcoded hex values in UI elements
- Proper token hierarchy (primitives → semantic → component)
- Violations: Direct hex codes, missing token references

**Dimension 2: M3 Expressive Typography (0-20)**
- Headlines: Fraunces (wght 700, wdth 100) for expressive warmth
- Body/UI: Work Sans (wght 400-600) for modern legibility
- Code/Data: JetBrains Mono (wght 400-600) for technical clarity
- Extreme contrast between headline and body weights
- Violations: Inter, Roboto, Arial, uniform weights, missing variable font axes

**Dimension 3: Color Palette Compliance (0-20)**
- Only approved Kerala Rage kr-solidarity colors:
  - asphaltBlack `#1A1714`, paperWhite `#F5F0E8`
  - kr-ink-gold `#D4A84B`, waratahRed `#C45C4B`
  - ochreEarth `#B8733D`, gumLeafGreen `#6B7F6E`, concreteGrey `#A39B8F`
- Proper tonal palette usage (primary-0 through primary-100)
- Violations: Purple, generic blues, off-palette colors

**Dimension 4: Asymmetric Composition (0-15)**
- Organic shapes and non-uniform border radius per archetype
- Asymmetric spacing (not rigid grid)
- Natural hierarchy through size variation (1.5-3× between levels)
- Violations: Uniform radius, perfectly symmetrical layouts, rigid Material grid

**Dimension 5: Accessibility (0-10)**
- WCAG 2.2 AA contrast ratios minimum (4.5:1 text, 3:1 UI)
- Focus indicators visible and distinct
- Touch targets ≥44×44px
- Violations: Low contrast, missing focus states, small touch targets

**Dimension 6: Kerala Diaspora Identity & Social Responsibility (0-10)**
- Naarm/Melbourne laneway aesthetics (urban, layered, multicultural)
- Kerala diaspora cultural markers (without stereotypes)
- Social justice and political activism visibility (equity, inclusion, solidarity)
- Community-centered design language
- Violations: Bureaucratic motifs, corporate sterility, apolitical neutrality, cultural appropriation

## Workflow

**Input:** Image file path or upload
**Process:**
1. Extract color palette (sample 50+ points across UI elements)
2. Detect CSS variable usage vs hardcoded hex (OCR + color matching)
3. Identify font families and weights (Vision API text analysis)
4. Measure contrast ratios (WCAG 2.2 computation)
5. Analyze composition symmetry (spatial distribution analysis)
6. Assess cultural/political markers (Vision API semantic analysis)
7. Score each dimension
8. Generate violation list
9. Build correction prompt

**Output:** JSON structure

```json
{
  "asset_id": "KR-SOLID-HERO-001",
  "overall_score": 87,
  "decision": "REGENERATE | PACKAGE",
  "dimensions": {
    "semantic_token_usage": {"score": 20, "violations": ["Hardcoded #1A1714 in button background"]},
    "m3_expressive_typography": {"score": 18, "violations": ["Work Sans missing wdth axis"]},
    "color_palette_compliance": {"score": 19, "violations": []},
    "asymmetric_composition": {"score": 14, "violations": ["Uniform 8px border radius on all cards"]},
    "accessibility": {"score": 8, "violations": ["Text contrast 3.2:1 (minimum 4.5:1)"]},
    "kerala_diaspora_identity": {"score": 8, "violations": ["Missing solidarity/activism markers"]}
  },
  "correction_prompt": "CRITICAL FIXES:\n- Replace hardcoded #1A1714 with --sys-color-asphaltBlack\n- Add wdth:100 to Work Sans font-variation-settings\n- Increase text contrast to 4.5:1 minimum (use --sys-color-paperWhite)\n- Vary border radius: hero-card (12px 4px 16px 8px), buttons (asymmetric per archetype)\n- Add subtle solidarity visual marker (waratahRed accent, social justice iconography)",
  "iteration_priority": "high"
}
```

## Integration Points

**With Flash-Sidekick:**
- Call `analyze_code_quality` on generated prompt → identify vague language
- Call `web_research_synthesis` for specimen geographic validation

**With Context7:**
- Call `query-docs` to verify implementation patterns against the latest documentation for libraries like Genkit, Supabase, and Radix UI.
- Use resolved library IDs from `context7-reference.md` for fast lookups.

**With Gemini:**
- Auto-validator output → correction_prompt → paste directly into next generation

**With Claude Desktop:**
- Decision gate: score ≥90 triggers Asset-Packager skill
- Score <90 triggers Prompt-Composer with corrections

## Usage Example

```python
# Pseudo-workflow
result = auto_validator.validate(
    image_path="/downloads/kr-solid-hero-001-attempt-2.png",
    asset_id="KR-SOLID-HERO-001",
    target_score=90
)

if result['decision'] == 'PACKAGE':
    # Asset meets quality threshold, ready for manifest addition
    asset_packager.run(result)
else:
    # Regenerate with corrections
    corrected_prompt = prompt_composer.apply_corrections(
        base_prompt=original_prompt,
        corrections=result['correction_prompt']
    )
    # Send to Gemini for regeneration with Kerala Rage kr-solidarity corrections
```

## Efficiency Gain

**Before:** 10-15 min manual validation per attempt
**After:** 30 sec programmatic validation
**Savings:** 20× faster validation, 95% time reduction
**Scale Impact:** 10 assets × 2-3 attempts = 3-5 hours saved

## Implementation Notes

- **Vision API**: Color palette extraction, font family detection, cultural marker analysis
- **CSS Variable Detection**: Pattern matching for `--sys-color-*` vs hardcoded hex codes
- **WCAG 2.2 Computation**: Automated contrast ratio calculation (text, UI elements)
- **Composition Analysis**: Spatial distribution metrics for asymmetry detection
- **OCR + Font Analysis**: Font family identification (Fraunces, Work Sans, JetBrains Mono)
- **Deterministic Scoring**: Rule-based evaluation (not subjective)
- **Context7 Lookups**: Validate complex implementation patterns (e.g., Genkit flows, Radix primitives) against real-world, high-reputation documentation to ensure compliance.

## Critical Differences from vision-scorer-mcp

**auto-validator**: Pre-manifest quality gate
- Focus: Visual design compliance (tokens, typography, composition, accessibility, identity)
- Input: New asset image file (not yet in system)
- No manifest integrity checks
- Fast feedback loop for iterative generation

**vision-scorer-mcp**: Post-manifest comprehensive validation
- Focus: System integration (token usage, wireframe alignment, manifest integrity, hero composition)
- Input: Asset already in manifest/registry
- Includes manifest + registry validation (15 points)
- Final quality gate before packaging/deployment

---

*Replaces conversational validation with programmatic compliance measurement. Critical path acceleration for high-volume Kerala Rage kr-solidarity asset generation.*
