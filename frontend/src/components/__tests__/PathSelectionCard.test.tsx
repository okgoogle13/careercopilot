import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PathSelectionCard } from '../PathSelectionCard';
import React from 'react';

describe('PathSelectionCard', () => {
  const props = {
    title: 'COLLECTIVE',
    description: 'The foundation of all paths.',
    onSelect: vi.fn(),
  };

  it('renders title and description', () => {
    render(<PathSelectionCard {...props} />);
    expect(screen.getByText('COLLECTIVE')).toBeDefined();
    expect(screen.getByText(/foundation/)).toBeDefined();
  });

  it('triggers onSelect when clicked', () => {
    render(<PathSelectionCard {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.onSelect).toHaveBeenCalled();
  });

  it('shows SELECTED state when isSelected is true', () => {
    render(<PathSelectionCard {...props} isSelected={true} />);
    expect(screen.getByText('SELECTED')).toBeDefined();
  });
});
