# Design System & M3 Expressive Migration Guide

## Frontend Migration Preparation (Material Design 3)

The project is preparing for automated Material Design 3 (M3) migration. Migration automation skills are being built and will be deployed soon.

### Current Readiness Status

- **Readiness Score:** 12% (based on initial audit)
- **Target Score:** 70% before migration automation
- **Components:** 126 total
- **With Tests:** 17% (22 components)
- **With Storybook:** 2% (3 components)
- **With Index Exports:** 18% (5 components)

### Migration Preparation Commands

#### Quick Start (All-in-One)

```bash
./scripts/prepare-for-migration.sh
# Interactive script that runs all preparation steps in order
# Creates backups, validates each step, runs TypeScript compilation
```

#### Individual Steps

1. **Audit Current Structure:**
   ```bash
   ./scripts/audit-component-structure.sh
   # Analyzes component structure and generates readiness report
   ```

2. **Consolidate Duplicate Directories:**
   ```bash
   ./scripts/consolidate-duplicate-dirs.sh
   # Merges Ksc/KSC, renames PascalCase dirs to kebab-case
   # Updates all imports automatically
   ```

3. **Standardize Component Structure:**
   ```bash
   ./scripts/standardize-component-structure.sh --dry-run  # Preview
   ./scripts/standardize-component-structure.sh           # Apply
   # Moves loose files into ComponentName/ directories
   # Creates index.ts barrel exports
   ```

4. **Generate Component Manifest:**
   ```bash
   node scripts/generate-component-manifest.ts
   # Creates component-manifest.json for automation tools
   # Generates component-manifest-summary.md report
   ```

5. **Validate Migration Readiness:**
   ```bash
   ./scripts/pre-migration-validation.sh
   # Runs 10 validation checks
   # Verifies structure, tests, TypeScript, build, linting
   # Exit code 0 = ready, 1 = not ready
   ```

### M3 Migration Skills (In Development)

Located in `.claude/skills/frontend-migration/`:

- **m3-layout-tokens** - Spacing tokens (padding, margin, gap)
- **m3-visual-tokens** - Color, shape, elevation tokens (78 colors, 7 shapes, 6 levels)
- **m3-typography-tokens** - Type scale + editorial conventions (13 scales + alignment/spacing)
- **m3-interaction-tokens** - Icon sizing/colors + motion tokens (3 sizes, 16 durations, 10 easing)

**Status:** 4 consolidated skills (8 original skills merged into 4 groups by token type)

### Documentation References

- **Quick Start Guide:** `MIGRATION_PREP_QUICKSTART.md` - Step-by-step instructions
- **Full Readiness Report:** `docs/development/FRONTEND_MIGRATION_STATUS.md` - Comprehensive analysis
- **Component Manifest:** `component-manifest.json` - Generated automation data
- **Manifest Summary:** `component-manifest-summary.md` - Human-readable report

### Preparation Workflow

1. Run audit to assess current state
2. Consolidate duplicate directories (Ksc/KSC)
3. Standardize component structure
4. Generate component manifest
5. Address failing validation checks
6. Generate missing tests (use `jest-test-scaffolder` skill)
7. Generate Storybook stories (use `storybook-scaffolder` skill)
8. Re-run validation until 70%+ readiness
9. Wait for M3 migration skills deployment
10. Run automated migration

### Safety Features

- **Backups:** All scripts create timestamped backups in `./backups/`
- **Dry-Run Mode:** Preview changes before applying
- **TypeScript Validation:** All scripts verify compilation after changes
- **Git Integration:** Changes are trackable and reversible
- **Import Auto-Update:** Scripts automatically update imports after restructuring

---

## Design System & Aesthetic Direction (Design Wing)

The project includes a comprehensive **Design Wing** infrastructure for creating and managing design systems with full WCAG compliance and accessibility auditing.

### Design Agents (3 Total)

#### Visual Design Director (`visual-design-director`)

**Role:** Senior Art Director who defines aesthetic direction and visual vibe

**Capabilities:**
- Analyzes design references and creates `aestheticPreferences` JSON
- Orchestrates design critique using vision analysis
- Hands off complete aesthetic specifications to Design Systems Architect

