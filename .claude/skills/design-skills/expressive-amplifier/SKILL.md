---
name: expressive-amplifier
description: >
  Turbocharge component styling with extreme contrast, variable fonts, spring physics, and semantic
  emotional coupling — AND annotate .md planning docs (COMET-MANIFEST, batch prompt packs,
  blueprint files) with route-family emotional registers and KR token guidance.
metadata:
  filePattern: "**/*.{tsx,ts,md}"
  triggers:
    - "amplify"
    - "expressive"
    - "emotional register"
    - "route-family register"
    - "annotate batch"
    - "apply emotional"
    - "expressive-amplifier"
---

# Expressive Amplifier

## Purpose

Amplify visual expression across typography, motion, color, and shapes while adhering to kerala-rage M3 Expressive principles and WCAG accessibility standards. Transform conservative components into emotionally resonant, professionally expressive interfaces that balance high visual energy with usability and context-appropriate restraint.

## When to Use

- **Hero Sections**: Implement maximum visual impact with extreme contrast and spring physics
- **Conservative Components**: Transform flat buttons, static headers, and generic cards into expressive variants
- **Emotional Interactions**: Add semantic motion, hover morphs, and scroll-driven typography that responds to user state
- **Brand Expressiveness**: Enforce kerala-rage "Maximum Expressive Playful" philosophy system-wide
- **Professional Data Display**: Balance expressive personality with readable data tables and forms
- **Accessibility Compliance**: Ensure WCAG AA contrast and reduced motion support while maximizing expression

**NOT for**: Over-expression in data-heavy contexts (dashboards, tables, forms requiring focus), decorative animation without semantic intent, or bypassing accessibility requirements.

---

## Markdown Planning Mode

Apply this skill to `.md` planning docs — COMET-MANIFEST, batch prompt packs, blueprint files, and route migration specs — to annotate them with route-family emotional registers and KR token guidance. This does **not** add TSX code; it inserts structured annotation blocks so downstream engineers and AI Studio prompts know which expressive register to enforce.

### When to Use (Markdown Mode)

- A batch prompt pack (`AI-STUDIO-PROMPT-PACK.md`) lacks register guidance for a route
- A COMET manifest section needs explicit typography intensity and KR token pointers
- A blueprint step specifies UI work without naming the emotional register
- You are authoring a new batch prompt and need the register pre-filled

### Route-Family → Emotional Register Mapping

This is the canonical lookup for CareerCopilot. Sourced from COMET-MANIFEST §1 "Route-Family Emotional Registers":

| Route / Surface | Route-Family | Emotional State | Typography Intensity | Primary KR Tokens |
| --- | --- | --- | --- | --- |
| `/dashboard`, onboarding, discovery | **Possibility** | `solidarity` | Assertive hero — 9× weight, 6× size | `solidarityRed`, `inkGold`, `typeSpringSlam` |
| `/tracker`, `/career/ingest`, `/apply/quick` | **Direct Action** | `labor-pressure` | Moderate expressive — 5× weight, 3× size | `charcoalRed`, `stencilYellow`, `dragSettle` |
| `/analysis`, ATS/diagnostic surfaces | **Revelation** | `labor-pressure` (summary focus) | Moderate expressive on scores/summaries | `charcoalRed`, `stencilYellow`, `pulseThrob` |
| `/documents`, templates, generators | **Craft** | `solidarity` (editorial) | Moderate expressive with editorial structure | `solidarityRed`, `inkGold`, `dragSettle` |
| `/profile`, `/settings`, auth | **Reflection** | `melancholy` | Restrained — 3× weight max, no spring slam | `activistSmokeGreen`, `worker-ash`, `melancholyBreath` |

### Annotation Block Format

Insert this block at the top of each batch prompt section or route-scoped section in a planning doc:

```markdown
<!-- expressive-amplifier: register=<REGISTER> intensity=<LEVEL> -->
<!-- KR tokens: typography=<PATTERN> motion=<PATTERN> color=<COLOR> shadow=<SHADOW> -->
```

Fill in from the mapping table above. Example for a `/tracker` batch:

```markdown
<!-- expressive-amplifier: register=Direct Action intensity=moderate -->
<!-- KR tokens: typography=laborExploitationPressure motion=dragSettle color=charcoalRed shadow=elevation3HoverLift -->
```

### Procedure: Annotating a Planning Doc

1. **Identify surfaces** — scan the doc for route names, tab labels, or section descriptions.
2. **Resolve register** — look up each surface in the Route-Family mapping table above.
3. **Insert annotation block** — place it immediately before the batch prompt code-block or section header.
4. **Add register summary** (optional, for long docs) — append a `## Expressive Register Summary` table at the end of the doc listing every route and its resolved register/tokens.
5. **Do not modify batch prompt content** — annotation blocks are additive only. Do not rewrite prompt text.

### Example: Annotating COMET-MANIFEST Batch Section

**Before:**

```markdown
### B5 — Jobs Feed & Job Cards

Task: Build the Jobs tab with a scrollable feed of job cards...
```

**After:**

```markdown
### B5 — Jobs Feed & Job Cards
<!-- expressive-amplifier: register=Possibility intensity=assertive -->
<!-- KR tokens: typography=solidarityProtest motion=typeSpringSlam color=solidarityRed shadow=solidarityBleed -->

Task: Build the Jobs tab with a scrollable feed of job cards...
```

### Example: Register Summary Table (append to end of doc)

