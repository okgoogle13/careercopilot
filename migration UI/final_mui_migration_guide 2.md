# CareerCopilot MUI Migration Guide

## Project Context & Scope

**Objective**: Migrate React frontend from Tailwind CSS to Material-UI with theme-based design system and dark mode support.

**Application**: AI-powered career assistant for community services job seekers, built with React/TypeScript frontend and FastAPI/Firebase backend.

## Acceptance Criteria

• **Visual Fidelity**: Components match Figma design tokens exactly
• **Zero Regression**: All existing functionality preserved
• **Performance**: Bundle size increase <10%, LCP <2.5s
• **Accessibility**: WCAG 2.1 AA compliance maintained
• **Testing**: All E2E tests pass, unit tests updated

## Migration Strategy

**Workflow**: Feature branch with atomic commits per component
**Validation**: Feature flag for safe A/B testing
**Rollback**: <15 minutes to previous stable version

---

## Phase 0: Foundation Setup

### Install Dependencies

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install --save-dev @mui/types
```

### Create Master Theme

```typescript
// src/theme/theme.ts - Essential structure only
import { createTheme, ThemeOptions } from "@mui/material/styles";

const createSemanticPalette = (mode: "light" | "dark") => ({
  primary: { main: "#6366f1", dark: "#5855eb" },
  background: {
    default: mode === "light" ? "#ffffff" : "#0a0e1a",
    paper: mode === "light" ? "#f8fafc" : "#1e293b",
  },
  text: {
    primary: mode === "light" ? "#1e293b" : "#f1f5f9",
    secondary: mode === "light" ? "#64748b" : "#94a3b8",
  },
});

export const createCareerCopilotTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: { mode, ...createSemanticPalette(mode) },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      h1: { fontSize: "2rem", fontWeight: 700 },
      body1: { fontSize: "1rem", lineHeight: 1.5 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, textTransform: "none" },
        },
      },
    },
  });
```

### Application Wrapper

```typescript
// src/App.tsx - Add theme provider
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createCareerCopilotTheme } from './theme/theme';

function App() {
  const theme = createCareerCopilotTheme('light');
  const isMuiEnabled = process.env.REACT_APP_ENABLE_MUI === 'true';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isMuiEnabled ? <MuiApp /> : <TailwindApp />}
    </ThemeProvider>
  );
}
```

---

## Phase 1: Component Migration

### Priority Matrix

| Priority     | Component                       | MUI Mapping                          | Complexity |
| ------------ | ------------------------------- | ------------------------------------ | ---------- |
| **Critical** | Navigation (`Navbar.tsx`)       | `AppBar`, `Toolbar`                  | Medium     |
| **Critical** | Forms (`KscGeneratorPage.tsx`)  | `TextField`, `Button`, `FormControl` | High       |
| **High**     | Dashboard (`DashboardPage.tsx`) | `Grid`, `Card`, `Typography`         | Medium     |
| **High**     | Modals/Dialogs                  | `Dialog`, `DialogContent`            | Medium     |
| **Medium**   | Analysis Components             | `LinearProgress`, `Chip`, `Table`    | High       |
| **Low**      | Icons/Utilities                 | `@mui/icons-material`                | Low        |

### Complete Component Inventory

#### Dashboard Components

• **Profile Summary Card**: User info with completion percentage
• **Document Library**: Generated documents with status indicators
• **Application Tracker**: Active applications with Gmail/Calendar integration
• **ATS Score Widget**: Circular progress with score breakdown
• **Quick Actions Panel**: Workflow shortcuts

#### Document Generation

• **Job Input Form**: Job description input with URL parsing
• **Template Selector**: Professional template gallery with previews
• **Company Research Panel**: AI-generated company insights
• **Generation Progress**: Real-time AI processing status
• **Document Preview**: Live preview with inline editing
• **Download Manager**: PDF generation with formatting

#### Analysis Components

• **ATS Score Visualization**: Multi-factor score breakdown chart
• **Keyword Analysis Table**: Matched/missing keywords from job description
• **Improvement Recommendations**: Prioritized suggestions with impact ratings
• **Before/After Comparison**: Side-by-side document analysis
• **Score History Chart**: ATS improvement tracking over time

#### Profile Management

• **Profile Builder Form**: Multi-step profile creation wizard
• **Experience Timeline**: Visual work history representation
• **Skills Matrix**: Categorized skills with proficiency levels
• **Document Upload Zone**: Drag-and-drop file interface
• **Voice Profile Settings**: Writing style preference management

### Standard Migration Process

**For each component above, execute this workflow:**

1. **Replace Tailwind classes** with equivalent MUI components
2. **Use sx prop** for custom styling (avoid mixing Tailwind/MUI)
3. **Apply theme tokens** for colors, spacing, typography
4. **Preserve functionality** - all props, events, responsive behavior
5. **Update tests** to work with MUI ThemeProvider
6. **Verify accessibility** - ARIA attributes, keyboard navigation

### Migration Template Prompt

```markdown
## Component Migration Task

