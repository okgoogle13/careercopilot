# CareerCopilot MUI Migration Guide

## Project Overview

Migrate CareerCopilot React frontend from Tailwind CSS to Material-UI (MUI) with consistent theme-based design system and dark mode support.

## Migration Strategy

### Acceptance Criteria

• **Visual Consistency**: All components match Figma design tokens
• **Functionality Preservation**: Zero regression in existing features
• **Performance Budget**: Bundle size increase <10%, LCP <2.5s
• **Accessibility**: WCAG 2.1 AA compliance maintained
• **Test Coverage**: All existing E2E tests pass

### Rollback Plan

• **Git Strategy**: Feature branch with atomic commits per component
• **Deployment**: Feature flag for MUI vs Tailwind rendering
• **Validation**: Side-by-side visual regression testing

## Phase 0: Foundation & Setup

### Task 0.1: Install Dependencies

```bash
# Core MUI packages
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# Development dependencies
npm install --save-dev @mui/types

# Verify installation
npm audit && npm run type-check
```

### Task 0.2: Create Master Theme

```typescript
// src/theme/theme.ts
import { createTheme, ThemeOptions } from "@mui/material/styles";
import { designTokens } from "../tokens/figma-design-tokens.json";

// Map Figma tokens to MUI theme structure
const createSemanticPalette = (mode: "light" | "dark") => ({
  primary: {
    main: designTokens.colors.action.primary,
    dark: designTokens.colors.action.primaryHover,
    contrastText: designTokens.colors.text.inverse,
  },
  secondary: {
    main: designTokens.colors.action.secondary,
    dark: designTokens.colors.action.secondaryHover,
  },
  background: {
    default: mode === "light" ? designTokens.colors.bg.canvas : designTokens.colors.bg.canvasDark,
    paper: mode === "light" ? designTokens.colors.bg.surface : designTokens.colors.bg.surfaceDark,
  },
  text: {
    primary: mode === "light" ? designTokens.colors.text.primary : designTokens.colors.text.primaryDark,
    secondary: mode === "light" ? designTokens.colors.text.secondary : designTokens.colors.text.secondaryDark,
  },
});

const typography: ThemeOptions["typography"] = {
  fontFamily: designTokens.typography.fontFamily.primary,
  h1: {
    fontSize: designTokens.typography.display.large.fontSize,
    fontWeight: designTokens.typography.display.large.fontWeight,
    lineHeight: designTokens.typography.display.large.lineHeight,
  },
  h2: {
    fontSize: designTokens.typography.heading.large.fontSize,
    fontWeight: designTokens.typography.heading.large.fontWeight,
  },
  body1: {
    fontSize: designTokens.typography.body.medium.fontSize,
    fontWeight: designTokens.typography.body.medium.fontWeight,
    lineHeight: designTokens.typography.body.medium.lineHeight,
  },
};

const spacing = (factor: number) => designTokens.spacing.base * factor;

export const createCareerCopilotTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      ...createSemanticPalette(mode),
    },
    typography,
    spacing,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.medium,
            textTransform: "none",
            fontWeight: designTokens.typography.body.medium.fontWeight,
          },
          contained: {
            boxShadow: designTokens.shadows.elevated,
            "&:hover": {
              boxShadow: designTokens.shadows.elevatedHover,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.large,
            boxShadow: designTokens.shadows.card,
          },
        },
      },
    },
  });

export const lightTheme = createCareerCopilotTheme("light");
export const darkTheme = createCareerCopilotTheme("dark");
```

### Task 0.3: Wrap Application

```typescript
// src/App.tsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useEffect } from 'react';
import { lightTheme, darkTheme } from './theme/theme';
import { useFeatureFlag } from './hooks/useFeatureFlag';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const isMuiEnabled = useFeatureFlag('mui-migration');

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isMuiEnabled ? <MuiApp /> : <TailwindApp />}
    </ThemeProvider>
  );
}
```

## Phase 1: Component Migration

### Migration Priority Matrix

| Priority   | Component                      | MUI Mapping                          | Complexity |
| ---------- | ------------------------------ | ------------------------------------ | ---------- |
| **High**   | `Navbar.tsx`                   | `AppBar`, `Toolbar`, `IconButton`    | Medium     |
| **High**   | Forms (`KscGeneratorPage.tsx`) | `FormControl`, `TextField`, `Button` | High       |
| **High**   | Modal (`DashboardPage.tsx`)    | `Dialog`, `DialogContent`            | Medium     |
| **Medium** | Layout (`DashboardPage.tsx`)   | `Grid`, `Stack`, `Box`               | Low        |
| **Medium** | Notifications                  | `Snackbar`, `Alert`                  | Medium     |
| **Low**    | Icons                          | `@mui/icons-material`                | Low        |

### Master Migration Prompt Template

```markdown
## Component Migration Task

**Component**: [ComponentName.tsx]
**MUI Target**: [List of MUI components]
**Requirements**:
• Replace all Tailwind classes with MUI components and sx props
• Use theme tokens for colors, spacing, typography
• Preserve all existing functionality and props
• Maintain responsive behavior
• Ensure accessibility attributes are preserved
• Add proper TypeScript types for MUI components

**Code Style Requirements**:
• Use sx prop for styling instead of makeStyles
• Leverage theme breakpoints for responsive design
• Use semantic color tokens (theme.palette.primary.main)
• Follow MUI component composition patterns
• Maintain existing data-testid attributes for testing

**Testing Requirements**:
• Update component tests to work with MUI theme
• Verify all interactive states (hover, focus, disabled)
• Test responsive breakpoints
• Validate accessibility with screen readers
```

### Specific Component Migrations

#### Task 1.1: Migrate Navbar Component

