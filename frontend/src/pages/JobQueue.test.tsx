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
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
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

        // Wait for loading to complete and page title to appear
        await waitFor(() => {
            expect(screen.getByText(/Incoming Job/i)).toBeInTheDocument();
        });
    });

    it('displays loading state initially', () => {
        (global.fetch as any).mockImplementationOnce(
            () => new Promise(() => { }) // Never resolves
        );

        renderWithRouter(<JobQueue />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays empty state when no jobs', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderWithRouter(<JobQueue />);

        await waitFor(() => {
            expect(screen.getByText(/No jobs in queue/i)).toBeInTheDocument();
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
            expect(screen.getByText('TechCorp')).toBeInTheDocument();
            expect(screen.getByText('React Developer')).toBeInTheDocument();
            expect(screen.getByText('StartupCo')).toBeInTheDocument();
        });
    });

    it('displays "Analyze with JobScout" button for pending jobs', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [mockJobs[0]], // Only pending job
        });

        renderWithRouter(<JobQueue />);

        await waitFor(() => {
            const analyzeButtons = screen.getAllByText(/Analyze with JobScout/i);
            expect(analyzeButtons.length).toBeGreaterThan(0);
            expect(analyzeButtons[0]).not.toBeDisabled();
        });
    });

    it('disables analyze button for non-pending jobs', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [mockJobs[1]], // ready_to_apply job
        });

        renderWithRouter(<JobQueue />);

        await waitFor(() => {
            const analyzeButton = screen.getByRole('button', { name: /Analyze with JobScout/i });
            expect(analyzeButton).toBeDisabled();
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
            expect(screen.getByText('Pending Analysis')).toBeInTheDocument();
            expect(screen.getByText('Ready to Apply')).toBeInTheDocument();
        });
    });

    it('displays error message on fetch failure', async () => {
        (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

        renderWithRouter(<JobQueue />);

        await waitFor(() => {
            expect(screen.getByText(/Failed to load job queue/i)).toBeInTheDocument();
        });
    });

    it('makes external link button clickable', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [mockJobs[0]],
        });

        renderWithRouter(<JobQueue />);

        await waitFor(() => {
            const links = screen.getAllByRole('link');
            const externalLink = links.find(link =>
                link.getAttribute('href') === mockJobs[0].url
            );
            expect(externalLink).toBeInTheDocument();
            expect(externalLink).toHaveAttribute('target', '_blank');
        });
    });

    it('calls correct API endpoint', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderWithRouter(<JobQueue />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:8000/api/ingest/queue'
            );
        });
    });
});
