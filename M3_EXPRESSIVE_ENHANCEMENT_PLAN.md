# M3 Expressive Enhancement Plan for CareerCopilot

**Version:** 1.0.0
**Timeline:** 3 Weeks
**Objective:** Migrate from basic design tokens to Material Design 3 Expressive system with 40+ tonal shades, motion tokens, and enhanced expressiveness.

---

## Overview

Material Design 3 (M3) Expressive builds on the foundation of M3 with enhanced color palettes, expressive shapes, and sophisticated motion design. This plan outlines the migration of CareerCopilot's 128 components to the M3 Expressive system.

### Key Enhancements

1. **Extended Color System**: 40+ tonal shades across Primary, Secondary, Tertiary, Neutral, and Error palettes
2. **Motion Token System**: Standardized easing curves, duration scales, and animation patterns
3. **Expressive Shapes**: Creative shape system beyond basic radius (squircles, asymmetric radii)
4. **Enhanced Typography**: Display fonts and expressive type scale

---

## Phase 1: Preset Selection & Token Generation (Week 1)

### Vibrant Professional Preset (Teal/Coral)

**Brand Personality:** Modern, approachable, professional yet energetic

**Color Strategy:**
- **Primary (Teal)**: `#00897B` (base) - Professional, trustworthy, career-focused
- **Secondary (Coral)**: `#FF7043` (base) - Energetic, warm, action-oriented
- **Tertiary (Purple)**: `#7B1FA2` (base) - Creative, ambitious, premium
- **Neutral (Cool Gray)**: `#78909C` (base) - Balanced, professional
- **Error (Red)**: `#D32F2F` (base) - Standard error state

**Tonal Palette Generation:**
Each color generates 13 tonal variants (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100) for light/dark theme support.

**Typography:**
- **Display**: `'Poppins', sans-serif` - Bold, expressive headlines
- **Heading**: `'Inter Variable', sans-serif` - Clean, professional sections
- **Body**: `'Inter', sans-serif` - Highly readable, accessible
- **Code**: `'JetBrains Mono', monospace` - Technical content

**Shape System:**
- **Small**: 8px (buttons, chips)
- **Medium**: 12px (cards, inputs)
- **Large**: 16px (dialogs, surfaces)
- **Extra Large**: 28px (expressive containers)
- **Squircle**: Custom path for iOS-style smoothing

**Motion System:**
- **Emphasized Decelerate**: Primary motion (0.3s, cubic-bezier(0.05, 0.7, 0.1, 1.0))
- **Emphasized Accelerate**: Exit motion (0.2s, cubic-bezier(0.3, 0.0, 0.8, 0.15))
- **Standard**: Default transitions (0.25s, cubic-bezier(0.4, 0.0, 0.2, 1))

---

## Phase 2: Skill Creation (Week 1)

### New Skills Required

#### 1. `m3-expressive-color-generator` Skill
**Location:** `.claude/skills/design-skills/m3-expressive-color-generator.md`

**Purpose:** Generate 40+ tonal shades from 5 base colors

**Input:**
```json
{
  "primary": "#00897B",
  "secondary": "#FF7043",
  "tertiary": "#7B1FA2",
  "neutral": "#78909C",
  "error": "#D32F2F"
}
```

**Output:** Complete tonal palette with WCAG-validated on-colors
```json
{
  "color": {
    "primary": { "0": "#000000", "10": "#00201B", ..., "100": "#FFFFFF" },
    "secondary": { "0": "#000000", "10": "#3A0900", ..., "100": "#FFFFFF" },
    ...
  }
}
```

#### 2. `m3-motion-token-generator` Skill
**Location:** `.claude/skills/design-skills/m3-motion-token-generator.md`

**Purpose:** Generate motion design tokens (easing, duration, patterns)

**Output:**
```json
{
  "motion": {
    "easing": {
      "emphasizedDecelerate": "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
      "emphasizedAccelerate": "cubic-bezier(0.3, 0.0, 0.8, 0.15)",
      "standard": "cubic-bezier(0.4, 0.0, 0.2, 1)"
    },
    "duration": {
      "short1": "50ms",
      "short2": "100ms",
      "medium1": "250ms",
      "long1": "450ms"
    }
  }
}
```

