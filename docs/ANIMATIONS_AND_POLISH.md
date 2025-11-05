# Animations and Polish Guide

## Overview

Animations and micro-interactions enhance user experience by providing visual feedback, guiding attention, and creating a polished, professional feel.

## Animation Principles

1. **Purpose** - Every animation should serve a purpose (provide feedback, guide attention, etc.)
2. **Speed** - Keep animations fast (150-500ms) to avoid feeling sluggish
3. **Easing** - Use appropriate easing functions for natural motion
4. **Restraint** - Don't overuse animations; they lose impact

## Timing Guidelines

| Duration  | Usage                                            |
| --------- | ------------------------------------------------ |
| 100-150ms | Micro-interactions (button click, focus change)  |
| 300ms     | Standard transitions (fade in/out, slide in/out) |
| 500ms     | Page transitions, large layout changes           |

## Animation Types

### 1. Fade In/Out

**Purpose**: Smoothly introduce/remove content

**Implementation**:

```typescript
import { animatedSx, animations } from '@/utils/animations';

<Box sx={animatedSx.fadeIn}>
  Content fades in on mount
</Box>
```

**Use Cases**:

- Page/modal entrance
- Loading to loaded state
- Revealing additional content

### 2. Slide In/Out

**Purpose**: Directional entrance from off-screen

**Implementation**:

```typescript
<Box sx={animatedSx.slideInUp}>
  Slides in from bottom
</Box>

<Box sx={animatedSx.slideInLeft}>
  Slides in from left
</Box>
```

**Use Cases**:

- Toast notifications
- Drawer opening
- List items appearing

### 3. Scale In/Out

**Purpose**: Zoom entrance/exit effect

**Implementation**:

```typescript
<Box sx={animatedSx.scaleIn}>
  Dialog opening
</Box>
```

**Use Cases**:

- Modal/dialog opening
- Expanding content areas
- Item selection

### 4. Loading Skeleton Shimmer

**Purpose**: Show content is loading

**Implementation**:

```typescript
import { SkeletonLoader } from '@/components/SkeletonLoader';

<SkeletonLoader type="card" count={3} />
```

## Hover Effects

### Card Lift

Subtle elevation on hover:

```typescript
import { hoverEffects } from '@/utils/animations';

<Card sx={hoverEffects.lift}>
  Lifts on hover
</Card>
```

**CSS**:

```css
transition:
  transform 0.3s ease,
  box-shadow 0.3s ease;
&:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
```

### Button Interactions

Interactive button feedback:

```typescript
<Button
  sx={buttonInteractions.withShadow}
>
  Hover me
</Button>
```

**Effect**:

- Slight upward movement
- Enhanced shadow
- Smooth transition

### Color Shift

Hover color changes:

```typescript
<Button
  sx={hoverEffects.colorShift}
>
  Color changes on hover
</Button>
```

## Focus States

### Focus Ring

Visible focus indicator for keyboard users:

```typescript
import { focusEffects } from '@/utils/animations';

<Button sx={focusEffects.ring}>
  Focus visible ring
</Button>
```

### Focus Outline

Alternative focus indicator:

```typescript
<Button sx={focusEffects.outline}>
  Focus outline
</Button>
```

## Loading States

### Pulse Animation

Continuous pulse for loading:

```typescript
<Box sx={animatedSx.pulse}>
  <CircularProgress />
</Box>
```

### Skeleton Loader

Placeholder with shimmer:

```typescript
<SkeletonLoader type="card" count={3} fullHeight={true} />
```

### Progress Indicator

Linear progress bar:

```typescript
<LinearProgress
  variant="determinate"
  value={progress}
  sx={{
    transition: 'width 0.3s ease',
  }}
/>
```

## Page Transitions

### Fade In

Simple opacity change:

```typescript
import { pageTransitions } from '@/utils/animations';

<Box sx={pageTransitions.enter}>
  Page content
</Box>
```

### Slide Transitions

Directional page transitions:

```typescript
<Box sx={pageTransitions.enterFromLeft}>
  Enter from left
</Box>

<Box sx={pageTransitions.enterFromRight}>
  Enter from right
</Box>
```

## Modal Animations

### Scale In

Modal appears with zoom:

```typescript
import { modalTransitions } from '@/utils/animations';

<Dialog
  TransitionComponent={Grow}
  sx={modalTransitions.enter}
>
  Dialog content
</Dialog>
```

### Fade In

Subtle fade entrance:

