# CareerCopilot Design System

## Overview

CareerCopilot uses a modern, accessible design system built on Material-UI (MUI) v5 with custom theming for a cohesive and professional user experience.

## Design Philosophy

Our design is built on three core principles:

1. **Accessibility First** - WCAG AA compliant with semantic HTML
2. **Material 3 Expressive** - Bold typography, dynamic spacing, prominent colors
3. **Dark Theme Optimized** - High contrast, reduced eye strain, modern aesthetic

## Color Palette

### Primary Colors

| Color         | Hex       | Usage                                     |
| ------------- | --------- | ----------------------------------------- |
| Primary       | `#A855F7` | Interactive elements, CTAs, active states |
| Primary Light | `#D8B4FE` | Hover states, light backgrounds           |
| Primary Dark  | `#7E22CE` | Pressed states, dark backgrounds          |

### Secondary Colors

| Color           | Hex       | Usage                                  |
| --------------- | --------- | -------------------------------------- |
| Secondary       | `#8B5A3C` | Supporting elements, secondary actions |
| Secondary Light | `#D4A574` | Light secondary backgrounds            |
| Secondary Dark  | `#5A3A24` | Dark secondary backgrounds             |

### Neutral Colors

| Color          | Hex       | Usage                    |
| -------------- | --------- | ------------------------ |
| Background     | `#0F0F0F` | Main background          |
| Paper          | `#1A1A1A` | Card/surface backgrounds |
| Divider        | `#333333` | Dividers, borders        |
| Text Primary   | `#FFFFFF` | Main text                |
| Text Secondary | `#B3B3B3` | Secondary text           |
| Text Disabled  | `#666666` | Disabled text            |

### Semantic Colors

| Status  | Color | Hex       |
| ------- | ----- | --------- |
| Success | Green | `#10B981` |
| Warning | Amber | `#F59E0B` |
| Error   | Red   | `#EF4444` |
| Info    | Blue  | `#3B82F6` |

## Typography

### Font Family

Primary: System font stack

```
'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue'
```

### Font Sizes & Weights

| Style     | Size | Weight | Usage              |
| --------- | ---- | ------ | ------------------ |
| H1        | 32px | 700    | Page titles        |
| H2        | 28px | 700    | Section headers    |
| H3        | 24px | 600    | Subsection headers |
| H4        | 20px | 600    | Card titles        |
| Subtitle1 | 16px | 600    | Form labels        |
| Subtitle2 | 14px | 600    | Chip labels        |
| Body1     | 16px | 400    | Body text          |
| Body2     | 14px | 400    | Secondary body     |
| Caption   | 12px | 400    | Helpers, hints     |

## Spacing Scale

8px based spacing system:

```
8px   (1 unit)
16px  (2 units)
24px  (3 units)
32px  (4 units)
48px  (6 units)
64px  (8 units)
```

## Border Radius

| Size   | Value | Usage                  |
| ------ | ----- | ---------------------- |
| Small  | 4px   | Small elements, inputs |
| Medium | 12px  | Cards, modals, buttons |
| Large  | 20px  | Pill buttons, badges   |
| Full   | 50%   | Circular elements      |

## Shadows

### Elevation Scale

| Level   | Shadow                        | Usage            |
| ------- | ----------------------------- | ---------------- |
| Default | `0 2px 4px rgba(0,0,0,0.1)`   | Regular elements |
| Hover   | `0 8px 16px rgba(0,0,0,0.15)` | Hover states     |
| Active  | `0 12px 24px rgba(0,0,0,0.2)` | Active states    |

## Animations & Transitions

### Timing

- **Fast**: 150ms - Micro-interactions
- **Normal**: 300ms - Standard transitions
- **Slow**: 500ms - Page transitions

### Common Animations

- **Fade In**: `fadeIn 0.3s ease-in-out`
- **Slide In (Up)**: `slideInUp 0.4s ease-out`
- **Scale In**: `scaleIn 0.3s ease-out`
- **Pulse**: `pulse 2s ease-in-out infinite`

## Component Patterns

### Buttons

```typescript
// Primary Button
<Button variant="contained" color="primary">
  Action
</Button>

// Secondary Button
<Button variant="outlined">
  Secondary
</Button>

// Text Button
<Button variant="text">
  Tertiary
</Button>
```

### Cards

```typescript
<Card>
  <CardContent>
    <Typography>Content</Typography>
  </CardContent>
</Card>
```

### Forms

```typescript
<TextField
  label="Email"
  type="email"
  required
  error={Boolean(error)}
  helperText={error}
  aria-required="true"
  aria-invalid={Boolean(error)}
/>
```

### Modals

```typescript
<Dialog open={open} onClose={onClose}>
  <DialogTitle>Title</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button>Cancel</Button>
    <Button variant="contained">Confirm</Button>
  </DialogActions>
</Dialog>
```

## Accessibility Standards

- **WCAG AA Compliance**: All components meet WCAG AA standards
- **Color Contrast**: Minimum 4.5:1 for text
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators

## Best Practices

### Do's ✅

- Use semantic HTML elements
- Include ARIA labels for interactive elements
- Ensure keyboard navigation works
- Test with screen readers
- Use meaningful color combinations
- Provide loading states
- Handle errors gracefully

### Don'ts ❌

- Don't rely solely on color to convey meaning
- Don't remove focus indicators
- Don't use purely decorative images
- Don't auto-play videos/audio
- Don't use placeholder text as labels
- Don't skip heading levels

## Theme Configuration

See [frontend/src/theme/theme.ts](../../frontend/src/theme/theme.ts) for the complete MUI theme configuration.

## Responsive Design

### Breakpoints

| Device  | Width      | CSS  |
| ------- | ---------- | ---- |
| Mobile  | < 600px    | `xs` |
| Tablet  | 600-960px  | `sm` |
| Desktop | 960-1264px | `md` |
| Wide    | > 1264px   | `lg` |

### Mobile-First Approach

```typescript
sx={{
  fontSize: '14px',           // Mobile
  md: { fontSize: '16px' },   // Tablet+
  lg: { fontSize: '18px' }    // Desktop+
}}
```

## Resources

- [Material-UI Documentation](https://mui.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
