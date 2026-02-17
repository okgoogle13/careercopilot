import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pebble } from '../Pebble';

describe('Pebble', () => {
  it('renders with content', () => {
    render(<Pebble>Continue</Pebble>);
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('calls onClick when enabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Pebble onClick={onClick}>Run</Pebble>);

    await user.click(screen.getByRole('button', { name: 'Run' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables interaction while loading', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <Pebble isLoading onClick={onClick}>
        Loading
      </Pebble>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
