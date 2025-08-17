// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

// Define handlers for API mocking
export const handlers = [
  // Intercept both relative and absolute URLs for GET /api/profile
  http.get('/api/profile', ({ request }) => {
    if (request.headers.get('x-msw-error') === 'true') {
      return new HttpResponse(null, { status: 500 });
    }
    return HttpResponse.json({
      id: 'test-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });
  }),
  http.get('http://localhost/api/profile', ({ request }) => {
    if (request.headers.get('x-msw-error') === 'true') {
      return new HttpResponse(null, { status: 500 });
    }
    return HttpResponse.json({
      id: 'test-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });
  }),

  // Intercept both relative and absolute URLs for POST /api/documents
  http.post('/api/documents', async ({ request }) => {
    const data = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 'doc-123',
      ...data,
      createdAt: '2025-08-18T12:00:00Z',
    });
  }),
  http.post('http://localhost/api/documents', async ({ request }) => {
    const data = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 'doc-123',
      ...data,
      createdAt: '2025-08-18T12:00:00Z',
    });
  }),

  // Authentication handlers (intercept both relative and absolute URLs)
  http.get('/api/auth/me', ({ request }) => {
    if (request.headers.get('x-msw-error') === 'true') {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json({
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });
  }),
  http.get('http://localhost/api/auth/me', ({ request }) => {
    if (request.headers.get('x-msw-error') === 'true') {
      return new HttpResponse(null, { status: 401 });
    }
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
  }),

  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.post('http://localhost/api/auth/logout', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // Add more handlers as needed
];
