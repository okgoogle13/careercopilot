import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { JobQueue } from './JobQueue';

// Mock fetch globally
global.fetch = jest.fn();

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
  });

  it('renders without crashing', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter(<JobQueue />);

    // Wait for loading to finish
    await waitFor(() => {
      const loaders = screen.queryAllByTestId('job-queue-loader');
      expect(loaders).toHaveLength(0);
    });

    // Debug output if needed (using screen.debug() if local, but here we just assert)
    // Now check for title using heading role to avoid button text conflict
    expect(screen.getByRole('heading', { name: /Intelligence/i })).toBeInTheDocument();
    // Pipeline might be separate or part of heading depending on component split
    // But PageHeader renders it inside h2.
    // If split, getByRole('heading') name computation should include full text "Intelligence Pipeline".
    // Let's rely on accessible name
    expect(screen.getByRole('heading', { name: /Intelligence Pipeline/i })).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    (global.fetch as any).mockImplementationOnce(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithRouter(<JobQueue />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays empty state when no jobs', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter(<JobQueue />);

    await waitFor(() => {
      expect(screen.getByText(/Empty Pipeline/i)).toBeInTheDocument();
    });
  });

  it('fetches and displays job cards', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobs,
    });

    renderWithRouter(<JobQueue />);

    await waitFor(() => {
      expect(screen.getByText('Senior Python Developer')).toBeInTheDocument();
      // TechCorp is overridden by notes in the new design
      expect(screen.getByText('React Developer')).toBeInTheDocument();
      expect(screen.getByText('StartupCo')).toBeInTheDocument();
    });
  });

  it('displays job notes when provided', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockJobs[0]],
    });

    renderWithRouter(<JobQueue />);

    await waitFor(() => {
      expect(screen.getByText(/Great company culture/i)).toBeInTheDocument();
    });
  });

  it('displays status chips correctly', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobs,
    });

    renderWithRouter(<JobQueue />);

    await waitFor(() => {
      // StatusBadge renders customized text, possibly uppercase or with specific styling
      // We'll look for the text content broadly or key elements
      const pendingParams = screen.getAllByText(/Pending Analysis/i);
      expect(pendingParams.length).toBeGreaterThan(0);

      const readyParams = screen.getAllByText(/Ready to Apply/i);
      expect(readyParams.length).toBeGreaterThan(0);
    });
  });

  it('displays error message on fetch failure', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<JobQueue />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load job queue/i)).toBeInTheDocument();
    });
  });

  it('calls correct API endpoint', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter(<JobQueue />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/api/ingest/queue');
    });
  });
});
