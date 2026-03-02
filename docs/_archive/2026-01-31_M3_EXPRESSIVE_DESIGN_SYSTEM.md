# M3 Expressive Enhancement Plan

**Date:** 2025-11-17
**Purpose:** Migrate CareerCopilot to Material 3 Expressive design system with maximum automation and token efficiency

---

## Executive Summary

### Current State Analysis

**Design Infrastructure (Good Foundation):**

- ✅ 4 design agents (design-project-manager, visual-design-director, design-systems-architect, m3-migration-architect)
- ✅ Design token system (tokens.json → CSS variables)
- ✅ 8-step M3 migration protocol
- ✅ Vision-based design critique
- ✅ WCAG validation

**Critical Gaps for M3 Expressive:**

- ❌ Current tokens are M3 **Standard** (conservative colors, generic Roboto)
- ❌ No M3 **Expressive** characteristics (vibrant colors, dynamic motion, personalization)
- ❌ No motion/animation tokens
- ❌ No automated asset generation (palettes, gradients, icons)
- ❌ Manual migration workflow (agent-by-agent, slow)
- ❌ No component audit for non-compliant code

### M3 Standard vs M3 Expressive

| Characteristic  | M3 Standard (Current)           | M3 Expressive (Target)                           |
| --------------- | ------------------------------- | ------------------------------------------------ |
| **Colors**      | Conservative (blue, purple)     | Vibrant, personalized, 40+ tonal shades          |
| **Typography**  | Roboto (generic)                | Display fonts, variable fonts, expressive scales |
<<<<<<< HEAD
| **Shapes**      | Standard radii (4px, 8px, 12px) | Organic, playful radii, squircles                |
=======
| **Shapes**      | Standard radii (4px, 8px, 12px) | [DEPRECATED_STYLE], playful radii, squircles                |
>>>>>>> restoration-KR-Rage-Figma-v2.0
| **Motion**      | Basic transitions               | Dynamic animations, expressive easing curves     |
| **Personality** | Functional, corporate           | Expressive, personalized, emotional              |

**Target:** Migrate 128 components to M3 Expressive with 80%+ automation

---

## Enhancement Strategy

### Phase 1: Foundation Enhancement (Week 1)

**Focus:** Upgrade agents and skills for M3 Expressive capabilities

### Phase 2: Automation Infrastructure (Week 2)

**Focus:** Batch migration, component audits, asset generation

### Phase 3: Execution (Weeks 3-4)

**Focus:** Migrate all 128 components with automated workflows

---

## Detailed Enhancements

## 1. M3 Expressive Design Agent Enhancements

### 1.1 Enhanced `visual-design-director` (Priority: HIGH)

**Current:** 72 lines, generic M3 guidance
**Enhancement:** Add M3 Expressive presets and knowledge

**New Capabilities:**

```markdown
## M3 Expressive Presets

**Preset 1: Vibrant Professional**

- Primary: Saturated teal (#00897B)
- Secondary: Warm coral (#FF6F61)
- Accent: Electric purple (#7C4DFF)
- Typography: 'Plus Jakarta Sans' (display), 'Inter' (body)
<<<<<<< HEAD
- Shape: Organic radii (4px, 16px, 28px)
=======
- Shape: [DEPRECATED_STYLE] radii (4px, 16px, 28px)
>>>>>>> restoration-KR-Rage-Figma-v2.0
- Motion: Bouncy, expressive easing

**Preset 2: Calm Confidence**

- Primary: Deep navy (#1A237E)
- Secondary: Soft lavender (#9FA8DA)
- Accent: Sunset orange (#FF7043)
- Typography: 'Poppins' (display), 'Open Sans' (body)
- Shape: Rounded (8px, 16px, 24px)
- Motion: Smooth, eased transitions

**Preset 3: Bold & Energetic**

- Primary: Bright magenta (#E91E63)
- Secondary: Vibrant cyan (#00BCD4)
- Accent: Lime green (#CDDC39)
- Typography: 'Montserrat' (display), 'Nunito' (body)
- Shape: Sharp with soft corners (2px, 12px, 20px)
- Motion: Fast, dynamic animations
```

**New Skills to Use:**

- `m3-expressive-preset-selector` - Interactive preset selection
- `m3-color-palette-generator` - Generate 40+ tonal shades per color
- `m3-typography-pairing-finder` - Find expressive font combinations

