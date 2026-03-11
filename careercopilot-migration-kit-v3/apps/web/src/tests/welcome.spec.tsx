import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { WelcomeScreen } from '../screens/WelcomeScreen';

describe('WelcomeScreen', () => {
  it('renders migrated welcome copy', () => {
    render(
      <MemoryRouter>
        <WelcomeScreen />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /bring your application into view/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /start onboarding pass/i }),
    ).toBeInTheDocument();
  });

  it('updates status when the welcome action is used', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <WelcomeScreen />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /start onboarding pass/i }));

    expect(screen.getByRole('status')).toHaveTextContent(
      /welcome briefing cleared\. onboarding route is next/i,
    );
  });
});
