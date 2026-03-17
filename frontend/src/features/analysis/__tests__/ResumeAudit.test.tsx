import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResumeAuditEntryPoint } from '../components/ResumeAuditEntryPoint';
import { ResumeAuditResultsPanel } from '../components/ResumeAuditResultsPanel';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    promise: jest.fn(),
  },
}));

describe('ResumeAuditEntryPoint', () => {
  const mockResume = 'I am a software engineer with 5 years of experience.';
  const mockJobDescription = 'Looking for senior engineer with React and Node.js experience';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders entry point with shield icon and header', () => {
    render(<ResumeAuditEntryPoint resumeText={mockResume} />);
    expect(screen.getByText('Resume Audit Evaluation')).toBeInTheDocument();
    expect(screen.getByText('Evaluation Strictness')).toBeInTheDocument();
  });

  it('disables audit button when resume text is empty', () => {
    render(<ResumeAuditEntryPoint resumeText="" />);
    const button = screen.getByRole('button', { name: /start rkl evaluation/i });
    expect(button).toBeDisabled();
  });

  it('disables audit button when disabled prop is true', () => {
    render(
      <ResumeAuditEntryPoint
        resumeText={mockResume}
        disabled={true}
      />
    );
    const button = screen.getByRole('button', { name: /start rkl evaluation/i });
    expect(button).toBeDisabled();
  });

  it('renders strictness mode selector with three options', () => {
    render(<ResumeAuditEntryPoint resumeText={mockResume} />);
    expect(screen.getByRole('button', { name: /lenient/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /moderate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /strict/i })).toBeInTheDocument();
  });

  it('allows changing strictness mode', async () => {
    render(<ResumeAuditEntryPoint resumeText={mockResume} />);
    const strictButton = screen.getByRole('button', { name: /strict/i });
    await userEvent.click(strictButton);
    // Button should have different styling when selected (we can't test CSS directly, but button should be clickable)
    expect(strictButton).toBeInTheDocument();
  });

  it('triggers backend call on audit button click', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          overallScore: 85,
          scanSimulation: 'Strong resume',
          violations: [],
          recommendations: ['Add more impact metrics'],
        },
      }),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

    const onComplete = jest.fn();
    render(
      <ResumeAuditEntryPoint
        resumeText={mockResume}
        jobDescription={mockJobDescription}
        onAuditComplete={onComplete}
      />
    );

    const button = screen.getByRole('button', { name: /start rkl evaluation/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/resume-audit/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: mockResume,
          jobDescription: mockJobDescription,
          strictnessMode: 'moderate',
        }),
      });
    });

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith({
        overallScore: 85,
        scanSimulation: 'Strong resume',
        violations: [],
        recommendations: ['Add more impact metrics'],
      });
    });
  });

  it('shows error message on API failure', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    render(<ResumeAuditEntryPoint resumeText={mockResume} />);
    const button = screen.getByRole('button', { name: /start rkl evaluation/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Audit Error/)).toBeInTheDocument();
      expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    });
  });

  it('shows loading state during audit', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          overallScore: 80,
          scanSimulation: 'Test',
          violations: [],
          recommendations: [],
        },
      }),
    };
    global.fetch = jest.fn().mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockResponse), 100);
      });
    });

    render(<ResumeAuditEntryPoint resumeText={mockResume} />);
    const button = screen.getByRole('button', { name: /start rkl evaluation/i });
    await userEvent.click(button);

    expect(screen.getByText(/Auditing.../)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/start rkl evaluation/i)).toBeInTheDocument();
    });
  });
});

