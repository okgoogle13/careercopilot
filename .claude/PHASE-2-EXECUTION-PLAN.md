# Phase 2 Execution Plan: Token Migration

**Date**: 2026-02-23
**Status**: READY FOR EXECUTION
**Duration**: 2-3 days

---

## Critical Finding: Token Naming Mismatch

**Issue Identified:**
The current CSS variable generation uses naming like:
- `--sys-color-charcoalBackground-base` (currently generated)
- `--sys-color-solidarityRed-base` (currently generated)

But the hero components created in Phase 1 expect:
- `--sys-color-asphaltBlack` (used in LandingHero, etc.)
- `--sys-color-kr-ink-gold` (used in LandingHero, etc.)
- `--sys-color-paperWhite` (used in LandingHero, etc.)

**Root Cause:**
The tokens.json file and the build script are using one naming convention, while the hero components use another. This mismatch must be resolved before proceeding with full Phase 2 migration.

**Resolution Options:**

### Option A: Update Hero Components to Match Generated Tokens (RECOMMENDED)
- **Pros**: Aligns with auto-generated system
- **Cons**: Changes already-tested components
- **Effort**: 1-2 hours

### Option B: Update tokens.json to Match Hero Component Expectations
- **Pros**: Hero components are already working
- **Cons**: Requires retesting all generated tokens
- **Effort**: 2-3 hours

### Option C: Support Both Naming Conventions
- **Pros**: Backward compatible
- **Cons**: Creates technical debt, complexity
- **Effort**: 3-4 hours

---

## Current Component Token Usage Status

From Phase 1 Exploration:

| Compliance Level | Count | Examples |
|---|---|---|
| **Fully Compliant** | 17 (14%) | 3 kr-heroes, 8 legacy stories, 6 UI components |
| **High Priority (Hardcoded hex)** | 8 | ApplicationForm, LayeredHero, PlasmaBackground |
| **Medium Priority (Legacy --color-*)** | 16 | MetricCard, StatusBadge, UI primitives |
| **Lower Priority (rgba)** | 15 | Transparency use cases |
| **No Token Usage** | 63 | Feature components, career/* |
| **TOTAL** | 119 components | 102 need migration |

---

## Phase 2 Implementation Strategy

### Phase 2.0: Resolve Token Naming Issue (BLOCKER)

**Action**: Clarify which naming convention should be canonical.

**Recommended**: Update hero components to use generated token names, ensuring consistency across the system.

**Steps**:
1. Audit tokens.json for the authoritative naming scheme
2. Choose canonical naming convention (generated vs. hero-expected)
3. Update mismatched components
4. Test hero components with corrected tokens
5. Update CSS variables if needed

---

### Phase 2.1: CSS Variable Completion (Post-Fix)

**Status**: ✅ CSS variables already generated (231 lines)

**Next**: Ensure all required tokens have CSS variable mappings:
- ✅ Color tonal steps generated
- ✅ Typography variables generated
- ✅ Shape/shadow tokens generated
- ⏳ Need to verify hero component tokens are present

---

### Phase 2.2: Priority 1 Migration - Hardcoded Colors (8 files)

**Duration**: 3-4 hours

**Files to Migrate**:
1. `/frontend/src/components/ApplicationForm/index.tsx` - `#F14714` → semantic token
2. `/frontend/src/components/kerala-rage/LayeredHero.tsx` - `#1A1714` → semantic token
3. `/frontend/src/components/shared/PlasmaBackground.tsx` - 6+ hex values
4. `/frontend/src/components/shared/IconBadge.tsx` - `#D0BCFF`, `#36343B`
5. `/frontend/src/components/layouts/GardenLayout.tsx` - Multiple hex
6-8. 3 story files with hardcoded examples

**Migration Pattern**:
```tsx
// Before
backgroundColor: '#1A1714'

// After
backgroundColor: 'var(--sys-color-charcoalBackground-base)' // or correct token name
```

---

### Phase 2.3: Priority 2 Migration - Legacy CSS Variables (16 files)

**Duration**: 4-6 hours

**Pattern**:
```tsx
// Before
style={{ color: 'var(--color-ink-gold)' }}

// After
style={{ color: 'var(--sys-color-solidarityRed-steps-2)' }} // or correct mapping
```

**Files**: MetricCard, StatusBadge, UI primitives (Jar, Lens, Mark, etc.)

---

### Phase 2.4: Priority 3 Migration - RGBA Transparency (15 files)

**Duration**: 2-3 hours

**Pattern** (case-by-case):
```tsx
// Before
backgroundColor: 'rgba(26, 23, 20, 0.8)'

// After (Option A - CSS color-mix for modern browsers)
backgroundColor: 'color-mix(in srgb, var(--sys-color-charcoalBackground-base) 80%, transparent)'

// After (Option B - Keep rgba but document the intent)
backgroundColor: 'rgba(26, 23, 20, 0.8)' // charcoalBackground with 80% opacity
```

---

### Phase 2.5: Priority 4 Migration - No Token Usage (63 files)

**Duration**: 8-12 hours (can use automation)

**Approach**: Batch processing with sed/regex for common patterns

```bash
# Automated batch replacements
find src/components -name "*.tsx" -type f -exec sed -i '' \
  -e 's/#1A1A1A/var(--sys-color-charcoalBackground-base)/g' \
  -e 's/#F14714/var(--sys-color-solidarityRed-base)/g' \
  {} +
```

---

### Phase 2.6: Validation & Testing

**Duration**: 2-3 hours

**Checks**:
```bash
# Verify no hardcoded hex remain
grep -r "#[0-9A-Fa-f]\{6\}" src/components --include="*.tsx" | grep -v test | wc -l
# Expected: 0

# Verify no legacy CSS variables remain
grep -r "var(--color-" src/components --include="*.tsx" | wc -l
# Expected: 0

# Run build
yarn build
# Expected: Success with 0 errors

# Run tests
yarn test
# Expected: All tests pass
```

---

## Blockers & Dependencies

### CRITICAL: Token Naming Resolution Required
**Impact**: Cannot proceed with full migration until naming is consistent
**Resolution**: Recommend Option A - update hero components (1-2 hours)

### Recommendation

1. **Immediately (Next Step)**: Investigate token naming mismatch
2. **Then**: Update hero components if needed (or tokens if preferred)
3. **Then**: Proceed with systematic Priority 1-4 migrations

---

## Expected Outcomes After Phase 2

- ✅ 119/119 components use semantic tokens (100% adoption)
- ✅ 0 hardcoded hex values
- ✅ 0 legacy `--color-*` variables
- ✅ 0 production build errors
- ✅ All tests passing

---

## Phase 2 Timeline (Post-Fix)

| Phase | Task | Duration |
|---|---|---|
| **2.0** | Resolve token naming | 1-2 hrs |
| **2.1** | CSS variable verification | 30 mins |
| **2.2** | Priority 1 (8 files, hardcoded) | 3-4 hrs |
| **2.3** | Priority 2 (16 files, legacy vars) | 4-6 hrs |
| **2.4** | Priority 3 (15 files, rgba) | 2-3 hrs |
| **2.5** | Priority 4 (63 files, automation) | 8-12 hrs |
| **2.6** | Validation & testing | 2-3 hrs |
| **TOTAL** | Phase 2 Complete | 2-3 days |

---

## Immediate Next Actions

1. ⏭️ **BLOCKER**: Resolve token naming mismatch
   - Check tokens.json authoritative naming
   - Decide: update components OR update tokens
   - Make decision within 30 minutes

2. ⏭️ After resolution: Execute Priority 1 hardcoded color migration

3. ⏭️ Execute remaining priorities systematically

---

## Notes

- Phase 2 can run in parallel with Phase 3 (typography)
- No architectural dependencies between phases
- Estimated completion: Feb 25-26, 2026 (2-3 days from now)

---

**Status**: 🟡 BLOCKED ON NAMING RESOLUTION
**Next Review**: After token naming decision made
