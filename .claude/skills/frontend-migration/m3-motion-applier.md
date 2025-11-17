# M3 Motion Applier

**Purpose:** Replace hardcoded transitions/animations with M3 Expressive motion tokens.

**Input:** Component file path + tokens-expressive.json
**Output:** Refactored component using M3 motion tokens

---

## Overview

This skill is Step 8 (FINAL) in the 8-step M3 migration protocol. It:

1. Detects all hardcoded transition/animation properties
2. Maps durations to M3 motion duration tokens
3. Replaces easing curves with M3 easing tokens
4. Applies M3 motion patterns (enter/exit, emphasis, state changes)
5. Ensures accessibility (prefers-reduced-motion support)

---

## M3 Expressive Motion System

The M3 Expressive motion system includes:

### Duration Tokens (16 Total)

| Token | Value | Use Case |
|-------|-------|----------|
| `--sys-motion-duration-short-1` | 50ms | Instant feedback |
| `--sys-motion-duration-short-2` | 100ms | Quick transitions |
| `--sys-motion-duration-short-3` | 150ms | Subtle animations |
| `--sys-motion-duration-short-4` | 200ms | Small elements |
| `--sys-motion-duration-medium-1` | 250ms | Standard transitions |
| `--sys-motion-duration-medium-2` | 300ms | Default duration |
| `--sys-motion-duration-medium-3` | 350ms | Larger elements |
| `--sys-motion-duration-medium-4` | 400ms | Complex transitions |
| `--sys-motion-duration-long-1` | 450ms | Large elements |
| `--sys-motion-duration-long-2` | 500ms | Page transitions |
| `--sys-motion-duration-long-3` | 550ms | Extended animations |
| `--sys-motion-duration-long-4` | 600ms | Smooth transitions |
| `--sys-motion-duration-extra-long-1` | 700ms | Elaborate animations |
| `--sys-motion-duration-extra-long-2` | 800ms | Hero transitions |
| `--sys-motion-duration-extra-long-3` | 900ms | Expressive motion |
| `--sys-motion-duration-extra-long-4` | 1000ms | Full-page transitions |

### Easing Tokens (10 Total)

| Token | Curve | Use Case |
|-------|-------|----------|
| `--sys-motion-easing-linear` | linear | Progress indicators |
| `--sys-motion-easing-standard` | cubic-bezier(0.2, 0, 0, 1) | Standard transitions |
| `--sys-motion-easing-standard-accelerate` | cubic-bezier(0.3, 0, 1, 1) | Exit animations |
| `--sys-motion-easing-standard-decelerate` | cubic-bezier(0, 0, 0, 1) | Enter animations |
| `--sys-motion-easing-emphasized` | cubic-bezier(0.2, 0, 0, 1) | Important actions |
| `--sys-motion-easing-emphasized-accelerate` | cubic-bezier(0.3, 0, 0.8, 0.15) | Expressive exits |
| `--sys-motion-easing-emphasized-decelerate` | cubic-bezier(0.05, 0.7, 0.1, 1) | Expressive enters |
| `--sys-motion-easing-expressive` | cubic-bezier(0.4, 0, 0.2, 1) | Playful motion |
| `--sys-motion-easing-expressive-bounce` | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Bounce effects |
| `--sys-motion-easing-expressive-spring` | cubic-bezier(0.175, 0.885, 0.32, 1.275) | Spring effects |

---

## Detection Patterns

### Pattern 1: Transition Duration

```tsx
// ❌ Before
<Button sx={{ transition: 'all 0.3s' }} />
<Box sx={{ transitionDuration: '200ms' }} />

// ✅ After
<Button sx={{
  transition: `all var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard)`
}} />
<Box sx={{ transitionDuration: 'var(--sys-motion-duration-short-4)' }} />
```

**Regex:**
```javascript
/(transition|transitionDuration):\s*['"]?(\d+)(ms|s)?['"]?/g
```