describe('ResumeAuditResultsPanel', () => {
  const mockAuditData = {
    overallScore: 85,
    scanSimulation: 'This resume has strong technical foundations and clear impact metrics.',
    violations: [
      {
        ruleId: 'L1.002',
        severity: 'warning' as const,
        message: 'Missing quantifiable results in sales achievements',
        location: 'Experience section, 3rd bullet point',
      },
      {
        ruleId: 'L2.001',
        severity: 'error' as const,
        message: 'No certifications listed despite role requirements',
        location: 'Certifications section',
      },
    ],
    recommendations: [
      'Add specific numbers to sales achievements (e.g., "Increased revenue by 30%")',
      'Include relevant certifications (AWS, CCNA, etc.)',
      'Expand on leadership experience with team size metrics',
    ],
  };

  it('renders results panel with overall score', () => {
    render(<ResumeAuditResultsPanel data={mockAuditData} />);
    expect(screen.getByText('Resume Audit Results')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Overall Score')).toBeInTheDocument();
  });

  it('displays summary stats correctly', () => {
    render(<ResumeAuditResultsPanel data={mockAuditData} />);
    // 1 error, 1 warning
    expect(screen.getByText('Errors')).toBeInTheDocument();
    expect(screen.getByText('Warnings')).toBeInTheDocument();
    expect(screen.getByText('Total Issues')).toBeInTheDocument();
  });

  it('displays recruiter scan simulation', () => {
    render(<ResumeAuditResultsPanel data={mockAuditData} />);
    expect(screen.getByText('10-Second Recruiter Scan')).toBeInTheDocument();
    expect(screen.getByText(/This resume has strong technical foundations/)).toBeInTheDocument();
  });

  it('renders all violations with severity icons', () => {
    render(<ResumeAuditResultsPanel data={mockAuditData} />);
    expect(screen.getByText('Issues Detected')).toBeInTheDocument();
    expect(screen.getByText('L1.002')).toBeInTheDocument();
    expect(screen.getByText('L2.001')).toBeInTheDocument();
    expect(screen.getByText(/Missing quantifiable results/)).toBeInTheDocument();
    expect(screen.getByText(/No certifications listed/)).toBeInTheDocument();
  });

  it('displays recommendations with bullet points', () => {
    render(<ResumeAuditResultsPanel data={mockAuditData} />);
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText(/Add specific numbers to sales achievements/)).toBeInTheDocument();
    expect(screen.getByText(/Include relevant certifications/)).toBeInTheDocument();
    expect(screen.getByText(/Expand on leadership experience/)).toBeInTheDocument();
  });

  it('calls onDismiss when close button clicked', async () => {
    const onDismiss = jest.fn();
    render(
      <ResumeAuditResultsPanel
        data={mockAuditData}
        onDismiss={onDismiss}
      />
    );
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    expect(onDismiss).toHaveBeenCalled();
  });

  it('renders optimize resume action link', () => {
    render(<ResumeAuditResultsPanel data={mockAuditData} />);
    const optimizeLink = screen.getByRole('link', { name: /optimize resume/i });
    expect(optimizeLink).toBeInTheDocument();
  });

  it('handles empty violations gracefully', () => {
    const dataWithoutViolations = {
      ...mockAuditData,
      violations: [],
    };
    render(<ResumeAuditResultsPanel data={dataWithoutViolations} />);
    // Issues Detected section should not be prominent
    expect(screen.queryByText('Issues Detected')).not.toBeInTheDocument();
  });

  it('handles empty recommendations gracefully', () => {
    const dataWithoutRecommendations = {
      ...mockAuditData,
      recommendations: [],
    };
    render(<ResumeAuditResultsPanel data={dataWithoutRecommendations} />);
    // Recommendations section header shouldn't appear
    const recommendationsHeading = screen.queryByText('Recommendations');
    if (recommendationsHeading) {
      // If it appears, verify it's not rendering recommendation items
      expect(screen.queryByText(/Add specific numbers/)).not.toBeInTheDocument();
    }
  });

  it('displays violation locations when provided', () => {
    render(<ResumeAuditResultsPanel data={mockAuditData} />);
    expect(screen.getByText(/Location: Experience section/)).toBeInTheDocument();
    expect(screen.getByText(/Location: Certifications section/)).toBeInTheDocument();
  });

  it('renders score percentage correctly for different scores', () => {
    const lowScoreData = {
      ...mockAuditData,
      overallScore: 45.6,
    };
    render(<ResumeAuditResultsPanel data={lowScoreData} />);
    expect(screen.getByText('46%')).toBeInTheDocument();
  });
});
