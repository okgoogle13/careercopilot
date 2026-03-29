import { render, screen, fireEvent } from '@testing-library/react';
import { PathSelectionCard } from '../PathSelectionCard';
import React from 'react';

describe('PathSelectionCard', () => {
  const createProps = () => ({
    title: 'COLLECTIVE',
    description: 'The foundation of all paths.',
    onSelect: jest.fn(),
  });

  it('renders title and description', () => {
    const props = createProps();

    render(<PathSelectionCard {...props} />);
    expect(screen.getByText('COLLECTIVE')).toBeDefined();
    expect(screen.getByText(/foundation/)).toBeDefined();
  });

  it('triggers onSelect when clicked', () => {
    const props = createProps();

    render(<PathSelectionCard {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.onSelect).toHaveBeenCalled();
  });

  it('shows selected styling when isSelected is true', () => {
    const props = createProps();

    render(
      <PathSelectionCard
        {...props}
        isSelected={true}
      />
    );
    // Component uses CSS border change, no text indicator
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('border-[var(--sys-color-inkGold-base)]');
  });

  it('shows unselected styling by default', () => {
    const props = createProps();

    render(<PathSelectionCard {...props} />);

    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(btn).not.toHaveClass('border-[var(--sys-color-inkGold-base)]');
  });
});