---

## Phase 3: Test Migration (Week 1, Days 4-5)

### Test Components (5 Components)

1. **Button** (`frontend/src/components/ui/Button/`)
   - Most used component (128 instances)
   - Test all variants: primary, secondary, tertiary, outlined, text
   - Validate motion tokens for hover/press states

2. **Card** (`frontend/src/components/ui/Card/`)
   - Surface colors + elevation
   - Expressive shape system

3. **Input** (`frontend/src/components/ui/Input/`)
   - Outlined variant with color states
   - Focus state motion

4. **Badge** (`frontend/src/components/ui/Badge/`)
   - Small component with color variants
   - Test tonal mappings

5. **Dialog** (`frontend/src/components/library/Dialog/`)
   - Complex component with multiple surfaces
   - Motion tokens for enter/exit animations

### Validation Criteria

- ✅ All color tokens resolve correctly
- ✅ WCAG AA compliance (4.5:1 for text, 3:1 for UI)
- ✅ Motion tokens applied to animations
- ✅ No visual regressions
- ✅ Dark mode support

---

## Phase 4: Automation Infrastructure (Week 2, Days 1-3)

### Batch Migration Script

**Location:** `scripts/migrate-to-m3.sh`

**Features:**
- Scan component files for old token references
- Replace with M3 Expressive tokens
- Update CSS variable names
- Run visual regression tests

### CI/CD Integration

**GitHub Actions Workflow:** `.github/workflows/design-system-validation.yml`

**Checks:**
- Token schema validation
- WCAG contrast checks
- Visual regression tests (Percy/Chromatic)
- Bundle size impact report

---

## Phase 5: Full Migration (Week 2-3)

### Component Migration Strategy

**Week 2 (Days 4-7): UI Components (29 components)**
- Base components: Button, Input, Select, Checkbox, Radio, Switch, Slider
- Feedback: Toast, Snackbar, Alert, Badge, Chip, Progress
- Surfaces: Card, Paper, Container, Divider

**Week 3 (Days 1-3): Library & Feature Components (94 components)**
- Library: Modal, Dialog, Drawer, Menu, Tooltip, Popover
- Feature: Forms, Tables, Charts, Career components
- Documents: Editors, Viewers, Generators

**Week 3 (Days 4-5): Validation & Deployment**
- Visual QA across all 128 components
- Dark mode validation
- Accessibility audit
- Production deployment

---

## Success Metrics

### Immediate (Post-Migration)

- ✅ 128/128 components using M3 Expressive tokens
- ✅ 100% WCAG AA compliance
- ✅ 0 visual regressions
- ✅ <5% bundle size increase
- ✅ Dark mode support for all components

### Long-Term (3 Months)

- 📊 Improved design consistency scores (Figma plugin metrics)
- 📊 Reduced design decision time (fewer ad-hoc color choices)
- 📊 Faster component development (pre-built token system)
- 📊 Improved accessibility audit scores

---

## Recommended Next Steps

### This Week (Week 1)

1. ✅ **Choose Preset**: Vibrant Professional (teal/coral) for CareerCopilot
2. 🚀 **Generate Tokens**: "Use Vibrant Professional preset to generate M3 Expressive tokens"
3. 🛠️ **Create M3 Color Skill**: Build `m3-expressive-color-generator` skill (40+ tonal shades)
4. 🛠️ **Create Motion Skill**: Build `m3-motion-token-generator` skill (animations, easing curves)
5. 🧪 **Migrate 5 Test Components**: Validate workflow with Button, Card, Input, Badge, Dialog

### Next 2 Weeks

6. 🤖 **Build Automation**: Create batch migration script and CI/CD integration
7. 📦 **Migrate Remaining**: 123 components in systematic batches
8. 🚀 **Deploy**: Production deployment with visual QA

---

## Appendix: M3 Expressive Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [M3 Color System](https://m3.material.io/styles/color/system/overview)
- [M3 Motion Guidelines](https://m3.material.io/styles/motion/overview)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
