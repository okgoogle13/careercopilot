# CareerCopilot Task-Specific Micro-Guides

## 1. mui-migration-prompt.md

````markdown
# MUI Migration Task

## Objective

Migrate React component from Tailwind CSS to Material-UI using design tokens and theme system.

## Requirements

- Replace ALL Tailwind classes with MUI components and sx props
- Use theme tokens: theme.palette, theme.spacing, theme.typography
- Preserve existing functionality, props, and TypeScript types
- Maintain responsive behavior using theme.breakpoints
- Keep all data-testid attributes for testing
- Update test file to work with MUI ThemeProvider

## MUI Components to Prefer

- Layout: Box, Stack, Grid, Container
- Surfaces: Paper, Card, Accordion
- Navigation: AppBar, Drawer, BottomNavigation
- Inputs: TextField, Button, FormControl, Autocomplete
- Data Display: List, Table, Chip, Avatar, Badge
- Feedback: Alert, Snackbar, LinearProgress, CircularProgress

## Code Style

- Use sx prop for styling, NOT makeStyles
- Leverage semantic color tokens (primary.main, surface.main)
- Use theme.breakpoints.up() for responsive design
- Follow Material Design 3 elevation principles

## Theme Structure Reference

```typescript
theme.palette.primary.main; // Purple #8B5CF6
theme.palette.surface.main; // Dark surface
theme.spacing(2); // 16px
theme.typography.h6; // Section headers
```
````

## Validation Checklist

- [ ] No Tailwind classes remain
- [ ] All functionality preserved
- [ ] TypeScript compiles without errors
- [ ] Tests pass with MUI theme
- [ ] Responsive behavior works
- [ ] Accessibility maintained

## Files to Include

- Target component file
- Component test file
- src/theme/theme.ts
- Related TypeScript types

````

---

## 2. ai-agent-prompt.md

```markdown
# AI Agent Development Task

## Objective
Create or modify Genkit AI workflows for CareerCopilot backend using FastAPI and Firebase.

## Requirements
- Use Google Genkit framework with async/await patterns
- Implement standardized input/output JSON format
- Include confidence scores and error handling
- Use Gemini 1.5 Flash for high-volume tasks
- Use Gemini 1.5 Pro for complex reasoning
- Store results in Firestore with proper security rules

## Agent Pattern
```python
@define_flow(name="agent_name")
async def agent_flow(input_data: dict) -> dict:
    try:
        # Validate input
        # Process with AI model
        # Format output
        return {
            "success": True,
            "content": result.text,
            "confidence_score": 0.95,
            "suggestions": [],
            "metadata": {},
            "error": None
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
````

## Model Usage Guidelines

- Document generation: gemini15Flash
- ATS optimization: gemini15Flash
- Complex analysis: gemini15Pro
- Research synthesis: gemini15Pro

## Performance Targets

- Document generation: <30 seconds
- ATS analysis: <10 seconds
- Response confidence: >80%

## Files to Include

- Target agent file
- Agent test file
- Related type definitions
- Backend configuration files

````

---

## 3. component-prompt.md

```markdown
# New Component Creation Task

## Objective
Create new React/TypeScript component for CareerCopilot using MUI design system.

## Requirements
- Use Material-UI components and theme system
- Follow TypeScript strict mode requirements
- Implement proper accessibility (WCAG 2.1 AA)
- Include comprehensive PropTypes/interfaces
- Support responsive design with theme breakpoints
- Include proper error boundaries and loading states

## Component Structure
```typescript
interface ComponentProps {
  // Define all props with types
}

export const ComponentName: React.FC<ComponentProps> = ({
  // Props with defaults
}) => {
  // Component logic

  return (
    <Box sx={{ /* MUI styling */ }}>
      {/* Component content */}
    </Box>
  );
};
````

## Design Patterns

- Use theme tokens for all styling
- Implement proper loading states with Skeleton
- Include error states with Alert components
- Support keyboard navigation
- Use semantic HTML elements
- Include proper ARIA labels

## Testing Requirements

- Unit tests for component behavior
- Accessibility tests with jest-axe
- Visual regression tests if complex
- Test all prop combinations
- Mock external dependencies

## Files to Include

- Design mockup or requirements
- Related components for context
- Theme configuration
- Type definitions

````

---

## 4. testing-prompt.md

```markdown
# Testing Task

## Objective
Write or update tests for CareerCopilot components using Jest, React Testing Library, and Playwright.

## Testing Strategy
- Unit tests: Component behavior and props
- Integration tests: API interactions and workflows
- E2E tests: Complete user journeys
- Accessibility tests: WCAG compliance
- Performance tests: Core Web Vitals

## Unit Testing Patterns
```typescript
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '../theme/theme';

const renderWithTheme = (component: React.ReactElement) =>
  render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );

describe('ComponentName', () => {
  it('renders with correct accessibility attributes', () => {
    renderWithTheme(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
````

## E2E Testing Patterns

```typescript
test("complete user workflow", async ({ page }) => {
  await page.goto("/dashboard");
  await page.click('[data-testid="create-document"]');
  await page.fill('[data-testid="job-input"]', "job description");
  await expect(page.locator('[data-testid="ats-score"]')).toBeVisible();
});
```

## Test Coverage Requirements

- Statements: >90%
- Branches: >85%
- Functions: >90%
- Lines: >90%

## Files to Include

- Component under test
- Existing test files
- Test utilities and mocks
- Configuration files (jest.config.js)

````

---

## 5. debug-prompt.md

```markdown
# Debugging Task

## Objective
Identify and fix bugs in CareerCopilot components or workflows.

## Debugging Process
1. Reproduce the issue consistently
2. Identify root cause using browser dev tools
3. Check console errors and network requests
4. Validate TypeScript types and props
5. Test fix across different scenarios
6. Update tests to prevent regression

## Common Issue Categories
- **Styling**: Theme not applied, responsive breakpoints
- **Functionality**: Event handlers, state management
- **Performance**: Bundle size, render optimization
- **Accessibility**: Focus management, ARIA labels
- **Integration**: API calls, Firebase connections

## Debugging Tools
- React DevTools for component inspection
- Chrome DevTools for performance profiling
- TypeScript compiler for type checking
- ESLint for code quality issues
- Lighthouse for performance auditing

## Fix Validation
- Reproduce original issue (should be resolved)
- Test edge cases and error conditions
- Verify no new issues introduced
- Run full test suite
- Check accessibility compliance
- Validate performance impact

## Files to Include
- Problematic component/file
- Error logs or screenshots
- Related test files
- Configuration files if relevant
````

---

## Usage Instructions

### File Selection by Task Type

**MUI Migration**:

```
mui-migration-prompt.md + component + test + theme.ts
```

**AI Agent Work**:

```
ai-agent-prompt.md + agent file + test + types
```

**New Component**:

```
component-prompt.md + design requirements + theme.ts + related components
```

**Testing**:

```
testing-prompt.md + component + existing tests + test config
```

**Debugging**:

```
debug-prompt.md + problematic file + error context + related files
```

### Token Efficiency Tips

- Use only the relevant micro-guide for your current task
- Include minimal necessary context files (3-5 files max)
- Focus on single component or single workflow per request
- Reference design tokens file only when needed for styling work
- Include test files only when testing/validation is required

Each micro-guide is designed to provide focused, actionable guidance while staying within optimal token limits for VS Code Claude usage.
