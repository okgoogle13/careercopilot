# Skill Review: ui-design-evaluator

**Score:** 68/100 (D) — ❌ NOT READY FOR DISTRIBUTION
**Reviewed:** 2026-02-17

---

## Critical Issues

### 1. Design Token Misalignment ❌
Skill references **non-existent design system**:
- Uses `--nc-*` CSS variables → project uses `--sys-color-*`
- References fonts "Curator, Proclamation, Bloom, Field Note, Annotation" → project uses {Fraunces, Work Sans, JetBrains Mono}
- Color names: "Wattle Gold", "[DEPRECATED_STYLE] Red" → actual tokens: `inkGold`, `solidarityRed`, `charcoalBackground`

**Impact:** Skill generates broken code with undefined variables.

### 2. Mode Contradiction ❌
Skill describes "kr-dark vs kr-dark modes" (lines 328-398).
**Project:** Solidarity is the only mode (CLAUDE.md).

### 3. Undefined Terminology ❌
`[DEPRECATED_STYLE]` appears 42 times — never defined.

### 4. File Size Violation ⚠️
630 lines (26% over 500-line limit).

---

## Scoring Breakdown

| Criterion | Score | Issues |
|-----------|-------|--------|
| Metadata | 12/20 | Deprecated terms in description |
| Documentation | 18/25 | Comprehensive but uses fictional tokens |
| Structure | 15/20 | No subdirectories; 630 lines |
| Functionality | 13/20 | Describes features that don't exist |
| Compliance | 10/15 | Violates CLAUDE.md design system rules |

---

## Required Fixes (Priority 1)

1. **Token Reconciliation** (4-6 hrs)
   - Replace all `--nc-*` → `--sys-color-*`
   - Use actual tokens: `charcoalBackground`, `solidarityRed`, `inkGold`, `signalGreen`
   - Update typography: Fraunces, Work Sans, JetBrains Mono

2. **Remove Mode References** (2-3 hrs)
   - Delete lines 328-398 (kr-dark/kr-dark section)
   - Update all examples to Solidarity-only

3. **Define or Remove Deprecated Terms** (1-2 hrs)
   - Clarify `[DEPRECATED_STYLE]` or remove all 42 instances

4. **File Restructure** (2-3 hrs)
   ```
   ui-design-evaluator/
   ├── SKILL.md (350 lines — core)
   ├── references/
   │   ├── SCORING_RUBRIC.md
   │   ├── TOKEN_MAPPING.md
   │   └── MIGRATION_NOTES.md
   └── scripts/
       └── validate-tokens.py
   ```

---

## Missing Documentation

- ❌ Troubleshooting section (image upload failures, API errors)
- ❌ Edge case handling (conflicting requirements, rate limits)
- ❌ Error recovery strategies
- ❌ Actual scoring calculation example

---

## Test Results

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| CSS Variables | `--sys-color-*` | `--nc-*` | ❌ FAIL |
| Fonts | Fraunces, Work Sans | Curator, Bloom | ❌ FAIL |
| Mode | Solidarity only | kr-dark/kr-dark | ❌ FAIL |
| Token Names | `solidarityRed`, `inkGold` | "Wattle Gold", "[DEPRECATED_STYLE] Red" | ❌ FAIL |

---

## Bottom Line

**Strengths:** Clear 5-phase workflow, comprehensive scoring system, good structure
**Fatal Flaw:** References deprecated design system that doesn't match project tokens
**Recommendation:** Quarantine until token alignment complete. Treat as draft from previous design iteration.

**Estimated Fix Time:** 8-12 hours
**Re-Review Required:** Yes (target score: 85+)
