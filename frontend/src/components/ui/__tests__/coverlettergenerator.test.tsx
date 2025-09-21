import React from 'react';
import { screen, waitFor, render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CoverLetterGenerator } from '../coverlettergenerator';
import { mockJobDescription, mockGeneratedCoverLetter } from '../utils/test-utils';

// Create mock functions
const mockGenerateCoverLetter = jest.fn();

// Mock the AI services module
jest.mock('@/api/aiServices', () => ({
  __esModule: true,
  generateCoverLetter: mockGenerateCoverLetter,
  default: {
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
      placeholder="Generated cover letter will appear here..."
    />
  ),
}));

// Increase test timeout
jest.setTimeout(15000);

// Extend expect with jest-dom matchers
import '@testing-library/jest-dom';

describe('CoverLetterGenerator', () => {
  let user: ReturnType<typeof userEvent.setup>;
  
  beforeAll(() => {
    // Setup user event with no delay for testing
    user = userEvent.setup({ delay: null });
  });
  
  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
    // Setup default mock implementation
    mockGenerateCoverLetter.mockResolvedValue(mockGeneratedCoverLetter);
  });

  it('renders without crashing', () => {
    render(<CoverLetterGenerator />);
    
    // Check for the job description heading
    expect(screen.getByText('Job Description')).toBeInTheDocument();
    
    // Check for the job description textarea
    expect(screen.getByPlaceholderText(/Paste the job description here to generate a tailored cover letter/i)).toBeInTheDocument();
    
    // Check for the generate button
    expect(screen.getByRole('button', { name: /Generate Tailored Cover Letter/i })).toBeInTheDocument();
  });

  it('contains all necessary form elements', () => {
    render(<CoverLetterGenerator />);
    
    // Check for the job description textarea
    const jobDescInput = screen.getByPlaceholderText(/Paste the job description here to generate a tailored cover letter/i);
    expect(jobDescInput).toBeInTheDocument();
    
    // Check for the tone selector using MUI's data-testid
    const toneSelector = screen.getByTestId('tone-selector');
    expect(toneSelector).toBeInTheDocument();
    
    // Check for the generate button
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Cover Letter/i });
    expect(generateButton).toBeInTheDocument();
    
    // Check for the editor
    expect(screen.getByTestId('editor')).toBeInTheDocument();
  });

  it('disables generate button when job description is empty', () => {
    render(<CoverLetterGenerator />);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Cover Letter/i });
    expect(generateButton).toHaveAttribute('disabled');
  });

  it('enables generate button when job description is not empty', async () => {
    render(<CoverLetterGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Paste the job description here to generate a tailored cover letter/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Cover Letter/i });

    await user.type(jobDescInput, 'Some job description');
    expect(generateButton).not.toHaveAttribute('disabled');
  });

  it('shows loading state while generating cover letter', async () => {
    // Mock the implementation to resolve after a delay
    mockGenerateCoverLetter.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockGeneratedCoverLetter), 100))
    );

    render(<CoverLetterGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Paste the job description here to generate a tailored cover letter/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Cover Letter/i });

    await user.type(jobDescInput, mockJobDescription);
    
    // Check if button is enabled before clicking
    expect(generateButton).not.toBeDisabled();
    
    await user.click(generateButton);

    // Button should be disabled during loading
    expect(generateButton).toBeDisabled();

    // Wait for generation to complete
    await waitFor(() => {
      // The editor should now contain the generated content
      const editor = screen.getByTestId('editor') as HTMLTextAreaElement;
      expect(editor.value).toContain(mockGeneratedCoverLetter);
    }, { timeout: 3000 });
  });

  it('allows entering job description and generates cover letter', async () => {
    mockGenerateCoverLetter.mockResolvedValue(mockGeneratedCoverLetter);

    render(<CoverLetterGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Paste the job description here to generate a tailored cover letter/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Cover Letter/i });

    // Type the job description
    await user.type(jobDescInput, mockJobDescription);
    
    // Click the generate button
    await user.click(generateButton);

    // Verify the API was called with the correct arguments
    await waitFor(() => {
      expect(mockGenerateCoverLetter).toHaveBeenCalledTimes(1);
      expect(mockGenerateCoverLetter).toHaveBeenCalledWith(mockJobDescription, 'formal');
    });

    // Check that the generated cover letter appears in the editor
    await waitFor(() => {
      const editor = screen.getByTestId('editor') as HTMLTextAreaElement;
      expect(editor.value).toContain(mockGeneratedCoverLetter);
    }, { timeout: 3000 });
  });

  it('handles tone selection correctly', async () => {
    mockGenerateCoverLetter.mockResolvedValue(mockGeneratedCoverLetter);

    render(<CoverLetterGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Paste the job description here to generate a tailored cover letter/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Cover Letter/i });
    
    // Type the job description
    await user.type(jobDescInput, mockJobDescription);
    
    // Open the select dropdown
    const select = screen.getByRole('combobox');
    await user.click(select);
    
    // Select 'Casual' from the dropdown
    const casualOption = await screen.findByRole('option', { name: /Casual/i });
    await user.click(casualOption);
    
    // Click the generate button
    await user.click(generateButton);

    // Verify the API was called with the correct tone
    await waitFor(() => {
      expect(mockGenerateCoverLetter).toHaveBeenCalledWith(mockJobDescription, 'casual');
    }, { timeout: 3000 });
  });

  it('shows error message when generation fails', async () => {
    jest.setTimeout(10000);
    const errorMessage = 'Failed to generate cover letter';
    
    // Setup the mock to reject with an error
    mockGenerateCoverLetter.mockRejectedValueOnce(new Error(errorMessage));

    render(<CoverLetterGenerator />);

    const jobDescInput = screen.getByPlaceholderText(/Paste the job description here to generate a tailored cover letter/i);
    const generateButton = screen.getByRole('button', { name: /Generate Tailored Cover Letter/i });

    // Enter job description and click generate
    await act(async () => {
      await user.type(jobDescInput, mockJobDescription);
      await user.click(generateButton);
      // Add small delay to allow state updates
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(generateButton).not.toBeDisabled(); // Button should be re-enabled after error
    }, { timeout: 5000 });
  });

  it('handles error state and allows retry', async () => {
    const errorMessage = 'Failed to generate cover letter';
    
    // Setup the mock to fail once, then succeed
    mockGenerateCoverLetter
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce(mockGeneratedCoverLetter);

    // Render the component
    const { rerender } = render(<CoverLetterGenerator />);

    // Use findByRole to wait for the button to be in the document
    const generateButton = await screen.findByRole('button', { 
      name: /Generate Tailored Cover Letter/i 
    });

    // First attempt - should fail
    await act(async () => {
      const jobDescInput = screen.getByPlaceholderText(
        /Paste the job description here to generate a tailored cover letter/i
      );
      
      // Type the job description
      await user.type(jobDescInput, mockJobDescription);
      
      // Click the generate button
      await user.click(generateButton);
      
      // Advance timers to handle any debounced inputs
      jest.advanceTimersByTime(100);
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
      // Advance timers to handle any debounced inputs
      jest.advanceTimersByTime(100);
    });

    // Wait for success and verify the editor content
    await waitFor(
      () => {
        const editor = screen.getByTestId('editor');
        expect(editor).toHaveValue(mockGeneratedCoverLetter);
        expect(mockGenerateCoverLetter).toHaveBeenCalledTimes(2);
      },
      { 
        timeout: 5000,
        onTimeout: (error) => {
          console.error('Test timed out waiting for success state');
          console.error('Current document body:', document.body.innerHTML);
          return error;
        }
      }
    );
  });
});
