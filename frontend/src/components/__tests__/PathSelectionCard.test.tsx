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

  it('shows SELECTED state when isSelected is true', () => {
    const props = createProps();

    render(
      <PathSelectionCard
        {...props}
        isSelected={true}
      />
    );
    expect(screen.getByText('SELECTED')).toBeDefined();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('marks the card as unselected by default', () => {
    const props = createProps();

    render(<PathSelectionCard {...props} />);

    expect(screen.getByText('CHOOSE THIS PATH')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });
});