**File Location:** `.claude/agents/visual-design-director.md`
**Estimated Enhancement:** +150 lines, 3 new sections

---

### 1.2 Enhanced `design-systems-architect` (Priority: HIGH)

**Current:** 34 lines, basic token generation
**Enhancement:** Add M3 Expressive token generation

**New Capabilities:**

```markdown
## M3 Expressive Token Generation

### Tonal Palettes (40+ shades per color)

- Generate complete tonal palette from seed color
- 11 stops: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100
- Dynamic color roles (primary, secondary, tertiary, error, neutral, neutral-variant)

### Motion Tokens

- Easing curves: linear, ease, ease-in, ease-out, ease-in-out, spring, bounce
- Durations: short (100ms), medium (250ms), long (500ms), extra-long (1000ms)
- Transition patterns: fade, slide, scale, rotate, morph

### Advanced Shape Tokens

<<<<<<< HEAD
- Organic radii: 4px, 12px, 20px, 28px (expressive)
=======
- [DEPRECATED_STYLE] radii: 4px, 12px, 20px, 28px (expressive)
>>>>>>> restoration-KR-Rage-Figma-v2.0
- Squircles: iOS-style continuous curves
- Asymmetric radii: top-left != bottom-right for dynamic feel

### Typography Scales (Expressive)

- Display: 57px, 45px, 36px (large, impactful)
- Headline: 32px, 28px, 24px
- Title: 22px, 16px, 14px
- Body: 16px, 14px
- Label: 14px, 12px, 11px
```

**New Skills to Use:**

- `m3-tonal-palette-generator` - Generate 40+ shades
- `m3-motion-token-generator` - Animation tokens
<<<<<<< HEAD
- `m3-advanced-shape-generator` - Organic shapes
=======
- `m3-advanced-shape-generator` - [DEPRECATED_STYLE] shapes
>>>>>>> restoration-KR-Rage-Figma-v2.0

**File Location:** `.claude/agents/design-systems-architect.md`
**Estimated Enhancement:** +100 lines, 4 new sections

---

### 1.3 New Agent: `m3-expressive-migration-coordinator` (Priority: HIGH)

**Purpose:** Orchestrate batch migration of all 128 components

**Capabilities:**

```markdown
## Batch Migration Workflow

### Phase 1: Component Audit (Automated)

1. Scan all 128 components in `frontend/src/components/`
2. Identify non-M3 code (hardcoded colors, spacing, shapes)
3. Categorize by complexity:
   - Simple (20 components): < 50 lines, no state
   - Medium (80 components): 50-200 lines, basic state
   - Complex (28 components): > 200 lines, API calls, context

### Phase 2: Batch Migration (Automated)

1. **Simple Components (Batch 1-4):** Migrate 5 components at a time
   - Use m3-migration-architect for each
   - Parallel execution via 4 Claude instances
   - Total time: 2 hours (20 components)

2. **Medium Components (Batch 5-20):** Migrate 5 components at a time
   - Sequential 8-step migration per component
   - 16 batches × 30 minutes = 8 hours
   - Total time: 1 day (80 components)

3. **Complex Components (Batch 21-28):** Migrate 1 component at a time
   - Manual review + automated migration
   - 28 components × 1 hour = 28 hours
   - Total time: 3.5 days (28 components)

### Phase 3: Validation (Automated)

1. Run visual regression tests (Chromatic)
2. Run accessibility tests (axe-core)
3. Run design token validator
4. Generate migration report
```

**Skills to Create:**

- `component-audit-scanner` - Scan for non-M3 code
- `batch-migration-orchestrator` - Coordinate parallel migrations
- `visual-regression-tester` - Automated screenshot comparison

**File Location:** `.claude/agents/m3-expressive-migration-coordinator.md`
**Estimated Size:** 200+ lines, complete orchestrator

---

## 2. New M3 Expressive Skills

### 2.1 `m3-expressive-color-system` (Priority: CRITICAL)

**Purpose:** Generate complete M3 Expressive color system with tonal palettes

**Input:** Seed colors (primary, secondary, tertiary)
**Output:** Complete JSON with 40+ shades per color

**Example Output:**

