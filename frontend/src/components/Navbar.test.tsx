import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';
import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    NavLink: ({ children, to, className }: any) => (
      <a href={to} className={className} data-testid={`navlink-${to}`}>
        {children}
      </a>
    ),
  };
});

describe('Navbar', () => {
  it('renders the main navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Assert that the main navigation links are present
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Documents')).toBeInTheDocument();
    // Add more assertions for other navigation links if needed
  });
});