# Component Tests (Legacy Archive)

This directory contains **Jest unit tests** for UI components that were retrieved from the `KR-Rage-Figma` branch before being permanently lost.

## Why These Files Are Here

During the investigation of the KR-Rage-Figma branch corruption, we discovered that the `restoration-KR-Rage-Figma-v2.0` branch (which has the complete git history and new features) had **deleted** these component tests.

To prevent permanent data loss and preserve the testing infrastructure, these files were retrieved from the `KR-Rage-Figma` branch and preserved here as a legacy archive.

## Files Preserved (5 Tests)

- **Button.test.tsx** (1.1KB) - Button component unit tests
- **Cabinet.test.tsx** (1.2KB) - Modal/dialog component tests
- **Jar.test.tsx** (1.4KB) - Select/dropdown component tests
- **Pebble.test.tsx** (1.1KB) - Progress indicator tests
- **Seed.test.tsx** (0.9KB) - Badge component tests

## Test Technology Stack

**Framework**: Jest  
**Testing Library**: @testing-library/react  
**Assertions**: @testing-library/jest-dom  

## Example Test Structure

From `Seed.test.tsx`:

```typescript
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Seed } from '../Seed';

describe('Seed', () => {
  it('renders child anchor', () => {
    render(
      <Seed content="2">
        <button type="button">Notifications</button>
      </Seed>
    );
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('shows badge content for standard variant', () => {
    render(<Seed content="7" variant="standard"><span>Anchor</span></Seed>);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('hides badge when invisible is true', () => {
    const { container } = render(
      <Seed content="9" invisible><span>Anchor</span></Seed>
    );
    expect(screen.getByText('Anchor')).toBeInTheDocument();
    expect(container).not.toHaveTextContent('9');
  });
});
```

## Test Coverage

Each test file includes:

### Rendering Tests
- Component renders correctly with props
- Child elements are displayed
- Accessibility roles are correct

### Variant Tests
- Standard variant behavior
- Optional/alternative variants
- Edge cases

### State Tests
- Visibility states (visible/invisible)
- Interactive states (hover, focus, disabled)
- Conditional rendering

### Accessibility Tests
- ARIA roles and labels
- Keyboard navigation
- Screen reader compatibility

## What These Tests Validate

### Button.test.tsx
- Button renders with children
- Click handlers work correctly
- Disabled state functions properly
- Button variants render correctly

### Cabinet.test.tsx
- Modal opens and closes
- Content is displayed when open
- Close button/handler works
- Portal rendering is correct

### Jar.test.tsx
- Dropdown renders options
- Selection updates correctly
- Disabled options are not selectable
- Label and helper text display properly

### Pebble.test.tsx
- Progress indicator renders
- Progress value displays correctly
- Different color variants work
- Accessibility attributes present

### Seed.test.tsx
- Badge renders with content
- Badge attaches to anchor element
- Invisible state hides badge
- Different color themes work

## Usage

**Running Tests** (if test infrastructure still exists):
```bash
cd frontend
yarn test __tests__-legacy/
```

**Reference for New Tests**:
- Use as examples when writing new component tests
- Follow the same structure and patterns
- Maintain similar coverage expectations

**Historical Value**:
- Documents original test strategy
- Shows testing priorities for Kerala Rage components
- Preserves accessibility testing patterns

## Value Preserved

**Quality Assurance**: Test coverage for 5 core UI components  
**Testing Patterns**: Shows @testing-library/react best practices  
**Accessibility Focus**: Tests include ARIA role verification  
**Regression Prevention**: Documents expected component behavior  

## Related Files

**Components Tested**:
- `frontend/src/components/ui/button.tsx`
- `frontend/src/components/ui/Cabinet.tsx`
- `frontend/src/components/ui/Jar.tsx`
- `frontend/src/components/ui/Pebble.tsx`
- `frontend/src/components/ui/Seed.tsx`

**Related Documentation**:
- Storybook stories: `frontend/src/components/ui/stories-legacy/`
- HiFi specifications: `docs/design/hifi-legacy/`
- Component source: `frontend/src/components/ui/`

## Status

✅ **Retrieved**: 2026-02-17  
✅ **Source**: KR-Rage-Figma branch (commit 59e4deb5)  
✅ **Files**: 5 Jest test files preserved  
✅ **Content Verified**: All tests complete and executable  

---

**Note**: These files were preserved to maintain the testing infrastructure and documentation. They can be used as reference for new tests or restored to active testing if needed.
