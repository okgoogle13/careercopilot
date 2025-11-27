# CareerCopilot Material Design 3 Migration Plan

**Status:** Ready to Execute
**Overall Completion:** 15.2% (52/204 components)
**Estimated Effort:** 134 hours (4-5 weeks)
**Target Completion:** January 15, 2025

---

## Executive Summary

CareerCopilot frontend has 204 components across three design systems:
- **M3 Token-Based:** 23 components ✅ (Complete)
- **Electric Alchemist:** 29 components ✅ (Complete)
- **MUI v5 Legacy:** 126 components ⏳ (Needs migration)
- **Deprecated:** 18 components (Remove)
- **Other:** 8 components

### Key Findings

| Metric | Value |
|--------|-------|
| Migration Progress | 15.2% complete |
| Components Remaining | 126 MUI v5 legacy |
| Quick Wins Available | 12 (6 hours total) |
| High-Impact Components | 5 (12 hours total) |
| Technical Blockers | None |
| Recommended Team Size | 1-2 developers |

---

## M3 Consolidated Skills Architecture (Updated 2025-11-28)

The migration now uses **4 unified design system skills + 1 orchestrator**:

### Core M3 Token Skills
1. **m3-layout-tokens** - Spacing, sizing, and layout patterns
   - 12-stop spacing scale (4px, 8px, 12px...64px)
   - Convert padding/margin/gap to `var(--sys-space-*)`
   - Transform hardcoded pixels to token variables

2. **m3-visual-tokens** - Color, shape, and elevation tokens
   - 78+ color tokens with semantic roles
   - 7 corner radius scales
   - 6 elevation levels with standardized shadows

3. **m3-typography-tokens** - Type scale and text styles
   - 13 semantic type scales (display, headline, title, label, body)
   - Font weight and line-height standards
   - Editorial conventions (alignment, spacing, overflow)

4. **m3-interaction-tokens** - Icons, motion, and animations
   - 3 standard icon sizes with semantic colors
   - 16 duration scales and 10 easing functions
   - Spring physics support for expressive animations

### Migration Orchestrator
- **batch-migration-orchestrator** - Coordinates multi-component migrations
  - 4-step migration protocol (layout → visual → typography → interaction)
  - Parallel execution for multiple components
  - Validation and compliance checking

### Design System Generator
- **m3-design-system-generator** - Unified token generation
  - Complete M3 token system creation
  - 150+ tokens with WCAG validation
  - Automatic CSS variable generation
  - Tailwind configuration integration

### Usage in Migration Process
Each phase uses these skills in sequence:
```
Phase 1 (Foundation): m3-design-system-generator
Phase 2-4 (Components): batch-migration-orchestrator
  ├─ Step 1: m3-layout-tokens
  ├─ Step 2: m3-visual-tokens
  ├─ Step 3: m3-typography-tokens
  └─ Step 4: m3-interaction-tokens
Phase 5 (Validation): All skills for compliance audit
```

---

## 5-Phase Migration Strategy

### Phase 1: Foundation (Week 1) - 8 Hours
**Objective:** Establish M3 design system baseline using consolidated skills

**Primary Tool:** `m3-design-system-generator` skill
- Request: "Generate complete M3 design system with 150+ tokens"
- Output: Unified token system with all colors, typography, spacing, and animation
- WCAG validation ensures accessibility compliance

**Tasks:**
- [ ] Use `m3-design-system-generator` to create design token system (4 hours)
- [ ] Document token usage patterns (2 hours)
- [ ] Train team on batch-migration-orchestrator workflow (1 hour)
- [ ] Set up component migration template with new skill references (1 hour)

**Deliverables:**
- Complete M3 token system (150+ tokens)
- Design token CSS variables file
- Migration workflow guide (how to use batch-migration-orchestrator)
- Component migration template with skill examples
- WCAG compliance report

**Timeline:** Week 1, Days 1-2

---

### Phase 2: Quick Wins (Week 1-2) - 6 Hours
**Objective:** Build momentum with easy, high-value migrations using batch orchestrator

