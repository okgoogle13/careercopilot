# Accessibility Guidelines

## Overview

CareerCopilot is committed to WCAG 2.1 Level AA compliance. All components must be accessible to users with disabilities, including those using assistive technologies like screen readers and keyboard navigation.

## Core Principles

We follow the **POUR** framework:

1. **Perceivable** - Content is visible and understandable
2. **Operable** - All functionality is keyboard accessible
3. **Understandable** - Content is clear and predictable
4. **Robust** - Code is compatible with assistive technologies

## ARIA Implementation

### ARIA Labels

Always provide labels for interactive elements:

```typescript
// ❌ Bad - no label
<Button>+</Button>

// ✅ Good - clear label
<Button aria-label="Add new item">+</Button>
```

### ARIA Descriptions

Use `aria-describedby` for additional context:

```typescript
<TextField
  id="password"
  label="Password"
  aria-describedby="password-hint"
/>
<Typography id="password-hint" variant="caption">
  Must be at least 8 characters
</Typography>
```

### ARIA Live Regions

Announce dynamic content changes:

```typescript
<Box
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {successMessage}
</Box>
```

### ARIA Roles

Use proper semantic roles:

```typescript
// ❌ Bad - div masquerading as button
<div onClick={handleClick}>Click me</div>

// ✅ Good - proper button element
<button onClick={handleClick}>Click me</button>

// ✅ Good - if div needed, add role
<div role="button" onClick={handleClick} onKeyPress={handleClick}>
  Click me
</div>
```

## Keyboard Navigation

### Requirements

- All interactive elements must be keyboard accessible
- Focus order should be logical
- Tab key should navigate through interactive elements
- Enter/Space keys should activate buttons
- Escape key should close modals/menus

### Implementation

```typescript
// Dialog with proper focus management
const [open, setOpen] = useState(false);
const firstFocusRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (open) {
    focusManagement.focusFirstElement(firstFocusRef.current);
  }
}, [open]);

return (
  <Dialog open={open} onClose={() => setOpen(false)}>
    <Button ref={firstFocusRef} autoFocus>
      Primary Action
    </Button>
  </Dialog>
);
```

### Focus Management

```typescript
import { focusManagement } from "@/utils/accessibility";

// Save current focus
const focusManager = focusManagement.createFocusManager();
focusManager.saveFocus();

// Later, restore focus
focusManager.restoreFocus();
```

### Focus Styles

Always ensure focus indicators are visible:

```typescript
sx={{
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: '2px',
  }
}}
```

## Forms

### Required Fields

Always indicate required fields:

```typescript
<TextField
  label="Email"
  required
  aria-required="true"
/>
```

### Error Messages

Show errors clearly and announce them:

```typescript
<TextField
  error={Boolean(error)}
  helperText={error}
  aria-invalid={Boolean(error)}
  aria-describedby={error ? 'email-error' : undefined}
/>
```

### Labels

Every input must have an associated label:

```typescript
// ❌ Bad - no label
<input type="email" />

// ✅ Good - associated label
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ✅ Good - MUI label
<TextField
  id="email"
  label="Email"
  type="email"
/>
```

## Color & Contrast

### Contrast Ratios (WCAG AA)

- **Normal text**: minimum 4.5:1 ratio
- **Large text** (18pt+): minimum 3:1 ratio
- **UI components**: minimum 3:1 ratio

### Testing Tools

```typescript
import { validateColorContrast } from "@/utils/accessibility";

// Check if colors meet WCAG AA standard
const isAccessible = validateColorContrast("#FFFFFF", "#A855F7");
```

### Color Combinations

```typescript
// ❌ Bad - red/green only
<span style={{ color: 'red' }}>Error</span>

// ✅ Good - icon + color + text
<Alert severity="error">
  <ErrorIcon /> Error message
</Alert>
```

## Text & Readability

### Headings

Use proper heading hierarchy:

```typescript
// ❌ Bad - skipping levels
<h1>Page Title</h1>
<h3>Subsection</h3> {/* Missing h2 */}

// ✅ Good - logical hierarchy
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

### Typography

Ensure readable text:

- **Line height**: Minimum 1.5 for body text
- **Font size**: Minimum 12px for body text
- **Line length**: Maximum 80 characters per line
- **Text density**: Avoid walls of text

### Link Text

Provide meaningful link text:

```typescript
// ❌ Bad - non-descriptive
<a href="/docs">Click here</a>

// ✅ Good - descriptive
<a href="/docs">Read the documentation</a>
```

## Images & Icons

### Alt Text

Provide alternative text for all images:

```typescript
// ❌ Bad
<img src="logo.png" />

// ✅ Good
<img src="logo.png" alt="CareerCopilot logo" />

// ✅ Good - decorative images
<img src="decoration.png" alt="" aria-hidden="true" />
```

### Icon Buttons

Label icon-only buttons:

```typescript
// ❌ Bad - no label
<IconButton>
  <DeleteIcon />
</IconButton>

// ✅ Good - with label
<IconButton aria-label="Delete item">
  <DeleteIcon />
</IconButton>
```

## Modals & Dialogs

### Focus Management

```typescript
// Focus goes to dialog on open
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Dialog Title</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    {/* Focus returns here on close */}
  </DialogActions>
</Dialog>
```

### Structure

```typescript
<Dialog aria-labelledby="dialog-title">
  <DialogTitle id="dialog-title">Title</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button>Cancel</Button>
    <Button variant="contained">Confirm</Button>
  </DialogActions>
</Dialog>
```

## Lists & Tables

### Unordered Lists

```typescript
// ✅ Good - semantic list
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### Data Tables

```typescript
// ✅ Good - proper table structure
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

## Screen Reader Testing

### Using NVDA (Windows)

1. Download [NVDA](https://www.nvaccess.org/)
2. Start NVDA
3. Navigate your site with:
   - **H**: Jump to next heading
   - **Tab**: Jump to next interactive element
   - **Arrow keys**: Read content

### Using JAWS (Windows)

1. Use keyboard shortcuts:
   - **H**: Jump to headings
   - **Tab**: Navigate interactive elements
   - **T**: Jump to tables

### Using VoiceOver (Mac/iOS)

1. Enable: System Preferences → Accessibility → VoiceOver
2. Use **VO** (Control+Option) + arrow keys to navigate
3. **VO + Space**: Activate controls

## Testing Checklist

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] All links have descriptive text
- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] Required fields are marked
- [ ] Error messages are clear and associated with fields
- [ ] Focus indicators are visible
- [ ] Color contrast meets 4.5:1 (or 3:1 for large text)
- [ ] Headings are in logical order
- [ ] Page can be navigated with screen reader
- [ ] Modals have proper focus management
- [ ] Videos have captions
- [ ] No content depends solely on color

## Common Issues & Solutions

### Issue: Form field without label

**Solution**:

```typescript
// Use visible label
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Or use aria-label
<input aria-label="Email" type="email" />
```

### Issue: Icon button without text

**Solution**:

```typescript
<IconButton aria-label="Delete">
  <DeleteIcon />
</IconButton>
```

### Issue: List items in divs

**Solution**:

```typescript
// Bad
<div onClick={selectItem}>Item 1</div>

// Good
<button onClick={selectItem}>Item 1</button>

// Or with proper role
<div role="option" onClick={selectItem}>Item 1</div>
```

### Issue: Focus lost in modal

**Solution**:

```typescript
const dialogRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (open) {
    focusManagement.focusFirstElement(dialogRef.current);
  }
}, [open]);
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Deque Accessibility Blog](https://www.deque.com/blog/)
- [WebAIM](https://webaim.org/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

## Getting Help

For accessibility questions or issues, refer to:

1. This document
2. Component guidelines documentation
3. WCAG guidelines
4. Team accessibility lead