**When to Use:**
- Define visual direction for new features
- Analyze design references and mood boards
- Create aesthetic specifications

#### Design Systems Architect (`design-systems-architect`)

**Role:** Design Operations specialist who translates aesthetics into tokenized systems

**Capabilities:**
- Receives aesthetic preferences and generates complete token system
- Validates color contrast against WCAG AA/AAA standards
- Builds frontend assets (CSS variables, Tailwind configuration)

**When to Use:**
- Convert aesthetic preferences into design tokens
- Generate complete design system from specifications
- Ensure accessibility compliance

#### UX & Accessibility Lead (`ux-accessibility-lead`)

**Role:** User advocate who audits designs for accessibility and usability

**Capabilities:**
- Validates WCAG compliance, focus states, and keyboard navigation
- Audits user flows against Nielsen's 10 Usability Heuristics
- Provides actionable remediation recommendations

**When to Use:**
- Audit designs for accessibility compliance
- Validate user flows and usability
- Ensure WCAG AA/AAA standards compliance

### Design Skills (4 + PDF Multimodal Skills)

#### Design Skills

- `design-critique-vision` - Analyzes screenshots for visual quality, hierarchy, spacing, and contrast
- `m3-design-system-generator` - Complete design token generation (colors, motion, base tokens + WCAG validation)
- `ux-heuristic-audit` - Audits user flows against Nielsen's 10 Usability Heuristics

#### Document Skills (PDF Multimodal)

- `pdf-text-extractor` - Extract text, summarize, answer questions, or parse forms from PDF documents
- Includes specialized guides: `forms.md` (structured form extraction), `reference.md` (usage patterns)

### Design System Automation Scripts

- `scripts/validate-design-tokens.py` - Schema validation, WCAG contrast checking, comprehensive error reporting
- `scripts/build-design-tokens.py` - Generates CSS variables (`:root`) and Tailwind configuration patch
- `scripts/update-design-system.sh` - Orchestration script: validates → builds → reports with error handling
- `design-system/` - Directory for storing `tokens.json` and generated assets

### Design System Workflow (Unified m3-design-system-generator)

```
1. User provides design vibe/reference
   ↓
2. Visual Design Director analyzes & creates aestheticPreferences JSON
   ↓
3. Design Systems Architect calls m3-design-system-generator (unified skill)
   → Generates colors (78+ tokens, 13 tones each)
   → Generates motion (16 durations, 10 easing curves)
   → Generates base tokens (shape, spacing, elevation, typography)
   → Validates WCAG AAA compliance on all color pairs
   ↓
4. Save to design-system/tokens-expressive.json
   ↓
5. Build frontend assets: ./scripts/update-design-system.sh
   ↓
6. Frontend Specialist consumes tokens in components (CSS variables)
   ↓
7. UX & Accessibility Lead audits final design for compliance
```

### Quick Start: Create a Design System

```bash
# 1. Define aesthetics with Visual Design Director
# Request: "Create a design system with a 'premium, minimal' aesthetic"

# 2. Design Systems Architect calls unified m3-design-system-generator
# → Generates 150+ tokens (colors, motion, base tokens)
# → Validates WCAG AAA compliance
# → Saves to: design-system/tokens-expressive.json

# 3. Build frontend assets
./scripts/update-design-system.sh

# 4. Output generated:
# - design-system/tokens-expressive.json (all 150+ tokens)
# - frontend/src/theme/design-tokens.css (CSS custom properties)
# - design-system/tailwind-token-patch.js (Tailwind config patch)
# - design-system/WCAG_VALIDATION_REPORT.md (accessibility audit)

# 5. Import in your app
# Add to frontend/src/App.tsx: import './theme/design-tokens.css'

# 6. Use in components
# .button {
#   background-color: var(--sys-color-primary);
#   color: var(--sys-color-on-primary);
#   animation: fadeIn var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard);
# }
```

### Design System Components

#### Color Tokens

- **System Colors:** Primary, secondary, tertiary variants
- **Semantic Colors:** Success, warning, error, info
- **Neutral Colors:** Surface, background, outline variants
- **Custom Colors:** Brand-specific color palettes

