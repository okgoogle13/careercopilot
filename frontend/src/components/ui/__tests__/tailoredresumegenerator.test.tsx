import React from 'react';
import { render, screen, waitFor } from './test-utils';
import userEvent from '@testing-library/user-event';
import { TailoredResumeGenerator } from '../tailoredresumegenerator';
import { mockJobDescription, mockGeneratedResume, mockAiServices } from './test-utils';

// Mock the AI services
jest.mock('@/api/aiServices', () => mockAiServices);

// Mock the Editor component since it might have complex dependencies
jest.mock('@/components/ui/editor', () => ({
  Editor: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea
      data-testid='editor'
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder='Generated resume will appear here...'
    />
  ),
}));

describe('TailoredResumeGenerator', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TailoredResumeGenerator />);

    expect(screen.getByText(/Tailored Resume Generator/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter the job description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Tailored Resume/i })).toBeInTheDocument();
  });

  it('renders with custom userProfileId prop', () => {
    const customUserId = 'user-123';
    render(<TailoredResumeGenerator userProfileId={customUserId} />);

    expect(screen.getByText(/Tailored Resume Generator/i)).toBeInTheDocument();
  });

  it('contains all necessary form elements', () => {
    render(<TailoredResumeGenerator />);

    // Job description textarea
    expect(screen.getByPlaceholderText(/Enter the job description/i)).toBeInTheDocument();

    // Generate button
    expect(screen.getByRole('button', { name: /Generate Tailored Resume/i })).toBeInTheDocument();

    // Editor for output
    expect(screen.getByTestId('editor')).toBeInTheDocument();
  });

  it('disables generate button when job description is empty', () => {
    render(<TailoredResumeGenerator />);

    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });
    expect(generateButton).toBeDisabled();
  });

  it('enables generate button when job description is provided', async () => {
    render(<TailoredResumeGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);

    expect(generateButton).not.toBeDisabled();
  });

  it('shows loading state while generating resume', async () => {
    mockAiServices.generateTailoredResume.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ content: mockGeneratedResume }), 100))
    );

    render(<TailoredResumeGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    // Check for loading state
    expect(screen.getByRole('button', { name: /Generating/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generating/i })).toBeDisabled();

    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Generate Tailored Resume/i })).toBeInTheDocument();
    });
  });

  it('generates resume successfully with resume_content property', async () => {
    mockAiServices.generateTailoredResume.mockResolvedValue({
      resume_content: mockGeneratedResume,
    });

    render(<TailoredResumeGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockAiServices.generateTailoredResume).toHaveBeenCalledWith(
        mockJobDescription,
        'current-user-id'
      );
    });

    // Check that the generated resume appears in the editor
    await waitFor(() => {
      const editor = screen.getByTestId('editor');
      expect(editor).toHaveValue(mockGeneratedResume);
    });
  });

  it('generates resume successfully with content property', async () => {
    mockAiServices.generateTailoredResume.mockResolvedValue({
      content: mockGeneratedResume,
    });

    render(<TailoredResumeGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    await waitFor(() => {
      const editor = screen.getByTestId('editor');
      expect(editor).toHaveValue(mockGeneratedResume);
    });
  });

  it('handles response with no specific content property by stringifying', async () => {
    const mockResponse = {
      data: 'some data',
      status: 'success',
      resume: mockGeneratedResume,
    };
    mockAiServices.generateTailoredResume.mockResolvedValue(mockResponse);

    render(<TailoredResumeGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    await waitFor(() => {
      const editor = screen.getByTestId('editor');
      expect(editor).toHaveValue(JSON.stringify(mockResponse, null, 2));
    });
  });

  it('uses custom userProfileId when provided', async () => {
    const customUserId = 'custom-user-123';
    mockAiServices.generateTailoredResume.mockResolvedValue({
      resume_content: mockGeneratedResume,
    });

    render(<TailoredResumeGenerator userProfileId={customUserId} />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockAiServices.generateTailoredResume).toHaveBeenCalledWith(
        mockJobDescription,
        customUserId
      );
    });
  });

  it('displays error message when generation fails', async () => {
    const errorMessage = 'Failed to generate tailored resume';
    mockAiServices.generateTailoredResume.mockRejectedValue(new Error(errorMessage));

    render(<TailoredResumeGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('clears error message when starting new generation', async () => {
    const errorMessage = 'Failed to generate tailored resume';
    mockAiServices.generateTailoredResume
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce({ resume_content: mockGeneratedResume });

    render(<TailoredResumeGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);

    // First generation fails
    await user.click(generateButton);
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Second generation succeeds and clears error
    await user.click(generateButton);
    await waitFor(() => {
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    });
  });
});
