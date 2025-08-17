# Testing Guide for CareerCopilot Frontend

This guide provides information about the testing setup and best practices for the CareerCopilot frontend codebase.

## Testing Framework

We use Vitest with React Testing Library for component tests. The configuration is designed to:

- Use JSDOM for simulating a browser environment
- Support DOM testing assertions via vitest-dom
- Automatically mock certain dependencies like React Router
- Mock API requests using Mock Service Worker (MSW)

## Running Tests

To run all tests:
```bash
npm test
```

To run tests in watch mode during development:
```bash
npm run test:watch
```

To run tests with coverage:
```bash
npm run test:ci
```

To run tests for a specific file:
```bash
npm test -- src/components/YourComponent.test.tsx
```

## Writing Component Tests

### Basic Component Test

```tsx
// src/components/YourComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Testing Components with React Router

For components that use React Router (NavLink, Link, useNavigate, etc.), use our test mock:

```tsx
// src/components/NavComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { mockReactRouterDom } from '../test-utils/test-mocks';
import NavComponent from './NavComponent';

// Set up the React Router mock before tests
beforeEach(() => {
  mockReactRouterDom();
});

describe('NavComponent', () => {
  it('renders navigation links', () => {
    render(<NavComponent />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});
```

### Testing Components with Firebase

For components that use Firebase, use our Firebase mocks:

```tsx
// src/components/AuthComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { mockFirebaseAuth } from '../test-utils/test-mocks';
import AuthComponent from './AuthComponent';

// Set up the Firebase Auth mock before tests
beforeEach(() => {
  mockFirebaseAuth();
});

describe('AuthComponent', () => {
  it('renders user email when logged in', () => {
    render(<AuthComponent />);
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});
```

### Testing API Calls with Mock Service Worker

We use MSW (Mock Service Worker) to intercept and mock API calls in tests:

```tsx
// src/components/ProfileComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import ProfileComponent from './ProfileComponent';

describe('ProfileComponent', () => {
  it('displays user profile data from API', async () => {
    // Override the default handler for this specific test if needed
    server.use(
      http.get('/api/profile', () => {
        return HttpResponse.json({
          id: 'test-id',
          name: 'Test User',
          email: 'test@example.com',
        });
      })
    );
    
    render(<ProfileComponent />);
    
    // Wait for the component to fetch and display data
    expect(await screen.findByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
  
  it('handles API error states', async () => {
    // Mock an error response
    server.use(
      http.get('/api/profile', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    render(<ProfileComponent />);
    
    // Check for error message
    expect(await screen.findByText('Failed to load profile')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Avoid `any` types**: Use proper TypeScript types in your tests.
2. **Test behavior, not implementation**: Focus on what the user would see and interact with.
3. **Use meaningful assertions**: Make your test expectations clear and focused.
4. **Mock external dependencies**: Use the provided mocks for external dependencies.
5. **Keep tests isolated**: Each test should run independently without affecting others.
6. **Clean up after tests**: Our setup handles cleanup automatically, but be mindful of any manual cleanup needed.
7. **Use MSW for API mocking**: Avoid direct mocking of fetch/axios for API testing.
8. **Test error states**: Always include tests for failure scenarios.

## Pre-commit Hooks

Our pre-commit hooks run:
- ESLint to fix code style issues
- TypeScript type checking
- Tests for affected files (when enabled)

These help catch issues early before code is committed to the repository.

## Troubleshooting

If you encounter JSDOM-related errors:
- Make sure you're using the correct test environment by including the proper imports
- Check that you're not trying to access browser APIs that aren't mocked

If your tests are failing unexpectedly:
- Run `npm test -- --updateSnapshot` if you've intentionally changed component output
- Check for any missing mocks for external dependencies
