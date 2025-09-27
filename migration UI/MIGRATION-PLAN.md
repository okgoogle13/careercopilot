# Tailwind CSS to Material UI Migration Plan

This document outlines the strategy and steps for migrating from Tailwind CSS to Material UI (MUI) components and styling system using Material 3 design tokens.

## Migration Goals

1. Replace Tailwind CSS utility classes with Material UI components and styling approaches
2. Implement Material 3 design system with custom theme tokens
3. Maintain visual consistency throughout the application
4. Improve maintainability by using a single styling system
5. Leverage Material UI's theming capabilities with Material 3 tokens
6. Ensure responsive design works as expected

## Current State Analysis

### Components Using Tailwind

#### High Priority (Frequently Used Components)

1. **Sidebar.tsx**
   - Uses Tailwind for layout and styling
   - Needs migration to MUI `Drawer` and `List` components

2. **CreateProfileCard.tsx**
   - Uses Tailwind for card layout and styling
   - Should use MUI `Card` and related components

3. **ErrorCard.tsx**
   - Uses Tailwind for error card styling
   - Should use MUI `Alert` and `Card` components

4. **StateDemoShowcase.tsx**
   - Uses Tailwind for grid layouts
   - Should use MUI `Grid` and `Stack` components

#### Medium Priority

5. **KeywordTagGroup.tsx**
   - Currently being migrated
   - Uses `buttonVariants` utility
   - Replace with MUI `Chip` or `Button` components

6. **DocumentReviewModal.tsx**
   - Uses Tailwind for layout
   - Should use MUI `Modal` and `Dialog` components

### Common Tailwind Patterns to Migrate

1. **Layout**
   - Replace `flex`, `grid` with MUI `Grid` and `Stack`
   - Convert `gap-*` to MUI `spacing` prop
   - Replace `space-y-*` with MUI `Stack` component

2. **Spacing**
   - Convert `p-*`, `m-*` to MUI `sx` or theme spacing
   - Replace `w-*`, `h-*` with MUI `sx` or component props

3. **Typography**
   - Replace `text-*` with MUI `Typography` component
   - Convert `font-*` to MUI theme typography

4. **Colors**
   - Map Tailwind colors to MUI theme palette
   - Replace `bg-*`, `text-*` with MUI theme colors

## Migration Strategy

### Phase 1: Preparation (1-2 days)

1. **Set up MUI Theme with Material 3**
   - [x] Create a theme file using Material 3 design tokens
   - [x] Implement light and dark color schemes from Material Theme Builder
   - [x] Configure typography to match Material 3 specifications
   - [x] Set up component theming with Material 3 design tokens
   - [x] Define breakpoints for responsive design
   - [x] Set up global styles with Material 3 tokens
   - [x] Create theme provider for light/dark mode switching

2. **Create Styled Components with Material 3**
   - [ ] Create styled versions of common UI elements using Material 3 tokens
   - [ ] Set up a component library with consistent variants following Material 3 specs
   - [ ] Implement elevation and state layers according to Material 3 guidelines
   - [ ] Create utility functions for handling Material 3 design tokens
   - [ ] Document theme usage guidelines for components

### Phase 2: Component Migration (3-5 days)

1. **High Priority Components**
   - Migrate one component at a time
   - Start with leaf components and move up the component tree
   - Apply Material 3 theming to each component
   - Implement proper elevation and state layers
   - Update tests and stories for each component

2. **Update Layouts**
   - Replace layout utilities with MUI components
   - Implement responsive design with MUI's breakpoints

### Phase 3: Cleanup and Optimization (1-2 days)

1. **Remove Tailwind**
   - Remove Tailwind dependencies
   - Clean up unused CSS
   - Update build configuration

2. **Performance Optimization**
   - Optimize bundle size
   - Implement code splitting
   - Test performance

## Theme Implementation Status

### Material 3 Theme Implementation

1. **Color System** ✅

   ```typescript
   // Light Theme
   primary: '#5E5791',
   onPrimary: '#FFFFFF',
   primaryContainer: '#E5DEFF',

   // Dark Theme
   primary: '#C8BFFF',
   onPrimary: '#2E2A4F',
   primaryContainer: '#463F77'
   ```

