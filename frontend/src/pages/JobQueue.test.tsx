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

<<<<<<< HEAD
        // Wait for loading to complete and page title to appear
        await waitFor(() => {
            expect(screen.getByText(/Incoming Job/i)).toBeInTheDocument();
        });
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
    });

    it('displays loading state initially', () => {
        (global.fetch as any).mockImplementationOnce(
            () => new Promise(() => { }) // Never resolves
        );

        renderWithRouter(<JobQueue />);
<<<<<<< HEAD
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
=======
        expect(screen.getByRole('status')).toBeInTheDocument();
>>>>>>> restoration-KR-Rage-Figma-v2.0
    });

    it('displays empty state when no jobs', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderWithRouter(<JobQueue />);

        await waitFor(() => {
<<<<<<< HEAD
            expect(screen.getByText(/No jobs in queue/i)).toBeInTheDocument();
=======
            expect(screen.getByText(/Empty Pipeline/i)).toBeInTheDocument();
>>>>>>> restoration-KR-Rage-Figma-v2.0
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

<<<<<<< HEAD
    it('displays "Analyze with JobScout" button for pending jobs', async () => {
=======
    it('displays "Analyze Intelligence" button for pending jobs', async () => {
>>>>>>> restoration-KR-Rage-Figma-v2.0
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [mockJobs[0]], // Only pending job
        });

        renderWithRouter(<JobQueue />);

        await waitFor(() => {
<<<<<<< HEAD
            const analyzeButtons = screen.getAllByText(/Analyze with JobScout/i);
            expect(analyzeButtons.length).toBeGreaterThan(0);
            expect(analyzeButtons[0]).not.toBeDisabled();
=======
            const analyzeButtons = screen.getAllByText(/Analyze Intelligence/i);
            expect(analyzeButtons.length).toBeGreaterThan(0);
            expect(analyzeButtons[0].closest('button')).not.toBeDisabled();
>>>>>>> restoration-KR-Rage-Figma-v2.0
        });
    });

    it('disables analyze button for non-pending jobs', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [mockJobs[1]], // ready_to_apply job
        });

        renderWithRouter(<JobQueue />);

        await waitFor(() => {
<<<<<<< HEAD
            const analyzeButton = screen.getByRole('button', { name: /Analyze with JobScout/i });
=======
            // "Analyze Intelligence" button handles click, but might be hidden or disabled?
            // In the component: 
            // disabled={job.status !== 'pending_analysis' || isAnalyzing}
            // And text is "Analyze Intelligence"
            const analyzeButton = screen.getByRole('button', { name: /Analyze Intelligence/i });
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
            expect(screen.getByText('Pending Analysis')).toBeInTheDocument();
            expect(screen.getByText('Ready to Apply')).toBeInTheDocument();
=======
            // StatusBadge renders customized text, possibly uppercase or with specific styling
            // We'll look for the text content broadly or key elements
            const pendingParams = screen.getAllByText(/Pending Analysis/i);
            expect(pendingParams.length).toBeGreaterThan(0);
            
            const readyParams = screen.getAllByText(/Ready to Apply/i);
            expect(readyParams.length).toBeGreaterThan(0);
>>>>>>> restoration-KR-Rage-Figma-v2.0
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

<<<<<<< HEAD
        renderWithRouter(<JobQueue />);

        await waitFor(() => {
            const links = screen.getAllByRole('link');
            const externalLink = links.find(link =>
                link.getAttribute('href') === mockJobs[0].url
            );
            expect(externalLink).toBeInTheDocument();
            expect(externalLink).toHaveAttribute('target', '_blank');
        });
=======
        // Mock window.open
        const originalOpen = window.open;
        window.open = jest.fn();

        renderWithRouter(<JobQueue />);

        await waitFor(() => {
            const inspectButton = screen.getByText(/Inspect Source/i);
            expect(inspectButton).toBeInTheDocument();
            
            // Simulate click
            inspectButton.click();
            expect(window.open).toHaveBeenCalledWith(mockJobs[0].url, '_blank');
        });

        // Cleanup
        window.open = originalOpen;
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
