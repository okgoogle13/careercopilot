import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock framer-motion
(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get:
        () =>
        ({ children, ...props }: any) => <div {...props}>{children}</div>,
    }
  ),
}));

// Mock UI components
(jest as any).unstable_mockModule('@/components/ui', () => ({
  Strike: ({ children }: any) => <button>{children}</button>,
  Placard: ({ children, className }: any) => <div className={className}>{children}</div>,
  StatusBadge: ({ label }: any) => <div>{label}</div>,
}));

// Mock Hero components
(jest as any).unstable_mockModule('@/components/kerala-rage/LayeredHero', () => ({
  LayeredHero: () => <div data-testid="layered-hero" />,
}));

(jest as any).unstable_mockModule('@/design/hero/heroRegistry', () => ({
  loadHeroRegistry: jest.fn().mockResolvedValue({}),
}));

(jest as any).unstable_mockModule('@/lib/composeHero', () => ({
  composeHero: jest.fn().mockReturnValue({
    valid: true,
    resolvedLayers: [],
    typography: {},
    animation: {},
    zIndexMap: {},
  }),
}));

(jest as any).unstable_mockModule('@/stores/userStore', () => ({
  useUserStore: () => ({
    hasMaster: true,
    hasCompletedIngestion: true,
    userSegment: null,
    checkMaster: jest.fn().mockResolvedValue(true),
  }),
}));

(jest as any).unstable_mockModule('lucide-react', () => ({
  FileText: () => <span>FileText</span>,
  Layout: () => <span>Layout</span>,
  Plus: () => <span>Plus</span>,
  Sparkles: () => <span>Sparkles</span>,
  Target: () => <span>Target</span>,
  Zap: () => <span>Zap</span>,
  CheckCircle2: () => <span>CheckCircle2</span>,
  Circle: () => <span>Circle</span>,
  X: () => <span>X</span>,
  Rocket: () => <span>Rocket</span>,
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const { Dashboard } = await import('../Dashboard');

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.setItem('cc_onboarding_checklist_dismissed', 'true');
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    localStorage.removeItem('cc_onboarding_checklist_dismissed');
  });

  it('renders the solidarity hub title', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /SOLIDARITY HUB/i })).toBeInTheDocument();
  });

  it('displays the mock profiles', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Senior Software Engineer/i)).toBeInTheDocument();
  });

  it('renders the action buttons', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Add Application/i)).toBeInTheDocument();
    expect(screen.getByText(/View Archive/i)).toBeInTheDocument();
  });

  it('renders the collective stat block with Nabla heading and display count', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const collectiveHeading = screen.getByText('THE COLLECTIVE');
    expect(collectiveHeading.className).toContain('font-nabla-hero');

    const collectiveCount = screen.getByText('1,204');
    expect(collectiveCount.className).toContain('font-display-ultra');
  });
});
