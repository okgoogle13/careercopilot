# API Testing with MSW

This document demonstrates how to use Mock Service Worker (MSW) to create robust API tests for the CareerCopilot application.

## Example API Test

Below is a practical example of testing an API service with MSW:

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
});
```

## Key MSW Concepts

1. **Define Handlers**: Create request handlers for specific API endpoints in `src/mocks/handlers.ts`

2. **Setup in Tests**:
   - MSW is automatically started/stopped by the setupTests.ts configuration
   - Override handlers within tests using `server.use()`

3. **Response Types**:
   - Success responses: `return HttpResponse.json({ data })`
   - Error responses: `return new HttpResponse(null, { status: 500 })`
   - Delayed responses: `return HttpResponse.json({ data }).delay(500)`

4. **Request Inspection**:
   ```typescript
   http.post('/api/documents', async ({ request }) => {
     const data = await request.json();
     // Validate the request body
     return HttpResponse.json({ id: 'new-id', ...data });
   })
   ```

## Best Practices

1. **Isolate Tests**: Create specific handlers for each test case
2. **Test Error Handling**: Include tests for both success and error paths
3. **Verify Request Data**: Validate that requests contain the expected data
4. **Reset After Tests**: Use `afterEach(() => server.resetHandlers())` for isolation

## Common Patterns

### Testing Authentication

```typescript
// Mock authentication responses
server.use(
  http.post('/api/login', async ({ request }) => {
    const { username, password } = await request.json();
    
    if (username === 'testuser' && password === 'password') {
      return HttpResponse.json({ 
        token: 'mock-jwt-token',
        user: { id: '123', username: 'testuser' }
      });
    }
    
    return new HttpResponse(null, { status: 401 });
  })
);
```

### Testing File Uploads

```typescript
server.use(
  http.post('/api/upload', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return new HttpResponse(null, { status: 400 });
    }
    
    return HttpResponse.json({ 
      fileId: 'file-123',
      url: 'https://example.com/files/file-123'
    });
  })
);
```
