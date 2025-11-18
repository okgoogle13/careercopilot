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
      render(<EmptyState icon={<span data-testid="custom-icon">=í</span>} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders without action button when not provided', () => {
      render(<EmptyState />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders with action button when provided', () => {
      render(<EmptyState actionLabel="Add Item" onAction={jest.fn()} />);
      expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onAction when button is clicked', async () => {
      const user = userEvent.setup();
      const handleAction = jest.fn();

      render(<EmptyState actionLabel="Create New" onAction={handleAction} />);

      await user.click(screen.getByRole('button', { name: /create new/i }));
      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it('does not render button if actionLabel is provided but onAction is not', () => {
      render(<EmptyState actionLabel="Add Item" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('does not render button if onAction is provided but actionLabel is not', () => {
      render(<EmptyState onAction={jest.fn()} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('accepts className prop', () => {
      const { container } = render(<EmptyState className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders with all props combined', () => {
      const handleAction = jest.fn();
      render(
        <EmptyState
          title="No Data"
          description="Start by adding some data"
          icon={<span data-testid="icon">=Ê</span>}
          actionLabel="Add Data"
          onAction={handleAction}
          className="custom-empty-state"
        />
      );

      expect(screen.getByText('No Data')).toBeInTheDocument();
      expect(screen.getByText('Start by adding some data')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add data/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('renders with empty title', () => {
      render(<EmptyState title="" />);
      expect(screen.queryByText('No items found')).not.toBeInTheDocument();
    });

    it('renders with empty description', () => {
      render(<EmptyState description="" />);
      expect(screen.queryByText('There are no items to display at the moment.')).not.toBeInTheDocument();
    });

    it('renders with long title', () => {
      const longTitle = 'This is a very long title that should still render correctly without breaking the layout';
      render(<EmptyState title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('renders with long description', () => {
      const longDesc = 'This is a very long description that should be properly wrapped and displayed without breaking the layout or causing overflow issues in the empty state component';
      render(<EmptyState description={longDesc} />);
      expect(screen.getByText(longDesc)).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('centers content', () => {
      const { container } = render(<EmptyState />);
      const emptyState = container.firstChild as HTMLElement;
      expect(emptyState).toHaveStyle({ display: 'flex', flexDirection: 'column' });
    });
  });
});
