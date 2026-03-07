---
name: kr-shapes
description: KR Solidarity v6.1 shape system - M3 Expressive morphing tokens, archetype palettes, asymmetric-only geometry
category: design-tokens
version: 6.1.0
priority: high
prerequisites:
  - kerala-rage-brand-enforcer
  - token-orchestrator
  - m3-expressive-ui-evaluator
---

# KR Shapes v6.1

## Purpose
Enforce Kerala Rage Solidarity v6.1 shape token system across all UI development (React, CSS, Tailwind, Figma). Prevents hardcoded `border-radius`, eliminates uniform corner geometry ("Institutional Squelch"), and ensures archetype-driven morphing states follow M3 Expressive principles.

**Core principle**: All shapes are **asymmetric, semantic, and morph-capable** (except Scaffold, which is intentionally immutable).

## When to Use

**ALWAYS invoke this skill when**:
- Writing React components with `border-radius` or `rounded-*` classes
- Modifying component shape/corner styles
- Creating Tailwind utility classes for shapes
- Writing design documentation (wireframes, specs, component catalogs)
- Reviewing PRs with shape-related changes
- Generating Figma wireframes or design handoff specs

**Critical triggers**:
- Any appearance of `border-radius: 8px` or hardcoded pixel values
- `rounded-md`, `rounded-lg`, `rounded-xl` Tailwind classes (generic, BANNED)
- `border-radius: 50%` (BANNED — use `--sys-radius-full` or `sentryAvatar`)
- New button, card, input, modal, or container components
- State transitions (hover, press, loading, selected)

## Capabilities

### 1. Shape Token Enforcement
- **Validates** all `border-radius` values reference semantic CSS variables (`--shape-*`)
- **Blocks** hardcoded pixel values, percentages, or generic Tailwind classes
- **Enforces** archetype-specific shape palettes (Strike → `blockRiot03`, March → `pillMarch01`, etc.)

### 2. Morph State Generation
- **Provides** complete state chains for interactive archetypes:
  - Strike: `base → pressed → active → selected → loading`
  - March: `base → pressed → open → expanded`
  - Placard: `base → selected → loading`
  - Megaphone: `base → loading → ambient`
- **Enforces** Scaffold invariance (no morphing — `scaffoldSlab01` never changes)

### 3. Anti-Slop Validation
- **Detects** uniform corner radius (all 4 corners identical) violations
- **Blocks** `shape.blob*` tokens (substrateTile*) outside approved contexts (Substrate archetype, hero frames, avatars)
- **Flags** 50% border-radius usage (institutional circles BANNED)
- **Ensures** tier compliance (Core UI legible, Decorative expressive, Tension aggressive)

### 4. Code Generation
- **React pattern**: `borderRadius: shapeVar('blockRiot03')`
- **Framer Motion morph**: `whileTap={{borderRadius: shapeVar('blockRiot03-pressed')}}`
- **Tailwind integration**: `[data-shape="blockRiot03"]` with CSS variable mapping
- **Archetype helper**: `shapeOf('Strike', 'pressed')` → `var(--shape-blockRiot03-pressed)`

## Shape Token Library (v6.1)

### Base Radius Scale (Primitives)
| Token | Value | Usage Context |
|-------|-------|---------------|
| `radius.xs` | `2px` | Micro accents, fine details |
| `radius.sm` | `4px` | Subtle rounding |
| `radius.md` | `8px` | Default corner softness |
| `radius.lg` | `12px` | Calm containers |
| `radius.xl` | `20px` | Large controls |
| `radius.xxl` | `32px` | Surface containers |
| `radius.xxxl` | `48px` | Hero elements |
| `radius.full` | `9999px` | Pills (NEVER use `50%`) |

### Core UI Shape Tokens

#### **Strike Archetype** (Decisive Actions, CTAs)
| Token | Definition | State | Metaphor |
|-------|------------|-------|----------|
| `blockRiot03` | `32px 2px 2px 2px` | Base | Corner-dominant riot shield |
| `blockRiot03-pressed` | `20px 4px 12px 2px` | Pressed | Impact deform (= blockRiot02) |
| `blockRiot02` | `20px 4px 12px 2px` | Active/Hover | Tension shift |
| `alertShard01` | `32px 2px 2px 32px` | Selected/Error | Alert shard geometry |
| `blockRiot03-loading` | `9999px` | Loading | Pill collapse |

