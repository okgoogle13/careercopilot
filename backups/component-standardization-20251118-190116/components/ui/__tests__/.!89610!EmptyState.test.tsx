import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<EmptyState />);
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('There are no items to display at the moment.')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      render(<EmptyState title="No results" />);
      expect(screen.getByText('No results')).toBeInTheDocument();
    });

    it('renders with custom description', () => {
      render(<EmptyState description="Try adjusting your filters" />);
      expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
    });

    it('renders with icon', () => {