**Primary Tool:** `batch-migration-orchestrator` skill
- Request: "Migrate [Component1, Component2, ...] to M3 Expressive"
- Executes 4-step protocol for each component (layout → visual → typography → interaction)
- Validates compliance and reports results

**12 Components to Migrate (2-3 days):**

1. **NavigationItem.tsx** (0.3 hrs) - batch-migration-orchestrator
2. **tabs/tabs.tsx** (0.2 hrs) - batch-migration-orchestrator
3. **sidebar/sidebar.tsx** (0.3 hrs) - batch-migration-orchestrator
4. **card/card.tsx** (0.2 hrs) - batch-migration-orchestrator
5. **progress/progress.tsx** (0.2 hrs) - batch-migration-orchestrator
6. **input/input.tsx** (0.2 hrs) - batch-migration-orchestrator
7. **toast/toast.tsx** (0.3 hrs) - batch-migration-orchestrator
8. **ErrorCard.tsx & LoadingCard.tsx** (0.3 hrs) - batch-migration-orchestrator
9-10. **Typography + Spacing** (0.8 hrs) - m3-typography-tokens + m3-layout-tokens
11. **Token CSS Documentation** (0.8 hrs) - Manual review of generated tokens
12. **Components Review & Refine** (0.2 hrs) - Validation checklist

**Effort:** 6 hours total (2-3 days with 1 developer)
**Expected Outcome:** 12 components migrated, 100% token compliance, momentum established

---

### Phase 3: High-Impact Components (Week 2-3) - 12-15 Hours
**Objective:** Migrate critical components using consolidated skills

**Tool:** `batch-migration-orchestrator` with focused validation

**5 Priority Components:**

#### 1. Navbar.tsx (2.5 hours) - CRITICAL
**Primary Skills:** m3-visual-tokens, m3-layout-tokens
- Replace primary/secondary colors with M3 surface/on-surface tokens
- Update spacing to 4px grid using m3-layout-tokens
- Apply M3 elevation via m3-visual-tokens
- Icon colors via m3-interaction-tokens
**Impact:** Navigation affects 100% of app

#### 2. PageHeader.tsx (2 hours) - CRITICAL
**Primary Skills:** m3-typography-tokens, m3-visual-tokens
- Typography palette via m3-typography-tokens (headline, supporting)
- Colors via m3-visual-tokens
- Icon sizing via m3-interaction-tokens
**Impact:** Used across all pages (20+ instances)

#### 3. JobCard.tsx (1.5 hours) - HIGH
**Primary Skills:** m3-visual-tokens, m3-layout-tokens
- Container colors via m3-visual-tokens
- Text colors via semantic M3 tokens
- Spacing via m3-layout-tokens (4px grid)
- Card elevation via m3-visual-tokens
**Impact:** Job matching features

#### 4. JobMatching.tsx (2.5 hours) - HIGH
**Primary Skills:** batch-migration-orchestrator (full 4-step)
- All styled elements → M3 tokens
- Layout spacing via m3-layout-tokens
- Typography via m3-typography-tokens
- Motion/animation via m3-interaction-tokens
**Impact:** Core career matching feature

#### 5. ATSAnalysisDashboard.tsx (2 hours) - HIGH
**Primary Skills:** m3-visual-tokens, m3-typography-tokens
- M3 token integration
- Progress bars with success/warning tokens
- Typography scale consistency
- Spacing standardization
**Impact:** Resume analysis feature

**Total Effort:** 10.5 hours (2-3 days with batch orchestrator)
**Timeline:** Week 2-3

---

### Phase 4: Batch Migration (Week 4-5) - 60-75 Hours
**Objective:** Systematically migrate remaining 100+ MUI v5 components

**Primary Tool:** `batch-migration-orchestrator`
- Coordinates multi-component migrations in parallel
- Validates each batch against M3 compliance rules
- Generates migration reports

**Component Batches (Optimized with new skills):**

**Batch A: Layout Components (12 components) - 5 hours**
- Tools: m3-layout-tokens (primary), m3-visual-tokens
- AppLayout, AppShell, Sidebar variants, Grid/Flex
- Focus: Spacing standardization and elevation