**Usage**: Primary buttons, critical CTAs, defiance moments
**Motion**: `typeSpringSlam` (600ms, M3 Expressive)

#### **March Archetype** (Navigation, Expanding Containers)
| Token | Definition | State | Metaphor |
|-------|------------|-------|----------|
| `pillMarch01` | `9999px` | Base | Full pill (NEVER 50%) |
| `pillMarch01-pressed` | `9999px 8px 9999px 8px` | Pressed | Pill with flat edges |
| `pebbleSurge01` | `20px 8px 12px 32px` | Open | Asymmetric expansion |
| `pebbleSurge01-expanded` | `32px 12px 8px 48px` | Fully Open | Maximum organic spread |

**Usage**: Dropdowns, selects, accordions, expanding panels
**Motion**: `dragSettle` (800ms, viscous-breeze)

#### **Placard Archetype** (Content Cards, Containers)
| Token | Definition | State | Metaphor |
|-------|------------|-------|----------|
| `placardTorn01` | `48% 52% 58% 42% / 55% 45% 60% 40%` | Base | Torn poster corner (organic % radii) |
| `placardTorn01-selected` | `20px 4px 12px 2px` | Selected | Sharp focus (= blockRiot02) |

**Usage**: Opportunity cards, kanban items, content surfaces
**Motion**: `dragSettle` (800ms)

#### **Megaphone Archetype** (Modals, Interruptions)
| Token | Definition | State | Metaphor |
|-------|------------|-------|----------|
| `megaphoneCut01` | `42% 58% 45% 55% / 48% 62% 38% 52%` | Base | Megaphone mouth (organic % radii) |
| `megaphoneCut01-loading` | `48% 52% 58% 42% / 55% 45% 60% 40%` | Loading | Morph to placardTorn01 |

**Usage**: Modals, alerts, critical overlays
**Motion**: `typeSpringSlam` (600ms)

#### **Scaffold Archetype** (Forms, Inputs — IMMUTABLE)
| Token | Definition | State | Metaphor |
|-------|------------|-------|----------|
| `scaffoldSlab01` | `8px 2px 8px 2px` | Base | Construction plank (NEVER morphs) |
| `scaffoldSlab01-focus` | `8px 2px 8px 2px` | Focus | Unchanged (Scaffold Law 4: invariance) |

