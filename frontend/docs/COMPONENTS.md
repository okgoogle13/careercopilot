# UI Components Documentation

This document outlines the UI component architecture and guidelines for the
CareerCopilot frontend.

## Component Library: Material-UI (MUI)

We use [Material-UI v7](https://mui.com/) as our primary component library. All
custom components should be built on top of MUI components for consistency and
accessibility.

## Component Structure

```
src/
└── components/
    └── ComponentName/
        ├── ComponentName.tsx     # Main component
        ├── ComponentName.stories.tsx  # Storybook stories
        ├── ComponentName.test.tsx     # Tests
        ├── ComponentName.types.ts     # TypeScript types
        ├── ComponentName.styles.ts    # Styled components
        └── index.ts                   # Public API
```

## Creating a New Component

1. **Create Component Directory**

   ```bash
   mkdir -p src/components/NewComponent
   ```

2. **Create Component File** (`NewComponent.tsx`)

   ```tsx
   import React from 'react';
   import { Button, ButtonProps } from '@mui/material';
   import { StyledComponent } from './NewComponent.styles';

   interface NewComponentProps extends ButtonProps {
     customProp?: string;
   }

   export const NewComponent: React.FC<NewComponentProps> = ({
     children,
     customProp,
     ...props
   }) => {
     return (
       <StyledComponent
         variant="contained"
         color="primary"
         {...props}
       >
         {customProp || children}
       </StyledComponent>
     );
   };
   ```

3. **Create Styles** (`NewComponent.styles.ts`)

   ```tsx
   import { styled } from '@mui/material/styles';
   import Button from '@mui/material/Button';

   export const StyledComponent = styled(Button)(({ theme }) => ({
     borderRadius: theme.shape.borderRadius,
     textTransform: 'none',
     padding: theme.spacing(1, 2),
   }));
   ```

4. **Create Tests** (`NewComponent.test.tsx`)

   ```tsx
   import React from 'react';
   import { render, screen } from '@testing-library/react';
   import { NewComponent } from './NewComponent';

   describe('NewComponent', () => {
     it('renders with default props', () => {
       render(<NewComponent>Test</NewComponent>);
       expect(
         screen.getByRole('button', { name: /test/i })
       ).toBeInTheDocument();
     });
   });
   ```

5. **Create Stories** (`NewComponent.stories.tsx`)

   ```tsx
   import React from 'react';
   import { Story, Meta } from '@storybook/react';
   import { NewComponent, NewComponentProps } from './NewComponent';

   export default {
     title: 'Components/NewComponent',
     component: NewComponent,
   } as Meta;

   const Template: Story<NewComponentProps> = (args) => (
     <NewComponent {...args} />
   );

   export const Default = Template.bind({});
   Default.args = {
     children: 'Click me',
   };
   ```

6. **Export Component** (`index.ts`)
   ```typescript
   export * from './NewComponent';
   export { default } from './NewComponent';
   ```

## Component Guidelines

### 1. Props

- Use TypeScript interfaces for props
- Extend MUI component props when possible
- Provide default values for optional props
- Document props using JSDoc comments

### 2. Styling

- Use `styled` API for component styling
- Leverage theme variables for colors, spacing, etc.
- Follow MUI's styling best practices
- Keep styles co-located with components

### 3. Accessibility

- Use semantic HTML elements
- Add proper ARIA attributes
- Ensure keyboard navigation works
- Test with screen readers

### 4. Testing

- Write unit tests for component logic
- Test different states and props
- Use React Testing Library
- Aim for good test coverage

## Common Components

### Buttons

```tsx
import Button from '@mui/material/Button';

// Primary button
<Button variant="contained" color="primary">
  Primary Action
</Button>

// Secondary button
<Button variant="outlined" color="primary">
  Secondary Action
</Button>
```

### Forms

```tsx
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

<FormControl fullWidth>
  <TextField
    label="Email"
    type="email"
    variant="outlined"
    margin="normal"
    required
  />
</FormControl>;
```

### Cards

```tsx
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

<Card>
  <CardContent>
    <Typography
      variant="h5"
      component="h2"
    >
      Card Title
    </Typography>
    <Typography color="textSecondary">Card content goes here</Typography>
  </CardContent>
</Card>;
```

## Theming

### Custom Theme

```typescript
// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
  },
});
```

### Using the Theme

```tsx
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';

function App() {
  return <ThemeProvider theme={theme}>{/* Your app */}</ThemeProvider>;
}
```

## Best Practices

1. **Composition Over Inheritance**
   - Compose MUI components instead of extending them
   - Use the `sx` prop for one-off styles
   - Create reusable styled components for common patterns

2. **Performance**
   - Use `React.memo` for expensive components
   - Lazy load heavy components
   - Avoid inline functions in render

3. **Naming Conventions**
   - Use PascalCase for component files
   - Prefix styled components with `Styled`
   - Use descriptive prop names

4. **Documentation**
   - Document all props with TypeScript
   - Add JSDoc comments for complex components
   - Include usage examples in stories

## Resources

- [Material-UI Documentation](https://mui.com/)
- [MUI Component API](https://mui.com/material-ui/api/)
- [MUI Theming](https://mui.com/material-ui/customization/theming/)
- [MUI System](https://mui.com/system/basics/)
- [MUI Icons](https://mui.com/material-ui/material-icons/)
