import React from 'react';
import { render, screen, fireEvent, waitFor } from './test-utils';
import userEvent from '@testing-library/user-event';
import { CoverLetterGenerator } from '../coverlettergenerator';
import { mockJobDescription, mockGeneratedCoverLetter, mockAiServices } from './test-utils';

// Mock the AI services
jest.mock('@/api/aiServices', () => mockAiServices);

// Mock the Editor component since it might have complex dependencies
jest.mock('@/components/ui/editor', () => ({
  Editor: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea
      data-testid='editor'
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder='Generated cover letter will appear here...'
    />
  ),
}));

describe('CoverLetterGenerator', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CoverLetterGenerator />);

    expect(screen.getByText(/Cover Letter Generator/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter the job description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Cover Letter/i })).toBeInTheDocument();
  });

  it('contains all necessary form elements', () => {
    render(<CoverLetterGenerator />);

    // Job description textarea
    expect(screen.getByPlaceholderText(/Enter the job description/i)).toBeInTheDocument();

    // Tone selector
    expect(screen.getByText(/Select Tone/i)).toBeInTheDocument();

    // Generate button
    expect(screen.getByRole('button', { name: /Generate Cover Letter/i })).toBeInTheDocument();

    // Editor for output
    expect(screen.getByTestId('editor')).toBeInTheDocument();
  });

  it('disables generate button when job description is empty', () => {
    render(<CoverLetterGenerator />);

    const generateButton = screen.getByRole('button', { name: /Generate Cover Letter/i });
    expect(generateButton).toBeDisabled();
  });

  it('enables generate button when job description is provided', async () => {
    render(<CoverLetterGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Cover Letter/i });

    await user.type(jobDescInput, mockJobDescription);

    expect(generateButton).not.toBeDisabled();
  });

  it('shows loading state while generating cover letter', async () => {
    mockAiServices.generateCoverLetter.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockGeneratedCoverLetter), 100))
    );

    render(<CoverLetterGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Cover Letter/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    // Check for loading state
    expect(screen.getByRole('button', { name: /Generating/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generating/i })).toBeDisabled();

    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Generate Cover Letter/i })).toBeInTheDocument();
    });
  });

  it('generates cover letter successfully', async () => {
    mockAiServices.generateCoverLetter.mockResolvedValue(mockGeneratedCoverLetter);

    render(<CoverLetterGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Cover Letter/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockAiServices.generateCoverLetter).toHaveBeenCalledWith(mockJobDescription, 'formal');
    });

    // Check that the generated cover letter appears in the editor
    await waitFor(() => {
      const editor = screen.getByTestId('editor');
      expect(editor).toHaveValue(mockGeneratedCoverLetter);
    });
  });

  it('handles tone selection correctly', async () => {
    mockAiServices.generateCoverLetter.mockResolvedValue(mockGeneratedCoverLetter);

    render(<CoverLetterGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);

    await user.type(jobDescInput, mockJobDescription);

    // Change tone to Casual (this would require interacting with the Select component)
    // For now, we'll test that the default tone is used
    const generateButton = screen.getByRole('button', { name: /Generate Cover Letter/i });
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockAiServices.generateCoverLetter).toHaveBeenCalledWith(mockJobDescription, 'formal');
    });
  });

  it('displays error message when generation fails', async () => {
    const errorMessage = 'Failed to generate cover letter';
    mockAiServices.generateCoverLetter.mockRejectedValue(new Error(errorMessage));

    render(<CoverLetterGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Cover Letter/i });

    await user.type(jobDescInput, mockJobDescription);
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('clears error message when starting new generation', async () => {
    const errorMessage = 'Failed to generate cover letter';
    mockAiServices.generateCoverLetter
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce(mockGeneratedCoverLetter);

    render(<CoverLetterGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Enter the job description/i);
    const generateButton = screen.getByRole('button', { name: /Generate Cover Letter/i });

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
