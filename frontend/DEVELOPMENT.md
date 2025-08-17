# Development Guidelines

## Pre-commit Hooks

This project uses pre-commit hooks to ensure code quality and prevent errors from being committed. When you attempt to commit changes, the following checks will run automatically:

1. **ESLint** - Fixes formatting issues and catches common code problems
2. **TypeScript Compiler** - Ensures type safety with `tsc --noEmit`
3. **Test Verification** - Checks that test files follow best practices
4. **Vitest** - Runs tests related to changed files

### Setting Up

After cloning the repository, run:

```bash
npm install
```

This will automatically set up the pre-commit hooks.

### Common Issues and Solutions

#### "any" Type Usage

Our ESLint configuration prevents the use of the `any` type. Instead:

```typescript
// ❌ Bad
function handleError(error: any) { ... }

// ✅ Good
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(String(error));
  }
}
```

#### Testing React Components with Router

When testing components that use React Router:

```typescript
// ✅ Good
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Navbar from './Navbar';

// Mock React Router DOM
vi.mock('react-router-dom', () => ({
  NavLink: ({ children, to }: { children: React.ReactNode, to: string }) => (
    <a href={to} data-testid="nav-link">{children}</a>
  ),
  useNavigate: () => vi.fn()
}));

describe('Navbar', () => {
  it('renders correctly', () => {
    render(<Navbar />);
    expect(screen.getByTestId('nav-link')).toBeInTheDocument();
  });
});
```

### Bypassing Pre-commit Hooks

In rare cases, you may need to bypass the pre-commit hooks (not recommended):

```bash
git commit -m "Your message" --no-verify
```

## Continuous Integration

Our CI pipeline runs these same checks, so bypassing them locally will still result in failed CI builds.

## Adding New Tests

When adding new test files, ensure they:

1. Import necessary testing utilities
2. Mock external dependencies properly
3. Include actual test assertions
4. Follow the component/function naming convention: `ComponentName.test.tsx`