### Pattern 2: Easing Curves

```tsx
// ❌ Before
<Fade timeout={300} easing="ease-in-out" />
<Box sx={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }} />

// ✅ After
<Fade
  timeout={300} // Keep Material-UI timeout as-is
  easing="var(--sys-motion-easing-expressive)"
/>
<Box sx={{ transitionTimingFunction: 'var(--sys-motion-easing-expressive)' }} />
```

**Regex:**
```javascript
/(easing|transitionTimingFunction):\s*['"]?([^'";}]+)['"]?/g
```

### Pattern 3: Animation Duration

```tsx
// ❌ Before
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.fade { animation: fadeIn 0.3s ease-in-out; }

// ✅ After
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.fade {
  animation: fadeIn var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard-decelerate);
}
```

### Pattern 4: Material-UI Transition Components

```tsx
// ❌ Before
<Collapse timeout={300} />
<Slide timeout="auto" />

// ✅ After (keep Material-UI timeout, add easing)
<Collapse
  timeout={300}
  easing="var(--sys-motion-easing-emphasized-decelerate)"
/>
<Slide
  timeout="auto"
  easing="var(--sys-motion-easing-standard)"
/>
```

---

## Duration Mapping Algorithm

### Step 1: Extract Duration Value

```javascript
function extractDuration(value) {
  // Handle ms units
  if (value.includes('ms')) {
    return parseInt(value, 10);
  }

  // Handle s units (convert to ms)
  if (value.includes('s')) {
    return parseFloat(value) * 1000;
  }

  // Handle numeric values (assume ms)
  return parseInt(value, 10);
}
```

### Step 2: Map to M3 Duration Token

```javascript
const durationMap = {
  50: 'var(--sys-motion-duration-short-1)',
  100: 'var(--sys-motion-duration-short-2)',
  150: 'var(--sys-motion-duration-short-3)',
  200: 'var(--sys-motion-duration-short-4)',
  250: 'var(--sys-motion-duration-medium-1)',
  300: 'var(--sys-motion-duration-medium-2)',
  350: 'var(--sys-motion-duration-medium-3)',
  400: 'var(--sys-motion-duration-medium-4)',
  450: 'var(--sys-motion-duration-long-1)',
  500: 'var(--sys-motion-duration-long-2)',
  550: 'var(--sys-motion-duration-long-3)',
  600: 'var(--sys-motion-duration-long-4)',
  700: 'var(--sys-motion-duration-extra-long-1)',
  800: 'var(--sys-motion-duration-extra-long-2)',
  900: 'var(--sys-motion-duration-extra-long-3)',
  1000: 'var(--sys-motion-duration-extra-long-4)'
};

function mapToDurationToken(durationMs) {
  // Find closest token
  const durations = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 700, 800, 900, 1000];
  const closest = durations.reduce((prev, curr) =>
    Math.abs(curr - durationMs) < Math.abs(prev - durationMs) ? curr : prev
  );

  return durationMap[closest];
}
```

### Step 3: Map Easing Curves

```javascript
const easingMap = {
  'linear': 'var(--sys-motion-easing-linear)',
  'ease': 'var(--sys-motion-easing-standard)',
  'ease-in': 'var(--sys-motion-easing-standard-accelerate)',
  'ease-out': 'var(--sys-motion-easing-standard-decelerate)',
  'ease-in-out': 'var(--sys-motion-easing-standard)',
  'cubic-bezier(0.2, 0, 0, 1)': 'var(--sys-motion-easing-standard)',
  'cubic-bezier(0.4, 0, 0.2, 1)': 'var(--sys-motion-easing-expressive)',
  'cubic-bezier(0.68, -0.55, 0.265, 1.55)': 'var(--sys-motion-easing-expressive-bounce)',
  'cubic-bezier(0.175, 0.885, 0.32, 1.275)': 'var(--sys-motion-easing-expressive-spring)'
};

function mapToEasingToken(easing) {
  return easingMap[easing] || 'var(--sys-motion-easing-standard)';
}
```

