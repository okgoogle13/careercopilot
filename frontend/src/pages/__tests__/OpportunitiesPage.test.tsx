import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OpportunitiesPage } from '../OpportunitiesPage';

describe('OpportunitiesPage', () => {
  const mockOnApply = jest.fn();
  const mockOnBookmark = jest.fn();
  const mockOnCreateAlert = jest.fn();

  beforeEach(() => {
    mockOnApply.mockClear();
    mockOnBookmark.mockClear();
    mockOnCreateAlert.mockClear();
  });

  describe('Empty State', () => {
    it('renders empty state when isEmpty is true', () => {
      render(<OpportunitiesPage isEmpty={true} onCreateAlert={mockOnCreateAlert} />);

      expect(screen.getByRole('heading', { name: /Discover Opportunities/i })).toBeInTheDocument();
      expect(screen.getByText(/Set up job alerts and preferences/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Search Jobs/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Alert/i })).toBeInTheDocument();
    });

    it('calls onCreateAlert when create alert button is clicked in empty state', async () => {
      const user = userEvent.setup();
      render(<OpportunitiesPage isEmpty={true} onCreateAlert={mockOnCreateAlert} />);

      const createAlertButton = screen.getByRole('button', { name: /Create Alert/i });
      await user.click(createAlertButton);

      expect(mockOnCreateAlert).toHaveBeenCalledTimes(1);
    });

    it('displays feature chips in empty state', () => {
      render(<OpportunitiesPage isEmpty={true} />);

      expect(screen.getByText(/Job Alerts/i)).toBeInTheDocument();
      expect(screen.getByText(/Match Scoring/i)).toBeInTheDocument();
      expect(screen.getByText(/Application Tracking/i)).toBeInTheDocument();
      expect(screen.getByText(/Company Research/i)).toBeInTheDocument();
    });
  });

  describe('Opportunities Page with Content', () => {
    it('renders the job opportunities heading and description', () => {
      render(<OpportunitiesPage />);

      expect(screen.getByRole('heading', { name: /Job Opportunities/i })).toBeInTheDocument();
      expect(screen.getByText(/Discover and track job opportunities tailored to your profile/i)).toBeInTheDocument();
    });

    it('displays statistics cards with correct data', () => {
      render(<OpportunitiesPage />);

      // Should display total opportunities
      expect(screen.getByText(/Total Opportunities/i)).toBeInTheDocument();
      expect(screen.getByText(/New Opportunities/i)).toBeInTheDocument();
      expect(screen.getByText(/Applications Sent/i)).toBeInTheDocument();
      expect(screen.getByText(/Avg Match Score/i)).toBeInTheDocument();
    });

    it('displays all job tabs', () => {
      render(<OpportunitiesPage />);

      expect(screen.getByRole('tab', { name: /All \(/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /New \(/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Applied \(/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Interviewing \(/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Bookmarked \(/i })).toBeInTheDocument();
    });

    it('displays job cards with correct information', () => {
      render(<OpportunitiesPage />);

      expect(screen.getByText(/Senior Full Stack Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/TechCorp Inc/i)).toBeInTheDocument();
      expect(screen.getByText(/Product Manager/i)).toBeInTheDocument();
      expect(screen.getByText(/Innovation Labs/i)).toBeInTheDocument();
    });

    it('displays search bar and filter buttons', () => {
      render(<OpportunitiesPage />);

      expect(screen.getByPlaceholderText(/Search jobs, companies, or skills/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Filters/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sort/i })).toBeInTheDocument();
    });

    it('displays match scores for jobs', () => {
      render(<OpportunitiesPage />);

      // Check for Match Score labels
      const matchScoreElements = screen.getAllByText(/Match Score/i);
      expect(matchScoreElements.length).toBeGreaterThan(0);
    });

    it('displays job type and salary information', () => {
      render(<OpportunitiesPage />);

      // Check for salary ranges (formatted with locale string)
      expect(screen.getByText(/\$120,000-\$160,000/i)).toBeInTheDocument();
      expect(screen.getByText(/\$110,000-\$140,000/i)).toBeInTheDocument();
    });
  });

  describe('Job Interactions', () => {
    it('filters jobs based on search query', async () => {
      const user = userEvent.setup();
      render(<OpportunitiesPage />);

      const searchInput = screen.getByPlaceholderText(/Search jobs, companies, or skills/i);
      await user.type(searchInput, 'React');

      // Jobs with "React" in tags should be visible
      expect(screen.getByText(/Senior Full Stack Developer/i)).toBeInTheDocument();
    });

    it('switches tabs when clicking on different job status tabs', async () => {
      const user = userEvent.setup();
      render(<OpportunitiesPage />);

      const appliedTab = screen.getByRole('tab', { name: /Applied \(/i });
      await user.click(appliedTab);

      await waitFor(() => {
        // Should show jobs with "applied" status
        expect(screen.getByText(/Product Manager/i)).toBeInTheDocument();
      });
    });

    it('opens job alert dialog when job alerts button is clicked', async () => {
      const user = userEvent.setup();
      render(<OpportunitiesPage />);

      const jobAlertsButton = screen.getByRole('button', { name: /Job Alerts/i });
      await user.click(jobAlertsButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Create Job Alert/i })).toBeInTheDocument();
      });
    });

    it('calls onApply when apply now button is clicked', async () => {
      const user = userEvent.setup();
      render(<OpportunitiesPage onApply={mockOnApply} />);

      // Find an "Apply Now" button
      const applyButtons = screen.getAllByRole('button', { name: /Apply Now/i });
      if (applyButtons.length > 0) {
        await user.click(applyButtons[0]);

        expect(mockOnApply).toHaveBeenCalledTimes(1);
        expect(mockOnApply).toHaveBeenCalledWith(expect.any(String));
      }
    });

    it('allows selecting multiple jobs for bulk actions', async () => {
      const user = userEvent.setup();
      render(<OpportunitiesPage />);

      // Find job checkboxes
      const checkboxes = screen.getAllByRole('checkbox');

      // Select two jobs
      if (checkboxes.length >= 2) {
        await user.click(checkboxes[0]);
        await user.click(checkboxes[1]);

        // Should show bulk action toolbar
        await waitFor(() => {
          expect(screen.getByText(/2 jobs selected/i)).toBeInTheDocument();
        });
      }
    });

    it('opens job details dialog when view details is clicked', async () => {
      const user = userEvent.setup();
      render(<OpportunitiesPage />);

      const viewDetailsButtons = screen.getAllByRole('button', { name: /View Details/i });
      if (viewDetailsButtons.length > 0) {
        await user.click(viewDetailsButtons[0]);

        await waitFor(() => {
          expect(screen.getByText(/Job Description/i)).toBeInTheDocument();
          expect(screen.getByText(/Requirements/i)).toBeInTheDocument();
          expect(screen.getByText(/Benefits/i)).toBeInTheDocument();
        });
      }
    });

    it('displays floating action button for creating alerts', () => {
      render(<OpportunitiesPage />);

      const fab = screen.getByRole('button', { name: /create alert/i });
      expect(fab).toBeInTheDocument();
    });
  });

  describe('Job Alert Creation', () => {
    it('displays job alert creation form with all fields', async () => {
      const user = userEvent.setup();
      render(<OpportunitiesPage />);

      const jobAlertsButton = screen.getByRole('button', { name: /Job Alerts/i });
      await user.click(jobAlertsButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/Keywords/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Job Type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Min Salary/i)).toBeInTheDocument();
      });
    });

    it('calls onCreateAlert when create alert is submitted', async () => {
      const user = userEvent.setup();
      render(<OpportunitiesPage onCreateAlert={mockOnCreateAlert} />);

      const jobAlertsButton = screen.getByRole('button', { name: /Job Alerts/i });
      await user.click(jobAlertsButton);

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /^Create Alert$/i });
        expect(createButton).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /^Create Alert$/i });
      await user.click(createButton);

      expect(mockOnCreateAlert).toHaveBeenCalledTimes(1);
    });
  });
});
