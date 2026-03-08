# Skill Review Report: ui-design-evaluator

**Reviewed:** 2026-02-17
**Reviewer:** skill-reviewer agent
**Version:** 1.0.0
**File:** `.claude/skills/ui-design-evaluator/SKILL.md`

---

## Overall Score: 68/100 (Grade: D)

**Status:** ⚠️ NEEDS SIGNIFICANT WORK — Do not distribute until critical issues resolved

**Summary:** The skill has strong potential and comprehensive content (630 lines), but is severely compromised by pervasive deprecated terminology (`DEPRECATED_STYLE`, `kr-dark`/`kr-dark` modes) that contradicts the project's Kerala Rage Solidarity-only design system. The skill needs urgent reconciliation with actual design tokens and removal of obsolete mode-switching concepts.

---

## Detailed Evaluation

### 1. Metadata Quality: 12/20 ⚠️

**YAML Frontmatter:**
- ✅ Valid YAML syntax
- ✅ Clear name: `ui-design-evaluator`
- ✅ Description present
- ⚠️ Description mentions deprecated terms: "kerala-rage kr-solidarity V3.1" (correct: "Kerala Rage Solidarity")
- ⚠️ Legacy frontmatter section adds noise (`version`, `tags`)

**Naming Conventions:**
- ✅ Directory name matches skill name
- ✅ Verb-based name ("evaluator")
- ✅ Clear intent

**Critical Issues:**
- ❌ Description references "V3.1" which is not documented in project CLAUDE.md
- ❌ Tags include obsolete "kerala-rage-kr-solidarity" (should be "kerala-rage")

**Recommendations:**
1. Update description to: "Evaluate design assets, analyze annotated wireframes, and create high-fidelity interactive mockups with Kerala Rage (Solidarity mode) compliance."
2. Remove legacy frontmatter section (version/tags belong in git history, not YAML)
3. Clarify what "V3.1" means or remove version references

---

### 2. Documentation Quality: 18/25 ⚠️

**Structure & Organization:**
- ✅ Clear H1 → H2 → H3 hierarchy
- ✅ Logical content flow (INPUT → ANALYZE → EVALUATE → DESIGN → DELIVER)
- ✅ Good use of formatting (code blocks, lists, tables)
- ⚠️ Excessive emoji usage (🎨, 📋, 🎭, ✅, 🚀, 📖, 🎯, 📚) — decorative but not essential

