import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ManifestoCard } from '../ManifestoCard';
import React from 'react';

describe('ManifestoCard', () => {
  const defaultProps = {
    title: 'Solidarity Forever',
    content: 'The collective history of our work is the foundation of our future.',
    actionLabel: 'JOIN STATION',
    onAction: vi.fn(),
  };

  it('renders title and content correctly', () => {
    render(<ManifestoCard {...defaultProps} />);
    expect(screen.getByText('Solidarity Forever')).toBeDefined();
    expect(screen.getByText(/collective history/)).toBeDefined();
  });

  it('triggers onAction when button is clicked', () => {
    render(<ManifestoCard {...defaultProps} />);
    const button = screen.getByText('JOIN STATION');
    fireEvent.click(button);
    expect(defaultProps.onAction).toHaveBeenCalledTimes(1);
  });

  it('has no basic a11y violations (ARIA roles check)', () => {
    render(<ManifestoCard {...defaultProps} />);
    expect(screen.getByRole('article')).toBeDefined();
    expect(screen.getByRole('button', { name: 'JOIN STATION' })).toBeDefined();
  });
});
