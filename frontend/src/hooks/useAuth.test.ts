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
      // Current user endpoint
      http.get('/api/auth/me', () => {
        return HttpResponse.json({
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        });
      }),
      
      // Login endpoint
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
      }),
      
      // Logout endpoint
      http.post('/api/auth/logout', () => {
        return new HttpResponse(null, { status: 200 });
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
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
    expect(result.current.error).toBe(null);
  });

  it('handles failed authentication', async () => {
    // Override the handler to simulate an authentication failure
    server.use(
      http.get('/api/auth/me', () => {
        return new HttpResponse(null, { status: 401 });
      }),
      http.get('http://localhost/api/auth/me', () => {
        return new HttpResponse(null, { status: 401 });
      })
    );
    
    const { result } = renderHook(() => useAuth());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.user).toBe(null);
    expect(result.current.error).not.toBe(null);
  });

  it('logs in successfully with correct credentials', async () => {
    const { result } = renderHook(() => useAuth());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Reset the auth state for the test
    server.use(
      http.get('/api/auth/me', () => {
        return new HttpResponse(null, { status: 401 });
      })
    );
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });
    
    expect(result.current.user).toEqual({
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });
    expect(result.current.error).toBe(null);
  });

  it('handles login failure with incorrect credentials', async () => {
    // Ensure initial auth check returns unauthenticated
         server.use(
           http.get('/api/auth/me', () => new HttpResponse(null, { status: 401 })),
           http.get('http://localhost/api/auth/me', () => new HttpResponse(null, { status: 401 })),
           http.post('/api/auth/login', async ({ request }) => {
             const { email, password } = await request.json() as Record<string, string>;
             if (email === 'test@example.com' && password === 'password123') {
               return HttpResponse.json({ user: { id: 'user-123', name: 'Test User', email, role: 'user' }, token: 'mock-token' });
             }
             return new HttpResponse(null, { status: 401 });
           }),
           http.post('http://localhost/api/auth/login', async ({ request }) => {
             const { email, password } = await request.json() as Record<string, string>;
             if (email === 'test@example.com' && password === 'password123') {
               return HttpResponse.json({ user: { id: 'user-123', name: 'Test User', email, role: 'user' }, token: 'mock-token' });
             }
             return new HttpResponse(null, { status: 401 });
           })
         );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.login('test@example.com', 'wrong-password');
      } catch (error) {
        // Expect login to throw an error
        expect(error).toBeDefined();
      }
    });

    expect(result.current.user).toBe(null);
    expect(result.current.error).not.toBe(null);
      }),
      http.post('/api/auth/login', async ({ request }) => {
        const { email, password } = await request.json() as Record<string, string>;
        if (email === 'test@example.com' && password === 'password123') {
          return HttpResponse.json({ user: { id: 'user-123', name: 'Test User', email, role: 'user' }, token: 'mock-token' });
        }
        return new HttpResponse(null, { status: 401 });
      }),
      http.post('http://localhost/api/auth/login', async ({ request }) => {
        const { email, password } = await request.json() as Record<string, string>;
        if (email === 'test@example.com' && password === 'password123') {
          return HttpResponse.json({ user: { id: 'user-123', name: 'Test User', email, role: 'user' }, token: 'mock-token' });
        }
        return new HttpResponse(null, { status: 401 });
      })

  it('logs out successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Ensure we have a user first
    expect(result.current.user).not.toBe(null);
    
    // Perform logout
    await act(async () => {
      await result.current.logout();
    });
    
    // Check that user is cleared
    expect(result.current.user).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
