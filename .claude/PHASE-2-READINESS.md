# Phase 2 Readiness Report: Token Compliance Migration

**Date**: 2026-02-23
**Status**: ✅ READY TO START
**Duration Estimate**: 3-4 days
**Team**: Claude Haiku 4.5 + token-orchestrator skill

---

## Executive Summary

**Phase 2** will migrate remaining 136 components from hardcoded/generic colors to semantic Kerala Rage tokens. P0 hero components (3) are already 100% compliant and will be skipped.

### Scope
- **In Scope**: 136 legacy components needing token migration
- **Out of Scope**: 3 P0 hero components (already compliant)
- **Total Components**: 139 in codebase

### Goals
- **Target**: 100% `--sys-color-*` compliance across all 136 components
- **Success Metric**: 0 hardcoded hex values, 0 RGB values in frontend/src/components/
- **Timeline**: Complete within 3-4 days (parallel with Phase 3 setup)

---

## Phase 2 Workflow

### Step 1: Component Audit Scan
**Tool**: `token-orchestrator` skill

**Command**:
```bash
token-orchestrator audit --all-components --report hardcoded-colors.json
```

**Inputs**:
- All 139 components in `frontend/src/components/`
- Design tokens: `frontend/src/design/tokens/tokens.json`
- CSS variables: `frontend/src/styles/design-tokens.css`

**Expected Output**:
```json
{
  "total_components": 139,
  "compliant": 3,
  "non_compliant": 136,
  "issues": [
    {
      "file": "frontend/src/components/Button.tsx",
      "line": 42,
      "issue": "hardcoded color #1A1714",
      "suggestion": "--sys-color-asphaltBlack",
      "severity": "critical"
    }
  ]
}
```

**Estimated Time**: 15-20 minutes

---

### Step 2: Token Replacement Mapping
**Tool**: `asset-token-replacer` skill

**Command**:
```bash
asset-token-replacer convert hardcoded-colors.json --output-format json
```

**Process**:
1. Parse all hardcoded colors from audit report
2. Match against semantic token palette
3. Generate replacement rules JSON
4. Verify no color is unmapped

**Expected Output**:
```json
{
  "replacement_rules": [
    {
      "old_value": "#1A1714",
      "new_token": "--sys-color-asphaltBlack",
      "files_affected": 12,
      "confidence": "HIGH"
    },
    {
      "old_value": "#D4A84B",
      "new_token": "--sys-color-kr-ink-gold",
      "files_affected": 8,
      "confidence": "HIGH"
    }
  ],
  "unmapped_colors": [],
  "total_replacements": 47
}
```

**Estimated Time**: 10-15 minutes

---

### Step 3: Automated Token Injection
**Tool**: `token-injector` skill

**Command**:
```bash
token-injector apply semantic-tokens-map.json --target frontend/src/components/
```

**Process**:
1. Read replacement rules
2. Find and replace in all component files
3. Update CSS variable references
4. Rebuild CSS custom properties
5. Generate diff report

**Expected Output**:
- 136 modified files
- 0 broken imports
- CSS variables validated
- Pre-commit hooks triggered

**Estimated Time**: 20-30 minutes (includes git hooks)

---

### Step 4: Validation & Testing
**Tool**: `design-token-validator` skill

**Command**:
```bash
design-token-validator validate frontend/src/styles/design-tokens.css
```

**Checks**:
- ✅ All `--sys-color-*` variables defined
- ✅ No circular token references
- ✅ DTCG compliance maintained
- ✅ WCAG AA contrast verified
- ✅ All variables resolve in build

**Expected Output**:
```json
{
  "status": "PASS",
  "coverage": "100%",
  "wcag_aa_compliance": "100%",
  "circular_refs": 0,
  "dtcg_compliance": "100%"
}
```

**Estimated Time**: 5-10 minutes

---

## Component Categories & Migration Strategy

### Category 1: UI Primitives (High Priority)
**Count**: 23 components
**Examples**: Button.tsx, Seed.tsx, Pebble.tsx, Stone.tsx

**Expected Issues**:
- Hardcoded button background colors
- Generic border colors
- Text color variants

**Token Mapping**:
- Button primary → `--sys-color-primary-50`
- Button secondary → `--sys-color-secondary-50`
- Border neutral → `--sys-color-concreteGrey`
- Text on dark → `--sys-color-paperWhite`

---

### Category 2: Feature Components (Medium Priority)
**Count**: 58 components
**Examples**: Dashboard widgets, Card components, List items

**Expected Issues**:
- Background fill colors
- Accent highlights
- Hover state colors
- Disabled state grays

**Token Mapping**:
- Card background → `--sys-color-surfaceBase`
- Card accent → `--sys-color-primary-90`
- Disabled text → `--sys-color-neutral-50`

---

### Category 3: Layout Components (Low Priority)
**Count**: 34 components
**Examples**: Headers, Footers, Sidebars

**Expected Issues**:
- Container backgrounds
- Divider colors
- Navigation highlights