```typescript
<Dialog sx={modalTransitions.enterFade}>
  Dialog content
</Dialog>
```

## Input Field Polish

### Focus State

Clear focus indication:

```typescript
<TextField
  sx={inputInteractions.withFocus}
/>
```

**Effect**:

- Border color changes
- Box shadow appears
- Smooth transition

### Error Animation

Shake animation for errors:

```typescript
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

<TextField
  error={hasError}
  sx={hasError ? { animation: `${shake} 0.4s` } : {}}
/>
```

## Button Micro-interactions

### Click Feedback

```typescript
<Button
  sx={{
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    '&:active': {
      transform: 'scale(0.98)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  }}
>
  Click me
</Button>
```

### Icon Animation

```typescript
<IconButton
  sx={{
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'rotate(90deg)',
    },
  }}
>
  <SettingsIcon />
</IconButton>
```

## List Animations

### Stagger Animation

Items appear in sequence:

```typescript
{items.map((item, index) => (
  <ListItem
    key={item.id}
    sx={{
      animation: `${animations.slideInUp} 0.4s ease-out`,
      animationDelay: `${index * 50}ms`,
    }}
  >
    {item.name}
  </ListItem>
))}
```

### Reorder Animation

Smooth reordering:

```typescript
<Box
  sx={{
    transition: 'transform 0.3s ease',
    transform: `translateY(${offset}px)`,
  }}
>
  Item
</Box>
```

## Toast/Snackbar Animations

### Slide Up

```typescript
<Snackbar
  open={open}
  autoHideDuration={3000}
  onClose={handleClose}
  TransitionComponent={Slide}
>
  <Alert severity="success">
    Saved successfully!
  </Alert>
</Snackbar>
```

### Fade In

```typescript
<Snackbar
  open={open}
  autoHideDuration={3000}
  onClose={handleClose}
  TransitionComponent={Fade}
>
  <Alert severity="info">
    Notification
  </Alert>
</Snackbar>
```

## Best Practices

### Do's ✅

- Use animations to guide attention
- Keep animations under 500ms
- Ensure animations have purpose
- Test animations on different devices
- Respect `prefers-reduced-motion` setting
- Use easing functions for natural motion

### Don'ts ❌

- Don't animate everything (be selective)
- Don't use long, complex animations
- Don't block interactions with animations
- Don't use auto-playing animations (accessibility)
- Don't ignore performance impact
- Don't violate `prefers-reduced-motion` preference

## Performance Considerations

### Hardware Acceleration

Use GPU-accelerated properties:

```typescript
// ✅ Good - GPU accelerated
transform: 'translateY(-4px)',
opacity: 0.8,

// ❌ Bad - CPU intensive
top: '-4px',
left: '0px',
```

### Reduce Motion

Respect user preferences:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<Box
  sx={{
    animation: prefersReducedMotion
      ? 'none'
      : `${animations.slideInUp} 0.4s ease-out`,
  }}
>
  Content
</Box>
```

## Common Patterns

### Loading to Loaded

```typescript
{isLoading ? (
  <SkeletonLoader type="card" count={3} />
) : (
  <Box sx={animatedSx.fadeIn}>
    Actual content
  </Box>
)}
```

### Success Feedback

```typescript
{showSuccess && (
  <Alert
    severity="success"
    sx={animatedSx.slideInUp}
  >
    Operation successful!
  </Alert>
)}
```

### Error Shake

```typescript
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

<TextField
  error={hasError}
  sx={hasError ? { animation: `${shake} 0.4s` } : {}}
/>
```

## Testing Animations

### Browser DevTools

1. Open DevTools
2. Go to Animations panel
3. Slow down playback rate to verify smoothness

### Screen Readers

Ensure animations don't interfere with screen reader announcements:

```typescript
<Box
  role="status"
  aria-live="polite"
  sx={animatedSx.fadeIn}
>
  Announcement
</Box>
```

## Animation Library Files

- **[frontend/src/utils/animations.ts](../../frontend/src/utils/animations.ts)** - Animation definitions
- **[frontend/src/components/SkeletonLoader.tsx](../../frontend/src/components/SkeletonLoader.tsx)** - Loading skeletons

## Resources

- [CSS Animations MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Emotion Animation](https://emotion.sh/docs/animation)
- [Material-UI Transitions](https://mui.com/api/transition/)
- [Animation Performance](https://web.dev/animations-guide/)
- [Prefers Reduced Motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