**Target**: [ComponentName.tsx]
**MUI Components**: [List specific MUI components to use]

**Requirements**:
• Replace ALL Tailwind classes with MUI equivalents
• Use sx prop for styling, NOT makeStyles or styled
• Leverage theme.palette, theme.spacing, theme.typography
• Preserve existing props interface and functionality
• Maintain responsive behavior using theme.breakpoints
• Keep all data-testid attributes for testing
• Ensure accessibility attributes remain

**Validation**:
• Component renders identically to Tailwind version
• All interactive states work (hover, focus, disabled)
• Responsive breakpoints function correctly
• TypeScript types compile without errors
```

---

## Phase 2: Quality Assurance

### Cleanup Tasks

```bash
# Remove Tailwind dependencies
npm uninstall tailwindcss postcss autoprefixer react-hot-toast
rm tailwind.config.js postcss.config.js

# Clean global CSS - remove @tailwind directives from src/index.css
# Keep only essential reset styles
```

### Validation Checklist

```bash
# Code quality
./scripts/lint-autofix.sh
yarn build
npm run type-check

# Testing
yarn test
npx playwright test

# Performance validation
npm run bundle:analyze
npx lighthouse http://localhost:3000
```

### Final Review Requirements

• **Visual Regression**: Screenshot comparison of before/after
• **Accessibility Audit**: axe-core automated testing + manual keyboard/screen reader testing
• **Performance Budget**: Bundle size analysis, Core Web Vitals check
• **Feature Flag Testing**: Verify both MUI and Tailwind versions work

---

## Debugging & Troubleshooting

### Common Issues

• **Theme not applied**: Verify ThemeProvider wraps component
• **TypeScript errors**: Install @mui/types, check sx prop usage
• **Styling conflicts**: Remove ALL Tailwind classes before adding MUI
• **Bundle size increase**: Use selective imports from @mui/icons-material
• **Responsive breakpoints**: Use theme.breakpoints.up() instead of Tailwind responsive classes

### Debug Commands

```bash
# Verify MUI installation
npm ls @mui/material @emotion/react

# Check theme in browser console
console.log(theme.palette.primary.main)

# Validate component props
npm run type-check -- --strict
```

---

## Deployment Strategy

### Feature Flag Configuration

```bash
# Development - enable MUI
echo "REACT_APP_ENABLE_MUI=true" >> .env.local

# Production - gradual rollout
./scripts/feature-flag.sh mui-migration --percentage=1
```

### Rollout Phases

1. **Deploy with flag OFF** - Ensure no regression in Tailwind version
2. **Internal testing** - Enable flag for team members
3. **Canary release** - 1% → 10% → 50% → 100%
4. **Full rollout** - Remove feature flag, delete Tailwind code

---

## Final Checklist

**Before Pull Request:**

- [ ] All components migrated and tested individually
- [ ] Feature flag implementation complete
- [ ] Bundle size within budget (<10% increase)
- [ ] All E2E tests passing
- [ ] Visual regression testing complete
- [ ] Accessibility audit passed
- [ ] TypeScript compilation clean
- [ ] Performance metrics validated
