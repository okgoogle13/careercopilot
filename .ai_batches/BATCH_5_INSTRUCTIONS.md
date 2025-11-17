# Batch 5: Feedback Components - Delegation Instructions

## Assignment Details
- **Difficulty:** Easy (85% automation)
- **Time Estimate:** 2.5 hours
- **Components:** 3 (Alert, Skeleton, EmptyState)
- **Ideal for:** Mid-level AI agents

## Your Mission
Migrate 3 feedback components from legacy styling to M3 Expressive design system.

---

## Component 1: M3Alert

### Generate Base
```bash
python3 scripts/generate-m3-component.py --name="Alert" --type="feedback" --output="frontend/src/components/ui"
```

### Customization Required (30 min)
1. **Add severity variants:**
   ```typescript
   severity?: 'info' | 'success' | 'warning' | 'error';
   ```

2. **Add severity-specific colors in CSS:**
   ```css
   .m3-alert--info {
     background-color: var(--md-sys-color-primary-95);
     border-left: 4px solid var(--md-sys-color-primary-50);
   }

   .m3-alert--success {
     background-color: var(--md-sys-color-tertiary-95);
     border-left: 4px solid var(--md-sys-color-tertiary-50);
   }

   .m3-alert--warning {
     background-color: var(--md-sys-color-secondary-95);
     border-left: 4px solid var(--md-sys-color-secondary-50);
   }

   .m3-alert--error {
     background-color: var(--md-sys-color-error-95);
     border-left: 4px solid var(--md-sys-color-error-50);
   }
   ```

3. **Add close button:**
   ```typescript
   onClose?: () => void;

   // In component:
   {onClose && (
     <button
       type="button"
       className="m3-alert__close-button"
       onClick={onClose}
       aria-label="Close alert"
     >
       <svg width="16" height="16" viewBox="0 0 16 16">
         <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2"/>
       </svg>
     </button>
   )}
   ```

4. **Add icon slot:**
   ```typescript
   icon?: React.ReactNode;

   // Render:
   {icon && <span className="m3-alert__icon">{icon}</span>}
   ```

### Storybook Stories
- Primary (default info)
- All Severities (info, success, warning, error)
- With Close Button
- With Custom Icon
- Long Message (test wrapping)

---

## Component 2: M3Skeleton

### Generate Base
```bash
python3 scripts/generate-m3-component.py --name="Skeleton" --type="feedback" --output="frontend/src/components/ui"
```

### Customization Required (25 min)
1. **Add shape variants:**
   ```typescript
   variant?: 'text' | 'rectangular' | 'circular';
   ```

2. **Add animation:**
   ```css
   @keyframes m3-skeleton-pulse {
     0%, 100% {
       opacity: 1;
     }
     50% {
       opacity: 0.4;
     }
   }

   .m3-skeleton {
     background: linear-gradient(
       90deg,
       var(--md-sys-color-neutral-90) 0%,
       var(--md-sys-color-neutral-95) 50%,
       var(--md-sys-color-neutral-90) 100%
     );
     background-size: 200% 100%;
     animation: m3-skeleton-shimmer 1.5s ease-in-out infinite;
   }

   @keyframes m3-skeleton-shimmer {
     0% {
       background-position: 200% 0;
     }
     100% {
       background-position: -200% 0;
     }
   }
   ```

3. **Add width/height props:**
   ```typescript
   width?: string | number;
   height?: string | number;

   // Apply inline styles:
   style={{
     width: typeof width === 'number' ? `${width}px` : width,
     height: typeof height === 'number' ? `${height}px` : height,
   }}
   ```

### Storybook Stories
- Text (single line)
- Text (multiple lines)
- Rectangular (avatar + text)
- Circular (avatar)
- Custom Dimensions

---

## Component 3: M3EmptyState

### Generate Base
```bash
python3 scripts/generate-m3-component.py --name="EmptyState" --type="feedback" --output="frontend/src/components/ui"
```

### Customization Required (20 min)
1. **Add structured content:**
   ```typescript
   export interface M3EmptyStateProps {
     illustration?: React.ReactNode;
     title: string;
     description?: string;
     action?: React.ReactNode;
   }
   ```

2. **Add layout structure:**
   ```tsx
   <div className="m3-empty-state">
     {illustration && (
       <div className="m3-empty-state__illustration">
         {illustration}
       </div>
     )}
     <h3 className="m3-empty-state__title">{title}</h3>
     {description && (
       <p className="m3-empty-state__description">{description}</p>
     )}
     {action && (
       <div className="m3-empty-state__action">{action}</div>
     )}
   </div>
   ```

3. **Add centered layout CSS:**
   ```css
   .m3-empty-state {
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     text-align: center;
     padding: var(--md-sys-spacing-12);
     gap: var(--md-sys-spacing-4);
   }

   .m3-empty-state__illustration {
     width: 200px;
     height: 200px;
     margin-bottom: var(--md-sys-spacing-6);
   }

   .m3-empty-state__title {
     font-size: var(--md-sys-typescale-headlineSmall-size);
     font-weight: var(--md-sys-typescale-headlineSmall-weight);
     color: var(--md-sys-color-on-surface);
   }

   .m3-empty-state__description {
     font-size: var(--md-sys-typescale-bodyMedium-size);
     color: var(--md-sys-color-on-surface-variant);
     max-width: 400px;
   }
   ```

### Storybook Stories
- Basic (title only)
- With Description
- With Illustration
- With Action Button
- Complete (all props)

---

## Validation Checklist

Before committing:
- [ ] All components compile without TypeScript errors
- [ ] All components use 100% M3 tokens (no hardcoded colors)
- [ ] All Storybook stories render correctly
- [ ] Animations are smooth (60fps)
- [ ] Accessible (ARIA labels, semantic HTML)
- [ ] Responsive (test at 375px, 768px, 1440px)

## Commit Command
```bash
git add -A
git commit -m "feat: Complete M3 Batch 5 - Feedback components (Alert, Skeleton, EmptyState)

**Batch 5 Complete (3/3 components)**

1. M3Alert - Severity variants with close button
   - Info/success/warning/error color schemes
   - Optional close button and icon slot
   - WCAG AA compliant contrast

2. M3Skeleton - Animated loading placeholders
   - Text/rectangular/circular variants
   - Shimmer animation with M3 motion tokens
   - Customizable dimensions

3. M3EmptyState - Centered empty state layouts
   - Illustration, title, description, action slots
   - Centered, responsive layout
   - Typography hierarchy with M3 tokens

Total: 3 components, ~320 lines, 100% M3 tokenized"

git push -u origin claude/m3-expressive-tokens-014XmAiA4Rd8N6ucn9JDEJuz
```

## Expected Completion
- Time: 2.5 hours
- Components: 3/3
- Quality: 100% M3 compliance
- Next: Report completion and handover to Batch 6 or 8
