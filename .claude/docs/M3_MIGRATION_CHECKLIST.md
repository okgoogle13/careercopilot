# M3 Migration Checklist

**Quick Reference for Each Component**

## Pre-Migration
- [ ] Read the component file
- [ ] Identify all hardcoded colors, spacing, fonts
- [ ] Note any custom styling patterns
- [ ] Check dependencies on other components

## Color Migration
- [ ] Replace `theme.palette.*` with M3 tokens
- [ ] Replace hardcoded colors with M3 equivalents
- [ ] Verify text contrast (WCAG AA)
- [ ] Check error states use M3 error token

## Typography
- [ ] Replace `<div>` with `<Typography variant="...">`
- [ ] Use correct variant (h1-h6, body1-2, caption)
- [ ] Remove custom font-size values

## Spacing
- [ ] Convert all px values to `theme.spacing()`
- [ ] Ensure multiples of 4px
- [ ] Check padding, margin, gap values

## Shapes & Shadows
- [ ] Use `theme.shape.borderRadius` (12px default)
- [ ] Replace shadows with theme tokens
- [ ] Use glass tokens if applicable

## Post-Migration
- [ ] No TypeScript errors
- [ ] Visual inspection passed
- [ ] Responsive design verified
- [ ] Create PR with before/after notes
