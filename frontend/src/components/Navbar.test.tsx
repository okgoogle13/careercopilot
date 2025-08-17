import { screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Navbar from './Navbar';
import { mockReactRouterDom } from '../test-utils/test-mocks';
import { renderWithProviders } from '../test-utils/renderWithProviders';

// Only mock react-router-dom here; firebase mocks are hoisted globally in global-mocks.ts
beforeEach(() => {
  mockReactRouterDom();
});

describe('Navbar', () => {
  it('renders the main navigation links', () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Documents')).toBeInTheDocument();
  });
});