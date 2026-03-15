import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { JobQueue } from '../JobQueue';
import React from 'react';

// Mock fetch globally
global.fetch = vi.fn();

// Mock m3Toast
vi.mock('@/utils/toast', () => ({
  m3Toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock child components
vi.mock('@/components/ui', () => ({
  Megaphone: ({ children, open, title, onClose }: any) =>
    open ? (
      <div
        data-testid="cabinet"
        role="dialog"
      >
        <h2>{title}</h2>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
  Strike: ({ children, onClick, isLoading, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {children}
    </button>
  ),
  StatusBadge: ({ children }: any) => <div data-testid="status-badge">{children}</div>,
  Placard: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('@/components/KanbanCard', () => ({
  KanbanCard: ({ title, onSelect, status }: any) => (
    <div data-testid="kanban-card">
      <h3>{title}</h3>
      <p>Status: {status}</p>
      <button onClick={onSelect}>Action</button>
    </div>
  ),
}));

vi.mock('@/components/shared/KrErrorAlert', () => ({
  KrErrorAlert: ({ message, onRetry }: any) => (
    <div data-testid="error-alert">
      {message}
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

vi.mock('@/components/shared/PageHeader', () => ({
  PageHeader: ({ title }: any) => <h1>{title}</h1>,
}));

vi.mock('@/components/kerala-rage/LayeredHero', () => ({
  LayeredHero: () => <div data-testid="layered-hero" />,
}));

// Mock all of lucide-react
vi.mock('lucide-react', async () => {
  const original = await vi.importActual('lucide-react');
  return {
    ...(original as any),
    Clock: () => <div data-testid="icon-clock" />,
    CheckCircle: () => <div data-testid="icon-check" />,
    Sparkles: () => <div data-testid="icon-sparkles" />,
    Copy: () => <div data-testid="icon-copy" />,
    ExternalLink: () => <div data-testid="icon-external" />,
    Play: () => <div data-testid="icon-play" />,
  };
});

// Mock hero registry
vi.mock('@/design/hero/heroRegistry', () => ({
  loadHeroRegistry: vi.fn().mockResolvedValue({}),
}));

// Mock composeHero
vi.mock('@/lib/composeHero', () => ({
  composeHero: vi.fn().mockReturnValue({
    valid: true,
    resolvedLayers: [],
    typography: {},
    animation: {},
    zIndexMap: {},
  }),
}));

const mockJobs = [
  {
    id: '1',
    title: 'Senior Python Developer',
    company: 'TechCorp',
    url: 'https://seek.com.au/job/123',
    status: 'pending_analysis',
    date_clipped: '2026-01-01T10:00:00Z',
    notes: 'Great company culture',
  },
  {
    id: '2',
    title: 'React Developer',
    company: 'StartupCo',
    url: 'https://ethicaljobs.com.au/job/456',
    status: 'ready_to_apply',
    date_clipped: '2026-01-01T11:00:00Z',
    notes: '',
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('JobQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('manifest.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ layers: [], typography: {} }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    });
  });

  it('renders without crashing', async () => {
    renderWithRouter(<JobQueue />);
    await waitFor(() => {
      expect(screen.queryByTestId('job-queue-loader')).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Intelligence Pipeline/i)).toBeInTheDocument();
  });

  it('displays empty state when no jobs', async () => {
    renderWithRouter(<JobQueue />);
    await waitFor(() => {
      expect(screen.getByText(/Empty Pipeline/i)).toBeInTheDocument();
    });
  });

  it('fetches and displays job cards', async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('manifest.json'))
        return Promise.resolve({ ok: true, json: async () => ({}) });
      return Promise.resolve({
        ok: true,
        json: async () => mockJobs,
      });
    });

    renderWithRouter(<JobQueue />);

    await waitFor(() => {
      expect(screen.getByText('Senior Python Developer')).toBeInTheDocument();
      expect(screen.getByText('React Developer')).toBeInTheDocument();
    });
  });

  it('triggers job analysis when pending job is clicked', async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('analyze')) return Promise.resolve({ ok: true, json: async () => ({}) });
      return Promise.resolve({
        ok: true,
        json: async () => [mockJobs[0]], // Return pending job
      });
    });

    renderWithRouter(<JobQueue />);

    const actionBtn = await screen.findByRole('button', { name: /Action/i });
    fireEvent.click(actionBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/1/analyze'),
        expect.anything()
      );
    });
  });

  it('triggers cover letter drafting when ready job is clicked', async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('draft')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: { cover_letter: 'Mock Letter' } }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [mockJobs[1]], // Return ready job
      });
    });

    renderWithRouter(<JobQueue />);

    const actionBtn = await screen.findByRole('button', { name: /Action/i });
    fireEvent.click(actionBtn);

    await waitFor(() => {
      expect(screen.getByTestId('cabinet')).toBeInTheDocument();
      expect(screen.getByText(/Mock Letter/i)).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('manifest.json'))
        return Promise.resolve({ ok: true, json: async () => ({}) });
      return Promise.reject(new Error('Network error'));
    });

    renderWithRouter(<JobQueue />);

    await waitFor(() => {
      expect(screen.getByTestId('error-alert')).toBeInTheDocument();
      expect(screen.getByText(/Failed to load job queue/i)).toBeInTheDocument();
    });
  });
});
