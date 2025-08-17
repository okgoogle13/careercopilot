import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navbar from './Navbar';
import { mockReactRouterDom } from '../test-utils/test-mocks';

// Mock react-router-dom using our test utility
mockReactRouterDom();

describe('Navbar', () => {
  it('renders the main navigation links', () => {
    // Render without trying to manipulate document directly
    render(<Navbar />);

    // Assert that the main navigation links are present
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Documents')).toBeInTheDocument();
    // Add more assertions for other navigation links if needed
  });
});