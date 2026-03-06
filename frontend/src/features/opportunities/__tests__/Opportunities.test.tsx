import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock framer-motion
(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, whileHover, whileTap, transition, ...props }: any, ref) => (
      <div
        data-testid="motion-div"
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )),
    img: (props: any) => <img {...props} />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react
(jest as any).unstable_mockModule('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  Compass: () => <div data-testid="compass-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
  Briefcase: () => <div data-testid="briefcase-icon" />,
  Loader2: () => <div data-testid="loader2-icon" />,
}));

// Mock UI components from @/components/ui
(jest as any).unstable_mockModule('@/components/ui', () => ({
  Pebble: ({ children, onClick, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="pebble-button"
    >
      {children}
    </button>
  ),
  StatusBadge: ({ children }: any) => <div data-testid="status-badge">{children}</div>,
  Stone: ({ children, className }: any) => (
    <div
      className={className}
      data-testid="stone-container"
    >
      {children}
    </div>
  ),
}));

// Mock JobList
(jest as any).unstable_mockModule('@/components/JobList', () => ({
  JobList: ({ jobs, onJobSelect }: any) => (
    <div data-testid="job-list">
      {jobs.map((job: any) => (
        <div
          key={job.id}
          data-testid="job-item"
          onClick={() => onJobSelect(job.id)}
        >
          {job.title}
        </div>
      ))}
    </div>
  ),
}));

// Mock PageHeader
(jest as any).unstable_mockModule('@/components/shared/PageHeader', () => ({
  PageHeader: ({ title }: any) => <h1 data-testid="page-header">{title}</h1>,
}));

// Mock fetch
global.fetch = jest.fn();

const { Opportunities } = await import('../Opportunities');

describe('Opportunities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in initial state', () => {
    render(<Opportunities />);

    expect(screen.getByTestId('page-header')).toHaveTextContent('The Sentry');
    expect(screen.getByPlaceholderText(/e.g. SOFTWARE ARCHITECT/i)).toHaveValue('Social Worker');
    expect(screen.getByPlaceholderText(/e.g. MELBOURNE, VIC/i)).toHaveValue('Melbourne');
    expect(screen.getByText('BEGIN SCOUT')).toBeInTheDocument();
    expect(screen.getByText('Lookout Deck Clear')).toBeInTheDocument();
  });

  it('updates input values', () => {
    render(<Opportunities />);

    const queryInput = screen.getByPlaceholderText(/e.g. SOFTWARE ARCHITECT/i);
    fireEvent.change(queryInput, { target: { value: 'Frontend Developer' } });
    expect(queryInput).toHaveValue('Frontend Developer');

    const locationInput = screen.getByPlaceholderText(/e.g. MELBOURNE, VIC/i);
    fireEvent.change(locationInput, { target: { value: 'Sydney' } });
    expect(locationInput).toHaveValue('Sydney');
  });

  it('handles scouting successfully', async () => {
    const mockResponse = {
      found_links: ['https://example.com/job1', 'https://example.com/job2'],
      message: 'Found some gems for you!',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<Opportunities />);

    const scoutButton = screen.getByText('BEGIN SCOUT');
    fireEvent.click(scoutButton);

    expect(screen.getByText('DISPATCHING...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/SCOUT DISPATCH: Found some gems for you!/i)).toBeInTheDocument();
      expect(screen.getAllByTestId('job-item').length).toBe(2);
    });
  });

  it('handles scouting error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<Opportunities />);

    const scoutButton = screen.getByText('BEGIN SCOUT');
    fireEvent.click(scoutButton);

    await waitFor(() => {
      expect(
        screen.getByText(/The Sentry reports an error in the transmission/i)
      ).toBeInTheDocument();
    });
  });
});
