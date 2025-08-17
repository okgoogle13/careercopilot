# TESTING EXAMPLES

This document provides examples of different testing scenarios in the CareerCopilot frontend.

## Table of Contents

1. [Component Testing](#component-testing)
2. [Hook Testing](#hook-testing)
3. [API Service Testing](#api-service-testing)
4. [Context Testing](#context-testing)

## Component Testing

### Basic Component Test

```typescript
// src/components/ProfileCard.test.tsx
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import ProfileCard from './ProfileCard';

describe('ProfileCard', () => {
  beforeAll(() => {
    // Set up a default handler for the profile endpoint
    server.use(
      http.get('/api/profile', () => {
        return HttpResponse.json({
          id: 'test-123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'developer',
        });
      })
    );
  });

  afterEach(() => {
    // Reset any runtime handlers between tests
    server.resetHandlers();
  });

  it('displays loading state initially', () => {
    renderWithProviders(<ProfileCard />);
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it('displays user profile data when loaded successfully', async () => {
    renderWithProviders(<ProfileCard />);
    
    // Wait for the loading state to disappear
    await waitForElementToBeRemoved(() => screen.queryByText(/loading profile/i));
    
    // Check that the profile data is displayed
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/developer/i)).toBeInTheDocument();
  });
}
```

## Hook Testing

### Testing a Custom Hook

```typescript
// src/hooks/useAuth.test.ts
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { useAuth } from './useAuth';

describe('useAuth hook', () => {
  beforeAll(() => {
    // Setup mock handlers for auth endpoints
    server.use(
      http.get('/api/auth/me', () => {
        return HttpResponse.json({
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        });
      }),
      
      http.post('/api/auth/login', async ({ request }) => {
        const { email, password } = await request.json() as Record<string, string>;
        
        if (email === 'test@example.com' && password === 'password123') {
          return HttpResponse.json({
            user: {
              id: 'user-123',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
            },
            token: 'mock-jwt-token',
          });
        }
        
        return new HttpResponse(null, { status: 401 });
      })
    );
  });

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('loads user data on initialization', async () => {
    const { result } = renderHook(() => useAuth());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.user).toEqual({
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });
  });
}
```

## API Service Testing

### Testing API Service Methods

```typescript
// src/services/api.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { fetchUserProfile, createDocument } from './api';

describe('API Service', () => {
  describe('fetchUserProfile', () => {
    beforeAll(() => {
      // Mock the profile API response
      server.use(
        http.get('/api/profile', () => {
          return HttpResponse.json({
            id: 'test-123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user',
          });
        })
      );
    });

    it('fetches user profile successfully', async () => {
      const profile = await fetchUserProfile();
      
      expect(profile).toEqual({
        id: 'test-123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      });
    });

    it('handles network errors gracefully', async () => {
      // Override the handler just for this test
      server.use(
        http.get('/api/profile', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(fetchUserProfile()).rejects.toThrow();
    });
  });
}
```

## Context Testing

### Testing a Context Provider

```typescript
// src/contexts/UserPreferencesContext.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserPreferencesProvider, useUserPreferences } from './UserPreferencesContext';

// Create a test component that uses the context
const TestConsumer = () => {
  const { theme, toggleTheme } = useUserPreferences();
  
  return (
    <div>
      <div data-testid="theme-value">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('UserPreferencesContext', () => {
  it('provides default values', () => {
    render(
      <UserPreferencesProvider>
        <TestConsumer />
      </UserPreferencesProvider>
    );
    
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
  });

  it('toggles theme when button is clicked', () => {
    render(
      <UserPreferencesProvider>
        <TestConsumer />
      </UserPreferencesProvider>
    );
    
    // Initial theme should be light
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    
    // Click the toggle button
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    // Theme should now be dark
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    
    // Click again to go back to light
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
  });
});
```
