# M3 Expressive Week 2 Implementation Plan

**Sprint:** Week 2 (Days 1-7)
**Status:** 🚀 In Progress
**Goal:** Migrate 30+ high-priority components with automation

---

## 🎯 Week 2 Objectives

### Primary Goals
1. ✅ Build batch migration automation (template-based generation)
2. 🚀 Migrate 30+ high-priority components (from 3.8% → 25%+)
3. 📚 Create Storybook documentation for all migrated components
4. 🔒 Set up CI/CD validation pipeline
5. 🌙 Build dark mode foundation (token system + switcher)

### Success Metrics
- **Component Coverage:** 35+ components migrated (25%+ of 131 total)
- **Storybook Coverage:** 35+ stories created
- **Automation:** 80%+ migration automated
- **CI/CD:** Token validation in pipeline
- **Dark Mode:** Infrastructure ready for Week 3

---

## 📅 Week 2 Timeline

### Days 1-2: Automation & Tooling
**Focus:** Build migration automation infrastructure

**Tasks:**
- ✅ Create component template generator
- ✅ Build batch migration script
- ✅ Set up Storybook infrastructure
- ✅ Create M3 token validation script
- ✅ Add GitHub Actions workflow

**Deliverables:**
- `scripts/generate-m3-component.py` - Template-based component generator
- `scripts/batch-migrate.py` - Automated batch migration
- `.github/workflows/m3-validation.yml` - CI/CD validation
- Storybook stories for Button, Card, Input, Badge, Dialog

### Days 3-5: High-Priority Component Migration
**Focus:** Migrate top 30 components by MUI pattern count

**Batch 1 (Day 3) - Complex UI Components:**
- date-picker (15 MUI patterns, 223 lines)
- select (13 MUI patterns, 214 lines)
- toast (6 MUI patterns, 227 lines)
- progress (5 MUI patterns, 31 lines)
- search-input (5 MUI patterns, 156 lines)
- **Total: 5 components**

**Batch 2 (Day 4) - Card Components:**
- ActionCard (9 MUI patterns, 377 lines)
- ProfileCard (6 MUI patterns, 234 lines)
- JobCard (4 MUI patterns, 466 lines)
- FeatureCard (0 patterns, simple conversion)
- TemplateCard (library component)
- **Total: 5 components**

**Batch 3 (Day 5) - Form & Input Components:**
- checkbox (existing component)
- radio-group (existing component)
- switch (existing component)
- textarea (existing component)
- slider (existing component)
- **Total: 5 components**

**Batch 4-6 (Days 5-6) - Additional Components:**
- Batch 4: Navigation (Tabs, Breadcrumb, Sidebar) - 5 components
- Batch 5: Feedback (Alert, Skeleton, EmptyState) - 5 components
- Batch 6: Utility (Avatar, Tooltip, Popover, Separator) - 5 components
- **Total: 15 components**

**Total Target: 30+ components**

### Days 6-7: Dark Mode & CI/CD
**Focus:** Infrastructure and quality assurance

**Tasks:**
- Build dark mode token system
- Create theme switcher component
- Set up CI/CD validation
- Visual QA testing
- Documentation updates

**Deliverables:**
- Dark mode tokens (156+ dark variants)
- M3ThemeSwitcher component
- CI/CD pipeline with token validation
- Updated migration tracker

---

## 🛠️ Automation Strategy

### Component Template Generator
**Script:** `scripts/generate-m3-component.py`

**Features:**
- Template-based TSX + CSS generation
- Auto-generates variants, sizes, colors
- Includes TypeScript interfaces
- Adds default styling with M3 tokens
- Creates placeholder tests

**Usage:**
```bash
python3 scripts/generate-m3-component.py \
  --name="Select" \
  --type="input" \
  --variants="outlined,filled" \
  --sizes="small,medium,large"
```

**Templates:**
- `templates/m3-button.template.tsx` - Button-like components
- `templates/m3-input.template.tsx` - Input/form components
- `templates/m3-card.template.tsx` - Card/surface components
- `templates/m3-feedback.template.tsx` - Toast/alert/dialog components

### Batch Migration Script
**Script:** `scripts/batch-migrate.py`

**Features:**
- Migrates multiple components in parallel
- Uses template generator for each component
- Automatically updates migration tracker
- Generates Storybook stories
- Runs basic validation

**Usage:**
```bash
python3 scripts/batch-migrate.py \
  --batch="batch1" \
  --components="date-picker,select,toast,progress,search-input"
```

