import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobMatching } from '../JobMatching';

// Mock Material-UI icons
jest.mock('@mui/icons-material', () => ({
  ...jest.requireActual('@mui/icons-material'),
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
  AutoAwesome: () => <span data-testid="sparkles-icon">✨</span>,
  LocationOn: () => <span data-testid="location-icon">📍</span>,
  AttachMoney: () => <span data-testid="dollar-icon">$</span>,
  Schedule: () => <span data-testid="clock-icon">⏰</span>,
  OpenInNew: () => <span data-testid="external-link-icon">↗</span>,
  Favorite: () => <span data-testid="heart-icon">❤</span>,
  Star: () => <span data-testid="star-icon">⭐</span>,
}));

describe('JobMatching', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders the job matching page', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText('AI Job Matching')).toBeInTheDocument();
      expect(
        screen.getByText(/Discover roles that perfectly match your skills/i)
      ).toBeInTheDocument();
    });

    it('displays all job matches', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText('Senior Community Support Worker')).toBeInTheDocument();
      expect(screen.getByText('Mental Health Peer Worker')).toBeInTheDocument();
      expect(screen.getByText('Community Outreach Coordinator')).toBeInTheDocument();
    });

    it('displays job company information', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText('Community Care Australia')).toBeInTheDocument();
      expect(screen.getByText('Queensland Health')).toBeInTheDocument();
      expect(screen.getByText('Mental Health Foundation')).toBeInTheDocument();
    });

    it('displays job locations', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText(/Brisbane, QLD/i)).toBeInTheDocument();
      expect(screen.getByText(/Gold Coast, QLD/i)).toBeInTheDocument();
      expect(screen.getByText(/Sydney, NSW/i)).toBeInTheDocument();
    });

    it('displays salary ranges', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText(/\$65,000 - \$75,000/i)).toBeInTheDocument();
      expect(screen.getByText(/\$60,000 - \$70,000/i)).toBeInTheDocument();
      expect(screen.getByText(/\$55,000 - \$65,000/i)).toBeInTheDocument();
    });

    it('displays match percentages', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText('94%')).toBeInTheDocument();
      expect(screen.getByText('87%')).toBeInTheDocument();
      expect(screen.getByText('82%')).toBeInTheDocument();
    });
  });

  describe('Job Details', () => {
    it('displays job descriptions', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(
        screen.getByText(/Join our passionate team providing support/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Support individuals with lived experience/i)
      ).toBeInTheDocument();
    });

    it('displays key requirements', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText('Certificate IV in Disability')).toBeInTheDocument();
      expect(screen.getByText('5+ years experience')).toBeInTheDocument();
      expect(screen.getByText(/Valid driver's license/i)).toBeInTheDocument();
    });

    it('displays job benefits', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText('Professional development')).toBeInTheDocument();
      expect(screen.getByText('Health insurance')).toBeInTheDocument();
      expect(screen.getByText('Flexible hours')).toBeInTheDocument();
    });

    it('displays remote badge for remote jobs', () => {
      render(<JobMatching onBack={mockOnBack} />);

      const remoteBadges = screen.getAllByText('Remote Available');
      expect(remoteBadges.length).toBeGreaterThan(0);
    });

    it('displays posted dates', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText('2 days ago')).toBeInTheDocument();
      expect(screen.getByText('5 days ago')).toBeInTheDocument();
      expect(screen.getByText('1 week ago')).toBeInTheDocument();
    });
  });

  describe('AI Insights Generation', () => {
    it('displays Get AI Insights buttons', () => {
      render(<JobMatching onBack={mockOnBack} />);

      const insightButtons = screen.getAllByText('Get AI Insights');
      expect(insightButtons.length).toBe(3); // One for each job
    });

    it('shows generating state when insight button is clicked', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobMatching onBack={mockOnBack} />);

      const insightButtons = screen.getAllByText('Get AI Insights');
      await user.click(insightButtons[0]);

      expect(screen.getByText('Generating Insights...')).toBeInTheDocument();
    });

    it('displays AI insights after generation', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobMatching onBack={mockOnBack} />);

      const insightButtons = screen.getAllByText('Get AI Insights');
      await user.click(insightButtons[0]);

      // Fast-forward time
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(screen.getByText(/AI-Generated Insights/i)).toBeInTheDocument();
      });
    });

    it('shows insights content after generation completes', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobMatching onBack={mockOnBack} />);

      const insightButtons = screen.getAllByText('Get AI Insights');
      await user.click(insightButtons[0]);

      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(
          screen.getByText(/Your Community Support Worker experience/i)
        ).toBeInTheDocument();
      });
    });

    it('only shows insights for the selected job', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobMatching onBack={mockOnBack} />);

      const insightButtons = screen.getAllByText('Get AI Insights');
      await user.click(insightButtons[0]);

      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        const insightsSections = screen.queryAllByText(/AI-Generated Insights/i);
        expect(insightsSections.length).toBe(1);
      });
    });
  });

  describe('Job Actions', () => {
    it('displays View Full Job buttons', () => {
      render(<JobMatching onBack={mockOnBack} />);

      const viewButtons = screen.getAllByText('View Full Job');
      expect(viewButtons.length).toBe(3);
    });

    it('displays Save Job buttons', () => {
      render(<JobMatching onBack={mockOnBack} />);

      const saveButtons = screen.getAllByText(/Save Job/i);
      expect(saveButtons.length).toBeGreaterThan(0);
    });

    it('shows Saved for favorited jobs', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText('Saved')).toBeInTheDocument();
    });

    it('displays Load More Matches button', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText('Load More Matches')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('calls onBack when back button is clicked', async () => {
      const user = userEvent.setup();

      render(<JobMatching onBack={mockOnBack} />);

      const backButton = screen.getByText('Back to Career Hub');
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('displays back to career hub button', () => {
      render(<JobMatching onBack={mockOnBack} />);

      expect(screen.getByText('Back to Career Hub')).toBeInTheDocument();
    });
  });

  describe('Match Score Display', () => {
    it('displays match score labels', () => {
      render(<JobMatching onBack={mockOnBack} />);

      const matchScoreLabels = screen.getAllByText('Match Score');
      expect(matchScoreLabels.length).toBe(3);
    });

    it('displays star ratings', () => {
      render(<JobMatching onBack={mockOnBack} />);

      const starIcons = screen.getAllByTestId('star-icon');
      expect(starIcons.length).toBeGreaterThan(0); // 5 stars per job
    });
  });
});