```markdown
## Expressive Register Summary

| Route / Surface | Register | Typography | Motion | Color | Shadow |
|---|---|---|---|---|---|
| Dashboard (B1, B3) | Possibility | solidarityProtest | typeSpringSlam | solidarityRed / inkGold | solidarityBleed |
| Jobs (B5, B6) | Possibility | solidarityProtest | typeSpringSlam | solidarityRed | solidarityBleed |
| ATS Check (B7) | Revelation | laborExploitationPressure | pulseThrob | charcoalRed / stencilYellow | elevation3HoverLift |
| Applications (B8, B14) | Direct Action | laborExploitationPressure | dragSettle | charcoalRed | elevation3HoverLift |
| Submitted Docs (B9-B13) | Craft | solidarityProtest (editorial) | dragSettle | solidarityRed / inkGold | inkOffset |
| Profile (MIG-202, B18) | Reflection | melancholyLonging | melancholyBreath | activistSmokeGreen / worker-ash | subtle glow |
```

---

## Capabilities

### Typography Amplification
- ✅ Apply extreme contrast rule (9× weight ratio: 100 vs 900, 6× size ratio: 12px vs 72px+)
- ✅ Implement emotional typography patterns (`solidarityProtest`, `laborExploitationPressure`, `melancholyLonging`, `scrollPressure`, `identityAssertion`, `extremeVariableContrast`)
- ✅ Exploit variable font axes (GRAD, SOFT, WONK, wght, wdth, opsz) for hover states and transitions
- ✅ Context-specific scaling (hero 9×, section headers 5×, data tables 2× max)
- ✅ Scroll-driven weight ramping (breathing headers, building tension)

