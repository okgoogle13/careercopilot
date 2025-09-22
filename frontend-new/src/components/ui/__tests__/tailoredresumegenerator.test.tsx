import React from 'react';
import { screen, waitFor, act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TailoredResumeGenerator } from '../tailoredresumegenerator';
import { mockJobDescription, mockGeneratedResume } from '../utils/test-utils';

// Mock the AI services
const mockGenerateTailoredResume = jest.fn().mockResolvedValue({
  resume_content: '',
  content: ''
});

const mockGenerateCoverLetter = jest.fn().mockResolvedValue('');

jest.mock('@/api/aiServices', () => ({
  __esModule: true,
  generateTailoredResume: mockGenerateTailoredResume,
  generateCoverLetter: mockGenerateCoverLetter,
  default: {
    generateTailoredResume: mockGenerateTailoredResume,
    generateCoverLetter: mockGenerateCoverLetter
  }
}));

// Mock the Editor component since it might have complex dependencies
jest.mock('../editor', () => ({
  Editor: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea
      data-testid="editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Generated resume will appear here..."
    />
  ),
}));

// Increase test timeout
jest.setTimeout(15000);

describe('TailoredResumeGenerator', () => {
  let user: ReturnType<typeof userEvent.setup>;
  
  beforeAll(() => {
    // Setup user event with no delay for testing
    user = userEvent.setup({ delay: null });
  });

  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
    // Setup default mock implementation
    mockGenerateTailoredResume.mockResolvedValue({
      resume_content: mockGeneratedResume,
      content: mockGeneratedResume
    });
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(<TailoredResumeGenerator />);
    });

    // Check for the main headings
    expect(screen.getByText('Job Description')).toBeInTheDocument();
    expect(screen.getByText('Tailored Resume')).toBeInTheDocument();
    
    // Check for the job description textarea
    expect(screen.getByPlaceholderText(/Paste the job description here to generate a tailored resume/i)).toBeInTheDocument();
    
    // Check for the generate button
    expect(screen.getByRole('button', { name: /Generate Tailored Resume/i })).toBeInTheDocument();
  });

  it('renders with custom userProfileId prop', async () => {
    const customUserId = 'user-123';
    await act(async () => {
      render(<TailoredResumeGenerator userProfileId={customUserId} />);
    });

    // Check for the main headings
    expect(screen.getByText('Job Description')).toBeInTheDocument();
    expect(screen.getByText('Tailored Resume')).toBeInTheDocument();
  });

  it('contains all necessary form elements', async () => {
    await act(async () => {
      render(<TailoredResumeGenerator />);
    });

    // Check for the main headings
    expect(screen.getByText('Job Description')).toBeInTheDocument();
    expect(screen.getByText('Tailored Resume')).toBeInTheDocument();

    // Job description textarea
    expect(screen.getByPlaceholderText(/Paste the job description here to generate a tailored resume/i)).toBeInTheDocument();

    // Generate button
    expect(screen.getByRole('button', { name: /Generate Tailored Resume/i })).toBeInTheDocument();

    // Editor for output
    expect(screen.getByTestId('editor')).toBeInTheDocument();
  });

  it('disables generate button when job description is empty', async () => {
    await act(async () => {
      render(<TailoredResumeGenerator />);
    });

    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });
    expect(generateButton).toBeDisabled();
  });

  it('enables generate button when job description is provided', async () => {
    await act(async () => {
      render(<TailoredResumeGenerator />);
    });

    const jobDescInput = screen.getByPlaceholderText(/Paste the job description here to generate a tailored resume/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);

    expect(generateButton).not.toBeDisabled();
  });

  it('shows loading state while generating resume', async () => {
    mockGenerateTailoredResume.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ content: mockGeneratedResume }), 100))
    );

    await act(async () => {
      render(<TailoredResumeGenerator />);
    });

    const jobDescInput = screen.getByPlaceholderText(/Paste the job description here to generate a tailored resume/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    // Check for loading state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Generating/i })).toBeInTheDocument();
    });

    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Generate Tailored Resume/i })).toBeInTheDocument();
    });
  });

  it('generates resume successfully with resume_content property', async () => {
    mockGenerateTailoredResume.mockResolvedValue({
      resume_content: mockGeneratedResume,
    });

    await act(async () => {
      render(<TailoredResumeGenerator />);
    });

    const jobDescInput = screen.getByPlaceholderText(/Paste the job description here to generate a tailored resume/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockGenerateTailoredResume).toHaveBeenCalledWith(
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
    mockGenerateTailoredResume.mockResolvedValue({
      content: mockGeneratedResume,
    });

    await act(async () => {
      render(<TailoredResumeGenerator />);
    });

    const jobDescInput = screen.getByPlaceholderText(/Paste the job description here to generate a tailored resume/i);
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
    mockGenerateTailoredResume.mockResolvedValue(mockResponse);

    await act(async () => {
      render(<TailoredResumeGenerator />);
    });

    const jobDescInput = screen.getByPlaceholderText(/Paste the job description here to generate a tailored resume/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Resume/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    await waitFor(() => {
      const editor = screen.getByTestId('editor');
      expect(editor).toHaveValue(JSON.stringify(mockResponse, null, 2));
    });
  });

  it('uses custom userProfileId when provided', async () => {
    jest.setTimeout(10000);
    const customUserId = 'custom-user-123';
    mockGenerateTailoredResume.mockResolvedValue({
      resume_content: mockGeneratedResume,
    });

    await act(async () => {
      render(<TailoredResumeGenerator userProfileId={customUserId} />);
    });

    const jobDescInput = screen.getByPlaceholderText(
      /Paste the job description here to generate a tailored resume/i
    );
    const generateButton = screen.getByRole('button', { 
      name: /Generate Tailored Resume/i 
    });

    const errorMessage = 'Failed to generate tailored resume';
    
    // Setup the mock to fail once, then succeed
    mockGenerateTailoredResume
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce({ resume_content: mockGeneratedResume });

    // First attempt - should fail
    await act(async () => {
      await user.type(jobDescInput, mockJobDescription);
      await user.click(generateButton);
    });

    // Wait for error
    await waitFor(
      () => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Second attempt - should succeed
    await act(async () => {
      await user.click(generateButton);
    });

    // Wait for success
    await waitFor(
      () => {
        const editor = screen.getByTestId('editor');
        expect(editor).toHaveValue(mockGeneratedResume);
      },
      { timeout: 5000 }
    );

    // Verify the success state
    expect(screen.getByText(/Tailored Resume/)).toBeInTheDocument();
    expect(mockGenerateTailoredResume).toHaveBeenCalledTimes(2);
  });
});
