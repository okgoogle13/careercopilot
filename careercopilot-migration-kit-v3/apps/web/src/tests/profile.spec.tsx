import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ProfileScreen } from '../screens/ProfileScreen';

describe('ProfileScreen', () => {
  it('renders migrated profile copy', () => {
    render(
      <MemoryRouter>
        <ProfileScreen />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /shape your movement profile/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save profile foundation/i }),
    ).toBeInTheDocument();
  });

  it('announces validation errors accessibly', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProfileScreen />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /save profile foundation/i }));

    expect(screen.getByRole('status')).toHaveTextContent(
      /add your role focus and community strengths before saving/i,
    );
  });
});
