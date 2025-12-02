import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DashboardStats } from '../DashboardStats';
import * as aiServices from '../../../../../api/aiServices';

// Mock the API services
jest.mock('../../../../../api/aiServices');

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('DashboardStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without errors', () => {
    renderWithTheme(<DashboardStats />);
    expect(screen.getByText('One-Click Application Prep')).toBeInTheDocument();
  });

  it('displays both action cards', () => {
    renderWithTheme(<DashboardStats />);
    expect(screen.getByText('One-Click Application Prep')).toBeInTheDocument();
    expect(screen.getByText('Scan Inbox for Jobs')).toBeInTheDocument();
  });

  it('displays application prep description', () => {
    renderWithTheme(<DashboardStats />);
    expect(
      screen.getByText(/Generate a complete application package/i)
    ).toBeInTheDocument();
  });

  it('displays email scanning description', () => {
    renderWithTheme(<DashboardStats />);
    expect(
      screen.getByText(/Automatically scan your email for job opportunities/i)
    ).toBeInTheDocument();
  });

  it('has textarea for job description', () => {
    renderWithTheme(<DashboardStats />);
    expect(
      screen.getByPlaceholderText('Paste the job description here...')
    ).toBeInTheDocument();
  });

  it('updates textarea value when typing', async () => {
    const user = userEvent.setup();
    renderWithTheme(<DashboardStats />);

    const textarea = screen.getByPlaceholderText(
      'Paste the job description here...'
    ) as HTMLTextAreaElement;

    await user.type(textarea, 'Software Engineer position');
    expect(textarea.value).toBe('Software Engineer position');
  });

  it('disables prepare button when textarea is empty', () => {
    renderWithTheme(<DashboardStats />);
    const button = screen.getByText('Prepare Application Package');
    expect(button).toBeDisabled();
  });

  it('enables prepare button when textarea has content', async () => {
    const user = userEvent.setup();
    renderWithTheme(<DashboardStats />);

    const textarea = screen.getByPlaceholderText('Paste the job description here...');
    await user.type(textarea, 'Job description');

    const button = screen.getByText('Prepare Application Package');
    expect(button).not.toBeDisabled();
  });

  it('calls prepareApplicationPackage API when button clicked', async () => {
    const mockResponse = {
      success: true,
      data: {
        components_generated: ['resume', 'cover_letter'],
        job_match_score: 85,
        application_strength: 'Strong',
      },
      processing_time_seconds: 2.5,
      message: 'Success',
    };

    (aiServices.prepareApplicationPackage as jest.Mock).mockResolvedValue(mockResponse);

    const user = userEvent.setup();
    renderWithTheme(<DashboardStats />);

    const textarea = screen.getByPlaceholderText('Paste the job description here...');
    await user.type(textarea, 'Senior Developer');

    const button = screen.getByText('Prepare Application Package');
    await user.click(button);

    await waitFor(() => {
      expect(aiServices.prepareApplicationPackage).toHaveBeenCalledWith('Senior Developer');
    });
  });

  it('shows loading state while preparing application', async () => {
    (aiServices.prepareApplicationPackage as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const user = userEvent.setup();
    renderWithTheme(<DashboardStats />);

    const textarea = screen.getByPlaceholderText('Paste the job description here...');
    await user.type(textarea, 'Job description');

    const button = screen.getByText('Prepare Application Package');
    await user.click(button);

    expect(screen.getByText('Preparing Application Package...')).toBeInTheDocument();
  });

  it('shows error message when API call fails', async () => {
    (aiServices.prepareApplicationPackage as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );

    const user = userEvent.setup();
    renderWithTheme(<DashboardStats />);

    const textarea = screen.getByPlaceholderText('Paste the job description here...');
    await user.type(textarea, 'Job description');

    const button = screen.getByText('Prepare Application Package');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('calls scanInboxForOpportunities when scan button clicked', async () => {
    const mockResponse = {
      success: true,
      data: {
        total_opportunities_found: 10,
        high_scoring_opportunities: 3,
        tasks_created: 3,
      },
      message: 'Success',
    };

    (aiServices.scanInboxForOpportunities as jest.Mock).mockResolvedValue(mockResponse);

    const user = userEvent.setup();
    renderWithTheme(<DashboardStats />);

    const button = screen.getByText('Scan Inbox for Opportunities');
    await user.click(button);

    await waitFor(() => {
      expect(aiServices.scanInboxForOpportunities).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state while scanning emails', async () => {
    (aiServices.scanInboxForOpportunities as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const user = userEvent.setup();
    renderWithTheme(<DashboardStats />);

    const button = screen.getByText('Scan Inbox for Opportunities');
    await user.click(button);

    expect(screen.getByText('Scanning Inbox...')).toBeInTheDocument();
  });

  it('clears job description after successful application prep', async () => {
    const mockResponse = {
      success: true,
      data: {
        components_generated: ['resume'],
        job_match_score: 80,
        application_strength: 'Good',
      },
      processing_time_seconds: 1.5,
      message: 'Success',
    };

    (aiServices.prepareApplicationPackage as jest.Mock).mockResolvedValue(mockResponse);

    const user = userEvent.setup();
    renderWithTheme(<DashboardStats />);

    const textarea = screen.getByPlaceholderText(
      'Paste the job description here...'
    ) as HTMLTextAreaElement;
    await user.type(textarea, 'Job description');

    const button = screen.getByText('Prepare Application Package');
    await user.click(button);

    await waitFor(() => {
      expect(textarea.value).toBe('');
    });
  });

  // TODO: Add validation tests
  it.todo('shows error when trying to prepare with empty description');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add edge case tests
  it.todo('handles very long job descriptions');
  it.todo('handles rapid successive button clicks');
});