**Token Mapping**:
- Header background → `--sys-color-surfaceVariant`
- Divider → `--sys-color-neutral-30`
- Active nav → `--sys-color-primary-50`

---

### Category 4: Already Compliant (Skip)
**Count**: 24 components (incl. 3 P0 heroes)
**Status**: Already using semantic tokens

**Action**: Skip migration, validate in final audit

---

## Risk Assessment & Mitigation

### Risk 1: Breaking Changes in Storybook
**Severity**: MEDIUM
**Mitigation**: Run Jest tests post-migration to verify rendering

### Risk 2: Color Mismatch Between Figma & Code
**Severity**: LOW
**Mitigation**: Sync tokens with Figma before starting (via `figma-token-sync` skill)

### Risk 3: Incomplete Token Mapping
**Severity**: LOW
**Mitigation**: `token-orchestrator` audit will flag any unmapped colors

### Risk 4: Performance Regression
**Severity**: LOW
**Mitigation**: CSS variables have negligible performance impact; verify with Lighthouse

---

## Success Criteria

- ✅ 136/136 components scanned
- ✅ 0 hardcoded hex values remain
- ✅ 0 RGB values in implementation
- ✅ 100% semantic token adoption
- ✅ All CSS variables resolve
- ✅ WCAG AA compliance maintained
- ✅ No broken imports
- ✅ Git pre-commit hooks pass

---

## Rollback Plan

If Phase 2 encounters critical issues:

1. **Revert commits**: `git revert HEAD~1..HEAD` (undo token-injector changes)
2. **Restore design tokens**: Keep `frontend/src/design/tokens/tokens.json` (no changes needed)
3. **Restart audit**: Re-run `token-orchestrator` to identify specific issues
4. **Manual fixes**: Handle edge cases individually before retry

**Rollback Time**: 10-15 minutes max

---

## Phase 2 Timeline

| Step | Task | Duration | Cumulative |
|------|------|----------|-----------|
| 1 | Component audit scan | 15-20 min | 15-20 min |
| 2 | Token mapping generation | 10-15 min | 25-35 min |
| 3 | Automated injection | 20-30 min | 45-65 min |
| 4 | Validation & testing | 5-10 min | 50-75 min |
| **Total** | **Full Phase 2** | **~1 hour** | **~1 hour** |

**Note**: Times are for automated execution. Parallel execution of Phase 3 can start immediately.

---

## Phase 2 Artifacts (to be generated)

- `hardcoded-colors.json` — Audit results
- `semantic-tokens-map.json` — Replacement rules
- `PHASE-2-COMPLETION-REPORT.md` — Final report
- `PHASE-2-VALIDATION-RESULTS.json` — Validation report
- Git commits: 1 comprehensive token migration commit

---

## Dependencies & Prerequisites

### Must Complete First
- ✅ Phase 1 (hero components) — DONE
- ✅ Design tokens defined — DONE (tokens.json v3.2)
- ✅ CSS variables generated — DONE (design-tokens.css)

### Must Be Available
- ✅ token-orchestrator skill — Available
- ✅ asset-token-replacer skill — Available
- ✅ token-injector skill — Available
- ✅ design-token-validator skill — Available

### Optional (Recommended)
- figma-token-sync: Verify Figma tokens match code tokens
- component-visual-audit: Verify rendered components post-migration

---

## Integration with Phase 3

**Phase 2 and Phase 3 can run in parallel**:

**Timeline**:
- **Day 1**: Start Phase 2 token migration (parallel with Phase 3 typography setup)
- **Day 2-3**: Complete Phase 2 validation while Phase 3 implements variable fonts
- **Day 4**: Final audit and deployment

**Interdependencies**: NONE (phases are independent)

---

## Next Steps

### Immediate (Ready to Execute Now)
1. ✅ Confirm Phase 2 start date
2. ⏭️ Run token-orchestrator audit scan
3. ⏭️ Generate replacement rules
4. ⏭️ Execute token injection
5. ⏭️ Validate and commit

### If Issues Found
- Review unmapped colors
- Create new semantic tokens if needed
- Re-run audit
- Retry injection

### Post-Phase 2
- ✅ Phase 2 complete → All components token-compliant
- ⏭️ Phase 3 can proceed independently
- ⏭️ Final deployment audit across all 139 components

---

## Success Criteria for Phase 2 Sign-Off

- ✅ 100% token adoption (136/136 components)
- ✅ Zero hardcoded colors
- ✅ All CSS variables resolve
- ✅ WCAG AA compliance maintained
- ✅ No rendering regressions
- ✅ Git history clean

---

## Conclusion

**Phase 2 is ready to execute**. The automated token migration workflow is designed to be fast, safe, and reversible. Estimated completion: **~1 hour of execution time**.

Following successful Phase 2 completion, all 139 components will be 100% semantically token-compliant, enabling seamless design system adoption and future updates through tokens only.

---

**Status**: ✅ **READY FOR PHASE 2 LAUNCH**
**Target Start**: Immediately after this report
**Estimated Completion**: Same day (1 hour execution + 30 min validation)
**Next Review**: Upon Phase 2 completion (design-token-validator report)
