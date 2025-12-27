# Batch 6: Utility Components - Delegation Instructions

## Assignment Details

- **Difficulty:** Easiest (90% automation)
- **Time Estimate:** 2 hours
- **Components:** 4 (Avatar, Tooltip, Popover, Separator)
- **Ideal for:** Junior AI agents or parallel execution

## Your Mission

Migrate 4 simple utility components. These are the easiest components in the entire migration!

---

## Component 1: M3Avatar

### Generate Base

```bash
python3 scripts/generate-m3-component.py --name="Avatar" --type="feedback" --output="frontend/src/components/ui"
```

### Customization Required (20 min)

1. **Add image support:**

   ```typescript
   export interface M3AvatarProps {
     src?: string;
     alt?: string;
     size?: "small" | "medium" | "large";
     fallback?: string; // Initials like "JD"
   }
   ```

2. **Add image loading logic:**

   ```typescript
   const [imageError, setImageError] = useState(false);

   <div className={avatarClasses}>
     {src && !imageError ? (
       <img
         src={src}
         alt={alt}
         onError={() => setImageError(true)}
         className="m3-avatar__image"
       />
     ) : (
       <span className="m3-avatar__fallback">{fallback}</span>
     )}
   </div>
   ```

3. **Add size variants in CSS:**

   ```css
   .m3-avatar--small {
     width: 32px;
     height: 32px;
     font-size: var(--md-sys-typescale-bodySmall-size);
   }

   .m3-avatar--medium {
     width: 40px;
     height: 40px;
     font-size: var(--md-sys-typescale-bodyMedium-size);
   }

   .m3-avatar--large {
     width: 56px;
     height: 56px;
     font-size: var(--md-sys-typescale-bodyLarge-size);
   }
   ```

### Storybook Stories

- With Image
- With Fallback Initials
- All Sizes
- Image Error Handling

---

## Component 2: M3Tooltip

### Generate Base

```bash
python3 scripts/generate-m3-component.py --name="Tooltip" --type="feedback" --output="frontend/src/components/ui"
```

### Customization Required (30 min)

1. **Add positioning props:**

   ```typescript
   export interface M3TooltipProps {
     content: React.ReactNode;
     placement?: "top" | "bottom" | "left" | "right";
     children: React.ReactElement;
   }
   ```

2. **Add hover logic:**

   ```typescript
   const [isVisible, setIsVisible] = useState(false);

   const childWithHandlers = React.cloneElement(children, {
     onMouseEnter: () => setIsVisible(true),
     onMouseLeave: () => setIsVisible(false),
     onFocus: () => setIsVisible(true),
     onBlur: () => setIsVisible(false),
   });
   ```

3. **Add positioning CSS:**

   ```css
   .m3-tooltip {
     position: absolute;
     background-color: var(--md-sys-color-inverse-surface);
     color: var(--md-sys-color-inverse-on-surface);
     padding: var(--md-sys-spacing-2) var(--md-sys-spacing-3);
     border-radius: var(--md-sys-shape-corner-small);
     font-size: var(--md-sys-typescale-bodySmall-size);
     z-index: 1000;
   }

   .m3-tooltip--top {
     bottom: calc(100% + 8px);
     left: 50%;
     transform: translateX(-50%);
   }

   .m3-tooltip--bottom {
     top: calc(100% + 8px);
     left: 50%;
     transform: translateX(-50%);
   }
   ```

### Storybook Stories

- All Placements (top, bottom, left, right)
- Long Content
- With Button
- Keyboard Focus

---

## Component 3: M3Popover

### Generate Base

```bash
python3 scripts/generate-m3-component.py --name="Popover" --type="feedback" --output="frontend/src/components/ui"
```

### Customization Required (35 min)

1. **Add controlled open state:**

   ```typescript
   export interface M3PopoverProps {
     open: boolean;
     onClose?: () => void;
     anchorEl?: HTMLElement | null;
     children: React.ReactNode;
   }
   ```

2. **Add click-outside handler:**

   ```typescript
   const popoverRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
         onClose?.();
       }
     };

     if (open) {
       document.addEventListener("mousedown", handleClickOutside);
     }

     return () => {
       document.removeEventListener("mousedown", handleClickOutside);
     };
   }, [open, onClose]);
   ```

3. **Add portal and positioning:**

   ```tsx
   import { createPortal } from "react-dom";

   if (!open) return null;

   return createPortal(
     <div className="m3-popover-backdrop">
       <div
         ref={popoverRef}
         className="m3-popover"
         style={{
           top: anchorEl?.getBoundingClientRect().bottom,
           left: anchorEl?.getBoundingClientRect().left,
         }}
       >
         {children}
       </div>
     </div>,
     document.body,
   );
   ```

### Storybook Stories

- Basic Popover
- With Menu Items
- Click Outside to Close
- Positioned Relative to Anchor

---

## Component 4: M3Separator (Divider)

### Generate Base

```bash
python3 scripts/generate-m3-component.py --name="Separator" --type="card" --output="frontend/src/components/ui"
```

### Customization Required (15 min - EASIEST!)

1. **Add orientation:**

   ```typescript
   export interface M3SeparatorProps {
     orientation?: "horizontal" | "vertical";
   }
   ```

2. **Add simple CSS:**

   ```css
   .m3-separator {
     border: none;
     background-color: var(--md-sys-color-outline-variant);
   }

   .m3-separator--horizontal {
     width: 100%;
     height: 1px;
     margin: var(--md-sys-spacing-4) 0;
   }

   .m3-separator--vertical {
     width: 1px;
     height: 100%;
     margin: 0 var(--md-sys-spacing-4);
   }
   ```

### Storybook Stories

- Horizontal
- Vertical
- In Card Layout
- In List

---

## Validation Checklist

Before committing:

- [ ] Avatar: Image loads, fallback shows on error
- [ ] Tooltip: Shows on hover/focus, positions correctly
- [ ] Popover: Opens/closes, click-outside works
- [ ] Separator: Both orientations render
- [ ] All components 100% M3 tokens (search for `#` - should be 0)
- [ ] TypeScript compiles clean
- [ ] All Storybook stories work

## Commit Command

```bash
git add -A
git commit -m "feat: Complete M3 Batch 6 - Utility components (Avatar, Tooltip, Popover, Separator)

**Batch 6 Complete (4/4 components - EASIEST BATCH)**

1. M3Avatar - Image with fallback initials
   - Image loading with error handling
   - Fallback to initials on load failure
   - Small/medium/large size variants

2. M3Tooltip - Hover tooltips with positioning
   - Top/bottom/left/right placement
   - Keyboard focus support
   - Inverse surface colors for contrast

3. M3Popover - Click-controlled overlay
   - Controlled open state
   - Click-outside to close
   - Portal-based rendering

4. M3Separator - Horizontal/vertical dividers
   - Orientation variants
   - M3 outline color
   - Flexible spacing

Total: 4 components, ~340 lines, 100% M3 tokenized
Automation: 90% (minimal customization required)"

git push -u origin claude/m3-expressive-tokens-014XmAiA4Rd8N6ucn9JDEJuz
```

## Expected Completion

- Time: 2 hours (fastest batch!)
- Components: 4/4
- Quality: 100% M3 compliance
- Difficulty: ⭐ (1/5 stars - easiest!)