```json
{
  "palettes": {
    "primary": {
      "0": "#000000",
      "10": "#00201E",
      "20": "#003735",
      "30": "#004F4C",
      "40": "#006A65",
      "50": "#00867F", // Seed color
      "60": "#00A399",
      "70": "#4DCAB4",
      "80": "#76DBC9",
      "90": "#9FEEE0",
      "95": "#C7FFF5",
      "99": "#F0FFFC",
      "100": "#FFFFFF"
    },
    "secondary": {
      /* ... */
    },
    "tertiary": {
      /* ... */
    },
    "error": {
      /* ... */
    },
    "neutral": {
      /* ... */
    },
    "neutral-variant": {
      /* ... */
    }
  },
  "roles": {
    "primary": "palettes.primary.50",
    "on-primary": "palettes.primary.100",
    "primary-container": "palettes.primary.90",
    "on-primary-container": "palettes.primary.10",
    "secondary": "palettes.secondary.50",
    "surface": "palettes.neutral.98",
    "surface-variant": "palettes.neutral-variant.90"
    // ... 30+ semantic color roles
  }
}
```

**Algorithm:**

- Use HCT (Hue, Chroma, Tone) color space (Material 3 standard)
- Generate perceptually uniform tonal scales
- Ensure WCAG AA/AAA compliance for role pairs

**File Location:** `.claude/skills/design-skills/m3-expressive-color-system.md`
**Estimated Size:** 150+ lines with algorithm details

---

### 2.2 `m3-motion-token-generator` (Priority: HIGH)

**Purpose:** Generate motion/animation tokens for expressive UI

**Output:**

```json
{
  "motion": {
    "durations": {
      "short-1": "50ms",
      "short-2": "100ms",
      "short-3": "150ms",
      "short-4": "200ms",
      "medium-1": "250ms",
      "medium-2": "300ms",
      "medium-3": "350ms",
      "medium-4": "400ms",
      "long-1": "450ms",
      "long-2": "500ms",
      "long-3": "550ms",
      "long-4": "600ms",
      "extra-long-1": "700ms",
      "extra-long-2": "800ms",
      "extra-long-3": "900ms",
      "extra-long-4": "1000ms"
    },
    "easing": {
      "linear": "cubic-bezier(0, 0, 1, 1)",
      "standard": "cubic-bezier(0.2, 0, 0, 1)",
      "standard-accelerate": "cubic-bezier(0.3, 0, 1, 1)",
      "standard-decelerate": "cubic-bezier(0, 0, 0, 1)",
      "emphasized": "cubic-bezier(0.2, 0, 0, 1)",
      "emphasized-accelerate": "cubic-bezier(0.3, 0, 0.8, 0.15)",
      "emphasized-decelerate": "cubic-bezier(0.05, 0.7, 0.1, 1)",
      "expressive": "cubic-bezier(0.4, 0, 0.2, 1)",
      "expressive-bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      "expressive-spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    }
  }
}
```

**CSS Variable Output:**