```typescript
// Before: Tailwind implementation
<nav className="bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      <button className="text-gray-500 hover:text-gray-700">
        Menu
      </button>
    </div>
  </div>
</nav>

// After: MUI implementation
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

<AppBar
  position="static"
  elevation={1}
  sx={{
    bgcolor: 'background.paper',
    borderBottom: 1,
    borderColor: 'divider'
  }}
>
  <Toolbar sx={{ maxWidth: 'lg', mx: 'auto', width: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <IconButton
        edge="start"
        color="inherit"
        data-testid="nav-menu-button"
        sx={{ color: 'text.secondary' }}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  </Toolbar>
</AppBar>
```

#### Task 1.2: Migrate Form Components

```typescript
// Before: Tailwind form
<div className="space-y-4">
  <input
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
    placeholder="Enter text"
  />
  <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
    Submit
  </button>
</div>

// After: MUI form
import { Stack, TextField, Button } from '@mui/material';

<Stack spacing={2}>
  <TextField
    fullWidth
    placeholder="Enter text"
    variant="outlined"
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: 1.5
      }
    }}
  />
  <Button
    fullWidth
    variant="contained"
    type="submit"
    sx={{ py: 1.5, borderRadius: 1.5 }}
  >
    Submit
  </Button>
</Stack>
```

### Task 1.3: Component Testing Updates

```typescript
// src/components/__tests__/Navbar.test.tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../../theme/theme';
import { Navbar } from '../Navbar';

const renderWithTheme = (component: React.ReactElement) =>
  render(
    <ThemeProvider theme={lightTheme}>
      {component}
    </ThemeProvider>
  );

describe('Navbar Component', () => {
  it('renders menu button with correct accessibility attributes', () => {
    renderWithTheme(<Navbar />);

    const menuButton = screen.getByTestId('nav-menu-button');
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-label', 'menu');
  });

  it('applies theme colors correctly', () => {
    renderWithTheme(<Navbar />);

    const appBar = screen.getByRole('banner');
    expect(appBar).toHaveStyle({
      backgroundColor: lightTheme.palette.background.paper
    });
  });
});
```

## Phase 2: Quality Assurance & Cleanup

### Task 2.1: Remove Tailwind Dependencies

```bash
# Remove Tailwind packages
npm uninstall tailwindcss postcss autoprefixer react-hot-toast

# Remove configuration files
rm tailwind.config.js postcss.config.js

# Clean package-lock.json
rm package-lock.json && npm install
```

### Task 2.2: Clean Global Styles

```css
/* src/index.css - Remove all Tailwind directives */
/* DELETE: @tailwind base; */
/* DELETE: @tailwind components; */
/* DELETE: @tailwind utilities; */

/* Keep only essential global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

### Task 2.3: Visual Regression Testing

```bash
# Install visual testing tools
npm install --save-dev @storybook/addon-visual-tests

# Run visual comparison
npm run test:visual

# E2E tests with screenshot comparison
npx playwright test --update-snapshots
```

### Task 2.4: Accessibility Validation

```bash
# Automated accessibility testing
npm run test:a11y

# Manual testing checklist:
# • Keyboard navigation works for all interactive elements
# • Screen reader announces component states correctly
# • Color contrast meets WCAG AA standards (4.5:1)
# • Focus indicators are visible and clear
# • Form labels are properly associated
```

## Development Workflow

### Code Quality Standards

```bash
# Pre-migration checklist
npm run lint:fix
npm run type-check
npm run test:unit

# Post-migration validation
npm run build
npm run test:e2e
npm run bundle:analyze
```

### Feature Flag Implementation

```typescript
// src/hooks/useFeatureFlag.ts
export const useFeatureFlag = (flag: string): boolean => {
  const flags = {
    "mui-migration": process.env.REACT_APP_ENABLE_MUI === "true",
  };

  return flags[flag] ?? false;
};

// Environment configuration
// .env.development
REACT_APP_ENABLE_MUI = true;

// .env.production
REACT_APP_ENABLE_MUI = false;
```

### Performance Monitoring

```bash
# Bundle analysis before and after migration
npm run build
npm run bundle:analyze

# Performance budget validation
npx lighthouse http://localhost:3000 --only-categories=performance
```

## Deployment Strategy

### Staging Deployment

```bash
# Deploy with feature flag OFF
./scripts/deploy.sh staging --feature-flags="mui-migration:false"

# Test migration components
./scripts/deploy.sh staging --feature-flags="mui-migration:true"
```

### Production Rollout

```bash
# Phase 1: Deploy with flag OFF
./scripts/deploy.sh production

# Phase 2: Enable for internal users (1%)
./scripts/feature-flag.sh mui-migration --percentage=1

# Phase 3: Gradual rollout (10% -> 50% -> 100%)
./scripts/feature-flag.sh mui-migration --percentage=10
```

## Troubleshooting

### Common Migration Issues

• **Theme Provider**: Ensure all components are wrapped in ThemeProvider
• **Type Errors**: Install @mui/types for enhanced TypeScript support
• **Bundle Size**: Use tree shaking for @mui/icons-material imports
• **Styling Conflicts**: Remove all Tailwind classes before adding MUI components
• **Responsive Breakpoints**: Use theme.breakpoints.up() instead of Tailwind responsive classes

### Debug Commands

```bash
# Verify MUI installation
npm ls @mui/material @emotion/react

# Check theme application
console.log(theme.palette.primary.main)

# Validate component props
npm run type-check -- --strict
```

### Performance Optimization

```bash
# Optimize MUI imports
npm install --save-dev babel-plugin-import

# Bundle analysis
npm run build && npm run analyze

# Tree shaking validation
npx webpack-bundle-analyzer build/static/js/*.js
```

---

**Migration Complete**: All components migrated to MUI with consistent theming, preserved functionality, and maintained accessibility standards.
