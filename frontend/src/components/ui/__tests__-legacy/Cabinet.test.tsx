import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cabinet } from '../Cabinet';

describe('Cabinet', () => {
  it('does not render when closed', () => {
    render(
      <Cabinet open={false} onClose={() => undefined} title="Draft details">
        <p>Body</p>
      </Cabinet>
    );

    expect(screen.queryByText('Draft details')).not.toBeInTheDocument();
  });

  it('renders title and content when open', () => {
    render(
      <Cabinet open onClose={() => undefined} title="Draft details">
        <p>Body content</p>
      </Cabinet>
    );

    expect(screen.getByText('Draft details')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('triggers onClose from close button', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <Cabinet open onClose={onClose} title="Closable modal">
        <p>Body content</p>
      </Cabinet>
    );

    await user.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
