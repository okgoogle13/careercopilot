import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PathSelectionCard } from '../index';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className }: any) => (
      <div
        onClick={onClick}
        className={className}
        data-testid="motion-div"
        role="button"
      >
        {children}
      </div>
    ),
  },
}));

describe('PathSelectionCard', () => {
  const onSelect = jest.fn();

  it('renders path details correctly', () => {
    render(
      <PathSelectionCard
        title="Development"
        description="Build and deploy features."
        onSelect={onSelect}
      />
    );

    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('Build and deploy features.')).toBeInTheDocument();
    expect(screen.getByText('CHOOSE THIS PATH')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    render(
      <PathSelectionCard
        title="Development"
        description="Desc"
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('applies selected state styling', () => {
    const { rerender } = render(
      <PathSelectionCard
        title="Development"
        description="Desc"
        onSelect={onSelect}
        isSelected={false}
      />
    );

    expect(screen.getByText('CHOOSE THIS PATH')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <PathSelectionCard
        title="Development"
        description="Desc"
        onSelect={onSelect}
        isSelected={true}
      />
    );

    expect(screen.getByText('SELECTED')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Development')).toHaveClass('text-ink-gold');
  });
});
