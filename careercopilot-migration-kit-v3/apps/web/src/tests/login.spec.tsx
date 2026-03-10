import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginScreen } from '../screens/LoginScreen';

describe('LoginScreen', () => {
  it('renders tokenized migrated login copy', () => {
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /step back into the worker portal/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open registration/i }),
    ).toBeInTheDocument();
  });

  it('announces validation errors accessibly', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /enter the workspace/i }));

    expect(screen.getByRole('status')).toHaveTextContent(
      /add both email and password to continue/i,
    );
  });
});
