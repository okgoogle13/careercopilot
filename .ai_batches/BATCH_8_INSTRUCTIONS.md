# Batch 8: Layout Components - Delegation Instructions

## Assignment Details
- **Difficulty:** Easiest (90% automation)
- **Time Estimate:** 1.5 hours
- **Components:** 3 (Container, Grid, Divider)
- **Ideal for:** Junior AI agents or parallel execution

## Your Mission
Migrate 3 layout components. These are almost entirely CSS work with minimal logic!

---

## Component 1: M3Container

### Generate Base
```bash
python3 scripts/generate-m3-component.py --name="Container" --type="card" --output="frontend/src/components/ui"
```

### Customization Required (20 min)
1. **Add max-width variants:**
   ```typescript
   export interface M3ContainerProps {
     maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | false;
     children: React.ReactNode;
   }
   ```

2. **Add responsive max-widths in CSS:**
   ```css
   .m3-container {
     width: 100%;
     margin-left: auto;
     margin-right: auto;
     padding-left: var(--md-sys-spacing-4);
     padding-right: var(--md-sys-spacing-4);
   }

   .m3-container--sm {
     max-width: 640px;
   }

   .m3-container--md {
     max-width: 768px;
   }

   .m3-container--lg {
     max-width: 1024px;
   }

   .m3-container--xl {
     max-width: 1280px;
   }

   .m3-container--false {
     max-width: none;
   }

   @media (min-width: 768px) {
     .m3-container {
       padding-left: var(--md-sys-spacing-6);
       padding-right: var(--md-sys-spacing-6);
     }
   }
   ```

### Storybook Stories
- All Max Widths (sm, md, lg, xl)
- No Max Width (full width)
- With Content Inside
- Responsive Behavior

---

## Component 2: M3Grid

### Generate Base
```bash
python3 scripts/generate-m3-component.py --name="Grid" --type="card" --output="frontend/src/components/ui"
```

### Customization Required (40 min)
1. **Add 12-column grid system:**
   ```typescript
   export interface M3GridProps {
     container?: boolean;
     item?: boolean;
     xs?: number; // 1-12
     sm?: number;
     md?: number;
     lg?: number;
     spacing?: number; // Gap multiplier (1-8)
     children: React.ReactNode;
   }
   ```

2. **Add grid CSS with breakpoints:**
   ```css
   .m3-grid-container {
     display: grid;
     grid-template-columns: repeat(12, 1fr);
   }

   /* Spacing variants */
   .m3-grid-container--spacing-1 {
     gap: calc(var(--md-sys-spacing-1) * 1); /* 4px */
   }

   .m3-grid-container--spacing-2 {
     gap: calc(var(--md-sys-spacing-1) * 2); /* 8px */
   }

   .m3-grid-container--spacing-4 {
     gap: calc(var(--md-sys-spacing-1) * 4); /* 16px */
   }

   .m3-grid-container--spacing-6 {
     gap: calc(var(--md-sys-spacing-1) * 6); /* 24px */
   }

   /* Grid items - mobile first (xs) */
   .m3-grid-item--xs-1 { grid-column: span 1; }
   .m3-grid-item--xs-2 { grid-column: span 2; }
   .m3-grid-item--xs-3 { grid-column: span 3; }
   .m3-grid-item--xs-4 { grid-column: span 4; }
   .m3-grid-item--xs-6 { grid-column: span 6; }
   .m3-grid-item--xs-12 { grid-column: span 12; }

   /* Tablet breakpoint (sm: 640px) */
   @media (min-width: 640px) {
     .m3-grid-item--sm-1 { grid-column: span 1; }
     .m3-grid-item--sm-2 { grid-column: span 2; }
     .m3-grid-item--sm-3 { grid-column: span 3; }
     .m3-grid-item--sm-4 { grid-column: span 4; }
     .m3-grid-item--sm-6 { grid-column: span 6; }
     .m3-grid-item--sm-12 { grid-column: span 12; }
   }

   /* Desktop breakpoint (md: 768px) */
   @media (min-width: 768px) {
     .m3-grid-item--md-1 { grid-column: span 1; }
     .m3-grid-item--md-2 { grid-column: span 2; }
     .m3-grid-item--md-3 { grid-column: span 3; }
     .m3-grid-item--md-4 { grid-column: span 4; }
     .m3-grid-item--md-6 { grid-column: span 6; }
     .m3-grid-item--md-12 { grid-column: span 12; }
   }

   /* Large desktop (lg: 1024px) */
   @media (min-width: 1024px) {
     .m3-grid-item--lg-1 { grid-column: span 1; }
     .m3-grid-item--lg-2 { grid-column: span 2; }
     .m3-grid-item--lg-3 { grid-column: span 3; }
     .m3-grid-item--lg-4 { grid-column: span 4; }
     .m3-grid-item--lg-6 { grid-column: span 6; }
     .m3-grid-item--lg-12 { grid-column: span 12; }
   }
   ```

