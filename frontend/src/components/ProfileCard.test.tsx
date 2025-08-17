// src/components/ProfileCard.test.tsx
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { renderWithProviders } from '../test-utils/renderWithProviders';
import ProfileCard from './ProfileCard';

describe('ProfileCard', () => {
  beforeEach(() => {
    // Ensure the profile endpoint returns the default test data for each test
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
    
    // Override handler to set role to 'developer'
    server.use(
      http.get('/api/profile', () => {
        return HttpResponse.json({
          id: 'test-123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'developer',
        });
      }),
      http.get('http://localhost/api/profile', () => {
        return HttpResponse.json({
          id: 'test-123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'developer',
        });
      })
    );
    renderWithProviders(<ProfileCard />);
    await waitForElementToBeRemoved(() => screen.queryByText(/loading profile/i));
  const nameElements = screen.getAllByText(/test user/i);
  expect(nameElements.length).toBeGreaterThanOrEqual(1);
  const emailElements = screen.getAllByText(/test@example.com/i);
  expect(emailElements.length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText(/developer/i)).toBeInTheDocument();
  });

  it('displays error message when profile fetch fails', async () => {
    // Override the handler to simulate a server error
    server.use(
      http.get('/api/profile', () => {
        return new HttpResponse(null, { status: 500 });
      }),
      http.get('http://localhost/api/profile', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    renderWithProviders(<ProfileCard />);
    
    // Wait for the loading state to disappear
    await waitForElementToBeRemoved(() => screen.queryByText(/loading profile/i));
    
    // Check that the error message is displayed
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('displays empty state when no profile data is returned', async () => {
    // Override the handler to return empty data
    server.use(
      http.get('/api/profile', () => {
        return HttpResponse.json(null);
      }),
      http.get('http://localhost/api/profile', () => {
        return HttpResponse.json(null);
      })
    );
    
    renderWithProviders(<ProfileCard />);
    
    // Wait for the loading state to disappear
    await waitForElementToBeRemoved(() => screen.queryByText(/loading profile/i));
    
    // Check that the empty state message is displayed
    expect(screen.getByText(/no profile data available/i)).toBeInTheDocument();
  });

  it('handles different profile data correctly', async () => {
    // Override the handler to return different profile data
    server.use(
      http.get('/api/profile', () => {
        return HttpResponse.json({
          id: 'admin-456',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'administrator',
        });
      }),
      http.get('http://localhost/api/profile', () => {
        return HttpResponse.json({
          id: 'admin-456',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'administrator',
        });
      })
    );
    
    renderWithProviders(<ProfileCard />);
    
    // Wait for the loading state to disappear
    await waitForElementToBeRemoved(() => screen.queryByText(/loading profile/i));
    
    // Check that the different profile data is displayed
    expect(screen.getByText(/admin user/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/administrator/i)).toBeInTheDocument();
  });
});