---

## M3 Motion Patterns

### Pattern 1: Enter Animations (Decelerate)

```tsx
// Component appearing
const FadeIn = styled.div`
  animation: fadeIn var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard-decelerate);
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
```

### Pattern 2: Exit Animations (Accelerate)

```tsx
// Component disappearing
const FadeOut = styled.div`
  animation: fadeOut var(--sys-motion-duration-short-4) var(--sys-motion-easing-standard-accelerate);
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
```

### Pattern 3: State Changes (Standard)

```tsx
// Hover, focus, active states
<Button sx={{
  transition: `all var(--sys-motion-duration-short-4) var(--sys-motion-easing-standard)`,
  '&:hover': {
    backgroundColor: 'var(--sys-color-primary-container)'
  }
}} />
```

### Pattern 4: Emphasis Motion (Expressive)

```tsx
// Important actions, attention-grabbing
<Fab sx={{
  transition: `transform var(--sys-motion-duration-medium-2) var(--sys-motion-easing-expressive-spring)`,
  '&:active': {
    transform: 'scale(0.95)'
  }
}} />
```

---

## Example Transformations

### Example 1: Button Hover Transition

**Before:**
```tsx
const Button = styled.button`
  background-color: #1976d2;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #1565c0;
  }
`;
```

**After:**
```tsx
const Button = styled.button`
  background-color: var(--sys-color-primary);
  transition: all var(--sys-motion-duration-short-4) var(--sys-motion-easing-standard);

  &:hover {
    background-color: var(--sys-palette-primary-30);
  }
`;
```

### Example 2: Modal Enter/Exit

**Before:**
```tsx
<Modal
  open={open}
  TransitionComponent={Fade}
  transitionDuration={300}
>
  <Box sx={{
    animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }}>
    Content
  </Box>
</Modal>
```

**After:**
```tsx
<Modal
  open={open}
  TransitionComponent={Fade}
  transitionDuration={300}
  TransitionProps={{
    easing: {
      enter: 'var(--sys-motion-easing-emphasized-decelerate)',
      exit: 'var(--sys-motion-easing-emphasized-accelerate)'
    }
  }}
>
  <Box sx={{
    animation: `slideIn var(--sys-motion-duration-medium-2) var(--sys-motion-easing-expressive)`
  }}>
    Content
  </Box>
</Modal>
```

### Example 3: Collapse Panel

**Before:**
```tsx
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    Title
  </AccordionSummary>
  <AccordionDetails sx={{
    transition: 'height 0.3s ease'
  }}>
    Content
  </AccordionDetails>
</Accordion>
```

**After:**
```tsx
<Accordion
  TransitionProps={{
    timeout: 300,
    easing: {
      enter: 'var(--sys-motion-easing-standard-decelerate)',
      exit: 'var(--sys-motion-easing-standard-accelerate)'
    }
  }}
>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    Title
  </AccordionSummary>
  <AccordionDetails sx={{
    transition: `height var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard)`
  }}>
    Content
  </AccordionDetails>
</Accordion>
```

### Example 4: Loading Spinner

**Before:**
```tsx
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

**After:**
```tsx
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin var(--sys-motion-duration-extra-long-4) var(--sys-motion-easing-linear) infinite;
}
```

### Example 5: Page Transition

**Before:**
```tsx
<CSSTransition
  in={show}
  timeout={500}
  classNames="page"
>
  <div>Page content</div>
</CSSTransition>

/* CSS */
.page-enter {
  opacity: 0;
  transform: translateX(100%);
}
.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 500ms ease-in-out;
}
```

**After:**
```tsx
<CSSTransition
  in={show}
  timeout={500}
  classNames="page"
>
  <div>Page content</div>
</CSSTransition>

