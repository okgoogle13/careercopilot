import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../utils/test-utils';
import { JobMatchingComponent } from '../JobMatchingComponent';
import { aiServices } from '../../../services/aiServices';
import { mockJobMatchingResult } from '../../../utils/mockData';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../../../services/aiServices');
jest.mock('react-hot-toast');

const mockedAiServices = jest.mocked(aiServices);
const mockedToast = jest.mocked(toast);

describe('JobMatchingComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders job matching form correctly', () => {
    render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

    expect(screen.getByText('AI-Powered Job Matching')).toBeInTheDocument();
    expect(screen.getByText('Find jobs that perfectly match your skills and experience')).toBeInTheDocument();
    expect(screen.getByText('Job Preferences')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /find job matches/i })).toBeInTheDocument();
  });

  it('renders preference form fields', () => {
    render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

    expect(screen.getByLabelText(/job type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/experience level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remote preference/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location preference/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/min salary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max salary/i)).toBeInTheDocument();
  });

  it('shows error when no resume is provided', async () => {
    render(<JobMatchingComponent />);

    const findMatchesButton = screen.getByRole('button', { name: /find job matches/i });
    fireEvent.click(findMatchesButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Please select a resume first');
    });

    expect(mockedAiServices.getJobMatching).not.toHaveBeenCalled();
  });

  it('handles successful job matching', async () => {
    mockedAiServices.getJobMatching.mockResolvedValue(mockJobMatchingResult);

    render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

    // Fill in some preferences
    const jobTypeSelect = screen.getByLabelText(/job type/i);
    fireEvent.change(jobTypeSelect, { target: { value: 'full-time' } });

    const findMatchesButton = screen.getByRole('button', { name: /find job matches/i });
    fireEvent.click(findMatchesButton);

    // Check loading state
    expect(screen.getByText(/finding matches/i)).toBeInTheDocument();

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Analysis Summary')).toBeInTheDocument();
    });

    // Check that results are displayed
    expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('TechCorp Inc')).toBeInTheDocument();
    expect(screen.getByText('92% Match')).toBeInTheDocument();
    expect(screen.getByText('247')).toBeInTheDocument(); // total jobs analyzed

    expect(mockedToast.success).toHaveBeenCalledWith('Found 3 job matches!');
    expect(mockedAiServices.getJobMatching).toHaveBeenCalledWith({
      document_id: 'test-resume-123',
      preferences: {
        job_type: 'full-time',
        salary_range: undefined
      }
    });
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Failed to fetch job matches';
    mockedAiServices.getJobMatching.mockRejectedValue(new Error(errorMessage));

    render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

    const findMatchesButton = screen.getByRole('button', { name: /find job matches/i });
    fireEvent.click(findMatchesButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Failed to find job matches. Please try again.');
    });

    expect(screen.queryByText('Analysis Summary')).not.toBeInTheDocument();
  });

  it('updates preferences correctly', () => {
    render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

    const experienceLevelSelect = screen.getByLabelText(/experience level/i);
    fireEvent.change(experienceLevelSelect, { target: { value: 'senior-level' } });

    const locationInput = screen.getByLabelText(/location preference/i);
    fireEvent.change(locationInput, { target: { value: 'New York, NY' } });

    const salaryMinInput = screen.getByLabelText(/min salary/i);
    fireEvent.change(salaryMinInput, { target: { value: '120000' } });

    expect(experienceLevelSelect).toHaveValue('senior-level');
    expect(locationInput).toHaveValue('New York, NY');
    expect(salaryMinInput).toHaveValue('120000');
  });

  it('calls onJobSelected when job is selected', async () => {
    const mockOnJobSelected = jest.fn();
    mockedAiServices.getJobMatching.mockResolvedValue(mockJobMatchingResult);

    render(
      <JobMatchingComponent
        resumeDocumentId="test-resume-123"
        onJobSelected={mockOnJobSelected}
      />
    );

    const findMatchesButton = screen.getByRole('button', { name: /find job matches/i });
    fireEvent.click(findMatchesButton);

    await waitFor(() => {
      expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
    });

    const viewDetailsButton = screen.getAllByText('View Details')[0];
    fireEvent.click(viewDetailsButton);

    expect(mockOnJobSelected).toHaveBeenCalledWith('job-001');
  });

  it('displays match score with correct styling', async () => {
    mockedAiServices.getJobMatching.mockResolvedValue(mockJobMatchingResult);

    render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

    const findMatchesButton = screen.getByRole('button', { name: /find job matches/i });
    fireEvent.click(findMatchesButton);

    await waitFor(() => {
      const excellentMatch = screen.getByText('92% Match');
      expect(excellentMatch).toBeInTheDocument();
      expect(excellentMatch.closest('div')).toHaveClass('bg-green-500');

      const goodMatch = screen.getByText('87% Match');
      expect(goodMatch).toBeInTheDocument();
      expect(goodMatch.closest('div')).toHaveClass('bg-green-500');

      const potentialMatch = screen.getByText('78% Match');
      expect(potentialMatch).toBeInTheDocument();
      expect(potentialMatch.closest('div')).toHaveClass('bg-yellow-500');
    });
  });

  it('displays skills correctly', async () => {
    mockedAiServices.getJobMatching.mockResolvedValue(mockJobMatchingResult);

    render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

    const findMatchesButton = screen.getByRole('button', { name: /find job matches/i });
    fireEvent.click(findMatchesButton);

    await waitFor(() => {
      // Check required skills you have
      expect(screen.getByText('Required Skills You Have:')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();

      // Check skills to develop
      expect(screen.getByText('Skills to Develop:')).toBeInTheDocument();
      expect(screen.getByText('GraphQL')).toBeInTheDocument();
    });
  });

  it('has accessible form elements', () => {
    render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

    // Check that form elements have proper labels
    const jobTypeSelect = screen.getByLabelText(/job type/i);
    expect(jobTypeSelect).toBeInTheDocument();
    expect(jobTypeSelect.tagName).toBe('SELECT');

    const locationInput = screen.getByLabelText(/location preference/i);
    expect(locationInput).toBeInTheDocument();
    expect(locationInput.tagName).toBe('INPUT');

    // Check button accessibility
    const findMatchesButton = screen.getByRole('button', { name: /find job matches/i });
    expect(findMatchesButton).toBeInTheDocument();
    expect(findMatchesButton).not.toBeDisabled();
  });

  it('disables button when loading', async () => {
    // Mock a slow response
    mockedAiServices.getJobMatching.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve(mockJobMatchingResult), 1000))
    );

    render(<JobMatchingComponent resumeDocumentId="test-resume-123" />);

    const findMatchesButton = screen.getByRole('button', { name: /find job matches/i });
    fireEvent.click(findMatchesButton);

    // Button should be disabled during loading
    expect(screen.getByRole('button', { name: /finding matches/i })).toBeDisabled();
  });
});