### Motion Amplification
- ✅ Diversify spring physics (`typeSpringSlam`, `dragSettle`, `pulseThrob`, `melancholyBreath`)
- ✅ Apply M3 Expressive curve (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for overshoot easing
- ✅ Multi-axis hover morphs (color + scale + weight + shadow simultaneously)
- ✅ Semantic motion mapping (CTA → slam, Cards → settle, Alerts → throb, Reflective → breath)
- ✅ Reduced motion fallbacks (accessibility requirement)

### Color Amplification
- ✅ Tonal stepping for depth (hover +2 steps, active -3 steps, glow +6 steps)
- ✅ Semantic color usage (inkGold for optimism, solidarityRed for urgency, activistSmokeGreen for calm)
- ✅ Glow effects (`solidarityBleed`, `inkOffset`, activation halos)
- ✅ WCAG AA contrast validation (4.5:1 text, 3:1 large text)

### Shape & Shadow Amplification
- ✅ Enforce semantic geometry (`rounded-strike`, `rounded-placard`, `rounded-megaphone`, `rounded-sentry`)
- ✅ Ban perfect circles (`border-radius: 50%` → `98%` sentry avatars)
- ✅ Semantic shadow progression (`elevation1Pebble` → `elevation4Float`, `inkOffset`, `solidarityBleed`)

### Emotional State Coupling
- ✅ Coordinate typography + motion + color + shadow by semantic intent
- ✅ Solidarity/Protest → solidarityProtest type + typeSpringSlam + solidarityRed + inkOffset shadow
- ✅ Labor Pressure → laborExploitationPressure type + dragSettle + charcoalRed + elevated shadow
- ✅ Melancholy → melancholyLonging type + melancholyBreath + activistSmokeGreen + subtle glow

## Typography Amplification Patterns

### 1. Extreme Contrast Rule (Hero Sections)

**Rule**: 9× weight ratio + 6× size ratio for maximum visual impact.

```tsx
// Hero Section with Extreme Contrast
<div className="hero-section">
  {/* Primary hero line: Hairline 100 weight, 72px */}
  <h1 style={{
    fontFamily: 'Fraunces',
    fontVariationSettings: '"wght" 100, "wdth" 100',
    fontSize: '72px',
    letterSpacing: '-0.02em',
    color: 'var(--sys-color-worker-ash-steps-6)' // Lightest for readability
  }}>
    Your Career Journey
  </h1>

  {/* Metadata: Ultra-black 900 weight, 12px */}
  <p style={{
    fontFamily: 'Work Sans',
    fontVariationSettings: '"wght" 900, "wdth" 75',
    fontSize: '12px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--sys-color-stencilYellow-base)' // High-salience marker
  }}>
    Kerala Rage · Solidarity Mode
  </p>
</div>
```

**Contrast Ratios**:
- Weight: 100 ÷ 900 = 9× ✅
- Size: 72px ÷ 12px = 6× ✅

### 2. Emotional Typography Presets

#### Solidarity Protest (Declarative Headers)

```tsx
// Poster-style declaration with collective breath
<h2 style={{
  fontFamily: 'Fraunces',
  fontVariationSettings: '"wght" 800, "wdth" 120', // Expanded solidarity
  letterSpacing: '0.02em', // Opens voice
  fontSize: '48px',
  color: 'var(--sys-color-solidarityRed-steps-3)' // Primary heat
}}>
  Workers' Rights Matter
</h2>
```

**Token Reference**: `tokens.json` → `sys.typography.emotionalPatterns.solidarityProtest`

#### Labor Exploitation Pressure (Constraint)

```tsx
// Compressed pressure state (fatigue, extraction)
<h3 style={{
  fontFamily: 'Work Sans',
  fontVariationSettings: '"wght" 900, "wdth" 75', // Compressed black
  letterSpacing: '0em', // Neutral tracking intensifies density
  fontSize: '32px',
  color: 'var(--sys-color-charcoalRed-steps-2)' // Warning energy
}}>
  Overworked. Underpaid.
</h3>
```

**Token Reference**: `tokens.json` → `sys.typography.emotionalPatterns.laborExploitationPressure`

#### Melancholy Longing (Reflective Sections)

```tsx
// Breathing animation for homesickness, between-worlds moments
<motion.p
  style={{
    fontFamily: 'Libre Bodoni',
    fontVariationSettings: '"wght" 475, "wdth" 98', // Mid-weight oscillation base
    letterSpacing: '0em',
    fontSize: '24px',
    color: 'var(--sys-color-activistSmokeGreen-steps-4)'
  }}
  animate={{
    fontVariationSettings: [
      '"wght" 450, "wdth" 98',
      '"wght" 500, "wdth" 98',
      '"wght" 450, "wdth" 98'
    ],
    opacity: [0.85, 1, 0.85]
  }}
  transition={{
    duration: 4, // melancholyBreath: 4000ms
    ease: [0.34, 1.56, 0.64, 1], // M3 Expressive curve
    repeat: Infinity,
    repeatType: 'loop'
  }}
>
  Between two worlds, neither fully home.
</motion.p>
```

**Token Reference**: `tokens.json` → `sys.typography.emotionalPatterns.melancholyLonging` + `sys.motion.patterns.melancholyBreath`

### 3. Scroll-Driven Weight Ramping

```tsx
import { useScroll, useTransform, motion } from 'framer-motion';

// Header gains weight as user scrolls (building tension)
export const ScrollPressureHeader = ({ children }) => {
  const { scrollYProgress } = useScroll();

  // Map scroll progress (0→1) to weight (300→800)
  const weight = useTransform(scrollYProgress, [0, 1], [300, 800]);

  // Subtle width compression (100→95)
  const width = useTransform(scrollYProgress, [0, 1], [100, 95]);

  return (
    <motion.h1
      style={{
        fontFamily: 'Fraunces',
        fontVariationSettings: useTransform(
          [weight, width],
          ([w, wdth]) => `"wght" ${w}, "wdth" ${wdth}`
        ),
        fontSize: '64px',
        color: 'var(--sys-color-worker-ash-steps-5)'
      }}
    >
      {children}
    </motion.h1>
  );
};
```

**Token Reference**: `tokens.json` → `sys.typography.emotionalPatterns.scrollPressure`

### 4. Variable Font Axis Hover (Layout-Safe)

```tsx
// Use GRAD axis for hover without layout reflow
<motion.button
  style={{
    fontFamily: 'Work Sans',
    fontVariationSettings: '"wght" 500, "GRAD" 0', // GRAD is layout-safe
    fontSize: '16px',
    color: 'var(--sys-color-worker-ash-base)'
  }}
  whileHover={{
    fontVariationSettings: '"wght" 500, "GRAD" 150' // Increase GRAD, not wght
  }}
  transition={{
    duration: 0.6,
    ease: [0.34, 1.56, 0.64, 1] // typeSpringSlam
  }}
>
  Apply Now
</motion.button>
```

**Why GRAD?** Weight shifts (`wght`) cause layout reflow. GRAD axis thickens strokes without changing glyph bounds.

## Motion Amplification Patterns

### 1. Semantic Motion Mapping

Match motion to semantic intent, not visual preference:

| Intent | Pattern | Duration | Curve | Usage |
|--------|---------|----------|-------|-------|
| **Primary CTA** | `typeSpringSlam` | 600ms | M3 Expressive | Headline entrance, emphasis toggles, weight shifts |
| **Cards/Panels** | `dragSettle` | 800ms | M3 Expressive | Card drag, reordering, expansions (labor-weight metaphor) |
| **Urgent Alerts** | `pulseThrob` | 1000ms | M3 Expressive | Urgent text emphasis, gentle alerting (no rapid flashing) |
| **Reflective Sections** | `melancholyBreath` | 4000ms | M3 Expressive | Oscillating wght/opacity for homesickness, longing |
| **Ambient Illustration** | `windFlutter` | 2000ms | M3 Expressive | Flags, palms, cloth motifs (optional, disable for reduced motion) |
| **Calm Transitions** | `waterRipple` | 3000ms | M3 Expressive | Backwater sections, ripple highlights (background-only) |

### 2. Spring Physics Configuration

**Token Reference**: `tokens.json` → `sys.motion.patterns.*`

```tsx
// Framer Motion variant presets
const motionPresets = {
  typeSpringSlam: {
    duration: 0.6,
    ease: [0.34, 1.56, 0.64, 1] // M3 Expressive overshoot
  },
  dragSettle: {
    duration: 0.8,
    ease: [0.34, 1.56, 0.64, 1],
    // Viscous shadows pair well (see shadow section)
  },
  pulseThrob: {
    duration: 1.0,
    ease: [0.34, 1.56, 0.64, 1],
    repeat: Infinity,
    repeatType: 'reverse'
  },
  melancholyBreath: {
    duration: 4.0,
    ease: [0.34, 1.56, 0.64, 1],
    repeat: Infinity,
    repeatType: 'loop'
  }
};

// Usage
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={motionPresets.typeSpringSlam}
>
  {/* CTA content */}
</motion.div>
```

### 3. Multi-Axis Hover Morph

Coordinate color + scale + weight + shadow simultaneously:

```tsx
<motion.button
  style={{
    fontFamily: 'Work Sans',
    fontVariationSettings: '"wght" 600, "GRAD" 0',
    fontSize: '18px',
    padding: '16px 32px',
    borderRadius: '32px 2px 2px 2px', // rounded-strike (base)
    backgroundColor: 'var(--sys-color-solidarityRed-steps-2)',
    color: 'var(--sys-color-worker-ash-base)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' // elevation1Pebble
  }}
  whileHover={{
    fontVariationSettings: '"wght" 600, "GRAD" 150', // Layout-safe weight bloom
    scale: 1.03, // Subtle scale (avoid aggressive 1.1+)
    y: -2, // Lift up
    backgroundColor: 'var(--sys-color-solidarityRed-steps-3)', // +1 tonal step
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.45)' // elevation3HoverLift
  }}
  transition={motionPresets.typeSpringSlam}
>
  Join the Movement
</motion.button>
```

**Coordinated Changes**:
- ✅ Typography: GRAD 0 → 150 (layout-safe weight increase)
- ✅ Transform: scale 1.03, y -2px (lift)
- ✅ Color: solidarityRed-steps-2 → steps-3 (+1 tonal step)
- ✅ Shadow: elevation1Pebble → elevation3HoverLift

### 4. Reduced Motion Fallback (Accessibility)

```tsx
import { useReducedMotion } from 'framer-motion';

const ExpressiveCard = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : {
        scale: 1.02,
        y: -4,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.45)'
      }}
      transition={shouldReduceMotion ? { duration: 0 } : motionPresets.dragSettle}
    >
      {children}
    </motion.div>
  );
};
```

**Accessibility Requirement**: Always respect `prefers-reduced-motion: reduce`.

## Color Amplification Patterns

### 1. Tonal Stepping for Depth

**Token Reference**: `tokens.json` → `sys.color.{colorName}.steps[]`

All color families have tonal steps (shadow → base → highlight):

```tsx
// Example: solidarityRed tonal family
const solidarityRedSteps = [
  '#A02F0F', // steps-0: Shadow (darkest)
  '#C03811', // steps-1: Dark
  '--sys-color-solidarity-red', // steps-2: Base (canonical red)
  '#FF6B3D', // steps-3: Highlight
  '#FF9470', // steps-4: Light
  '#FFB999'  // steps-5: Glow (lightest)
];

// Usage: Hover state steps up +2
<motion.div
  style={{
    backgroundColor: 'var(--sys-color-solidarityRed-steps-2)' // Base
  }}
  whileHover={{
    backgroundColor: 'var(--sys-color-solidarityRed-steps-4)' // +2 steps lighter
  }}
/>

// Usage: Active state steps down -3 (shadow)
<motion.div
  style={{
    backgroundColor: 'var(--sys-color-solidarityRed-steps-2)'
  }}
  whileTap={{
    backgroundColor: 'var(--sys-color-solidarityRed-steps-0)' // Shadow (pressed)
  }}
/>

// Usage: Glow/halo uses lightest step
<div style={{
  boxShadow: '0 0 24px var(--sys-color-solidarityRed-steps-5)' // Lightest glow
}} />
```

### 2. Semantic Color Usage

Colors have cultural/emotional meaning, not generic "primary/secondary":

| Color | Semantic Intent | Usage | AVOID Using For |
|-------|-----------------|-------|-----------------|
| **solidarityRed** | Resistance heat, primary CTA energy | Primary buttons, urgent emphasis, screenprint moments | Generic "primary" theming, decorative gradients |
| **charcoalRed** | Institutional warning without bureaucracy | Errors, destructive actions, critical alerts | Success states, decorative accents |
| **inkGold** | Temple radiance, optimistic defiance | Halo disks, ornament highlights, celebratory states | Generic "accent" color |
| **activistSmokeGreen** | Calm-meets-activism, landscape | Backwater motifs, melancholy sections, routes | Success/completion states (use solidarityRed instead) |
| **stencilYellow** | Economic critique, attention | Headline accents, key UI warnings, poster type | Generic highlights |
| **worker-ash** | Quiet reverence, primary readability | Body text, icon strokes, dividers | Decorative backgrounds |

### 3. Glow Effects (Semantic Shadows)

```tsx
// inkOffset: 2D screenprint shadow
<div style={{
  boxShadow: '2px 2px 0px var(--sys-color-inkGold-base)'
}} />

// solidarityBleed: Urgent glow for critical modals
<div style={{
  boxShadow: '0 0 12px var(--sys-color-solidarityRed-steps-4)'
}} />

// activistSmokeGreen halo: Subtle calm accent
<div style={{
  boxShadow: '0 0 8px var(--sys-color-activistSmokeGreen-steps-5)'
}} />
```

### 4. WCAG Contrast Validation

**Requirement**: WCAG AA minimum contrast ratios:
- Text: 4.5:1 (normal), 3:1 (large text 18px+)
- UI components: 3:1

```tsx
// GOOD: worker-ash (light) on charcoalBackground (dark) = ~12:1 ✅
<p style={{
  color: 'var(--sys-color-worker-ash-base)', // --sys-color-worker-ash
  backgroundColor: 'var(--sys-color-charcoalBackground-base)' // --sys-color-charcoal-background
}}>
  High contrast, readable text.
</p>

// BAD: activistSmokeGreen-steps-2 on charcoalBackground = ~2.8:1 ❌
<p style={{
  color: 'var(--sys-color-activistSmokeGreen-steps-2)', // #3AAF6E (too dark)
  backgroundColor: 'var(--sys-color-charcoalBackground-base)'
}}>
  Fails WCAG AA (insufficient contrast).
</p>

// FIX: Use lighter step for text
<p style={{
  color: 'var(--sys-color-activistSmokeGreen-steps-5)', // #8EEFC0 (lighter)
  backgroundColor: 'var(--sys-color-charcoalBackground-base)'
}}>
  Passes WCAG AA ✅
</p>
```

**Tool**: Use browser DevTools Contrast Checker or WebAIM Contrast Checker.

## Shape & Shadow Amplification

### 1. Organic Asymmetry Enforcement

**Token Reference**: `tokens.json` → `sys.shape.*`

```tsx
// GOOD: Organic pebble radius (asymmetric)
<button style={{
  borderRadius: '32px 2px 2px 2px' // rounded-strike ✅
}} />

// GOOD: Stone shape for cards (organic blob)
<div style={{
  borderRadius: '42% 58% 45% 55% / 48% 62% 38% 52%' // rounded-megaphone ✅
}} />

// GOOD: Sentry avatar (imperfect circle)
<img style={{
  borderRadius: '98%' // --radius-sentry ✅ (banned: 50%)
}} />

// BAD: Perfect circle (generic, banned)
<div style={{
  borderRadius: '50%' // ❌ BANNED in kerala-rage
}} />

// BAD: Uniform radius (generic)
<button style={{
  borderRadius: '8px' // ❌ Too generic, use rounded-strike
}} />
```

**Enforcement**: Audit all components and replace:
- `rounded-full` → `rounded-sentry` (98%)
- `rounded-lg`, `rounded-xl` → `rounded-strike` or `rounded-megaphone`
- `border-radius: 50%` → `border-radius: 98%` (sentry avatars)

### 2. Semantic Shadow Progression

```tsx
// elevation1Pebble: Resting state
const elevation1Pebble = '0 2px 4px rgba(0, 0, 0, 0.25)';

// elevation3HoverLift: Hover state (increased depth)
const elevation3HoverLift = '0 8px 16px rgba(0, 0, 0, 0.45)';

// elevation4Float: Modal/dialog (maximum depth)
const elevation4Float = '0 16px 32px rgba(0, 0, 0, 0.55)';

// inkOffset: 2D screenprint shadow (brand accent)
const inkOffset = '2px 2px 0px var(--sys-color-inkGold-base)';

// solidarityBleed: Urgent glow (error/critical)
const solidarityBleed = '0 0 12px var(--sys-color-solidarityRed-steps-4)';

// Usage: Card with hover elevation
<motion.div
  style={{
    boxShadow: elevation1Pebble
  }}
  whileHover={{
    boxShadow: elevation3HoverLift
  }}
  transition={motionPresets.dragSettle}
/>
```

## Emotional State Coupling

**Core Principle**: Typography + Motion + Color + Shadow must coordinate by semantic intent, not visual preference.

### 1. Solidarity/Protest State

**Intent**: Declarative headers, street-poster energy, moments of collective clarity.

```tsx
<motion.h2
  style={{
    // Typography: solidarityProtest
    fontFamily: 'Fraunces',
    fontVariationSettings: '"wght" 800, "wdth" 120', // Expanded solidarity
    letterSpacing: '0.02em',
    fontSize: '48px',
    // Color: solidarityRed (resistance heat)
    color: 'var(--sys-color-solidarityRed-steps-3)',
    // Shadow: inkOffset (screenprint)
    textShadow: '2px 2px 0px var(--sys-color-inkGold-base)'
  }}
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  // Motion: typeSpringSlam
  transition={motionPresets.typeSpringSlam}
>
  Workers Unite
</motion.h2>
```

**Coupling**:
- Typography: `solidarityProtest` (wght 800, wdth 120, expanded voice)
- Motion: `typeSpringSlam` (600ms overshoot, impact timing)
- Color: `solidarityRed` (resistance heat)
- Shadow: `inkOffset` (screenprint aesthetic)

### 2. Labor Pressure State

**Intent**: Constraint, fatigue, extraction, wage critique, exhaustion.

```tsx
<motion.div
  style={{
    // Typography: laborExploitationPressure
    fontFamily: 'Work Sans',
    fontVariationSettings: '"wght" 900, "wdth" 75', // Compressed black
    letterSpacing: '0em',
    fontSize: '32px',
    padding: '24px 32px',
    borderRadius: '32px 2px 2px 2px', // rounded-strike
    // Color: charcoalRed (warning without bureaucracy)
    backgroundColor: 'var(--sys-color-charcoalRed-steps-1)',
    color: 'var(--sys-color-worker-ash-base)',
    // Shadow: elevated (weighty)
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.55)'
  }}
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  // Motion: dragSettle (heavy settling)
  transition={motionPresets.dragSettle}
>
  Overworked. Underpaid.
</motion.div>
```

**Coupling**:
- Typography: `laborExploitationPressure` (wght 900, wdth 75, compressed pressure)
- Motion: `dragSettle` (800ms viscous, labor-weight metaphor)
- Color: `charcoalRed` (institutional warning)
- Shadow: `elevation3HoverLift` (heavy, elevated)

### 3. Melancholy State

**Intent**: Between-worlds sections, homesickness, reflective copy, gentle emphasis.

```tsx
<motion.p
  style={{
    // Typography: melancholyLonging
    fontFamily: 'Libre Bodoni',
    fontVariationSettings: '"wght" 475, "wdth" 98', // Mid-weight oscillation
    letterSpacing: '0em',
    fontSize: '24px',
    // Color: activistSmokeGreen (calm landscape)
    color: 'var(--sys-color-activistSmokeGreen-steps-5)',
    // Shadow: subtle glow
    textShadow: '0 0 8px var(--sys-color-activistSmokeGreen-steps-6)'
  }}
  animate={{
    fontVariationSettings: [
      '"wght" 450, "wdth" 98',
      '"wght" 500, "wdth" 98',
      '"wght" 450, "wdth" 98'
    ],
    opacity: [0.85, 1, 0.85]
  }}
  // Motion: melancholyBreath
  transition={motionPresets.melancholyBreath}
>
  Neither here nor there, suspended between two worlds.
</motion.p>
```

**Coupling**:
- Typography: `melancholyLonging` (wght 475 oscillating, subtle instability)
- Motion: `melancholyBreath` (4000ms breathing, slow oscillation)
- Color: `activistSmokeGreen` (calm-meets-activism)
- Shadow: Subtle glow (lightest tonal step)

## Context-Appropriate Scaling

**Critical Principle**: Expression must scale by context. Hero sections ≠ data tables.

| Context | Weight Contrast | Size Contrast | Motion | Shadow |
|---------|-----------------|---------------|--------|--------|
| **Hero Sections** | 9× (100 vs 900) | 6× (12px vs 72px+) | typeSpringSlam | solidarityBleed glow |
| **Section Headers** | 5× (200 vs 900) | 3× (16px vs 48px) | dragSettle | elevation3HoverLift |
| **Cards/Components** | 3× (400 vs 700) | 2× (14px vs 28px) | dragSettle | elevation1Pebble → elevation3HoverLift |
| **Data Tables** | 2× (400 vs 600) | 1.5× (14px vs 21px) | Linear (no spring) | elevation1Pebble |
| **Forms/Inputs** | 3× (400 vs 700) | 2× (14px vs 28px) | typeSpringSlam (CTAs), pulseThrob (errors) | elevation1Pebble |

### Example: Hero vs Data Table

```tsx
// HERO SECTION: Maximum expression (9× weight, 6× size)
<div className="hero">
  <h1 style={{
    fontFamily: 'Fraunces',
    fontVariationSettings: '"wght" 100, "wdth" 100',
    fontSize: '72px', // Large
    color: 'var(--sys-color-worker-ash-steps-6)'
  }}>
    Career Liberation
  </h1>
  <p style={{
    fontFamily: 'Work Sans',
    fontVariationSettings: '"wght" 900, "wdth" 75',
    fontSize: '12px', // Micro (6× contrast)
    textTransform: 'uppercase'
  }}>
    Kerala Rage
  </p>
</div>

// DATA TABLE: Restrained expression (2× weight, 1.5× size)
<table>
  <thead>
    <tr>
      <th style={{
        fontFamily: 'Work Sans',
        fontVariationSettings: '"wght" 600', // Medium
        fontSize: '14px',
        color: 'var(--sys-color-worker-ash-base)'
      }}>
        Job Title
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{
        fontFamily: 'Work Sans',
        fontVariationSettings: '"wght" 400', // Regular (2× contrast)
        fontSize: '14px',
        color: 'var(--sys-color-worker-ash-steps-5)'
      }}>
        Senior Engineer
      </td>
    </tr>
  </tbody>
</table>
```

**Rationale**: Hero sections tolerate extreme contrast because they're scannable and have ample negative space. Data tables prioritize readability and rapid scanning, so restrained contrast prevents visual fatigue.

## Usage Examples

### Example 1: Amplifying a Hero Section

**Before (Conservative)**:
```tsx
<div className="hero" style={{ backgroundColor: '--sys-color-charcoal-background', padding: '64px' }}>
  <h1 style={{ fontSize: '48px', fontWeight: 700 }}>
    Find Your Dream Job
  </h1>
  <p style={{ fontSize: '18px', fontWeight: 400 }}>
    AI-powered career guidance
  </p>
</div>
```

**After (Expressive Amplification)**:
```tsx
<motion.div
  className="hero"
  style={{
    backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
    padding: '96px 64px',
    borderRadius: '42% 58% 45% 55% / 48% 62% 38% 52%' // rounded-megaphone
  }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={motionPresets.dragSettle}
>
  {/* Extreme contrast: 72px hairline vs 12px ultra-black */}
  <motion.h1
    style={{
      fontFamily: 'Fraunces',
      fontVariationSettings: '"wght" 100, "wdth" 100',
      fontSize: '72px',
      letterSpacing: '-0.02em',
      color: 'var(--sys-color-worker-ash-steps-6)',
      textShadow: '0 0 24px var(--sys-color-inkGold-steps-5)' // Halo glow
    }}
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={motionPresets.typeSpringSlam}
  >
    Find Your Dream Job
  </motion.h1>

  <motion.p
    style={{
      fontFamily: 'Work Sans',
      fontVariationSettings: '"wght" 900, "wdth" 75',
      fontSize: '12px',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--sys-color-stencilYellow-base)'
    }}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ ...motionPresets.typeSpringSlam, delay: 0.1 }}
  >
    AI-Powered Career Liberation
  </motion.p>
</motion.div>
```

**Amplifications Applied**:
- ✅ Extreme contrast: 100 vs 900 weight (9×), 72px vs 12px size (6×)
- ✅ Variable fonts: Fraunces (display), Work Sans (metadata)
- ✅ Semantic colors: worker-ash (text), stencilYellow (attention)
- ✅ Motion: typeSpringSlam entrance (600ms overshoot)
- ✅ Organic shape: rounded-megaphone (blob container)
- ✅ Glow effect: inkGold halo on hero text

### Example 2: Transforming a Button to Expressive CTA

**Before**:
```tsx
<button style={{
  backgroundColor: '--sys-color-solidarity-red',
  color: '#FFFFFF',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: 600
}}>
  Apply Now
</button>
```

**After**:
```tsx
<motion.button
  style={{
    fontFamily: 'Work Sans',
    fontVariationSettings: '"wght" 600, "GRAD" 0',
    fontSize: '18px',
    padding: '16px 32px',
    borderRadius: '32px 2px 2px 2px', // rounded-strike (base)
    backgroundColor: 'var(--sys-color-solidarityRed-steps-2)',
    color: 'var(--sys-color-worker-ash-base)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)', // elevation1Pebble
    border: 'none',
    cursor: 'pointer'
  }}
  whileHover={{
    fontVariationSettings: '"wght" 600, "GRAD" 150', // Layout-safe bloom
    scale: 1.03,
    y: -2,
    backgroundColor: 'var(--sys-color-solidarityRed-steps-3)', // +1 tonal step
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.45)' // elevation3HoverLift
  }}
  whileTap={{
    scale: 0.98,
    y: 0,
    backgroundColor: 'var(--sys-color-solidarityRed-steps-1)', // Shadow step
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' // Pressed
  }}
  transition={motionPresets.typeSpringSlam}
>
  Apply Now
</motion.button>
```

**Amplifications Applied**:
- ✅ Variable font: Work Sans with GRAD axis (layout-safe hover)
- ✅ Tonal stepping: solidarityRed-steps-2 → steps-3 (hover), → steps-1 (active)
- ✅ Multi-axis morph: GRAD + scale + y-translate + shadow
- ✅ Semantic shape: rounded-strike (archetype)
- ✅ Semantic motion: typeSpringSlam (600ms overshoot)
- ✅ Shadow progression: elevation1Pebble → elevation3HoverLift

### Example 3: Emotional Card States

```tsx
const EmotionalCard = ({ state, children }) => {
  const stateConfig = {
    solidarity: {
      typography: { wght: 800, wdth: 120 },
      motion: motionPresets.typeSpringSlam,
      color: 'var(--sys-color-solidarityRed-steps-2)',
      shadow: '2px 2px 0px var(--sys-color-inkGold-base)' // inkOffset
    },
    pressure: {
      typography: { wght: 900, wdth: 75 },
      motion: motionPresets.dragSettle,
      color: 'var(--sys-color-charcoalRed-steps-1)',
      shadow: '0 8px 16px rgba(0, 0, 0, 0.55)' // elevated
    },
    melancholy: {
      typography: { wght: 475, wdth: 98 },
      motion: motionPresets.melancholyBreath,
      color: 'var(--sys-color-activistSmokeGreen-steps-4)',
      shadow: '0 0 8px var(--sys-color-activistSmokeGreen-steps-5)' // subtle glow
    }
  };

  const config = stateConfig[state];

  return (
    <motion.div
      style={{
        fontFamily: 'Fraunces',
        fontVariationSettings: `"wght" ${config.typography.wght}, "wdth" ${config.typography.wdth}`,
        fontSize: '24px',
        padding: '32px',
        borderRadius: '42% 58% 45% 55% / 48% 62% 38% 52%', // --radius-stone
        backgroundColor: config.color,
        color: 'var(--sys-color-worker-ash-base)',
        boxShadow: config.shadow
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={config.motion}
    >
      {children}
    </motion.div>
  );
};

// Usage
<EmotionalCard state="solidarity">
  Workers' Rights Matter
</EmotionalCard>

<EmotionalCard state="pressure">
  Overworked. Underpaid.
</EmotionalCard>

<EmotionalCard state="melancholy">
  Between two worlds.
</EmotionalCard>
```

## Best Practices

### 1. Start with Emotional Intent
Before choosing typography, motion, or color, identify the semantic intent:
- What emotion should this convey? (solidarity, pressure, melancholy, defiance)
- What action is the user taking? (CTA, reading, reflecting, alerting)
- What's the context? (hero moment, data display, error state)

Then select coordinated patterns from the tokens.

### 2. Test with Reduced Motion
Always implement fallbacks for `prefers-reduced-motion: reduce`:
```tsx
const shouldReduceMotion = useReducedMotion();
transition={shouldReduceMotion ? { duration: 0 } : motionPresets.typeSpringSlam}
```

### 3. Validate Contrast Before Committing
Use browser DevTools or WebAIM Contrast Checker to verify:
- Text contrast ≥ 4.5:1 (WCAG AA)
- Large text contrast ≥ 3:1 (18px+)
- UI component contrast ≥ 3:1

### 4. Use Context-Appropriate Scaling
- Hero sections: 9× weight, 6× size ✅
- Section headers: 5× weight, 3× size ✅
- Data tables: 2× weight, 1.5× size max ✅
- Forms: 3× weight, 2× size ✅

Don't apply hero-level expression to data-heavy UIs.

### 5. Preserve Semantic Token Usage
Never hardcode colors:
```tsx
// BAD
backgroundColor: '--sys-color-solidarity-red' ❌

// GOOD
backgroundColor: 'var(--sys-color-solidarityRed-base)' ✅
```

### 6. Test Scroll-Driven Animations Across Viewports
Scroll-driven typography (weight ramping) must work on mobile, tablet, and desktop:
```tsx
const weight = useTransform(scrollYProgress, [0, 0.5], [300, 800]); // Clamp at 50% scroll
```

### 7. Provide Static Fallbacks for Variable Fonts
If variable fonts fail to load, provide static font-weight fallbacks:
```css
@supports not (font-variation-settings: normal) {
  h1 {
    font-weight: 700; /* Fallback for browsers without variable font support */
  }
}
```

## Anti-Patterns

### Typography
- ❌ Hardcoded font weights (`font-weight: 700`) → Use `fontVariationSettings: '"wght" 700'`
- ❌ Generic fonts (Inter/Roboto as primary) → Use Fraunces/Work Sans/Libre Bodoni
- ❌ Uniform font weights across UI → Use emotional patterns (solidarityProtest, laborExploitationPressure)
- ❌ Static fonts everywhere → Exploit variable axes (GRAD, SOFT, WONK, wght, wdth)

### Motion
- ❌ Linear easing (`ease: linear`) → Use M3 Expressive curve `[0.34, 1.56, 0.64, 1]`
- ❌ Uniform spring config → Diversify by semantic intent (slam, settle, throb, breath)
- ❌ No reduced motion fallback → Always respect `prefers-reduced-motion`
- ❌ Aggressive scale hover (`scale: 1.2`) → Keep subtle (1.03 max)

### Color
- ❌ Hardcoded colors (`--sys-color-solidarity-red`) → Use `--sys-color-solidarityRed-base`
- ❌ Flat color usage (base only) → Use tonal steps for depth
- ❌ Generic color roles ("primary", "secondary") → Use semantic names (solidarityRed, inkGold)
- ❌ Low contrast text → Validate WCAG AA (4.5:1 minimum)

### Shapes
- ❌ Perfect circles (`border-radius: 50%`) → Use `98%` (sentry avatars)
- ❌ Uniform border-radius (`8px` everywhere) → Use organic asymmetry (--radius-pebble, --radius-stone)
- ❌ Generic Tailwind classes (`rounded-full`) → Use semantic tokens

### Accessibility
- ❌ Expression without accessibility → Always validate contrast, reduced motion
- ❌ Decorative animation without semantic intent → Motion must have purpose
- ❌ Skipping focus states → Ensure keyboard navigation clarity

## Troubleshooting

### Issue: Variable fonts not rendering
**Solution**: Check font loading in CSS:
```css
@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf') format('truetype-variations');
  font-weight: 100 900;
  font-variation-settings: "SOFT" 0, "WONK" 0, "opsz" 8, "wght" 400;
}
```

### Issue: Layout reflow on hover
**Solution**: Use GRAD axis instead of wght for hover states:
```tsx
// BAD: wght causes layout reflow
fontVariationSettings: '"wght" 500' → '"wght" 700' ❌

// GOOD: GRAD is layout-safe
fontVariationSettings: '"wght" 500, "GRAD" 0' → '"wght" 500, "GRAD" 150' ✅
```

### Issue: Motion feels too aggressive
**Solution**: Reduce scale/translate values and increase duration:
```tsx
// Aggressive
whileHover={{ scale: 1.1, y: -10 }} ❌

// Subtle
whileHover={{ scale: 1.03, y: -2 }} ✅
```

### Issue: Contrast failing WCAG
**Solution**: Use lighter tonal steps for text on dark backgrounds:
```tsx
// BAD: activistSmokeGreen-steps-2 on charcoal = 2.8:1 ❌
color: 'var(--sys-color-activistSmokeGreen-steps-2)'

// GOOD: activistSmokeGreen-steps-5 on charcoal = 5.2:1 ✅
color: 'var(--sys-color-activistSmokeGreen-steps-5)'
```

## Related Skills

- [expressive-typography-manipulation](../../expressive-typography-manipulation/SKILL.md) - Technical implementation for M3 Expressive typography
- [kerala-rage-typography-strategy](../../kerala-rage-typography-strategy/SKILL.md) - Orchestrate "Maximum Expressive Playful" typography tiers
- [kerala-rage-brand-enforcer](../../kerala-rage-brand-enforcer/SKILL.md) - Validate kerala-rage brand compliance
- [m3-expressive-ui-evaluator](../../m3-expressive-ui-evaluator/SKILL.md) - Score designs against M3 Expressive standards
- [component-builder](../../component-builder/SKILL.md) - Build production-grade M3 Expressive components
- [token-orchestrator](../../token-orchestrator/SKILL.md) - Validate design tokens for DTCG compliance

## Related Files

- [`frontend/src/design/tokens/tokens.json`](../../../frontend/src/design/tokens/tokens.json) - Canonical design tokens (emotional patterns, motion, colors, shapes)
- [`frontend/src/styles/design-tokens.css`](../../../frontend/src/styles/design-tokens.css) - CSS variables (auto-generated)
- [`frontend/src/components/ui/AuroraHeader.tsx`](../../../frontend/src/components/ui/AuroraHeader.tsx) - Best practice example (variable fonts + spring physics)
- [`frontend/src/components/ui/KeralaRageButton.tsx`](../../../frontend/src/components/ui/KeralaRageButton.tsx) - Motion example (GRAD axis hover)
- [`CLAUDE.md`](../../../CLAUDE.md) - Design system documentation
- [`/.agent/workflows/design-workflow-2026.md`](../../../.agent/workflows/design-workflow-2026.md) - Design-to-code workflow

---

**Remember**: Expression without accessibility is exclusion. Amplify with purpose, validate with rigor, and always respect user preferences (reduced motion, contrast needs). The goal is **professional expressiveness**, not chaotic decoration.