/* CSS */
.page-enter {
  opacity: 0;
  transform: translateX(100%);
}
.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all var(--sys-motion-duration-long-2) var(--sys-motion-easing-emphasized-decelerate);
}
```

---

## Accessibility: Reduced Motion

**CRITICAL:** Always respect user's motion preferences:

```tsx
// ❌ Before (no reduced motion support)
<Button sx={{
  transition: 'all var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard)'
}} />

// ✅ After (with prefers-reduced-motion)
<Button sx={{
  transition: 'all var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard)',
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none'
  }
}} />
```

**Global CSS Support:**

```css
/* Disable all transitions/animations for reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## M3 Motion Use Cases

### Micro-Interactions (Short Durations)

- Button hover states: **short-4** (200ms)
- Checkbox/toggle animations: **short-2** (100ms)
- Tooltip fade-in: **short-3** (150ms)
- Ripple effects: **short-4** (200ms)

### Standard UI Transitions (Medium Durations)

- Card hover elevation: **medium-1** (250ms)
- Dropdown open/close: **medium-2** (300ms)
- Tab switching: **medium-3** (350ms)
- Snackbar appear: **medium-2** (300ms)

### Complex Animations (Long Durations)

- Modal enter/exit: **long-2** (500ms)
- Drawer slide: **long-3** (550ms)
- Page transitions: **long-4** (600ms)
- Accordion expand: **long-1** (450ms)

### Expressive Motion (Extra-Long Durations)

- Hero animations: **extra-long-2** (800ms)
- Onboarding flows: **extra-long-3** (900ms)
- Full-page transitions: **extra-long-4** (1000ms)
- Celebration effects: **extra-long-2** (800ms)

---

## Edge Cases

### Case 1: Delay Property

```tsx
// ✅ Keep delay as-is (no M3 delay tokens)
transition: `all var(--sys-motion-duration-medium-2) var(--sys-motion-easing-standard) 100ms`
```

### Case 2: Multiple Properties

```tsx
// ✅ Apply M3 tokens to each property
transition: `
  opacity var(--sys-motion-duration-short-4) var(--sys-motion-easing-standard),
  transform var(--sys-motion-duration-medium-2) var(--sys-motion-easing-expressive)
`
```

### Case 3: Auto/Inherit Values

```tsx
// ✅ Keep as-is
transitionDuration: 'auto'
transitionDuration: 'inherit'
```

---

## Validation

### Post-Replacement Checks

1. **Syntax Valid:** Code still parses correctly
2. **All Durations Mapped:** No hardcoded ms/s values remain
3. **All Easings Mapped:** No hardcoded cubic-bezier values remain
4. **Reduced Motion:** `prefers-reduced-motion` support added
5. **Visual Regression:** Animations look the same
6. **Performance:** No animation jank or stuttering

---

## Output Format

```json
{
  "file": "frontend/src/components/ui/Button/Button.tsx",
  "replacements": 6,
  "details": [
    {
      "line": 15,
      "property": "transitionDuration",
      "original": "0.3s",
      "token": "var(--sys-motion-duration-medium-2)",
      "context": "Button hover transition"
    },
    {
      "line": 16,
      "property": "transitionTimingFunction",
      "original": "ease-in-out",
      "token": "var(--sys-motion-easing-standard)",
      "context": "Button easing"
    }
  ],
  "warnings": [
    {
      "line": 32,
      "message": "Missing prefers-reduced-motion support (accessibility issue)"
    }
  ]
}
```

---

## Usage

**As standalone skill:**
```bash
# Pass component file path
m3-motion-applier --file frontend/src/components/ui/Button/Button.tsx
```

**Within m3-migration-architect (Step 8 - FINAL STEP):**
```javascript
const finalCode = await runSkill('m3-motion-applier', {
  code: iconReplacedCode,
  tokens: tokensExpressive
});

// Migration complete! 🎉
```

---

**Created:** 2025-11-17
**Version:** 1.0.0
**Status:** Ready for use in migration protocol (FINAL STEP)
