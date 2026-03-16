import React from 'react';
import { render, screen } from '@testing-library/react';

const mockUserStore = {
  isNewUser: true,
};

(jest as any).unstable_mockModule('@/stores/userStore', () => ({
  useUserStore: (selector: (state: typeof mockUserStore) => unknown) => selector(mockUserStore),
}));

(jest as any).unstable_mockModule('@/features/onboarding/OnboardingPage', () => ({
  OnboardingPage: () => <div data-testid="onboarding-page" />,
}));

(jest as any).unstable_mockModule('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
}));

const { OnboardingRoute } = await import('../OnboardingRoute');

describe('OnboardingRoute', () => {
  beforeEach(() => {
    mockUserStore.isNewUser = true;
  });

  it('redirects brand-new users to the welcome step', () => {
    render(<OnboardingRoute />);

    expect(screen.getByTestId('navigate')).toHaveTextContent('/welcome');
  });

  it('renders the onboarding flow for returning users', () => {
    mockUserStore.isNewUser = false;

    render(<OnboardingRoute />);

    expect(screen.getByTestId('onboarding-page')).toBeInTheDocument();
  });
});
