import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Seed } from '../Seed';

describe('Seed', () => {
  it('renders child anchor', () => {
    render(
      <Seed content="2">
        <button type="button">Notifications</button>
      </Seed>
    );

    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('shows badge content for standard variant', () => {
    render(
      <Seed
        content="7"
        variant="standard"
      >
        <span>Anchor</span>
      </Seed>
    );

    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('hides badge when invisible is true', () => {
    const { container } = render(
      <Seed
        content="9"
        invisible
      >
        <span>Anchor</span>
      </Seed>
    );

    expect(screen.getByText('Anchor')).toBeInTheDocument();
    expect(container).not.toHaveTextContent('9');
  });
});
