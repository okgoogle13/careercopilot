import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

const mockNavigate = jest.fn();
const mockTrack = jest.fn();
const mockSetUserSegment = jest.fn();

(jest as any).unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

(jest as any).unstable_mockModule('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}));

(jest as any).unstable_mockModule('@/stores/userStore', () => ({
  useUserStore: (selector: (state: { setUserSegment: typeof mockSetUserSegment }) => unknown) =>
    selector({ setUserSegment: mockSetUserSegment }),
}));

(jest as any).unstable_mockModule('@/components/PathSelectionCard', () => ({
  PathSelectionCard: ({ title, onSelect }: { title: string; onSelect: () => void }) => (
    <button onClick={onSelect}>{title}</button>
  ),
}));

(jest as any).unstable_mockModule('@/components/kerala-rage/LayeredHero', () => ({
  LayeredHero: () => <div data-testid="layered-hero" />,
}));

(jest as any).unstable_mockModule('@/design/hero/heroRegistry', () => ({
  loadHeroRegistry: jest.fn().mockResolvedValue({}),
}));

(jest as any).unstable_mockModule('@/lib/composeHero', () => ({
  composeHero: jest.fn().mockReturnValue({
    valid: false,
    resolvedLayers: [],
    typography: {},
    animation: {},
    motion: {},
    zIndexMap: {},
  }),
}));

(jest as any).unstable_mockModule('@/design/hero/pageHeroMap', () => ({
  resolvePageHeroComposition: jest.fn().mockReturnValue('onboarding'),
}));

(jest as any).unstable_mockModule('@/screens/03_onboarding/OnboardFlow', () => ({
  OnboardFlow: ({
    children,
    title,
    subtitle,
  }: {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
  }) => (
    <section data-testid="onboard-flow">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </section>
  ),
}));

const { OnboardingPage } = await import('../OnboardingPage');

describe('OnboardingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReset();
  });

  it('renders inside the OnboardFlow shell and advances to the segment step', () => {
    render(<OnboardingPage />);

    expect(screen.getByTestId('onboard-flow')).toBeInTheDocument();
    expect(screen.getByText('Choose Your Focus Area')).toBeInTheDocument();
    expect(screen.getByText(/Select your domain to personalize job matching/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Social Work'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('What Best Describes Your Situation?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue to Document Setup' })).toBeInTheDocument();
  });
});
