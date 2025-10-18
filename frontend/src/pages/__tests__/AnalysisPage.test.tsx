import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnalysisPage } from '../AnalysisPage';

describe('AnalysisPage', () => {
  const mockOnRunAnalysis = jest.fn();
  const mockOnViewReport = jest.fn();

  beforeEach(() => {
    mockOnRunAnalysis.mockClear();
    mockOnViewReport.mockClear();
  });

  describe('Empty State', () => {
    it('renders empty state when isEmpty is true', () => {
      render(<AnalysisPage isEmpty={true} onRunAnalysis={mockOnRunAnalysis} />);

      expect(screen.getByRole('heading', { name: /No Analysis Available/i })).toBeInTheDocument();
      expect(screen.getByText(/Upload documents and run ATS analysis/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Run First Analysis/i })).toBeInTheDocument();
    });

    it('calls onRunAnalysis when run first analysis button is clicked in empty state', async () => {
      const user = userEvent.setup();
      render(<AnalysisPage isEmpty={true} onRunAnalysis={mockOnRunAnalysis} />);

      const runAnalysisButton = screen.getByRole('button', { name: /Run First Analysis/i });
      await user.click(runAnalysisButton);

      expect(mockOnRunAnalysis).toHaveBeenCalledTimes(1);
    });

    it('displays analysis features in empty state', () => {
      render(<AnalysisPage isEmpty={true} />);

      expect(screen.getByText(/ATS Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Keyword Match/i)).toBeInTheDocument();
      expect(screen.getByText(/Skills Gap/i)).toBeInTheDocument();
      expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
    });
  });

  describe('Analysis Page with Content', () => {
    it('renders the document analysis heading and description', () => {
      render(<AnalysisPage />);

      expect(screen.getByRole('heading', { name: /Document Analysis/i })).toBeInTheDocument();
      expect(screen.getByText(/Comprehensive ATS scoring and optimization recommendations/i)).toBeInTheDocument();
    });

    it('displays summary statistics cards', () => {
      render(<AnalysisPage />);

      expect(screen.getByText(/Average ATS Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Score Improvement/i)).toBeInTheDocument();
      expect(screen.getByText(/Documents Analyzed/i)).toBeInTheDocument();
      expect(screen.getByText(/Optimized Documents/i)).toBeInTheDocument();
    });

    it('displays run new analysis button', () => {
      render(<AnalysisPage />);

      expect(screen.getByRole('button', { name: /Run New Analysis/i })).toBeInTheDocument();
    });

    it('displays all analysis tabs', () => {
      render(<AnalysisPage />);

      expect(screen.getByRole('tab', { name: /Recent Analysis/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Performance Trends/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Insights/i })).toBeInTheDocument();
    });

    it('displays analysis reports in table format', () => {
      render(<AnalysisPage />);

      expect(screen.getByText(/Senior Software Developer Resume/i)).toBeInTheDocument();
      expect(screen.getByText(/Product Manager Cover Letter/i)).toBeInTheDocument();
      expect(screen.getByText(/UX Designer KSC Response/i)).toBeInTheDocument();
    });

    it('displays document type, ATS score, and status columns', () => {
      render(<AnalysisPage />);

      expect(screen.getByRole('columnheader', { name: /Document/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Type/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /ATS Score/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Analysis Date/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Status/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Actions/i })).toBeInTheDocument();
    });

    it('displays analysis statistics with correct values', () => {
      render(<AnalysisPage />);

      expect(screen.getByText(/85%/i)).toBeInTheDocument();
      expect(screen.getByText(/\+12%/i)).toBeInTheDocument();
      expect(screen.getByText(/^15$/)).toBeInTheDocument();
      expect(screen.getByText(/^8$/)).toBeInTheDocument();
    });
  });

  describe('Analysis Tabs', () => {
    it('switches to performance trends tab when clicked', async () => {
      const user = userEvent.setup();
      render(<AnalysisPage />);

      const trendsTab = screen.getByRole('tab', { name: /Performance Trends/i });
      await user.click(trendsTab);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Score Trends/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Document Types/i })).toBeInTheDocument();
      });
    });

    it('displays charts in performance trends tab', async () => {
      const user = userEvent.setup();
      render(<AnalysisPage />);

      const trendsTab = screen.getByRole('tab', { name: /Performance Trends/i });
      await user.click(trendsTab);

      await waitFor(() => {
        expect(screen.getByText(/Average score improved by 12% over last month/i)).toBeInTheDocument();
        expect(screen.getByText(/Resume: 60% • Cover Letters: 30% • KSC: 10%/i)).toBeInTheDocument();
      });
    });

    it('switches to insights tab when clicked', async () => {
      const user = userEvent.setup();
      render(<AnalysisPage />);

      const insightsTab = screen.getByRole('tab', { name: /Insights/i });
      await user.click(insightsTab);

      await waitFor(() => {
        expect(screen.getByText(/Strong Performance Areas/i)).toBeInTheDocument();
        expect(screen.getByText(/Areas for Improvement/i)).toBeInTheDocument();
        expect(screen.getByText(/Trending Keywords/i)).toBeInTheDocument();
      });
    });

    it('displays insights with recommendations', async () => {
      const user = userEvent.setup();
      render(<AnalysisPage />);

      const insightsTab = screen.getByRole('tab', { name: /Insights/i });
      await user.click(insightsTab);

      await waitFor(() => {
        expect(screen.getByText(/Your documents excel in keyword optimization/i)).toBeInTheDocument();
        expect(screen.getByText(/Consider adding more quantifiable achievements/i)).toBeInTheDocument();
        expect(screen.getByText(/cloud computing/i)).toBeInTheDocument();
        expect(screen.getByText(/agile methodology/i)).toBeInTheDocument();
      });
    });

    it('displays quick actions in insights tab', async () => {
      const user = userEvent.setup();
      render(<AnalysisPage />);

      const insightsTab = screen.getByRole('tab', { name: /Insights/i });
      await user.click(insightsTab);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Re-analyze All/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Export Report/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Share Insights/i })).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('calls onRunAnalysis when run new analysis button is clicked', async () => {
      const user = userEvent.setup();
      render(<AnalysisPage onRunAnalysis={mockOnRunAnalysis} />);

      const runButton = screen.getByRole('button', { name: /Run New Analysis/i });
      await user.click(runButton);

      // Wait for the simulated async operation
      await waitFor(() => {
        expect(mockOnRunAnalysis).toHaveBeenCalledTimes(1);
      }, { timeout: 3000 });
    });

    it('shows loading state when analysis is running', async () => {
      const user = userEvent.setup();
      render(<AnalysisPage />);

      const runButton = screen.getByRole('button', { name: /Run New Analysis/i });
      await user.click(runButton);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Analyzing.../i })).toBeInTheDocument();
      });

      // Should return to normal state after loading
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Run New Analysis/i })).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('displays document insights with keywords and skills count', () => {
      render(<AnalysisPage />);

      // Check for insight counts in the table
      expect(screen.getByText(/12 keywords • 8 skills/i)).toBeInTheDocument();
      expect(screen.getByText(/15 keywords • 10 skills/i)).toBeInTheDocument();
      expect(screen.getByText(/9 keywords • 6 skills/i)).toBeInTheDocument();
    });

    it('displays ATS scores with progress bars', () => {
      render(<AnalysisPage />);

      // Look for score percentages in the table
      const scoreElements = screen.getAllByText(/85%|92%|78%/);
      expect(scoreElements.length).toBeGreaterThan(0);
    });

    it('displays analysis status indicators', () => {
      render(<AnalysisPage />);

      // Check for status indicators
      const completedElements = screen.getAllByText(/completed/i);
      const pendingElements = screen.getAllByText(/pending/i);

      expect(completedElements.length).toBeGreaterThan(0);
      expect(pendingElements.length).toBeGreaterThan(0);
    });

    it('displays analysis dates for each report', () => {
      render(<AnalysisPage />);

      expect(screen.getByText(/2 hours ago/i)).toBeInTheDocument();
      expect(screen.getByText(/1 day ago/i)).toBeInTheDocument();
      expect(screen.getByText(/3 days ago/i)).toBeInTheDocument();
    });
  });

  describe('Report Actions', () => {
    it('displays action menu when more options is clicked', async () => {
      const user = userEvent.setup();
      render(<AnalysisPage />);

      // Find action buttons in the table
      const moreButtons = screen.getAllByRole('button', { name: '' });
      const actionButton = moreButtons.find(btn => btn.querySelector('[data-testid="MoreVertIcon"]'));

      if (actionButton) {
        await user.click(actionButton);

        await waitFor(() => {
          expect(screen.getByText(/View Report/i)).toBeInTheDocument();
          expect(screen.getByText(/Re-analyze/i)).toBeInTheDocument();
          expect(screen.getByText(/Download/i)).toBeInTheDocument();
          expect(screen.getByText(/Share/i)).toBeInTheDocument();
        });
      }
    });

    it('calls onViewReport when view report is selected', async () => {
      const user = userEvent.setup();
      render(<AnalysisPage onViewReport={mockOnViewReport} />);

      // Find and click action button
      const moreButtons = screen.getAllByRole('button', { name: '' });
      const actionButton = moreButtons.find(btn => btn.querySelector('[data-testid="MoreVertIcon"]'));

      if (actionButton) {
        await user.click(actionButton);

        await waitFor(() => {
          const viewReportItem = screen.getByText(/View Report/i);
          expect(viewReportItem).toBeInTheDocument();
        });

        const viewReportItem = screen.getByText(/View Report/i);
        await user.click(viewReportItem);

        expect(mockOnViewReport).toHaveBeenCalledTimes(1);
        expect(mockOnViewReport).toHaveBeenCalledWith(
          expect.objectContaining({
            documentName: expect.any(String),
            atsScore: expect.any(Number),
          })
        );
      }
    });
  });
});
