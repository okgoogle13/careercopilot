import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ATSAnalysisDashboard, AnalysisResult } from '../ATSAnalysisDashboard';

// Mock the ATSScoreCircle component
jest.mock('../../../library/ATSScoreCircle', () => ({
  ATSScoreCircle: ({ score, size }: any) => (
    <div data-testid="ats-score-circle" data-score={score} data-size={size}>
      Score Circle: {score}
    </div>
  ),
}));

// Mock Material-UI icons
jest.mock('@mui/icons-material', () => ({
  ...jest.requireActual('@mui/icons-material'),
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
  ArrowRight: () => <span data-testid="arrow-right-icon">→</span>,
  GpsFixed: () => <span data-testid="gps-icon">GPS</span>,
  CheckCircle: () => <span data-testid="check-icon">✓</span>,
  Error: () => <span data-testid="error-icon">!</span>,
  TrendingUp: () => <span data-testid="trending-icon">↑</span>,
  Description: () => <span data-testid="description-icon">📄</span>,
  Lightbulb: () => <span data-testid="lightbulb-icon">💡</span>,
  Warning: () => <span data-testid="warning-icon">⚠</span>,
  Refresh: () => <span data-testid="refresh-icon">↻</span>,
}));

describe('ATSAnalysisDashboard', () => {
  const mockAnalysisData: AnalysisResult = {
    overallScore: 87,
    keywordMatches: 18,
    totalKeywords: 20,
    sections: {
      experience: 92,
      skills: 85,
      education: 88,
      formatting: 90,
    },
    matchedKeywords: ['React', 'TypeScript', 'Node.js', 'AWS', 'Python'],
    missingKeywords: ['Docker', 'Kubernetes', 'GraphQL'],
    insights: [
      {
        type: 'strength',
        title: 'Strong Technical Background',
        description: 'Your experience with modern frameworks is well-documented',
      },
      {
        type: 'improvement',
        title: 'Add Container Technologies',
        description: 'Consider adding Docker and Kubernetes to your skills',
      },
      {
        type: 'opportunity',
        title: 'Leadership Experience',
        description: 'Highlight your team leadership roles more prominently',
      },
    ],
  };

  const mockOnBack = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnContinueToTemplates = jest.fn();
  const mockOnBackToJobAnalysis = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the dashboard with analysis data', () => {
      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('ATS Compatibility Analysis')).toBeInTheDocument();
      expect(screen.getByText(/Your resume has been analyzed/i)).toBeInTheDocument();
    });

    it('displays the overall ATS score', () => {
      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('Overall ATS Score')).toBeInTheDocument();
      expect(screen.getByText('87%')).toBeInTheDocument();
    });

    it('displays keyword match statistics', () => {
      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText(/matches 18 of 20 key requirements/i)).toBeInTheDocument();
    });

    it('renders ATSScoreCircle with correct props', () => {
      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      const scoreCircle = screen.getByTestId('ats-score-circle');
      expect(scoreCircle).toHaveAttribute('data-score', '87');
      expect(scoreCircle).toHaveAttribute('data-size', 'large');
    });
  });

  describe('Score Breakdown', () => {
    it('displays all section scores', () => {
      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('Score Breakdown')).toBeInTheDocument();
      expect(screen.getByText('92%')).toBeInTheDocument(); // experience
      expect(screen.getByText('85%')).toBeInTheDocument(); // skills
      expect(screen.getByText('88%')).toBeInTheDocument(); // education
      expect(screen.getByText('90%')).toBeInTheDocument(); // formatting
    });

    it('formats section names correctly', () => {
      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('Experience')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
      expect(screen.getByText('Education')).toBeInTheDocument();
      expect(screen.getByText('Formatting')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('renders all tabs', () => {
      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Keywords')).toBeInTheDocument();
      expect(screen.getByText('Insights')).toBeInTheDocument();
    });

    it('starts with overview tab active', () => {
      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('Strengths')).toBeInTheDocument();
      expect(screen.getByText('Areas for Improvement')).toBeInTheDocument();
    });

    it('switches to keywords tab when clicked', async () => {
      const user = userEvent.setup();

      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      const keywordsTab = screen.getByText('Keywords');
      await user.click(keywordsTab);

      expect(screen.getByText('Keyword Analysis')).toBeInTheDocument();
      expect(screen.getByText(/Matched Keywords \(5\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Missing Keywords \(3\)/i)).toBeInTheDocument();
    });

    it('switches to insights tab when clicked', async () => {
      const user = userEvent.setup();

      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      const insightsTab = screen.getByText('Insights');
      await user.click(insightsTab);

      expect(screen.getByText('Actionable Insights')).toBeInTheDocument();
      expect(screen.getByText('Strong Technical Background')).toBeInTheDocument();
    });
  });

  describe('Keywords Tab', () => {
    it('displays matched keywords', async () => {
      const user = userEvent.setup();

      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      await user.click(screen.getByText('Keywords'));

      mockAnalysisData.matchedKeywords.forEach((keyword) => {
        expect(screen.getByText(keyword)).toBeInTheDocument();
      });
    });

    it('displays missing keywords', async () => {
      const user = userEvent.setup();

      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      await user.click(screen.getByText('Keywords'));

      mockAnalysisData.missingKeywords.forEach((keyword) => {
        expect(screen.getByText(keyword)).toBeInTheDocument();
      });
    });
  });

  describe('Insights Tab', () => {
    it('displays all insights', async () => {
      const user = userEvent.setup();

      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      await user.click(screen.getByText('Insights'));

      expect(screen.getByText('Strong Technical Background')).toBeInTheDocument();
      expect(screen.getByText('Add Container Technologies')).toBeInTheDocument();
      expect(screen.getByText('Leadership Experience')).toBeInTheDocument();
    });

    it('displays insight descriptions', async () => {
      const user = userEvent.setup();

      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      await user.click(screen.getByText('Insights'));

      expect(
        screen.getByText(/Your experience with modern frameworks is well-documented/i)
      ).toBeInTheDocument();
    });
  });

  describe('Navigation Callbacks', () => {
    it('calls onBackToJobAnalysis when Back button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
          onBackToJobAnalysis={mockOnBackToJobAnalysis}
        />
      );

      const backButton = screen.getByText('Back to Job Analysis');
      await user.click(backButton);

      expect(mockOnBackToJobAnalysis).toHaveBeenCalledTimes(1);
    });

    it('calls onContinueToTemplates when Continue button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
          onContinueToTemplates={mockOnContinueToTemplates}
        />
      );

      const continueButton = screen.getByText('Continue to Templates');
      await user.click(continueButton);

      expect(mockOnContinueToTemplates).toHaveBeenCalledTimes(1);
    });

    it('calls onNext when Choose Template button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ATSAnalysisDashboard
          data={mockAnalysisData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      const chooseTemplateButton = screen.getByText('Choose Template');
      await user.click(chooseTemplateButton);

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Score Colors', () => {
    it('displays high score with green color class', () => {
      const highScoreData = { ...mockAnalysisData, overallScore: 85 };

      render(
        <ATSAnalysisDashboard
          data={highScoreData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('displays medium score with yellow color class', () => {
      const mediumScoreData = { ...mockAnalysisData, overallScore: 65 };

      render(
        <ATSAnalysisDashboard
          data={mediumScoreData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('65%')).toBeInTheDocument();
    });

    it('displays low score with red color class', () => {
      const lowScoreData = { ...mockAnalysisData, overallScore: 45 };

      render(
        <ATSAnalysisDashboard
          data={lowScoreData}
          onBack={mockOnBack}
          onNext={mockOnNext}
        />
      );

      expect(screen.getByText('45%')).toBeInTheDocument();
    });
  });
});