---

## 📚 Storybook Strategy

### Story Template Structure
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { M3ComponentName } from './M3ComponentName';

const meta: Meta<typeof M3ComponentName> = {
  title: 'M3/ComponentCategory/ComponentName',
  component: M3ComponentName,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'tonal'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3ComponentName>;

export const Primary: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    children: 'Button',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <M3ComponentName variant="filled">Filled</M3ComponentName>
      <M3ComponentName variant="outlined">Outlined</M3ComponentName>
      <M3ComponentName variant="tonal">Tonal</M3ComponentName>
    </div>
  ),
};
```

### Storybook Categories
- **M3/Buttons** - Button, IconButton, FAB
- **M3/Inputs** - Input, Select, Checkbox, Radio, Switch, Slider
- **M3/Surfaces** - Card, Dialog, Drawer, Modal
- **M3/Feedback** - Toast, Alert, Progress, Skeleton
- **M3/Navigation** - Tabs, Breadcrumb, Sidebar, Menu
- **M3/Data Display** - Badge, Avatar, Tooltip, Divider

---

## 🌙 Dark Mode Implementation

### Dark Mode Token System
**File:** `design-system/tokens-dark.json`

**Structure:**
```json
{
  "color": {
    "primary": {
      "0": "#000000",
      "10": "#00201B",
      ...
      "100": "#FFFFFF"
    },
    "surface": {
      "dim": "#111418",
      "default": "#191C20",
      "bright": "#2B2F33",
      "containerLowest": "#0C0E11",
      "containerLow": "#191C20",
      "container": "#1D2024",
      "containerHigh": "#272A2E",
      "containerHighest": "#323539"
    }
  }
}
```

**Key Differences from Light Mode:**
- Surface colors: Dark backgrounds (#191C20 instead of #F9FAFB)
- Text colors: Light text on dark (#E3E3E3 instead of #1A1C1E)
- Elevation: Higher contrast shadows
- Primary/Secondary: Same hue, adjusted lightness for dark backgrounds

### Theme Switcher Component
**Component:** `M3ThemeSwitcher.tsx`

**Features:**
- Toggle between light/dark modes
- Persist preference in localStorage
- Smooth transitions (250ms)
- System preference detection
- Icon animation (sun/moon)

**Usage:**
```tsx
<M3ThemeSwitcher defaultTheme="system" />
```

### CSS Variable Switching
```css
/* Light mode (default) */
:root {
  --md-sys-color-surface-default: #F9FAFB;
  --md-sys-color-neutral-10: #1A1C1E;
}

