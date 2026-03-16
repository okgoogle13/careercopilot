import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

(jest as any).unstable_mockModule('@/utils/toast', () => ({
  m3Toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

(jest as any).unstable_mockModule('@/components/ui', () => ({
  Megaphone: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Strike: ({
    children,
    iconLeft: _iconLeft,
    variant: _variant,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    iconLeft?: React.ReactNode;
    variant?: string;
  }) => <button {...props}>{children}</button>,
  StatusBadge: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Placard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

(jest as any).unstable_mockModule('@/components/KanbanCard', () => ({
  KanbanCard: ({ title }: { title: string }) => <div>{title}</div>,
}));

(jest as any).unstable_mockModule('@/components/shared/KrErrorAlert', () => ({
  KrErrorAlert: ({ message }: { message: string }) => <div>{message}</div>,
}));

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

(jest as any).unstable_mockModule('@/screens/06_lookout/LookoutDiscovery', () => ({
  LookoutDiscovery: ({
    children,
    title,
    subtitle,
  }: {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
  }) => (
    <section data-testid="lookout-discovery">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </section>
  ),
}));

const { JobQueue } = await import('../JobQueue');

describe('JobQueue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('manifest.json')) {
        return Promise.resolve({ ok: true, json: async () => ({}) });
      }
      return Promise.resolve({ ok: true, json: async () => [] });
    });
  });

  it('renders inside the LookoutDiscovery shell and shows the empty queue state', async () => {
    render(
      <BrowserRouter>
        <JobQueue />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('lookout-discovery')).toBeInTheDocument();
    });

    expect(screen.getByText('Intelligence Pipeline')).toBeInTheDocument();
    expect(
      screen.getByText(/Synthesize clipped opportunities into tactical application strategies/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Empty Pipeline')).toBeInTheDocument();
  });
});
