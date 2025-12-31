---
description: Create a production-ready, M3-compliant React component with tests.
params:
  component_name: "Name of the component (PascalCase)"
  description: "What the component does and how it looks"
  path: "Target directory (default: src/components)"
---

# Component Builder Workflow

This workflow scaffolds a React component following the "Electric Alchemist" design system (Material 3).

## 1. Analysis & Preparation

1.  **Verify M3 Tokens**:
    - Read `frontend/src/theme/tokens.json` (or equivalent) to understand available color, spacing, and typography tokens.
    - *Goal*: Ensure NO hardcoded hex values or pixel spacings are used.

2.  **Determine Structure**:
    - Identify required props interaction handlers.
    - Plan the folder structure:
      ```text
      [path]/[ComponentName]/
      ├── index.ts           # Barrel file
      ├── [ComponentName].tsx # Main component
      └── [ComponentName].test.tsx # Unit tests
      ```

## 2. Component Implementation

Create the component file using `write_to_file`.

**Strict Rules:**
- Use **MUI** (`@mui/material`) components (`Box`, `Stack`, `Typography`, `Paper`).
- Use `sx` prop for styling.
- **NEVER** use magic values (e.g., `p: 2` is okay, `p: "16px"` is NOT).
- Use `var(--sys-*)` CSS variables for tokens if defined in CSS, or MUI theme keys.

```typescript
// Template for [ComponentName].tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

export interface {{component_name}}Props {
  // Define props
}

export const {{component_name}}: React.FC<{{component_name}}Props> = ({ ...props }) => {
  return (
    <Box sx={{ 
      p: 'var(--sys-spacing-4)',
      bgcolor: 'var(--sys-color-surface)',
      borderRadius: 'var(--sys-shape-medium)'
    }}>
      {/* Implementation */}
    </Box>
  );
};
```

## 3. Test Scaffolding

Create the test file immediately after the component.

**Strict Rules:**
- Use `@testing-library/react`.
- Test accessibility (A11y) first: `expect(screen.getByRole(...))`.
- Test user interactions via `userEvent`.

## 4. Barrel File

Create `index.ts` to export the component.

```typescript
export * from './{{component_name}}';
```

## 5. Verification

1.  Run the linter (if available) on the new files.
2.  Output the full path of the created files for the user.