/* Dark mode */
[data-theme="dark"] {
  --md-sys-color-surface-default: #191C20;
  --md-sys-color-neutral-10: #E3E3E3;
}
```

---

## 🔒 CI/CD Validation Pipeline

### GitHub Actions Workflow
**File:** `.github/workflows/m3-validation.yml`

**Checks:**
1. **Token Validation**
   - Schema validation (all required keys present)
   - WCAG contrast ratio validation
   - Token naming convention check

2. **Component Validation**
   - M3 token usage verification
   - No hardcoded colors/sizes
   - TypeScript compilation
   - ESLint compliance

3. **Build Validation**
   - Token build script runs successfully
   - CSS variables generated correctly
   - No duplicate token names

4. **Visual Regression** (Optional)
   - Chromatic/Percy integration
   - Screenshot comparison
   - Cross-browser testing

**Workflow Triggers:**
- Pull request to main
- Push to `claude/m3-*` branches
- Manual dispatch

---

## 📊 Migration Prioritization

### Component Priority Matrix

**High Priority (15 components):**
- Heavy MUI usage (>5 patterns)
- User-facing components
- Frequently used across app

**Components:**
1. date-picker (15 patterns)
2. select (13 patterns)
3. ActionCard (9 patterns)
4. toast (6 patterns)
5. ProfileCard (6 patterns)
6. progress (5 patterns)
7. search-input (5 patterns)
8. JobCard (4 patterns)
9. checkbox (existing)
10. radio-group (existing)
11. switch (existing)
12. tabs (existing)
13. breadcrumb (existing)
14. alert (existing)
15. skeleton (existing)

**Medium Priority (15 components):**
- Moderate MUI usage (1-4 patterns)
- Important but less frequently used

**Low Priority (96 components):**
- Minimal/no MUI usage
- Simple conversion
- Less critical paths

---

## 🎨 Design Token Additions (Dark Mode)

### New Tokens Required
- **Surface Colors (Dark):** 8 variants
- **Text Colors (Dark):** Inverted neutral tones
- **Shadow Colors (Dark):** Higher contrast
- **State Layers (Dark):** Adjusted opacity

### Token Count Increase
- **Before Week 2:** 156 tokens (light mode)
- **After Week 2:** 312 tokens (light + dark)

---

## 📈 Success Metrics

### Component Migration
- **Start:** 5/131 (3.8%)
- **Week 2 Target:** 35/131 (26.7%)
- **Daily Target:** 5 components/day

### Code Coverage
- **Storybook:** 35+ stories (26.7% component documentation)
- **Tests:** Maintain >90% test pass rate
- **TypeScript:** 100% type safety

### Automation Efficiency
- **Manual Migration Time:** ~2 hours/component
- **Automated Migration Time:** ~15 minutes/component
- **Time Savings:** 88% reduction

### Quality Metrics
- **WCAG AA Compliance:** 100% of migrated components
- **Token Usage:** 100% M3 tokens (no hardcoded values)
- **Dark Mode Support:** 100% of migrated components

---

## 🚧 Risks & Mitigation

### Risk 1: Component Complexity
**Risk:** Some components too complex for automation
**Mitigation:**
- Prioritize simple components first
- Manual migration for complex cases
- Template refinement based on learnings

### Risk 2: Breaking Changes
**Risk:** Migration breaks existing functionality
**Mitigation:**
- Keep old components (deprecated)
- Gradual rollout with feature flags
- Comprehensive testing

### Risk 3: Design Inconsistencies
**Risk:** Components look different post-migration
**Mitigation:**
- Visual regression testing
- Design review checkpoints
- Reference screenshots

### Risk 4: Timeline Pressure
**Risk:** 30 components in 7 days is aggressive
**Mitigation:**
- Automation reduces manual work
- Batch processing enables parallelization
- Adjust scope if needed (minimum 20 components)

---

## 🎓 Learning Goals

### Technical Skills
1. **Batch Processing:** Parallelized component generation
2. **Template Systems:** Jinja2-style templating for code generation
3. **CI/CD Integration:** Automated quality gates
4. **Theme Systems:** CSS variable-based theming

### Process Improvements
1. **Automation ROI:** Measure time savings from tooling
2. **Quality Metrics:** Track WCAG compliance, token usage
3. **Documentation:** Storybook as living documentation
4. **Collaboration:** Migration tracker for team coordination

---

## 📝 Week 2 Checklist

### Day 1-2: Infrastructure ✅
- [ ] Create component template generator
- [ ] Build batch migration script
- [ ] Set up Storybook for M3 components
- [ ] Create CI/CD validation workflow
- [ ] Generate stories for Week 1 components

### Day 3: Batch 1 Migration
- [ ] Migrate date-picker
- [ ] Migrate select
- [ ] Migrate toast
- [ ] Migrate progress
- [ ] Migrate search-input

### Day 4: Batch 2 Migration
- [ ] Migrate ActionCard
- [ ] Migrate ProfileCard
- [ ] Migrate JobCard
- [ ] Migrate FeatureCard
- [ ] Migrate TemplateCard

### Day 5: Batch 3 Migration
- [ ] Migrate checkbox
- [ ] Migrate radio-group
- [ ] Migrate switch
- [ ] Migrate textarea
- [ ] Migrate slider

### Day 6: Batch 4-5 Migration
- [ ] Migrate navigation components (Tabs, Breadcrumb, Sidebar)
- [ ] Migrate feedback components (Alert, Skeleton, EmptyState)
- [ ] Migrate utility components (Avatar, Tooltip)

### Day 7: Dark Mode & QA
- [ ] Build dark mode token system
- [ ] Create theme switcher component
- [ ] Visual QA testing
- [ ] Update migration tracker
- [ ] Week 2 summary documentation

---

## 🚀 Week 3 Preview

### Goals
- Complete remaining 96 components (100% migration)
- Full dark mode implementation across all components
- Performance optimization (bundle size, runtime)
- Production deployment
- Design system documentation site

### Deliverables
- 131/131 components migrated
- Complete light/dark theme support
- Optimized bundle size
- Production-ready M3 system

---

**Week 2 Status:** 🚀 Ready to Execute
**Next Action:** Build component template generator
