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
      screen.getByRole('heading', { name: /return to the collective portal/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create account \(step 1 of 2\)/i }),
    ).toBeInTheDocument();
  });

  it('announces validation errors accessibly', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /login → access dashboard/i }));

    expect(screen.getByRole('status')).toHaveTextContent(
      /add your email and password to move forward/i,
    );
  });
});