**Batch B: Form Components (18 components) - 6 hours**
- Tools: m3-interaction-tokens, m3-visual-tokens, m3-layout-tokens
- Input, Select, Checkbox/Radio, Form containers
- Focus: Interactive states and color contrast

**Batch C: Data Display (22 components) - 8 hours**
- Tools: m3-visual-tokens (primary), m3-typography-tokens
- Table, List, Card variants, Badge/Chip
- Focus: Text colors and surface containers

**Batch D: Feature Components (32 components) - 20 hours**
- Tools: batch-migration-orchestrator (full 4-step)
- Job-related, Document-related, Career-related, Application tracking
- Focus: Complex interactions and animations

**Batch E: Utility Components (16 components) - 6 hours**
- Tools: m3-interaction-tokens, m3-visual-tokens
- Dialogs/Modals, Snackbars/Toast, Loading states, Error boundaries
- Focus: Motion tokens and feedback states

**Parallel Execution Strategy:**
- Run Batches A-B concurrently (days 1-2)
- Run Batches C-D concurrently (days 3-5)
- Run Batch E (day 6)
- With 2 developers: 10-12 days total

---

### Phase 5: Cleanup & Validation (Week 5) - 10-12 Hours
**Objective:** Complete migration, validate compliance, remove deprecated code

**Tools:** All M3 skills + compliance validation

**5.1 Remove Deprecated Components (1.5 hours)**
- [ ] Delete 18 deprecated components from `_deprecated/` folder
- [ ] Verify no remaining theme.palette imports
- [ ] Update documentation references

**5.2 M3 Compliance Audit (3 hours)**
- [ ] Use m3-visual-tokens validator for color compliance
- [ ] Use m3-typography-tokens to ensure font consistency
- [ ] Use m3-layout-tokens to validate spacing grid
- [ ] Use m3-interaction-tokens for animation compliance
- [ ] Generate compliance report for all 100+ migrated components

**5.3 Comprehensive Testing (4 hours)**
- [ ] Visual regression testing (all pages)
- [ ] Component interaction testing
- [ ] Responsive design testing (mobile, tablet, desktop)
- [ ] Accessibility audit (WCAG AA compliance)
- [ ] Performance audit (bundle size, load time)

**5.4 Documentation & Training (2 hours)**
- [ ] Update component library with M3 guidelines
- [ ] Document new skill workflows
- [ ] Create token usage reference
- [ ] Add migration examples for future components

**5.5 Deploy & Monitor (1.5 hours)**
- [ ] Deploy to staging for QA validation
- [ ] Monitor for token loading issues
- [ ] Validate CSS coverage and specificity
- [ ] Prepare production deployment

---

## Quick Reference: Top 10 Highest-Impact Components

### Priority 1 (Critical - 4 hours)
1. **Navbar.tsx** - Navigation (affects 100% of app)
2. **AppLayout.tsx** - Main layout wrapper
3. **AppShell.tsx** - Page shell/container
4. **PageHeader.tsx** - Page headers (20+ instances)

### Priority 2 (High - 8 hours)
5. **JobCard.tsx** - Job matching UI
6. **JobMatching.tsx** - Career matching dashboard
7. **ApplicationCard.tsx** - Application tracking
8. **ATSAnalysisDashboard.tsx** - Resume analysis

### Priority 3 (Medium - 12 hours)
9. **Documents Components** (5 files) - Document handling
10. **Sidebar Components** - Navigation sidebar

---

## Migration Pattern Template

Use this template for all component migrations:

```typescript
// BEFORE: MUI v5 with hardcoded values
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2),
  color: '#000',
}));

// AFTER: M3 tokens with proper usage
const MigrationCard = () => {
  return (
    <Card sx={{
      backgroundColor: 'var(--sys-color-surface-container)',
      padding: '16px', // 4 x 4px grid
      color: 'var(--sys-color-on-surface)',
    }}>
      {/* content */}
    </Card>
  );
};
```

### Common Replacements

