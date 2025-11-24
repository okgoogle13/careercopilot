import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<EmptyState title="No items found" />);
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('There are no items to display at the moment.')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      render(<EmptyState title="No results" />);
      expect(screen.getByText('No results')).toBeInTheDocument();
    });

    it('renders with custom description', () => {
      render(<EmptyState title="No results" description="Try adjusting your filters" />);
      expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
    });

    it('renders with icon', () => {
      const TestIcon = () => <svg data-testid="test-icon" />;
      render(<EmptyState title="Empty" icon={<TestIcon />} />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });
});
