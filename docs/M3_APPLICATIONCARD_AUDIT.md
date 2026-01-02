# ApplicationCard M3 Design Token Audit

**Date:** 2026-01-02  
**Component:** `frontend/src/components/shared/ApplicationCard.tsx`  
**Design System:** Material Design 3 (Electric Alchemist Theme)  
**Token Reference:** `frontend/src/theme/design-tokens.css`

---

## Audit Summary

### Overall Compliance: ⚠️ **Partial Compliance**

The ApplicationCard component uses **ad-hoc Tailwind classes** instead of properly referencing M3 design tokens via CSS variables. This creates inconsistencies with the defined design system.

---

## Detailed Token Analysis

### 1. **Padding** ⚠️ **Non-Compliant**

#### Current Implementation
```tsx
<div className="... p-8 ...">
```

**Issue:** Uses Tailwind spacing class `p-8` (2rem / 32px) which is not mapped to any M3 token.

#### M3 Token Recommendation
The design tokens don't define explicit padding tokens, but based on M3 principles:
- **Expected:** Use spacing that aligns with the 4px/8px grid system
- **Suggested Fix:** Create a custom spacing token or use `2rem` directly via custom class

**Action Required:** ✅ **Create M3 spacing tokens**
```css
/* Add to design-tokens.css */
--sys-space-xs: 4px;
--sys-space-sm: 8px;
--sys-space-md: 16px;
--sys-space-lg: 24px;
--sys-space-xl: 32px;
--sys-space-2xl: 48px;
```

---

### 2. **Border Radius** ❌ **Non-Compliant**

#### Current Implementation
```tsx
<div className="... rounded-xl ...">
```
- Tailwind `rounded-xl` = `0.75rem` (12px) with symmetric corners

#### M3 Token Definition
```css
--sys-shape-corner-extra-large: 28px 12px 28px 12px; /* Organic asymmetric */
--sys-shape-pebble: 20px 20px 32px 32px; /* Friendly organic */
--sys-shape-leaf: 32px 12px 32px 12px; /* Growth motif */
```

**Issue:** The component uses symmetric 12px radius, which contradicts the Electric Alchemist aesthetic requiring **organic, asymmetric shapes**.

**Action Required:** ✅ **Replace with M3 shape token**
```tsx
// Replace:
className="... rounded-xl ..."

// With:
style={{ borderRadius: 'var(--sys-shape-pebble)' }}
// OR create Tailwind utility:
className="... rounded-pebble ..."
```

---

### 3. **Elevation/Shadow** ❌ **Non-Compliant**

#### Current Implementation
```tsx
shadow-elevation-1 hover:shadow-elevation-2
```

**Issue:** References undefined Tailwind utilities. These classes don't exist in the generated CSS.

#### M3 Token Definition
```css
--sys-elevation-level1: 0 1px 2px rgba(0, 0, 0, 0.3), 
                        0 1px 3px 1px rgba(0, 0, 0, 0.15);
--sys-elevation-level2: 0 1px 2px rgba(0, 0, 0, 0.3), 
                        0 2px 6px 2px rgba(0, 0, 0, 0.15);
--sys-elevation-level3: 0 4px 8px 3px rgba(0, 0, 0, 0.15), 
                        0 1px 3px rgba(0, 0, 0, 0.3);
```

**Action Required:** ✅ **Add shadow utilities to index.css**
```css
/* Add to @layer utilities in index.css */
.shadow-elevation-1 {
  box-shadow: var(--sys-elevation-level1);
}
.shadow-elevation-2 {
  box-shadow: var(--sys-elevation-level2);
}
.shadow-elevation-3 {
  box-shadow: var(--sys-elevation-level3);
}
.shadow-elevation-4 {
  box-shadow: var(--sys-elevation-level4);
}
.shadow-elevation-5 {
  box-shadow: var(--sys-elevation-level5);
}
```

---

### 4. **Motion/Transitions** ✅ **Compliant**

#### Current Implementation
```tsx
transition-all duration-medium-1 ease-spring
```

**Status:** ✅ References M3 motion tokens correctly!

