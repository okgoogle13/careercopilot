import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { OnboardingScreen } from '../screens/OnboardingScreen';

describe('OnboardingScreen', () => {
  it('renders migrated onboarding copy', () => {
    render(
      <MemoryRouter>
        <OnboardingScreen />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /choose the route pressure point/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open welcome briefing/i }),
    ).toBeInTheDocument();
  });

  it('announces validation errors when no pathway is selected', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <OnboardingScreen />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /open welcome briefing/i }));

    expect(screen.getByRole('status')).toHaveTextContent(
      /choose one pathway before opening the welcome briefing/i,
    );
  });
});
