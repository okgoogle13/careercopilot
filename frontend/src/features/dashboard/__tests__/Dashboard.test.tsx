import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock framer-motion
(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock UI components
(jest as any).unstable_mockModule('@/components/ui', () => ({
  Pebble: ({ children }: any) => <button>{children}</button>,
  StatusBadge: ({ label }: any) => <div>{label}</div>,
  Stone: ({ children, className }: any) => <div className={className}>{children}</div>,
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

(jest as any).unstable_mockModule('lucide-react', () => ({
  FileText: () => <span>FileText</span>,
  Layout: () => <span>Layout</span>,
  Plus: () => <span>Plus</span>,
  Sparkles: () => <span>Sparkles</span>,
  Target: () => <span>Target</span>,
  Zap: () => <span>Zap</span>,
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const { Dashboard } = await import('../Dashboard');

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it('renders the solidarity hub title', () => {
    render(<Dashboard />);
    expect(screen.getByText(/SOLIDARITY/i)).toBeInTheDocument();
    expect(screen.getByText(/HUB/i)).toBeInTheDocument();
  });

  it('displays the mock profiles', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Senior Software Engineer/i)).toBeInTheDocument();
  });

  it('renders the action buttons', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Deposit KrMotif/i)).toBeInTheDocument();
    expect(screen.getByText(/View Archive/i)).toBeInTheDocument();
  });
});