3. **Add className builder:**
   ```typescript
   const gridClasses = [
     container && 'm3-grid-container',
     container && spacing && `m3-grid-container--spacing-${spacing}`,
     item && 'm3-grid-item',
     item && xs && `m3-grid-item--xs-${xs}`,
     item && sm && `m3-grid-item--sm-${sm}`,
     item && md && `m3-grid-item--md-${md}`,
     item && lg && `m3-grid-item--lg-${lg}`,
     className,
   ]
     .filter(Boolean)
     .join(' ');
   ```

### Storybook Stories
- Basic 3-Column Layout
- Responsive (12 cols on mobile, 6 on tablet, 4 on desktop)
- All Spacing Variants
- Complex Dashboard Layout
- Nested Grids

---

## Component 3: M3Divider (Alternative to Separator)

**Note:** This is almost identical to Batch 6's M3Separator. If Batch 6 is already complete, you can skip this or create as an alias.

### Generate Base
```bash
python3 scripts/generate-m3-component.py --name="Divider" --type="card" --output="frontend/src/components/ui"
```

### Customization Required (15 min)
1. **Add orientation and variant:**
   ```typescript
   export interface M3DividerProps {
     orientation?: 'horizontal' | 'vertical';
     variant?: 'full' | 'inset' | 'middle';
   }
   ```

2. **Add CSS variants:**
   ```css
   .m3-divider {
     border: none;
     background-color: var(--md-sys-color-outline-variant);
   }

   /* Orientation */
   .m3-divider--horizontal {
     width: 100%;
     height: 1px;
     margin: var(--md-sys-spacing-4) 0;
   }

   .m3-divider--vertical {
     width: 1px;
     height: 100%;
     margin: 0 var(--md-sys-spacing-4);
   }

   /* Variants */
   .m3-divider--inset {
     margin-left: var(--md-sys-spacing-16);
   }

   .m3-divider--middle {
     margin-left: var(--md-sys-spacing-6);
     margin-right: var(--md-sys-spacing-6);
   }
   ```

### Storybook Stories
- Horizontal (full, inset, middle)
- Vertical
- In List (inset variant)
- In Card (middle variant)

---

## Validation Checklist

Before committing:
- [ ] Container: All max-width variants work
- [ ] Grid: 12-column system responsive across breakpoints
- [ ] Grid: Spacing variants (1, 2, 4, 6) render correctly
- [ ] Divider: Horizontal/vertical orientation works
- [ ] Test responsive grid at 375px, 640px, 768px, 1024px
- [ ] All components 100% M3 tokens
- [ ] TypeScript compiles clean
- [ ] Storybook stories interactive

## Commit Command
```bash
git add -A
git commit -m "feat: Complete M3 Batch 8 - Layout components (Container, Grid, Divider)

**Batch 8 Complete (3/3 components - EASIEST BATCH)**

1. M3Container - Responsive max-width containers
   - Max-width variants: sm (640px), md (768px), lg (1024px), xl (1280px)
   - Auto-centered with horizontal padding
   - Responsive padding adjustments

2. M3Grid - 12-column responsive grid system
   - Mobile-first breakpoints (xs, sm, md, lg)
   - Spacing variants (1, 2, 4, 6)
   - Grid container and item components
   - Nested grid support

3. M3Divider - Horizontal/vertical dividers
   - Orientation variants (horizontal, vertical)
   - Spacing variants (full, inset, middle)
   - M3 outline color tokens

Total: 3 components, ~280 lines, 100% M3 tokenized
Automation: 90% (mostly CSS, minimal logic)
Time: 1.5 hours (FASTEST BATCH)"

git push -u origin claude/m3-expressive-tokens-014XmAiA4Rd8N6ucn9JDEJuz
```

## Expected Completion
- Time: 1.5 hours (fastest batch!)
- Components: 3/3
- Quality: 100% M3 compliance
- Difficulty: ⭐ (1/5 stars - easiest!)
- Key Skills: CSS Grid, responsive design, M3 spacing tokens
