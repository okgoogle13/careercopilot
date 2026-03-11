import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RegisterScreen } from '../screens/RegisterScreen';

describe('RegisterScreen', () => {
  it('renders tokenized migrated register copy', () => {
    render(
      <MemoryRouter>
        <RegisterScreen />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /claim your collective portal/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /back to login/i }),
    ).toBeInTheDocument();
  });

  it('announces validation errors accessibly', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterScreen />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /create account \(step 1 of 2\)/i }));

    expect(screen.getByRole('status')).toHaveTextContent(
      /complete every field to create your account/i,
    );
  });
});
