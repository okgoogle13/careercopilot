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

const { OnboardingRoute } = await import('../OnboardingRoute');

describe('OnboardingRoute', () => {
  beforeEach(() => {
    mockUserStore.isNewUser = true;
  });

  it('renders the onboarding flow for brand-new users', () => {
    render(<OnboardingRoute />);

    expect(screen.getByTestId('onboarding-page')).toBeInTheDocument();
  });

  it('renders the onboarding flow for returning users', () => {
    mockUserStore.isNewUser = false;

    render(<OnboardingRoute />);

    expect(screen.getByTestId('onboarding-page')).toBeInTheDocument();
  });
});
