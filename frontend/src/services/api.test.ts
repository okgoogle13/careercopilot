// src/services/api.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { fetchUserProfile, createDocument } from './api'; // Assume this file exists

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
        }),
        http.get('http://localhost/api/profile', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(fetchUserProfile()).rejects.toThrow();
    });
  });

  describe('createDocument', () => {
    it('creates a document successfully', async () => {
      // Mock the document creation response
      server.use(
        http.post('/api/documents', async ({ request }) => {
          const data = await request.json() as Record<string, unknown>;
          return HttpResponse.json({
            id: 'doc-123',
            ...data,
            createdAt: '2025-08-18T12:00:00Z',
          });
        })
      );

      const newDoc = await createDocument({
        title: 'Test Document',
        content: 'Test content',
      });

      expect(newDoc).toEqual({
        id: 'doc-123',
        title: 'Test Document',
        content: 'Test content',
        createdAt: '2025-08-18T12:00:00Z',
      });
    });
  });
});
