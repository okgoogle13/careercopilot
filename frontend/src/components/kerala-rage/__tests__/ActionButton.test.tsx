import { render, screen } from '@testing-library/react';
import { ActionButton } from '../ActionButton';
import React from 'react';

describe('ActionButton', () => {
  it('renders with the correct label', () => {
    render(<ActionButton label="TEST STRIKE" />);
    expect(screen.getByText(/TEST STRIKE/i)).toBeInTheDocument();
  });

  it('applies the solidarityProtest class', () => {
    const { container } = render(<ActionButton label="STRIKE" />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('type-solidarityProtest');
  });
});