#### M3 Token Definition
```css
--sys-motion-duration-medium-1: 250ms;
--sys-motion-easing-expressive-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

**Mapped via:**
```css
--ease-spring: var(--sys-motion-easing-expressive-spring);
```

**Verification:** These utilities need to be defined in index.css. **Action needed to verify.**

---

### 5. **Colors** ⚠️ **Partially Compliant**

#### Current Implementation
```tsx
bg-surface-container
text-on-surface
border-outline-variant
bg-primary-container text-on-primary-container
bg-secondary-container text-on-secondary-container
bg-surface-container-high text-on-surface-variant
```

**Status:** ⚠️ **Good token usage**, but needs verification that Tailwind utilities exist.

#### M3 Token Definition
All referenced colors are properly defined in design-tokens.css:
```css
--sys-color-surface-container: var(--ref-palette-neutral-12);
--sys-color-on-surface: var(--ref-palette-neutral-90);
--sys-color-outline-variant: var(--ref-palette-neutral-30);
--sys-color-primary-container: var(--ref-palette-primary-30);
--sys-color-on-primary-container: var(--ref-palette-primary-90);
```

**Action Required:** ✅ **Verify Tailwind config maps these**

---

### 6. **Typography** ⚠️ **Partially Compliant**

#### Current Implementation
```tsx
text-headline-large        // h3
text-title-large          // company name
text-label-small          // location meta
text-label-medium         // step labels
```

**Issue:** These classes reference M3 type scales but may not be mapped in Tailwind.

#### M3 Token Definition
```css
--sys-type-headline-large-size: 32px;
--sys-type-headline-large-line-height: 40px;
--sys-type-title-large-size: 22px;
--sys-type-title-large-line-height: 28px;
```

**Action Required:** ✅ **Add typography utilities to index.css**

---

## Action Items

### High Priority (Blocking Visual Consistency)

1. ✅ **Add M3 spacing tokens** to design-tokens.css
2. ✅ **Update ApplicationCard** to use `--sys-shape-pebble or --sys-shape-leaf` instead of `rounded-xl`
3. ✅ **Create shadow utilities** (`.shadow-elevation-1` through `.shadow-elevation-5`) in index.css
4. ✅ **Verify and create motion utilities** (`duration-medium-1`, `ease-spring`) in index.css
5. ✅ **Create typography scale utilities** (`text-headline-large`, `text-title-large`, etc.) in index.css

### Medium Priority (Optimization)

6. ⚠️ **Verify Tailwind theme config** maps all M3 color tokens correctly
7. ⚠️ **Add JSDoc comments** to ApplicationCard explaining M3 token usage

### Low Priority (Enhancement)

8. 💡 **Consider adding M3 elevation glows** for interactive states:
   ```css
   .hover\:shadow-glow-primary:hover {
     box-shadow: var(--sys-elevation-glow-primary);
   }
   ```

---

## Recommended Component Updates

### Before (Current)
```tsx
<div className="bg-surface-container rounded-xl p-8 border border-outline-variant shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-medium-1 ease-spring">
```

### After (M3 Compliant)
```tsx
<div 
  className="bg-surface-container p-8 border border-outline-variant shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-medium-1 ease-spring"
  style={{ borderRadius: 'var(--sys-shape-pebble)' }}
>
```

**OR** (if Tailwind utility created):
```tsx
<div className="bg-surface-container rounded-pebble p-8 border border-outline-variant shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-medium-1 ease-spring">
```

---

## Testing Checklist

- [ ] Storybook story created and rendering
- [ ] All M3 tokens properly applied
- [ ] Shadows visible in hover state
- [ ] Organic border radius matches design tokens
- [ ] Spring easing animation feels natural
- [ ] Component responsive on mobile
- [ ] Dark theme colors correct
- [ ] Accessibility contrast ratios pass WCAG AA

---

## Conclusion

The ApplicationCard component demonstrates **good intent** with M3 token naming in class names, but requires **actual implementation** of the Tailwind utilities that reference these tokens. The most critical issues are:

1. **Missing organic shape system** (symmetric radius instead of asymmetric)
2. **Undefined shadow utilities** (classes exist in code but not in CSS)
3. **Need for explicit spacing tokens** aligned with M3 grid system

**Estimated Effort:** 2-3 hours to fully align the component and create all necessary utilities.
