import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { JobQueue } from '../JobQueue';
import React from 'react';

// Mock fetch globally
global.fetch = jest.fn();

// Mock m3Toast
jest.mock('@/utils/toast', () => ({
  m3Toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock child components
jest.mock('@/components/ui', () => ({
  Cabinet: ({ children, open, title, onClose }: any) =>
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
  Pebble: ({ children, onClick, isLoading, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {children}
    </button>
  ),
  StatusBadge: ({ children }: any) => <div data-testid="status-badge">{children}</div>,
  Stone: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

jest.mock('@/components/KanbanCard', () => ({
  KanbanCard: ({ title, onSelect, status }: any) => (
    <div data-testid="kanban-card">
      <h3>{title}</h3>
      <p>Status: {status}</p>
      <button onClick={onSelect}>Action</button>
    </div>
  ),
}));

jest.mock('../../components/shared/M3ErrorAlert', () => ({
  M3ErrorAlert: ({ message, onRetry }: any) => (
    <div data-testid="error-alert">
      {message}
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

jest.mock('../../components/shared/PageHeader', () => ({
  PageHeader: ({ title }: any) => <h1>{title}</h1>,
}));

jest.mock('../../components/kerala-rage/LayeredHero', () => ({
  LayeredHero: () => <div data-testid="layered-hero" />,
}));

// Mock all of lucide-react
jest.mock('lucide-react', () => {
  const original = jest.requireActual('lucide-react');
  return {
    ...original,
    Clock: () => <div data-testid="icon-clock" />,
    CheckCircle: () => <div data-testid="icon-check" />,
    Sparkles: () => <div data-testid="icon-sparkles" />,
    Copy: () => <div data-testid="icon-copy" />,
    ExternalLink: () => <div data-testid="icon-external" />,
    Play: () => <div data-testid="icon-play" />,
  };
});

// Mock hero registry
jest.mock('../../design/hero/heroRegistry', () => ({
  loadHeroRegistry: jest.fn().mockResolvedValue({}),
}));

// Mock composeHero
jest.mock('../../lib/composeHero', () => ({
  composeHero: jest.fn().mockReturnValue({
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
    jest.clearAllMocks();
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
