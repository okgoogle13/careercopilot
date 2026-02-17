# Storybook Stories (Legacy Archive)

This directory contains **Storybook component stories** that were retrieved from the `KR-Rage-Figma` branch before being permanently lost.

## Why These Files Are Here

During the investigation of the KR-Rage-Figma branch corruption, we discovered that the `restoration-KR-Rage-Figma-v2.0` branch (which has the complete git history and new features) had **deleted** these Storybook stories.

To prevent permanent data loss and preserve the component documentation, these files were retrieved from the `KR-Rage-Figma` branch and preserved here as a legacy archive.

## Files Preserved (9 Stories)

- **cabinet.stories.tsx** (1.3KB) - Modal/dialog component stories
- **jar.stories.tsx** (1.0KB) - Select/dropdown component stories
- **lens.stories.tsx** (1.0KB) - Inspection overlay stories
- **mark.stories.tsx** (0.9KB) - Mark/highlight component stories
- **pebble.stories.tsx** (1.0KB) - Progress indicator stories
- **seed.stories.tsx** (0.9KB) - Badge component stories
- **stone.stories.tsx** (1.0KB) - Structural element stories
- **valve.stories.tsx** (0.9KB) - Valve component stories
- **vessel.stories.tsx** (1.2KB) - Container component stories

## Storybook Technology

**Framework**: Storybook 7.x  
**Story Format**: Component Story Format (CSF) 3.0  
**TypeScript**: Fully typed with Meta and StoryObj  

## Example Story Structure

From `seed.stories.tsx`:

```typescript
import 'src/design/styles/design-tokens.css';
import type { Meta, StoryObj } from '@storybook/react';
import { Bell } from 'lucide-react';
import { Seed } from './Seed';

const meta: Meta<typeof Seed> = {
  title: 'Components/UI/Seed',
  component: Seed,
  tags: ['autodocs'],
  args: {
    content: '3',
    variant: 'standard',
    color: 'error',
    children: <Bell aria-label="Notifications" className="h-6 w-6" />,
  },
};

export default meta;
type Story = StoryObj<typeof Seed>;

export const Default: Story = {};
export const Hover: Story = { args: { className: 'hover:scale-105' } };
export const Focus: Story = { args: { className: 'ring-2 ring-[var(--sys-color-inkGold-base)]' } };
export const Disabled: Story = { args: { invisible: true } };
export const Error: Story = { args: { color: 'error', content: '!' } };
```

## Story Variants

Each story file typically includes:

### Default Story
- Basic component rendering
- Default props and appearance
- Standard use case

### Hover Story
- Component in hover state
- Interactive styling
- Visual feedback

### Focus Story
- Component in focus state
- Keyboard navigation styling
- Accessibility highlight

### Disabled Story
- Component in disabled state
- Reduced opacity/interaction
- Visual indicators

### Error/Warning Stories
- Error state styling
- Warning/alert variants
- Validation feedback

### Color/Theme Variants
- Different color themes
- Semantic color usage
- Kerala Rage design tokens

## What These Stories Document

### cabinet.stories.tsx
- Modal component variants
- Open/close states
- Different modal sizes
- Portal rendering

### jar.stories.tsx
- Dropdown/select options
- Single and multi-select
- Disabled options
- Error states

### lens.stories.tsx
- Inspection overlay variants
- Different content types
- Positioning options
- Focus states

### mark.stories.tsx
- Highlight component
- Different mark types
- Color variants
- Text emphasis

### pebble.stories.tsx
- Progress indicator variants
- Linear and circular progress
- Different colors
- Indeterminate states

### seed.stories.tsx
- Badge component variants
- Number badges
- Dot badges
- Color themes

### stone.stories.tsx
- Structural divider variants
- Horizontal and vertical
- Different styles
- Spacing options

### valve.stories.tsx
- Valve component variants
- Open/close states
- Different orientations
- Interactive controls

### vessel.stories.tsx
- Container component variants
- Different container types
- Content layouts
- Padding options

## Usage

**Running Storybook** (if infrastructure still exists):
```bash
cd frontend
yarn storybook
```

**Viewing Stories**:
- Navigate to Components/UI section
- Each story shows component variants
- Props are interactive via controls
- Auto-generated docs from TypeScript

**Reference for New Stories**:
- Use as templates for new component stories
- Follow the same CSF 3.0 structure
- Maintain variant naming conventions (Default, Hover, Focus, etc.)

## Value Preserved

**Component Documentation**: Visual documentation for 9 UI components  
**Usage Examples**: Shows how to use components with different props  
**Design Tokens**: Demonstrates Kerala Rage token usage in components  
**Variant Catalog**: Documents all component states and variants  

## Design Token References

Stories reference Kerala Rage design tokens:
- `--sys-color-inkGold-base` - Primary accent color
- `--sys-color-worker-ash-steps-6` - Neutral color
- `--radius-seed` - Border radius tokens
- Component-specific token variables

## Related Files

**Components Documented**:
- `frontend/src/components/ui/Cabinet.tsx`
- `frontend/src/components/ui/Jar.tsx`
- `frontend/src/components/ui/Lens.tsx`
- `frontend/src/components/ui/Mark.tsx`
- `frontend/src/components/ui/Pebble.tsx`
- `frontend/src/components/ui/Seed.tsx`
- `frontend/src/components/ui/Stone.tsx`
- `frontend/src/components/ui/Valve.tsx`
- `frontend/src/components/ui/Vessel.tsx`

**Related Documentation**:
- Component tests: `frontend/src/components/ui/__tests__-legacy/`
- HiFi specifications: `docs/design/hifi-legacy/`
- Design tokens: `frontend/src/design/tokens/tokens.json`

## Story Naming Convention

**File naming**: `component-name.stories.tsx` (lowercase with dashes)  
**Story naming**: PascalCase (Default, Hover, Focus, Disabled, Error)  
**Title**: `Components/UI/ComponentName`  

## Status

✅ **Retrieved**: 2026-02-17  
✅ **Source**: KR-Rage-Figma branch (commit 59e4deb5)  
✅ **Files**: 9 Storybook story files preserved  
✅ **Content Verified**: All stories complete with variants  

---

**Note**: These files were preserved to maintain the component documentation and visual testing infrastructure. They can be used as reference for new stories or restored to active Storybook if needed.