| Old Pattern | New M3 Token |
|-------------|--------------|
| `theme.palette.primary.main` | `var(--sys-color-primary)` |
| `theme.palette.secondary.main` | `var(--sys-color-secondary)` |
| `theme.palette.error.main` | `var(--sys-color-error)` |
| `theme.palette.background.default` | `var(--sys-color-background)` |
| `theme.spacing(1)` | `4px` |
| `theme.spacing(2)` | `8px` |
| `theme.spacing(3)` | `12px` |
| `theme.spacing(4)` | `16px` |

---

## Timeline & Milestones

```
Week 1:
├─ Phase 1 (Foundation): Mon-Tue (8 hrs)
└─ Phase 2 (Quick Wins): Wed-Fri (6 hrs)

Week 2:
├─ Phase 2 (Continued): Mon-Tue (wrap up)
└─ Phase 3 (High-Impact): Wed-Fri (5 hrs)

Week 3:
├─ Phase 3 (Continued): Mon-Wed (9.5 hrs wrap-up)
└─ Phase 4 (Batch A-B): Thu-Fri (8 hrs)

Week 4:
├─ Phase 4 (Batch C-D-E): Mon-Fri (56 hrs)
└─ Checkpoint: 50% complete (127 components)

Week 5:
├─ Phase 4 (Final batches): Mon-Wed (28 hrs wrap-up)
└─ Phase 5 (Cleanup): Thu-Fri (15 hrs)

Target: Jan 15, 2025 - 100% M3 Migration Complete
```

---

## Success Metrics

### Completion Tracking
- [ ] All 126 MUI v5 legacy components migrated to M3
- [ ] Zero deprecated components remaining
- [ ] 100% design token usage (no hardcoded colors)
- [ ] Zero TypeScript errors in migrated components

### Quality Metrics
- [ ] Visual regression testing: 100% pass
- [ ] Accessibility audit: WCAG AA compliance
- [ ] Bundle size: No increase >5%
- [ ] Performance: Lighthouse score >90
- [ ] Test coverage: >80% for modified components

### Documentation
- [ ] M3 migration guide complete
- [ ] Component library updated
- [ ] Before/after examples documented
- [ ] Team training materials finalized

---

## Risk Mitigation

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Token naming conflicts | Low | High | Pre-audit token naming, create mapping doc |
| Responsive design breaks | Medium | High | Test all breakpoints during migration |
| Performance regression | Low | Medium | Monitor bundle size, run Lighthouse |
| Accessibility issues | Medium | High | WCAG audit on each phase |

### Organizational Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Resource availability | Medium | High | Assign dedicated developer, clear blockers |
| Scope creep | Medium | Medium | Stick to M3 only, defer nice-to-haves |
| Testing gaps | Medium | High | Plan comprehensive QA phase |

---

## Resource Requirements

### Team
- **1 Primary Developer** - Lead migration, make architectural decisions
- **1 Secondary Developer** (Optional) - Parallel batch migrations
- **1 QA/Tester** - 5 hours/week for validation

### Tools
- Refactoring IDE (VS Code with automated refactoring)
- Design token documentation
- Testing tools (Playwright, Jest)
- Git/GitHub for change management

### Infrastructure
- Staging environment for testing
- Design system documentation
- Token reference library

---

## Next Steps

1. **Immediate (This Week)**
   - [ ] Review and approve this plan
   - [ ] Assign dedicated developer(s)
   - [ ] Schedule Phase 1 kickoff
   - [ ] Create migration checklist

2. **Phase 1 (Next Week)**
   - [ ] Document M3 design tokens
   - [ ] Create migration template
   - [ ] Train team on patterns
   - [ ] Prepare Phase 2

3. **Phase 2 (Week 1-2)**
   - [ ] Start quick win migrations
   - [ ] Build developer momentum
   - [ ] Establish migration cadence

4. **Ongoing**
   - [ ] Daily standups to track progress
   - [ ] Weekly reviews of completed components
   - [ ] Adjust timeline if needed
   - [ ] Celebrate milestones

---

## Contact & Questions

For questions about this migration plan:
- Refer to M3 Design System documentation
- Check component migration examples
- Review token reference guide
- Consult team lead or architecture

---

**Document Version:** 1.0
**Last Updated:** November 26, 2025
**Status:** Ready for Execution
**Approval:** Pending