#### Typography Tokens

- **Type Scale:** 13 scales from display to caption
- **Font Weights:** Custom utility classes (text-hero, text-human, text-data, text-hologram)
- **Line Heights:** Optimal reading ratios for each scale
- **Letter Spacing:** Tracking adjustments for readability

#### Motion Tokens

- **Durations:** 16 standardized durations (50ms to 2000ms)
- **Easing Curves:** 10 motion easing functions
- **Animations:** Predefined keyframes for common interactions
- **Transitions:** Standardized transition properties

#### Spatial Tokens

- **Spacing:** Consistent spacing scale (4px to 128px)
- **Corner Radius:** 7 shape variations from subtle to rounded
- **Elevation:** 6 shadow levels for depth hierarchy
- **Grid Systems:** Layout grid and spacing systems

### Accessibility Features

#### WCAG Compliance

- **Color Contrast:** All combinations meet WCAG AA standards, most meet AAA
- **Focus States:** Visible, consistent focus indicators
- **Keyboard Navigation:** Full keyboard accessibility
- **Screen Reader:** Semantic HTML and ARIA labels

#### Usability Heuristics

- **Nielsen's 10 Heuristics:** Built-in validation against usability principles
- **User Flow Analysis:** End-to-end user journey validation
- **Error Prevention:** Proactive error handling and prevention
- **Consistency:** Consistent design patterns across components

### Integration with Frontend

#### CSS Custom Properties

```css
:root {
  /* System Colors */
  --sys-color-primary: #1976d2;
  --sys-color-on-primary: #ffffff;
  
  /* Typography */
  --sys-typescale-headline-large: 32px / 40px;
  --sys-font-weight-hero: var(--font-weight-hero);
  
  /* Motion */
  --sys-motion-duration-medium-2: 300ms;
  --sys-motion-easing-standard: cubic-bezier(0.2, 0.0, 0.0, 1.0);
}
```

#### Tailwind CSS Integration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'sys-primary': 'var(--sys-color-primary)',
        'sys-on-primary': 'var(--sys-color-on-primary)',
      },
      fontFamily: {
        'hero': ['var(--font-family-hero)'],
        'human': ['var(--font-family-human)'],
      },
      animationDuration: {
        'medium-2': 'var(--sys-motion-duration-medium-2)',
      },
    },
  },
}
```

### Best Practices

#### Token Usage

1. **Use semantic tokens** (sys-color-primary) over design tokens (blue-500)
2. **Maintain consistency** across all components
3. **Test accessibility** with actual users and tools
4. **Document exceptions** and design decisions

#### Component Development

1. **Import design tokens** in component files
2. **Use CSS custom properties** for dynamic theming
3. **Test with different color schemes** and contrast settings
4. **Validate keyboard navigation** and screen reader compatibility

#### Design System Maintenance

1. **Regular audits** for accessibility compliance
2. **Version control** for token changes
3. **Documentation updates** for new tokens
4. **Performance monitoring** for token usage

### Troubleshooting

#### Common Issues

1. **Token Not Applied:** Check CSS import order and specificity
2. **Contrast Failures:** Use WCAG validation report for fixes
3. **Animation Issues:** Verify duration and easing values
4. **Typography Problems:** Check font loading and fallbacks

#### Debug Commands

```bash
# Validate design tokens
python3 scripts/validate-design-tokens.py

# Build frontend assets
./scripts/update-design-system.sh

# Check WCAG compliance
cat design-system/WCAG_VALIDATION_REPORT.md
```

### Future Enhancements

#### Planned Features

1. **Dark Mode Support:** Automatic dark mode token generation
2. **Theme Variants:** Multiple theme support (brand, seasonal, etc.)
3. **Component Library:** Pre-built components using design tokens
4. **Design Tools Integration:** Figma/Sketch plugin for token sync

#### Tool Upgrades

1. **Real-time Validation:** Live token validation during development
2. **Performance Optimization:** Token usage analytics and optimization
3. **AI-powered Suggestions:** Automated token recommendations
4. **Cross-platform Support:** React Native, Flutter, and other platforms
