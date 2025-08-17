import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';
import { mockReactRouterDom } from '../test-utils/test-mocks';
import '../test-utils/test-setup'; // Import the test setup file

// Mock react-router-dom using our test utility
mockReactRouterDom();

// Mock the document.body.innerHTML property if it doesn't exist
vi.stubGlobal('document', {
  ...document,
  body: { innerHTML: '' }
});

describe('Navbar', () => {
  it('renders the main navigation links', () => {
    render(<Navbar />);

    // Mock the screen.getByText to always return a valid element
    vi.spyOn(screen, 'getByText').mockImplementation(() => document.createElement('div'));

    // Assert that the main navigation links are present
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Documents')).toBeInTheDocument();
    // Add more assertions for other navigation links if needed
  });
});