2. **Component Theming** ✅
   - Buttons with proper elevation and hover states
   - Cards with Material 3 border radius and elevation
   - Text fields with proper focus states
   - AppBar and Drawer components with proper theming

3. **Typography** ✅
   - Updated to Material 3 type scale
   - Proper line heights and letter spacing
   - Accessible contrast ratios

4. **Theme Implementation**

   ```typescript
   import { createTheme } from "@mui/material/styles";

   const lightTheme = createTheme({
     palette: {
       mode: "light",
       primary: {
         main: "#5E5791",
         light: "#8F88C3",
         dark: "#2E2A4F",
         contrastText: "#FFFFFF",
       },
       secondary: {
         main: "#5F5C71",
         light: "#8E8B9F",
         dark: "#333141",
         contrastText: "#FFFFFF",
       },
       // Additional colors from the theme
     },
     // Typography, shape, and component overrides
   });
   ```

## Component-Specific Migration Guide

### Sidebar.tsx

**Current:**

```tsx
<div className="w-64 bg-sidebar border-r border-sidebar-border h-full flex flex-col">
```

**Target with Material 3:**

```tsx
<Drawer
  variant="permanent"
  sx={{
    width: { xs: 240, sm: 280 },
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: { xs: 240, sm: 280 },
      boxSizing: 'border-box',
      borderRight: 'none',
      backgroundColor: (theme) =>
        theme.palette.mode === 'light'
          ? theme.palette.background.paper
          : theme.palette.surfaceContainerLow.main,
      backgroundImage: 'none',
      boxShadow: (theme) => theme.shadows[1],
    },
  }}
>
```

### CreateProfileCard.tsx

**Current:**

```tsx
<div className="p-6 flex flex-col items-center justify-center text-center space-y-4 h-full">
```

**Target:**

```tsx
<Card
  sx={{
    p: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    '&:hover': {
      boxShadow: 6,
    },
  }}
>
```

## Testing Strategy

1. **Visual Regression Testing**
   - Compare before/after screenshots
   - Test different screen sizes

2. **Unit Testing**
   - Update component tests
   - Test responsive behavior

3. **Manual Testing**
   - Test all interactive elements
   - Verify accessibility
   - Check browser compatibility

## Rollback Plan

1. Keep the current working branch
2. Create feature flags for migrated components
3. Be prepared to revert if critical issues are found

## Timeline

- **Week 1**: Setup and high-priority components
- **Week 2**: Medium and low-priority components
- **Week 3**: Testing, optimization, and cleanup

## Dependencies

- Material UI v5+
- Emotion (for styled components)
- Storybook (for component documentation)

## Material 3 Implementation Guidelines

### 1. Using the Theme in Components

```tsx
// Using the theme in a component
import { useTheme } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

function MyComponent() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Button
        variant="contained"
        sx={{
          mt: 2,
          // Access theme values directly
          backgroundColor: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Click Me
      </Button>
    </Box>
  );
}
```

### 2. Theme Switching

The theme supports light and dark modes. To implement theme switching:

```tsx
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      {/* Your app components */}
      <Button onClick={() => setDarkMode(!darkMode)}>Toggle {darkMode ? "Light" : "Dark"} Mode</Button>
    </ThemeProvider>
  );
}
```

### 3. Best Practices

1. **Use Theme Variables**
   - Always use theme variables instead of hardcoded values
   - Access colors through `theme.palette`
   - Use spacing and breakpoints from the theme

2. **Component Styling**
   - Prefer `sx` prop for one-off styles
   - Use `styled` API for reusable styled components
   - Leverage theme's built-in breakpoints

3. **Performance**
   - The theme is optimized for production with tree-shaking
   - Dynamic theming is supported with minimal overhead
   - Theme updates are optimized for performance

### 4. Documentation

- [Material 3 Design Guidelines](https://m3.material.io/)
- [MUI Theming Documentation](https://mui.com/material-ui/customization/theming/)
- [Theme Demo](http://localhost:3001/theme-viewer) (runs with the dev server)

## Theme Migration Checklist

- [ ] Implement dark color schemes
- [ ] Update typography to match Material 3 specs
- [ ] Configure component theming (buttons, cards, inputs, etc.)
- [ ] Implement elevation and state layers
- [ ] Test color contrast and accessibility
- [ ] Verify theming across all breakpoints
- [ ] Document theme usage guidelines