```css
:root {
  --sys-motion-duration-short-1: 50ms;
  --sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --sys-motion-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

**File Location:** `.claude/skills/design-skills/m3-motion-token-generator.md`
**Estimated Size:** 100+ lines

---

### 2.3 `component-audit-scanner` (Priority: HIGH)

**Purpose:** Scan codebase for non-M3 compliant code

**Scan Patterns:**

```javascript
// Anti-patterns to detect:
const antiPatterns = [
  // Hardcoded colors
  /color:\s*['"]#[0-9a-fA-F]{6}['"]/g,
  /backgroundColor:\s*['"]#[0-9a-fA-F]{6}['"]/g,
  /background:\s*['"]rgb\(/g,

  // Hardcoded spacing
  /padding:\s*['"]\d+px['"]/g,
  /margin:\s*['"]\d+px['"]/g,
  /gap:\s*['"]\d+px['"]/g,

  // Hardcoded shapes
  /borderRadius:\s*['"]\d+px['"]/g,

  // Non-token usage
  /sx=\{\{(?!.*var\(--sys-).*\}\}/g,
];
```

**Output:**

```json
{
  "totalComponents": 128,
  "compliant": 0,
  "nonCompliant": 128,
  "issues": [
    {
      "file": "frontend/src/components/ui/Button/Button.tsx",
      "line": 45,
      "pattern": "hardcoded-color",
      "code": "backgroundColor: '#1976d2'",
      "fix": "backgroundColor: 'var(--sys-color-primary)'"
    },
    {
      "file": "frontend/src/components/ui/Card/Card.tsx",
      "line": 23,
      "pattern": "hardcoded-spacing",
      "code": "padding: '16px'",
      "fix": "padding: 'var(--sys-space-md)'"
    }
  ],
  "priorityMigration": ["Button.tsx (12 issues)", "Card.tsx (8 issues)", "Input.tsx (10 issues)"]
}
```

**File Location:** `.claude/skills/design-skills/component-audit-scanner.md`
**Estimated Size:** 120+ lines with regex patterns

---

### 2.4 `batch-migration-orchestrator` (Priority: HIGH)

**Purpose:** Coordinate parallel migration of multiple components

**Workflow:**

```markdown
## Batch Migration Protocol

### Input

- Component list (5-10 components per batch)
- Migration strategy (simple/medium/complex)
- Parallel execution count (1-4 instances)

### Execution

1. **Preparation:**
   - Read all component files
   - Analyze complexity
   - Generate migration plan

2. **Parallel Migration (if 4 instances):**
   - Instance 1: Components 1-2
   - Instance 2: Components 3-4
   - Instance 3: Components 5-6
   - Instance 4: Components 7-8

3. **Per-Component Steps:**
   - Run m3-migration-architect (8-step protocol)
   - Validate output with component-audit-scanner
   - Run tests (yarn test ComponentName)
   - Commit if passing

4. **Consolidation:**
   - Collect results from all instances
   - Generate batch report
   - Identify failures for manual review

### Output

- Batch migration report (JSON)
- Updated component files
- Test results
- Git commits (one per component)
```

**File Location:** `.claude/skills/design-skills/batch-migration-orchestrator.md`
**Estimated Size:** 150+ lines

---

## 3. Enhanced Token System

### 3.1 M3 Expressive Token Schema

**New Structure:**

```json
{
  "version": "2.0.0-expressive",
  "palettes": {
    "primary": { "0": "#000", "10": "#..." /* ... 11 stops */ },
    "secondary": {
      /* ... */
    },
    "tertiary": {
      /* ... */
    },
    "error": {
      /* ... */
    },
    "neutral": {
      /* ... */
    },
    "neutral-variant": {
      /* ... */
    }
  },
  "roles": {
    "primary": "palettes.primary.40",
    "on-primary": "palettes.primary.100",
    "primary-container": "palettes.primary.90",
    "on-primary-container": "palettes.primary.10"
    // ... 30+ semantic roles
  },
  "motion": {
    "durations": {
      /* ... */
    },
    "easing": {
      /* ... */
    }
  },
  "shape": {
    "corner": {
      "none": "0px",
      "extra-small": "4px",
      "small": "8px",
      "medium": "12px",
      "large": "16px",
      "extra-large": "28px",
      "full": "9999px"
    },
    "squircle": {
      "small": "...", // iOS-style curves
      "medium": "...",
      "large": "..."
    }
  },
  "typography": {
    "family": {
      "display": "'Plus Jakarta Sans', sans-serif",
      "body": "'Inter', sans-serif"
    },
    "scale": {
      "display-large": { "size": "57px", "weight": 400, "lineHeight": 64 },
      "display-medium": { "size": "45px", "weight": 400, "lineHeight": 52 },
      "display-small": { "size": "36px", "weight": 400, "lineHeight": 44 },
      "headline-large": { "size": "32px", "weight": 400, "lineHeight": 40 }
      // ... 13 type scales total
    }
  },
  "spacing": {
    "scale": {
      "space-0": "0px",
      "space-1": "4px",
      "space-2": "8px",
      "space-3": "12px",
      "space-4": "16px",
      "space-5": "20px",
      "space-6": "24px",
      "space-7": "28px",
      "space-8": "32px",
      "space-10": "40px",
      "space-12": "48px",
      "space-16": "64px"
    }
  },
  "elevation": {
    "level-0": { "shadow": "none" },
    "level-1": { "shadow": "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)" },
    "level-2": { "shadow": "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)" }
    // ... 5 elevation levels
  }
}
```

**File Location:** `design-system/tokens-expressive.json`
**Estimated Size:** 800+ lines (complete M3 Expressive token system)

---

### 3.2 CSS Variable Generation (Enhanced)

**Current Output:** 64 lines
**Enhanced Output:** 200+ lines

**New CSS Variables:**

```css
:root {
  /* Tonal Palettes (40+ shades per color) */
  --sys-palette-primary-0: #000000;
  --sys-palette-primary-10: #00201e;
  --sys-palette-primary-20: #003735;
  /* ... 11 stops × 6 palettes = 66 variables */

  /* Semantic Color Roles (30+) */
  --sys-color-primary: var(--sys-palette-primary-40);
  --sys-color-on-primary: var(--sys-palette-primary-100);
  --sys-color-primary-container: var(--sys-palette-primary-90);
  --sys-color-on-primary-container: var(--sys-palette-primary-10);
  /* ... 30+ role variables */

  /* Motion Tokens (20+) */
  --sys-motion-duration-short-1: 50ms;
  --sys-motion-duration-medium-2: 300ms;
  --sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --sys-motion-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  /* ... 20+ motion variables */

  /* Advanced Shape Tokens */
  --sys-shape-corner-extra-small: 4px;
  --sys-shape-corner-large: 16px;
  --sys-shape-corner-extra-large: 28px;
  --sys-shape-squircle-small: /* iOS curve */;
  /* ... 10+ shape variables */

  /* Typography Scales (13 scales) */
  --sys-type-display-large-size: 57px;
  --sys-type-display-large-weight: 400;
  --sys-type-display-large-line-height: 64px;
  /* ... 39 typography variables (13 scales × 3 props) */

  /* Spacing (12 stops) */
  --sys-space-0: 0px;
  --sys-space-1: 4px;
  --sys-space-4: 16px;
  --sys-space-12: 48px;
  /* ... 12 spacing variables */

  /* Elevation (5 levels) */
  --sys-elevation-level-0: none;
  --sys-elevation-level-1: 0px 1px 2px rgba(0, 0, 0, 0.3);
  /* ... 5 elevation variables */
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --sys-color-primary: var(--sys-palette-primary-80);
    --sys-color-on-primary: var(--sys-palette-primary-20);
    /* ... auto-inverse all roles */
  }
}
```

**File Location:** `frontend/src/styles/design-tokens-expressive.css`
**Estimated Size:** 250+ lines

---

## 4. Automated Asset Generation

### 4.1 Color Palette Exporter

**Formats:**

- **Figma Plugin JSON:** Import directly to Figma
- **Tailwind Config:** Extend Tailwind with M3 colors
- **CSS Variables:** Already generated
- **SCSS Variables:** For legacy projects
- **iOS Swift:** UIColor extensions
- **Android XML:** colors.xml

**Example Output (Tailwind):**

```javascript
// design-system/tailwind-m3-expressive.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          0: "var(--sys-palette-primary-0)",
          10: "var(--sys-palette-primary-10)",
          // ... 11 stops
          DEFAULT: "var(--sys-color-primary)",
        },
        secondary: {
          /* ... */
        },
      },
      spacing: {
        0: "var(--sys-space-0)",
        1: "var(--sys-space-1)",
        4: "var(--sys-space-4)",
        // ... 12 stops
      },
      borderRadius: {
        xs: "var(--sys-shape-corner-extra-small)",
        lg: "var(--sys-shape-corner-large)",
        xl: "var(--sys-shape-corner-extra-large)",
      },
    },
  },
};
```

**File Location:** `scripts/export-design-tokens.py`
**Estimated Size:** 200+ lines (multi-format export)

---

### 4.2 Component Storybook Generator (Enhanced)

**Current:** Basic story generation
**Enhancement:** Add M3 Expressive variants

**New Story Template:**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: 'var(--sys-color-surface)' },
        { name: 'surface-variant', value: 'var(--sys-color-surface-variant)' },
      ],
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'text', 'elevated', 'tonal'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: 'Button',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Button',
  },
};

// M3 Expressive Variants
export const WithMotion: Story = {
  args: {
    variant: 'filled',
    children: 'Animated Button',
    // Component uses motion tokens internally
  },
  play: async ({ canvasElement }) => {
    // Interaction test: hover should trigger bounce animation
    const button = canvasElement.querySelector('button');
    await userEvent.hover(button);
    // Assert: animation class applied
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--sys-space-4)' }}>
      <Button variant="filled">Primary</Button>
      <Button variant="filled" color="secondary">Secondary</Button>
      <Button variant="filled" color="tertiary">Tertiary</Button>
    </div>
  ),
};
```

**File Location:** `.claude/skills/storybook-scaffolder/templates/m3-expressive-story.tsx.tpl`
**Estimated Size:** 150+ lines

---

## 5. Automation Workflows

### 5.1 One-Command Migration

**Script:** `npm run migrate:m3-expressive`

**Workflow:**

```bash
#!/bin/bash
# scripts/migrate-to-m3-expressive.sh

echo "🎨 Starting M3 Expressive Migration..."

# Step 1: Component Audit
echo "📊 Step 1/6: Auditing components..."
node scripts/audit-components.js > .migration-report.json

# Step 2: Generate M3 Expressive Tokens
echo "🎨 Step 2/6: Generating M3 Expressive tokens..."
python3 scripts/generate-m3-expressive-tokens.py

# Step 3: Build CSS Variables
echo "🔧 Step 3/6: Building CSS variables..."
python3 scripts/build-design-tokens.py

# Step 4: Migrate Components (Batch)
echo "🚀 Step 4/6: Migrating components..."
node scripts/batch-migrate-components.js --parallel=4

# Step 5: Run Tests
echo "✅ Step 5/6: Running tests..."
yarn test:ci

# Step 6: Visual Regression
echo "📸 Step 6/6: Visual regression testing..."
yarn chromatic --auto-accept-changes

echo "✨ M3 Expressive migration complete!"
echo "📊 View report: .migration-report.json"
```

**File Location:** `scripts/migrate-to-m3-expressive.sh`
**Estimated Size:** 100+ lines with error handling

---

### 5.2 Pre-commit Hook (M3 Compliance)

**Hook:** `.husky/pre-commit`

**Check:**

```bash
#!/bin/bash
# .husky/pre-commit

# Run M3 compliance checker on staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(tsx?|jsx?)$')

if [ -n "$STAGED_FILES" ]; then
  echo "🎨 Checking M3 compliance..."
  node scripts/check-m3-compliance.js $STAGED_FILES

  if [ $? -ne 0 ]; then
    echo "❌ M3 compliance check failed!"
    echo "Fix issues or run: npm run migrate:m3-expressive"
    exit 1
  fi

  echo "✅ M3 compliance check passed!"
fi
```

**File Location:** `.husky/pre-commit`
**Estimated Size:** 30+ lines

---

### 5.3 CI/CD Integration

**GitHub Actions Workflow:** `.github/workflows/m3-compliance.yml`

```yaml
name: M3 Compliance Check

on:
  pull_request:
    paths:
      - "frontend/src/**/*.tsx"
      - "frontend/src/**/*.ts"

jobs:
  m3-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install Dependencies
        run: yarn install

      - name: M3 Compliance Check
        run: |
          node scripts/check-m3-compliance.js frontend/src/
          if [ $? -ne 0 ]; then
            echo "❌ M3 compliance issues detected"
            echo "Run: npm run migrate:m3-expressive"
            exit 1
          fi

      - name: Visual Regression (Chromatic)
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          autoAcceptChanges: false
```

**File Location:** `.github/workflows/m3-compliance.yml`
**Estimated Size:** 50+ lines

---

## 6. Token Usage Efficiency

### 6.1 Optimization Strategies

**Problem:** Design workflows can consume many tokens if agents chat back and forth

**Solution: Stateless Skills with JSON I/O**

**Current Workflow (Inefficient):**

```
User: "I want a vibrant design"
  ↓ (150 tokens)
visual-design-director: "What kind of vibrant? Bold or calm?"
  ↓ (80 tokens)
User: "Bold"
  ↓ (5 tokens)
visual-design-director: "Here's my aestheticPreferences JSON..."
  ↓ (200 tokens)
design-systems-architect: "I'll generate tokens..."
  ↓ (150 tokens)
Total: 585 tokens
```

**Optimized Workflow (Efficient):**

```
User: "I want a vibrant, bold design with coral and teal"
  ↓ (50 tokens)
visual-design-director: (uses m3-expressive-preset-selector skill)
  → Returns complete aestheticPreferences JSON (100 tokens)
  ↓
design-systems-architect: (uses m3-expressive-color-system skill)
  → Returns complete tokens.json (150 tokens)
  ↓
Scripts run (no tokens): build-design-tokens.py
Total: 300 tokens (48% savings)
```

**Key Efficiency Techniques:**

1. **Use skills instead of conversational agents** (skills are stateless, no back-and-forth)
2. **Batch operations** (migrate 10 components at once, not 1-by-1)
3. **Automate via scripts** (Python/Node scripts consume 0 tokens)
4. **Use presets** (avoid "what do you want?" questions)

---

### 6.2 Preset-Driven Workflows

**M3 Expressive Presets (Instant Selection):**

```markdown
User: "I want preset 3: Bold & Energetic"
↓ (10 tokens)
visual-design-director: (loads preset from file, no generation)
→ Returns preset JSON from .claude/presets/bold-energetic.json
↓ (50 tokens)
design-systems-architect: (builds tokens from preset)
→ Runs build script (0 tokens)
↓
Total: 60 tokens (90% savings vs custom design)
```

**Preset Files:**

```
.claude/presets/
├── vibrant-professional.json
├── calm-confidence.json
├── bold-energetic.json
├── minimal-elegant.json
└── playful-creative.json
```

**File Location:** `.claude/presets/`
**Estimated Files:** 5 presets × 100 lines each

---

## 7. Implementation Timeline

### Week 1: Foundation Enhancement (5 days)

**Day 1-2: Agent Enhancements**

- Enhance visual-design-director (+150 lines)
- Enhance design-systems-architect (+100 lines)
- Create m3-expressive-migration-coordinator (200 lines)
- **Deliverable:** 3 enhanced/new agents

**Day 3-4: Skill Creation**

- Create m3-expressive-color-system skill (150 lines)
- Create m3-motion-token-generator skill (100 lines)
- Create component-audit-scanner skill (120 lines)
- Create batch-migration-orchestrator skill (150 lines)
- **Deliverable:** 4 new skills

**Day 5: Testing & Validation**

- Test token generation with sample presets
- Validate component audit scanner on 10 components
- Run batch migration on 5 test components
- **Deliverable:** Validated infrastructure

---

### Week 2: Automation Infrastructure (5 days)

**Day 1-2: Scripts & Automation**

- Create migrate-to-m3-expressive.sh (100 lines)
- Create audit-components.js (200 lines)
- Create batch-migrate-components.js (300 lines)
- Create check-m3-compliance.js (150 lines)
- **Deliverable:** 4 automation scripts

**Day 3: CI/CD Integration**

- Add pre-commit hook (.husky/pre-commit)
- Create GitHub Actions workflow (m3-compliance.yml)
- Integrate Chromatic for visual regression
- **Deliverable:** Automated compliance checks

**Day 4: Asset Generation**

- Create export-design-tokens.py (200 lines)
- Generate Tailwind config from tokens
- Generate Figma plugin JSON
- **Deliverable:** Multi-format asset export

**Day 5: Presets & Templates**

- Create 5 M3 Expressive presets
- Create enhanced Storybook templates
- Create migration documentation
- **Deliverable:** 5 presets, enhanced templates

---

### Week 3-4: Execution (10 days)

**Week 3: Simple & Medium Components (100 components)**

- Day 1-2: Audit all 128 components
- Day 3-4: Migrate 20 simple components (4 batches × 5 components)
- Day 5: Migrate 80 medium components (16 batches × 5 components)
- **Deliverable:** 100 components migrated

**Week 4: Complex Components & Finalization (28 components)**

- Day 1-3: Migrate 28 complex components (1 at a time with manual review)
- Day 4: Visual regression testing (Chromatic)
- Day 5: Final validation, documentation, deployment
- **Deliverable:** All 128 components migrated, deployed

---

## 8. Success Metrics

### Migration Efficiency

| Metric                        | Current (Manual)      | Target (Automated) | Improvement   |
| ----------------------------- | --------------------- | ------------------ | ------------- |
| **Time per Component**        | 2 hours               | 15 minutes         | 88% faster    |
| **Total Migration Time**      | 256 hours (32 days)   | 32 hours (4 days)  | 87% faster    |
| **Token Usage per Component** | 1000 tokens           | 200 tokens         | 80% savings   |
| **Error Rate**                | 20% (manual mistakes) | 5% (validated)     | 75% reduction |

### Quality Metrics

| Metric                 | Target                                  |
| ---------------------- | --------------------------------------- |
| **M3 Compliance**      | 100% (all components use design tokens) |
| **WCAG AA Compliance** | 100% (automated validation)             |
| **Test Coverage**      | 90%+ (components + M3 compliance)       |
| **Visual Regression**  | 0 unintended changes (Chromatic)        |

### Automation Metrics

| Metric                        | Target                             |
| ----------------------------- | ---------------------------------- |
| **Automated Component Audit** | 100% (scans all 128)               |
| **Batch Migration Capacity**  | 5-10 components per batch          |
| **Parallel Execution**        | 4 instances simultaneously         |
| **CI/CD Integration**         | 100% (pre-commit + GitHub Actions) |

---

## 9. Cost-Benefit Analysis

### Manual Migration Cost (Current Baseline)

**Assumptions:**

- 128 components to migrate
- 2 hours per component (manual coding)
- Developer rate: $75/hour
- Claude API costs: $1000 tokens × 128 components = $12.80

**Total Cost:**

- Developer time: 256 hours × $75 = $19,200
- API costs: $12.80
- **Total: $19,212.80**

---

### Automated Migration Cost (With Enhancement)

**Assumptions:**

- 1 week to build infrastructure (40 hours × $75 = $3,000)
- 1 week for automated migration (8 hours × $75 = $600)
- Claude API costs: 200 tokens × 128 components = $2.56

**Total Cost:**

- Infrastructure: $3,000
- Migration execution: $600
- API costs: $2.56
- **Total: $3,602.56**

---

### Cost Savings

**Savings:** $19,212.80 - $3,602.56 = **$15,610.24 (81% savings)**

**ROI:** Infrastructure pays for itself immediately on first migration, then reusable for future projects

**Additional Benefits:**

- Reusable automation for future projects (amortized cost)
- Higher quality (validated, tested, consistent)
- Faster iteration (change tokens, rebuild in seconds)
- Better maintainability (single source of truth)

---

## 10. Risk Mitigation

### Risk 1: Automated Migration Breaks Components

**Mitigation:**

- Run component tests after each migration
- Visual regression testing with Chromatic
- Manual review of complex components
- Rollback capability (git revert per component)

---

### Risk 2: M3 Expressive Tokens Don't Match Brand

**Mitigation:**

- Use presets as starting point, not final
- visual-design-director can customize any preset
- Iterative refinement (generate → review → adjust)
- Export to Figma for designer review

---

### Risk 3: Performance Degradation (CSS Variables)

**Mitigation:**

- CSS variables are performant (native browser support)
- Compile to static values in production (PostCSS)
- Benchmark before/after migration
- Monitor Core Web Vitals

---

### Risk 4: Developer Resistance (New System)

**Mitigation:**

- Comprehensive documentation
- Storybook examples for every component
- Pre-commit hooks enforce compliance (can't ignore)
- Gradual rollout (simple components first)

---

## 11. Documentation Requirements

### For Developers

**Files to Create:**

1. `docs/M3_EXPRESSIVE_GUIDE.md` - Complete developer guide
2. `docs/DESIGN_TOKEN_USAGE.md` - How to use tokens in components
3. `docs/MIGRATION_RUNBOOK.md` - Step-by-step migration instructions
4. `docs/M3_COMPLIANCE_CHECKLIST.md` - PR review checklist

### For Designers

**Files to Create:**

1. `docs/DESIGN_SYSTEM_OVERVIEW.md` - High-level design system guide
2. `docs/FIGMA_INTEGRATION.md` - Export tokens to Figma
3. `docs/COLOR_PALETTE_GUIDE.md` - Tonal palette usage
4. `docs/MOTION_GUIDELINES.md` - Animation best practices

---

## 12. Next Steps

### Immediate Actions (This Week)

1. **Review and Approve Plan** (30 min)
   - Review this document
   - Approve timeline and scope

2. **Start Week 1 Implementation** (5 days)
   - Enhance agents (visual-design-director, design-systems-architect)
   - Create new skills (m3-expressive-color-system, etc.)
   - Validate on 5 test components

3. **Set Up Chromatic** (1 hour)
   - Sign up for Chromatic
   - Add CHROMATIC_PROJECT_TOKEN to GitHub Secrets
   - Configure visual regression testing

---

## Summary

This enhancement plan provides:

✅ **Complete M3 Expressive Infrastructure** (agents, skills, tokens)
✅ **Maximum Automation** (87% faster, 80% token savings)
✅ **High Quality** (validated, tested, WCAG compliant)
✅ **Reusable Components** (presets, scripts, templates)
✅ **Clear Timeline** (4 weeks, phased approach)
✅ **Strong ROI** (81% cost savings, $15,610 saved)

**Ready to proceed?** Start with Week 1: Foundation Enhancement.