**Content Completeness:**
- ✅ Purpose section: Clear and actionable
- ✅ "When to Use" section: Present but vague
- ✅ Capabilities: Comprehensive 5-phase process documented
- ✅ Usage examples: 3 detailed examples provided
- ✅ Best practices: Present with clear DO/DON'T guidance
- ❌ **Missing:** Troubleshooting section
- ❌ **Missing:** Error handling (what if image upload fails? what if tokens don't match?)
- ❌ **Missing:** Limitations explicitly stated

**Clarity & Accessibility:**
- ⚠️ Heavy use of deprecated/undefined jargon:
  - `[DEPRECATED_STYLE]` appears 42 times — completely undefined
  - `kr-dark` vs `kr-dark` modes — contradicts CLAUDE.md (Solidarity is the only mode)
  - "Federation Typography Stack" — not defined in project tokens.json
  - "Curator, Proclamation, Bloom, Field Note, Annotation" — these fonts don't exist in Kerala Rage
- ❌ Examples reference non-existent CSS variables: `--nc-wattle-gold-300`, `--nc-[DEPRECATED_STYLE]-red-400`
- ❌ Actual tokens.json uses: `charcoalBackground`, `solidarityRed`, `kr-activistSmokeGreen`, `signalGreen`, `inkGold`

**Critical Content Errors:**
- Line 70: "kr-dark vs kr-dark mode" — project is Solidarity-only (no mode switching)
- Line 80-86: References "Federation Typography Stack" fonts that don't exist
- Line 219-268: Token mapping examples use deprecated `--nc-*` prefix (actual: `--sys-color-*`)
- Line 328-398: Entire section on "kr-dark vs kr-dark Mode" is obsolete

**Recommendations:**
1. **URGENT:** Search/replace all deprecated terminology with actual token names
2. **URGENT:** Remove kr-dark/kr-dark mode sections (lines 328-398)
3. Add troubleshooting section for common issues:
   - Image upload failures
   - Token mismatch errors
   - Accessibility violations
   - Vision API rate limits
4. Replace "Federation Typography Stack" with actual fonts: Fraunces, Work Sans, JetBrains Mono
5. Update CSS variable examples to match tokens.json:
   ```css
   /* Correct examples */
   background: var(--sys-color-charcoalBackground-base);
   color: var(--sys-color-solidarityRed-base);
   ```

---

### 3. Structure & Organization: 15/20 ⚠️

**File Organization:**
- ✅ SKILL.md present
- ❌ No `references/` subdirectory (skill is 630 lines — exceeds 500-line guideline)
- ❌ No `scripts/` subdirectory for automation
- ❌ No `assets/` subdirectory for templates
- ❌ No README.md for development notes

**Current Structure:**
```
ui-design-evaluator/
└── SKILL.md (630 lines — 126% over limit)
```

**Recommended Structure:**
```
ui-design-evaluator/
├── SKILL.md (350 lines — core overview)
├── README.md (development notes, changelog)
├── references/
│   ├── DESIGN_TOKEN_MAPPING.md (detailed token reference with examples)
│   ├── SCORING_RUBRIC.md (400-point system breakdown)
│   └── MODE_REMOVED_MIGRATION.md (explains removal of kr-dark/kr-dark split)
├── scripts/
│   └── validate-tokens.py (check CSS var references against tokens.json)
└── assets/
    ├── evaluation-report.md.template
    └── component-spec.md.template
```

**File Size Issues:**
- ❌ SKILL.md is 630 lines (26% over 500-line limit)
- Content should be split: core instructions in SKILL.md, detailed reference material in `references/`

**Recommendations:**
1. Move scoring rubric detail (lines 76-119) to `references/SCORING_RUBRIC.md`
2. Move token mapping examples (lines 213-268) to `references/DESIGN_TOKEN_MAPPING.md`
3. Move kr-dark/kr-dark mode section (lines 328-398) to `references/MODE_REMOVED_MIGRATION.md` (explaining why it's deprecated)
4. Add `scripts/validate-tokens.py` to programmatically check skill examples against actual tokens.json
5. Add templates for evaluation reports and component specs

---

### 4. Functionality & Coverage: 13/20 ❌

**Scope & Capabilities:**
- ✅ Clear 5-phase process (INPUT → ANALYZE → EVALUATE → DESIGN → DELIVER)
- ✅ Multiple input types supported (screenshots, wireframes, Figma exports)
- ✅ Comprehensive scoring system (400 points)
- ❌ Capabilities reference non-existent design system features
- ❌ Token mapping is fictional (uses `--nc-*` prefix that doesn't exist)

**Edge Cases & Error Handling:**
- ❌ No guidance on image upload failures
- ❌ No fallback if Vision API is unavailable
- ❌ No handling for ambiguous wireframe annotations
- ❌ No guidance on conflicting design requirements
- ❌ No rate limiting strategy for batch evaluations
- ❌ No versioning for when design tokens change
- ❌ No handling for accessibility violations that can't be auto-fixed

**Unhandled Scenarios:**
1. **Token Migration:** What if CSS variables change between skill versions?
2. **Multi-Page Flows:** Example 3 (lines 493-520) describes 5-page flow but no detail on state management
3. **Conflicting Requirements:** User asks for "vibrant purple gradient" (anti-pattern) — how to handle?
4. **Partial Compliance:** Design scores 65% — which issues to fix first?
5. **Vision API Failures:** Gemini API down or rate-limited — fallback strategy?
6. **Ambiguous Wireframes:** Annotation says "make it pop" — how to interpret?
7. **Accessibility Violations:** Color contrast fails WCAG AA — auto-adjust or warn user?

**Practical Applicability:**
- ⚠️ Examples use deprecated terminology, making them non-functional
- ⚠️ 400-point scoring system is abstract — no example of actual scoring calculation
- ⚠️ No guidance on interpreting scores (e.g., "75% — what should I fix first?")
- ✅ Work Sansactive HTML artifact output is practical and useful
- ✅ React component code generation is clearly defined

**Recommendations:**
1. Add "Edge Cases & Error Handling" section:
   - Image upload failures → retry logic or manual path input
   - Token mismatches → validation against tokens.json
   - Accessibility failures → automated fixes vs manual review
   - Vision API rate limits → queue system or batch scheduling
2. Add "Scoring Work Sanspretation Guide":
   - 90-100%: Ship it
   - 80-89%: Fix listed issues, then ship
   - 70-79%: Prioritize accessibility and token compliance
   - <70%: Redesign from scratch
3. Add "Conflict Resolution" guide for contradictory design requests
4. Provide at least one complete scoring example with calculations

---

### 5. Guideline Compliance: 10/15 ❌

**Anthropic Standards:**
- ✅ Follows YAML frontmatter format
- ✅ Description includes "when to use" triggers
- ❌ Skill references non-existent design tokens (violates accuracy requirement)
- ❌ 630 lines exceeds recommended 500-line limit
- ⚠️ Legacy frontmatter section should be removed

**Project Standards (CLAUDE.md):**
- ❌ **CRITICAL VIOLATION:** References "kr-dark" and "kr-dark" modes — project is Solidarity-only
- ❌ **CRITICAL VIOLATION:** Uses `--nc-*` CSS variables — project uses `--sys-color-*`
- ❌ **CRITICAL VIOLATION:** References "Federation Typography Stack" — project uses {Fraunces, Work Sans, JetBrains Mono}
- ❌ References fonts that don't exist: "Curator, Proclamation, Bloom, Field Note, Annotation"
- ❌ Uses deprecated color names: "Wattle Gold" → correct: `inkGold` or `solidarityRed`
- ✅ Correctly advocates for asymmetric shapes
- ✅ Correctly warns against Work Sans/Work Sans fonts
- ✅ Correctly warns against purple gradients

**Actual Kerala Rage Tokens (from tokens.json):**
```json
{
  "sys": {
    "color": {
      "charcoalBackground": { "base": "--sys-color-charcoal-background" },
      "solidarityRed": { "base": "--sys-color-solidarity-red" },
      "kr-charcoalRed": { "base": "--sys-color-kr-charcoal-red" },
      "kr-activistSmokeGreen": { "base": "--sys-color-kr-activist-smoke-green" },
      "signalGreen": { "base": "--sys-color-signal-green" },
      "inkGold": { "base": "--sys-color-ink-gold" }
    },
    "typography": {
      "fraunces": { /* variable font */ },
      "workSans": { /* variable font */ },
      "jetBrainsMono": { /* monospace */ }
    }
  }
}
```

**CLAUDE.md Violations:**
- Line 70, 328-398: Mode switching (Solidarity is the only mode)
- Line 80-86, 414: "Federation Typography Stack" (doesn't exist)
- Line 219-268: All token examples use wrong CSS variable prefix
- Line 82: "[DEPRECATED_STYLE] color palette" — undefined term used 42 times

**Recommendations:**
1. **URGENT:** Align skill with actual Kerala Rage design tokens
2. **URGENT:** Remove all kr-dark/kr-dark mode references
3. **URGENT:** Update CSS variable examples to `--sys-color-*` prefix
4. Add validation script to check skill examples against tokens.json
5. Remove legacy frontmatter section
6. Split file to meet 500-line guideline

---

## Priority Recommendations

### Priority 1 (CRITICAL — Do Not Distribute Until Fixed)

1. **Token Reconciliation:**
   - Replace all `--nc-*` variables with `--sys-color-*`
   - Use actual token names: `charcoalBackground`, `solidarityRed`, `inkGold`, etc.
   - Remove references to non-existent fonts: "Curator", "Proclamation", "Bloom"
   - Update typography to: Fraunces, Work Sans, JetBrains Mono

2. **Mode Removal:**
   - Delete kr-dark/kr-dark mode section (lines 328-398)
   - Remove all kr-dark vs kr-dark comparisons
   - Update examples to Solidarity-only mode

3. **Deprecated Term Cleanup:**
   - Define or remove `[DEPRECATED_STYLE]` (appears 42 times)
   - Replace "Wattle Gold" with `inkGold`
   - Replace "[DEPRECATED_STYLE] Red" with `solidarityRed`
   - Remove "Federation Typography Stack" terminology

4. **File Size Reduction:**
   - Move detailed reference material to `references/` subdirectory
   - Target: SKILL.md under 400 lines (core instructions only)

### Priority 2 (HIGH — Improve Usability)

1. **Add Troubleshooting Section:**
   - Image upload failures
   - Token validation errors
   - Accessibility violation handling
   - Vision API rate limits

2. **Add Edge Case Documentation:**
   - Conflicting design requirements
   - Partial compliance scoring interpretation
   - Multi-page flow state management
   - Batch evaluation strategies

3. **Improve Examples:**
   - Provide complete scoring calculation example
   - Show actual token.json → CSS variable mapping
   - Include real component code snippets

4. **Structure Improvements:**
   - Create `references/` for detailed docs
   - Create `scripts/` for validation automation
   - Create `assets/` for templates
   - Add README.md for development notes

### Priority 3 (NICE TO HAVE — Polish)

1. **Reduce Emoji Usage:**
   - Keep emojis in section headers if desired
   - Remove decorative emojis in body text

2. **Add Validation Script:**
   - Python script to check CSS var references against tokens.json
   - Automated testing of example code snippets

3. **Add Screenshots:**
   - Visual examples of evaluation reports
   - Before/after mockup comparisons

4. **Version Clarification:**
   - Document what "V3.1" means or remove version references
   - Add changelog/history to README.md

---

## Comparison with Project Standards

### What the Skill Says:

**Typography:**
> "Uses Federation Typography Stack (Curator, Proclamation, Bloom, Field Note, Annotation)"

**Color Variables:**
> ```css
> background: var(--nc-wattle-gold-300);
> color: var(--nc-[DEPRECATED_STYLE]-red-400);
> ```

**Modes:**
> "kr-dark vs kr-dark mode"

### What CLAUDE.md Says:

**Typography:**
> "Headlines: Fraunces (wght 700, wdth 100)
> Body/UI: Work Sans (wght 400–600)
> Code/Data: JetBrains Mono (wght 400–600)"

**Color Variables:**
> "CSS Variable Convention: `--sys-color-{name}` or `--sys-color-{role}-{step}`"

**Modes:**
> "Single mode: Solidarity (unified product experience)"

**Verdict:** Skill and project are fundamentally misaligned. Skill appears to be from a different design system iteration.

---

## Functionality Testing

### Test 1: Token Validation

**Command:** Search skill for CSS variable references
**Result:** 42 instances of deprecated `--nc-*` prefix
**Expected:** `--sys-color-*` prefix
**Status:** ❌ FAIL

### Test 2: Font References

**Command:** Search skill for font names
**Result:** References to "Curator", "Proclamation", "Bloom", "Field Note", "Annotation"
**Expected:** Fraunces, Work Sans, JetBrains Mono
**Status:** ❌ FAIL

### Test 3: Mode References

**Command:** Search for mode mentions
**Result:** 18 instances of "kr-dark mode", 16 instances of "kr-dark mode"
**Expected:** Solidarity mode only
**Status:** ❌ FAIL

### Test 4: Color Token Names

**Command:** Cross-reference skill examples with tokens.json
**Result:** "Wattle Gold", "[DEPRECATED_STYLE] Red", "kr-leaf Smoke" — none exist in tokens.json
**Expected:** `charcoalBackground`, `solidarityRed`, `inkGold`, `signalGreen`
**Status:** ❌ FAIL

**Overall Functionality:** ❌ BROKEN — Skill references non-existent design system

---

## Related Skills Cross-Check

**Skill Claims to Integrate With:**
- `component-builder` — Convert mockups to production code
- `asset-placement-strategy` — Typography on wallpaper positioning
- `kerala-rage-visual-audit` — Validate final design token compliance
- `compliance-dashboard` — Track overall design system adoption

**Status of Related Skills:**
- ✅ `component-builder` exists
- ❓ `asset-placement-strategy` — need to verify token alignment
- ❓ `kerala-rage-visual-audit` — need to verify exists
- ❓ `compliance-dashboard` — need to verify exists

**Recommendation:** Audit all related skills for token alignment.

---

## Scoring Breakdown

| Criterion | Score | Max | Notes |
|-----------|-------|-----|-------|
| Metadata Quality | 12 | 20 | Deprecated terms in description; legacy frontmatter |
| Documentation Quality | 18 | 25 | Comprehensive but uses non-existent terminology |
| Structure & Organization | 15 | 20 | 630 lines (26% over limit); no subdirectories |
| Functionality & Coverage | 13 | 20 | Features described don't match actual design system |
| Guideline Compliance | 10 | 15 | Multiple CLAUDE.md violations; wrong tokens |
| **TOTAL** | **68** | **100** | **Grade: D (Needs Significant Improvement)** |

---

## Distribution Readiness: ❌ NOT READY

**Blocking Issues:**
1. References non-existent design tokens
2. Contradicts project CLAUDE.md (mode switching)
3. Uses deprecated terminology without definition
4. Exceeds file size guideline by 26%
5. Missing critical error handling documentation

**Estimated Work to Fix:** 8-12 hours
1. Token reconciliation: 4-6 hours
2. Mode removal: 2-3 hours
3. Documentation restructure: 2-3 hours

**Re-Review Required After:**
- Token alignment complete
- Mode references removed
- File split into main + references
- Validation script created

---

## Summary

The **ui-design-evaluator** skill demonstrates strong structural thinking with its 5-phase process (INPUT → ANALYZE → EVALUATE → DESIGN → DELIVER) and comprehensive 400-point scoring system. However, it is fundamentally broken due to pervasive references to a deprecated design system that conflicts with the project's actual Kerala Rage Solidarity tokens.

**Key Strengths:**
- Clear, logical workflow structure
- Comprehensive scoring framework
- Multiple input format support
- Good examples (if tokens were correct)

**Critical Flaws:**
- 42 instances of undefined `[DEPRECATED_STYLE]` placeholder
- References kr-dark/kr-dark modes (project is Solidarity-only)
- Uses `--nc-*` CSS variables (actual: `--sys-color-*`)
- References fonts that don't exist in tokens.json
- 26% over file size limit

**Recommendation:** This skill requires urgent reconciliation with actual design tokens before any distribution. Consider this a draft from a previous design system iteration that was never updated when Kerala Rage Solidarity was finalized.

---

**Next Steps:**
1. Pause any usage of this skill until token alignment complete
2. Create validation script to prevent future token drift
3. Audit related skills (`asset-placement-strategy`, `kerala-rage-visual-audit`) for same issues
4. After fixes, re-run skill-reviewer for passing grade (target: 85+)