**Usage**: Text inputs, textareas, form elements, structural containers
**Motion**: **NONE** (Scaffold is immutable — if it morphs, it's not Scaffold)

### Decorative Shape Tokens (RESTRICTED)

#### **Substrate Archetype** (Ambient Backgrounds, Hero Frames)
| Token | Definition | Tier | Whitelist Context |
|-------|------------|------|-------------------|
| `substrateTile02` | `40% 60% 70% 30% / 40% 50% 60% 50%` | Decorative | Base canvas, hero frames |
| `substrateTile01` | `60% 40% 30% 70% / 60% 30% 70% 40%` | Decorative | Ambient morph state |
| `substrateTile01-hover` | `70% 30% 40% 60% / 50% 60% 40% 50%` | Decorative | Hover drift |

**⚠️ BANNED OUTSIDE WHITELIST**:
- Substrate archetype components only
- Hero compositions (registered in `kr-solidarity-hero-registry.json`)
- Avatar masks (`sentryAvatar` = `98%` for near-circle compliance)

**Motion**: `waterRipple` (3000ms, slow ambient drift)

### Tension Shape Tokens (Aggressive, Structural)
| Token | Definition | Usage |
|-------|------------|-------|
| `tearBanner01` | `0 48px 0 0` | Scroll-triggered reveals, right-corner tear |
| `brickWall01` | `0` | Hard construction, structural dividers, data tables (completely flat) |
| `alertShard01` | `32px 2px 2px 32px` | Error states, critical warnings |

## Archetype Shape Palette Reference

```typescript
// Import helper utilities
import { shapeVar, shapeOf, motionOf } from '@/design/tokens/archetypes';

// STRIKE ARCHETYPE
const Strike = {
  shapes: {
    base: 'blockRiot03',              // 32px 2px 2px 2px
    pressed: 'blockRiot03-pressed',   // 20px 4px 12px 2px
    active: 'blockRiot02',            // 20px 4px 12px 2px
    selected: 'alertShard01',         // 32px 2px 2px 32px
    loading: 'blockRiot03-loading',   // 9999px
  },
  motion: 'typeSpringSlam', // 600ms
};

// MARCH ARCHETYPE
const March = {
  shapes: {
    base: 'pillMarch01',              // 9999px
    pressed: 'pillMarch01-pressed',   // 9999px 8px 9999px 8px
    open: 'pebbleSurge01',            // 20px 8px 12px 32px
    expanded: 'pebbleSurge01-expanded', // 32px 12px 8px 48px
  },
  motion: 'dragSettle', // 800ms
};

// PLACARD ARCHETYPE
const Placard = {
  shapes: {
    base: 'placardTorn01',            // 48% 52% 58% 42% / 55% 45% 60% 40%
    selected: 'placardTorn01-selected', // 20px 4px 12px 2px
  },
  motion: 'dragSettle', // 800ms
};

// MEGAPHONE ARCHETYPE
const Megaphone = {
  shapes: {
    base: 'megaphoneCut01',           // 42% 58% 45% 55% / 48% 62% 38% 52%
    loading: 'megaphoneCut01-loading', // 48% 52% 58% 42% / 55% 45% 60% 40%
  },
  motion: 'typeSpringSlam', // 600ms
};

// SCAFFOLD ARCHETYPE (IMMUTABLE)
const Scaffold = {
  shapes: {
    base: 'scaffoldSlab01',           // 8px 2px 8px 2px
    focus: 'scaffoldSlab01-focus',    // 8px 2px 8px 2px (unchanged)
  },
  motion: null, // NO MORPHING
};

// SUBSTRATE ARCHETYPE (RESTRICTED - whitelist only)
const Substrate = {
  shapes: {
    base: 'substrateTile02',          // 40% 60% 70% 30% / 40% 50% 60% 50%
    ambient: 'substrateTile01',       // 60% 40% 30% 70% / 60% 30% 70% 40%
    hover: 'substrateTile01-hover',   // 70% 30% 40% 60% / 50% 60% 40% 50%
  },
  motion: 'waterRipple', // 3000ms
};
```

## React Implementation Patterns

### Pattern 1: Basic Shape Assignment (Static)
```tsx
import { shapeVar } from '@/design/tokens/archetypes';

export const SolidarityCard = () => (
  <div style={{
    borderRadius: shapeVar('placardTorn01'), // ✅ Correct
    // NOT: borderRadius: '8px',             // ❌ Hardcoded BANNED
    // NOT: borderRadius: '50%',             // ❌ 50% BANNED
  }}>
    {/* Card content */}
  </div>
);
```

### Pattern 2: Archetype Helper (Recommended)
```tsx
import { shapeOf, motionOf } from '@/design/tokens/archetypes';

export const StrikeButton = () => (
  <button style={{
    borderRadius: shapeOf('Strike'),           // Base state
    transition: `border-radius ${motionOf('Strike')}`,
  }}>
    Decisive Action
  </button>
);
```

### Pattern 3: Framer Motion Morph States
```tsx
import { motion } from 'framer-motion';
import { shapeVar, shapeOf } from '@/design/tokens/archetypes';

export const MarchDropdown = ({ isOpen }) => (
  <motion.div
    style={{
      borderRadius: shapeOf('March', 'base'), // pillMarch01
    }}
    animate={{
      borderRadius: isOpen
        ? shapeVar('pebbleSurge01-expanded')  // Fully open
        : shapeVar('pillMarch01'),            // Closed
    }}
    transition={{
      type: 'spring',
      damping: 20,
      stiffness: 100,
      duration: 0.8, // dragSettle motion
    }}
  >
    {/* Dropdown content */}
  </motion.div>
);
```

### Pattern 4: Complete State Machine (Strike CTA)
```tsx
import { motion } from 'framer-motion';
import { shapeVar } from '@/design/tokens/archetypes';

export const StrikeCTA = ({ isLoading, isSelected }) => {
  const getShapeState = () => {
    if (isLoading) return shapeVar('blockRiot03-loading');
    if (isSelected) return shapeVar('alertShard01');
    return shapeVar('blockRiot03'); // Base
  };

  return (
    <motion.button
      style={{ borderRadius: getShapeState() }}
      whileHover={{ borderRadius: shapeVar('blockRiot02') }}
      whileTap={{ borderRadius: shapeVar('blockRiot03-pressed') }}
      transition={{
        type: 'spring',
        damping: 22,
        stiffness: 120,
        duration: 0.6, // typeSpringSlam
      }}
    >
      {isLoading ? 'Loading...' : 'Take Action'}
    </motion.button>
  );
};
```

### Pattern 5: Scaffold Invariance (NO MORPH)
```tsx
import { shapeVar } from '@/design/tokens/archetypes';

export const ScaffoldInput = () => (
  <input
    style={{
      borderRadius: shapeVar('scaffoldSlab01'), // IMMUTABLE
    }}
    // NO onFocus shape change
    // NO hover shape change
    // Scaffold never morphs — if it does, it's not Scaffold
  />
);
```

## Tailwind Integration

### Custom Utility Classes (Recommended)
```css
/* frontend/src/styles/design-tokens.css */

/* Archetype shape utilities */
.kr-shape-strike-base { border-radius: var(--shape-blockRiot03); }
.kr-shape-strike-pressed { border-radius: var(--shape-blockRiot03-pressed); }
.kr-shape-strike-active { border-radius: var(--shape-blockRiot02); }
.kr-shape-strike-selected { border-radius: var(--shape-alertShard01); }

.kr-shape-march-base { border-radius: var(--shape-pillMarch01); }
.kr-shape-march-open { border-radius: var(--shape-pebbleSurge01); }

.kr-shape-placard-base { border-radius: var(--shape-placardTorn01); }
.kr-shape-scaffold-base { border-radius: var(--shape-scaffoldSlab01); }
```

### Data Attribute Pattern (Dynamic)
```tsx
<button
  data-shape="blockRiot03"
  className="kr-shape"
>
  Strike Button
</button>
```

```css
/* Dynamic shape mapping */
[data-shape="blockRiot03"] { border-radius: var(--shape-blockRiot03); }
[data-shape="pillMarch01"] { border-radius: var(--shape-pillMarch01); }
[data-shape="placardTorn01"] { border-radius: var(--shape-placardTorn01); }
```

## Anti-Slop Validation Rules

### BANNED Patterns (Validator Will Flag)

#### ❌ Rule 1: Hardcoded Pixel Values
```tsx
// BANNED
<div style={{ borderRadius: '8px' }} />
<div style={{ borderRadius: '12px' }} />
<button className="rounded-md" />  // Generic Tailwind BANNED
```

```tsx
// CORRECT
<div style={{ borderRadius: shapeVar('blockRiot03') }} />
<div style={{ borderRadius: 'var(--shape-placardTorn01)' }} />
<button className="kr-shape-strike-base" />
```

#### ❌ Rule 2: 50% Border Radius (Institutional Circles)
```tsx
// BANNED
<div style={{ borderRadius: '50%' }} />
<img className="rounded-full" /> // Only if using 50% internally
```

```tsx
// CORRECT
<div style={{ borderRadius: 'var(--sys-radius-full)' }} /> // 9999px pill
<img style={{ borderRadius: 'var(--sys-radius-sentryAvatar)' }} /> // 98% near-circle
```

#### ❌ Rule 3: Uniform Corner Radius (All 4 Corners Identical)
```tsx
// BANNED (unless using approved pill tokens)
<div style={{ borderRadius: '20px 20px 20px 20px' }} />
```

```tsx
// CORRECT (asymmetric only)
<div style={{ borderRadius: 'var(--shape-blockRiot03)' }} /> // 32px 2px 2px 2px
<div style={{ borderRadius: 'var(--shape-pillMarch01)' }} /> // 9999px (approved pill)
```

#### ❌ Rule 4: Blob Tokens Outside Whitelist
```tsx
// BANNED (outside Substrate archetype or hero frames)
<div
  className="content-card"
  style={{ borderRadius: 'var(--shape-substrateTile01)' }} // Decorative token on UI card
/>
```

```tsx
// CORRECT
<div
  className="substrate-hero-frame"  // Whitelist context
  style={{ borderRadius: 'var(--shape-substrateTile02)' }}
/>
<div
  className="content-card"  // Core UI archetype
  style={{ borderRadius: 'var(--shape-placardTorn01)' }}
/>
```

#### ❌ Rule 5: Scaffold Morphing
```tsx
// BANNED (Scaffold NEVER morphs)
<input
  style={{ borderRadius: 'var(--shape-scaffoldSlab01)' }}
  onFocus={(e) => {
    e.target.style.borderRadius = 'var(--shape-blockRiot02)'; // VIOLATION
  }}
/>
```

```tsx
// CORRECT (Scaffold invariance)
<input
  style={{ borderRadius: 'var(--shape-scaffoldSlab01)' }}
  // NO shape change on focus/hover/press
/>
```

### Tier Compliance

| Tier | Tokens | Usage Context | Legibility Requirement |
|------|--------|---------------|------------------------|
| **Core UI** | `blockRiot*`, `pillMarch*`, `placardTorn01`, `megaphoneCut01`, `scaffoldSlab*` | Buttons, cards, inputs, modals | Must be legible at all sizes |
| **Decorative** | `substrateTile*`, `pebbleSurge*` | Hero frames, ambient backgrounds, avatars | Expressive, organic % radii allowed |
| **Tension** | `alertShard01`, `tearBanner01`, `brickWall01` | Errors, alerts, structural dividers | Sharp, aggressive geometry |

## Figma Workflow

### 1. Import Shape SVGs
```bash
# Shape library location
/design-assets/kr-shapes-v6.1/

# Files:
- blockRiot03.svg
- pillMarch01.svg
- placardTorn01.svg
- megaphoneCut01.svg
- scaffoldSlab01.svg
- substrateTile01.svg
```

### 2. Create Figma Components
1. Drag SVG into Figma
2. Convert to Component (`Cmd+Option+K`)
3. Name: `shape.blockRiot03`
4. Annotate in description:
   - **Archetype**: Strike
   - **Tier**: Core UI
   - **State**: Base
   - **Motion**: typeSpringSlam (600ms)

### 3. Wireframe Annotation Pattern
```markdown
## Component: Strike CTA Button

### Shape Specification
- **Base**: `shape.blockRiot03` (32px 2px 2px 2px)
- **Hover**: `shape.blockRiot02` (20px 4px 12px 2px)
- **Pressed**: `shape.blockRiot03-pressed` (20px 4px 12px 2px)
- **Selected**: `shape.alertShard01` (32px 2px 2px 32px)
- **Loading**: `shape.blockRiot03-loading` (9999px pill)

### Morph Behavior
- **Transition**: typeSpringSlam (600ms, spring damping 22)
- **Reduced Motion**: Instant shape change (no animation)
- **Archetype**: Strike
```

## Documentation Patterns

### Component Spec Template
```markdown
## Shape Usage

### Archetype
[Strike | March | Placard | Megaphone | Scaffold | Substrate]

### Shape Tokens
- **Base**: `shape.{tokenName}` ({CSS value})
- **Hover**: `shape.{tokenName}-hover` (if applicable)
- **Pressed**: `shape.{tokenName}-pressed` (if applicable)
- **Selected**: `shape.{tokenName}-selected` (if applicable)
- **Loading**: `shape.{tokenName}-loading` (if applicable)

### Morph Rules
- **Motion type**: [typeSpringSlam | dragSettle | waterRipple | none]
- **Duration**: {milliseconds}ms
- **Reduced motion**: [Instant change | No animation]

### Compliance
- ✅ Asymmetric geometry
- ✅ Semantic CSS variable
- ✅ No hardcoded values
- ✅ Tier-appropriate (Core UI / Decorative / Tension)
- ✅ No 50% border-radius
- ✅ Scaffold invariance respected (if applicable)
```

### Design Review Checklist
```markdown
## Shape Token Compliance

- [ ] All `border-radius` uses semantic tokens (`--shape-*`)
- [ ] No hardcoded pixel values (8px, 12px, etc.)
- [ ] No generic Tailwind classes (`rounded-md`, `rounded-lg`)
- [ ] No 50% border-radius (use `--sys-radius-full` or `sentryAvatar`)
- [ ] No uniform corner radius (unless approved pill token)
- [ ] Blob tokens (`substrateTile*`) only in whitelist contexts
- [ ] Scaffold archetype never morphs
- [ ] Archetype shape palette followed
- [ ] Motion type matches archetype
- [ ] Tier compliance (Core UI / Decorative / Tension)
```

## Helper Functions Reference

### TypeScript Utilities
```typescript
// Location: frontend/src/design/tokens/archetypes.ts

/**
 * Get CSS variable for shape token
 * @example shapeVar('blockRiot03') → 'var(--shape-blockRiot03)'
 */
export const shapeVar = (tokenName: string): string =>
  `var(--shape-${tokenName})`;

/**
 * Get shape token for archetype state
 * @example shapeOf('Strike', 'pressed') → 'var(--shape-blockRiot03-pressed)'
 */
export const shapeOf = (
  archetype: 'Strike' | 'March' | 'Placard' | 'Megaphone' | 'Scaffold' | 'Substrate',
  state?: 'base' | 'pressed' | 'active' | 'selected' | 'loading' | 'open' | 'expanded' | 'hover' | 'ambient'
): string => {
  const archetypeShapes = {
    Strike: {
      base: 'blockRiot03',
      pressed: 'blockRiot03-pressed',
      active: 'blockRiot02',
      selected: 'alertShard01',
      loading: 'blockRiot03-loading',
    },
    March: {
      base: 'pillMarch01',
      pressed: 'pillMarch01-pressed',
      open: 'pebbleSurge01',
      expanded: 'pebbleSurge01-expanded',
    },
    Placard: {
      base: 'placardTorn01',
      selected: 'placardTorn01-selected',
    },
    Megaphone: {
      base: 'megaphoneCut01',
      loading: 'megaphoneCut01-loading',
    },
    Scaffold: {
      base: 'scaffoldSlab01',
      focus: 'scaffoldSlab01-focus', // Unchanged (invariance)
    },
    Substrate: {
      base: 'substrateTile02',
      ambient: 'substrateTile01',
      hover: 'substrateTile01-hover',
    },
  };

  const shape = archetypeShapes[archetype]?.[state || 'base'];
  return shapeVar(shape);
};

/**
 * Get motion type for archetype
 * @example motionOf('Strike') → 'typeSpringSlam'
 */
export const motionOf = (
  archetype: 'Strike' | 'March' | 'Placard' | 'Megaphone' | 'Scaffold' | 'Substrate'
): string | null => {
  const archetypeMotion = {
    Strike: 'typeSpringSlam',      // 600ms
    March: 'dragSettle',            // 800ms
    Placard: 'dragSettle',          // 800ms
    Megaphone: 'typeSpringSlam',    // 600ms
    Scaffold: null,                 // IMMUTABLE
    Substrate: 'waterRipple',       // 3000ms
  };
  return archetypeMotion[archetype];
};
```

## Token File Locations

### Source of Truth
- **Master tokens**: `/Users/okgoogle13/Projects/careercopilot/frontend/src/design/tokens/tokens.json`
  - Lines 614-751: Shape token definitions (v6.1)
  - Lines 753-799: Archetype coupling

### Generated Files
- **CSS variables**: `/Users/okgoogle13/Projects/careercopilot/frontend/src/styles/design-tokens.css`
  - Lines 22-94: `--shape-*` CSS variable emission

### Design Documentation
- **System spec**: `/Users/okgoogle13/Projects/careercopilot/docs/design/02_SYSTEM.md`
  - Section §3: Shape system, archetype palettes, anti-slop rules
- **Component catalog**: `/Users/okgoogle13/Projects/careercopilot/docs/design/03_COMPONENTS.md`
  - Archetype definitions with shape usage patterns

### React Utilities
- **Archetype helpers**: `/Users/okgoogle13/Projects/careercopilot/frontend/src/design/tokens/archetypes.ts`
  - `shapeVar()`, `shapeOf()`, `motionOf()` utilities

## Common Issues & Solutions

### Issue 1: "Generic Tailwind class detected"
```tsx
// PROBLEM
<button className="rounded-lg" />
```

**Solution**: Use semantic shape token
```tsx
<button style={{ borderRadius: shapeVar('blockRiot03') }} />
// OR
<button className="kr-shape-strike-base" />
```

### Issue 2: "50% border-radius violation"
```tsx
// PROBLEM
<img style={{ borderRadius: '50%' }} />
```

**Solution**: Use approved pill token or near-circle avatar
```tsx
<img style={{ borderRadius: 'var(--sys-radius-full)' }} />  // 9999px pill
// OR for avatars
<img style={{ borderRadius: 'var(--sys-radius-sentryAvatar)' }} />  // 98%
```

### Issue 3: "Uniform corner radius (Institutional Squelch)"
```tsx
// PROBLEM
<div style={{ borderRadius: '20px' }} />  // All 4 corners identical
```

**Solution**: Use asymmetric token
```tsx
<div style={{ borderRadius: shapeVar('blockRiot03') }} />  // 32px 2px 2px 2px
```

### Issue 4: "Blob token outside whitelist"
```tsx
// PROBLEM
<div className="card" style={{ borderRadius: 'var(--shape-substrateTile01)' }} />
```

**Solution**: Use appropriate Core UI token
```tsx
<div className="card" style={{ borderRadius: shapeVar('placardTorn01') }} />
```

### Issue 5: "Scaffold archetype morphing"
```tsx
// PROBLEM
<input
  style={{ borderRadius: shapeVar('scaffoldSlab01') }}
  onFocus={() => setShape('blockRiot02')}  // Scaffold can't morph
/>
```

**Solution**: Respect Scaffold invariance
```tsx
<input
  style={{ borderRadius: shapeVar('scaffoldSlab01') }}
  // NO shape change — Scaffold is immutable
/>
```

## Related Skills

### Required Prerequisites
- **kerala-rage-brand-enforcer** - Enforces Zero-Flora Lockdown + Canon compliance
- **token-orchestrator** - Validates DTCG compliance, Kerala Rage palette rules
- **m3-expressive-ui-evaluator** - Checks M3 Expressive compliance (typography, contrast, spring physics)

### Complementary Skills
- **component-builder** - Production-grade UI component creator (uses kr-shapes)
- **hifi-blueprint-linter** - Validates hi-fi wireframe blueprints against KR Solidarity v6.0 design system rules
- **component-visual-audit** - Analyze UI component screenshots against kerala-rage kr-solidarity standards

### Design System Skills
- **token-injector** - Automated CSS variable injection from tokens.json
- **figma-token-sync** - Bi-directional token synchronization between DTCG tokens.json and Figma Variables
- **design-token-validator** - Validate CareerCopilot design tokens for DTCG compliance

## Related Files

### Token System
- [`frontend/src/design/tokens/tokens.json`](frontend/src/design/tokens/tokens.json) - Master token source (DTCG format)
- [`frontend/src/design/tokens/archetypes.ts`](frontend/src/design/tokens/archetypes.ts) - Archetype helpers (shapeVar, shapeOf, motionOf)
- [`frontend/src/styles/design-tokens.css`](frontend/src/styles/design-tokens.css) - Auto-generated CSS variables

### Documentation
- [`docs/design/01_CANON.md`](docs/design/01_CANON.md) - Identity, Manifesto, Cultural Safety, Zero-Flora Rule
- [`docs/design/02_SYSTEM.md`](docs/design/02_SYSTEM.md) - Palette, Typography, **Shape Archetypes**, Motion
- [`docs/design/03_COMPONENTS.md`](docs/design/03_COMPONENTS.md) - Component catalog (archetype usage)

### Gold Standard Components (Reference)
- [`frontend/src/components/kerala-rage/ActionButton.tsx`](frontend/src/components/kerala-rage/ActionButton.tsx) - Strike archetype (Pebble primitive)
- [`frontend/src/components/kerala-rage/SolidarityCard.tsx`](frontend/src/components/kerala-rage/SolidarityCard.tsx) - Placard archetype (Slab primitive)
- [`frontend/src/components/ui/Stone.tsx`](frontend/src/components/ui/Stone.tsx) - Expressive card / hero anchor
- [`frontend/src/components/ui/Lens.tsx`](frontend/src/components/ui/Lens.tsx) - Scaffold archetype (TacticalInput)

## Version History

### v6.1.0 (Current)
- Semantic shape library with KR-specific naming (`blockRiot`, `pillMarch`, `placardTorn`)
- Archetype coupling via `archetypes.ts` with React helpers
- Morph state definitions for interactive archetypes
- Scaffold invariance enforcement (IMMUTABLE rule)
- Tier system: Core UI / Decorative / Tension
- Anti-slop validation rules (no 50%, no uniform corners, no blob tokens outside whitelist)

### v6.0.0 (Deprecated)
- Generic shape naming (`block01`, `pill01`, `stone01`)
- Limited morph state support
- No archetype coupling

---

**Enforced by**: `token-orchestrator`, `m3-expressive-ui-evaluator`, `kerala-rage-brand-enforcer`
**Validator**: Anti-slop rules enforced via design system linter
**Motion**: M3 Expressive spring physics (`typeSpringSlam`, `dragSettle`, `waterRipple`)
