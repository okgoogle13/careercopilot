import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobInput } from '../JobInput';

// Mock Material-UI components
jest.mock('@mui/icons-material', () => ({
  ...jest.requireActual('@mui/icons-material'),
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
  Link: () => <span data-testid="link-icon">🔗</span>,
  Description: () => <span data-testid="file-icon">📄</span>,
  AutorenewRounded: () => <span data-testid="loader-icon">⟳</span>,
  OpenInNew: () => <span data-testid="external-link-icon">↗</span>,
}));

describe('JobInput', () => {
  const mockOnAnalyze = jest.fn();
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
    it('renders the job input page', () => {
      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      expect(screen.getByText('Analyze the Job')).toBeInTheDocument();
      expect(
        screen.getByText(/Provide the job details so we can optimize your document/i)
      ).toBeInTheDocument();
    });

    it('displays tab navigation', () => {
      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      expect(screen.getByText('Job URL')).toBeInTheDocument();
      expect(screen.getByText('Job Description')).toBeInTheDocument();
    });

    it('displays back button', () => {
      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      expect(screen.getByText('Back')).toBeInTheDocument();
    });
  });

  describe('URL Tab', () => {
    it('displays URL input by default', () => {
      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      expect(screen.getByPlaceholderText(/https:\/\/example.com\/job-posting/i)).toBeInTheDocument();
    });

    it('updates URL input value when typing', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      const urlInput = screen.getByPlaceholderText(/https:\/\/example.com\/job-posting/i);
      await user.type(urlInput, 'https://example.com/jobs/123');

      expect(urlInput).toHaveValue('https://example.com/jobs/123');
    });

    it('shows validation message when valid URL is entered', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      const urlInput = screen.getByPlaceholderText(/https:\/\/example.com\/job-posting/i);
      await user.type(urlInput, 'https://example.com/jobs/123');

      expect(screen.getByText(/Valid job URL detected/i)).toBeInTheDocument();
    });

    it('does not show validation message for invalid URL', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      const urlInput = screen.getByPlaceholderText(/https:\/\/example.com\/job-posting/i);
      await user.type(urlInput, 'invalid-url');

      expect(screen.queryByText(/Valid job URL detected/i)).not.toBeInTheDocument();
    });

    it('disables analyze button when URL is empty', () => {
      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      const analyzeButton = screen.getByText('Analyze with AI');
      expect(analyzeButton).toBeDisabled();
    });

    it('enables analyze button when valid URL is entered', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      const urlInput = screen.getByPlaceholderText(/https:\/\/example.com\/job-posting/i);
      await user.type(urlInput, 'https://example.com/jobs/123');

      const analyzeButton = screen.getByText('Analyze with AI');
      expect(analyzeButton).not.toBeDisabled();
    });
  });

  describe('Job Description Tab', () => {
    it('switches to job description tab when clicked', async () => {
      const user = userEvent.setup();

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      const descriptionTab = screen.getByText('Job Description');
      await user.click(descriptionTab);

      expect(
        screen.getByPlaceholderText(/Paste the complete job description here/i)
      ).toBeInTheDocument();
    });

    it('updates job description when typing', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      await user.click(screen.getByText('Job Description'));

      const descriptionInput = screen.getByPlaceholderText(
        /Paste the complete job description here/i
      );
      const longDescription = 'A'.repeat(60); // More than 50 characters
      await user.type(descriptionInput, longDescription);

      expect(descriptionInput).toHaveValue(longDescription);
    });

    it('shows character count', async () => {
      const user = userEvent.setup();

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      await user.click(screen.getByText('Job Description'));

      expect(screen.getByText(/0\/50 characters minimum/i)).toBeInTheDocument();
    });

    it('updates character count as user types', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      await user.click(screen.getByText('Job Description'));

      const descriptionInput = screen.getByPlaceholderText(
        /Paste the complete job description here/i
      );
      await user.type(descriptionInput, 'Test description');

      expect(screen.getByText(/16\/50 characters minimum/i)).toBeInTheDocument();
    });

    it('shows validation message when description meets minimum length', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      await user.click(screen.getByText('Job Description'));

      const descriptionInput = screen.getByPlaceholderText(
        /Paste the complete job description here/i
      );
      const longDescription = 'A'.repeat(60);
      await user.type(descriptionInput, longDescription);

      expect(screen.getByText(/Job description looks good/i)).toBeInTheDocument();
    });

    it('enables analyze button when description meets minimum length', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      await user.click(screen.getByText('Job Description'));

      const descriptionInput = screen.getByPlaceholderText(
        /Paste the complete job description here/i
      );
      const longDescription = 'A'.repeat(60);
      await user.type(descriptionInput, longDescription);

      const analyzeButton = screen.getByText('Analyze with AI');
      expect(analyzeButton).not.toBeDisabled();
    });

    it('disables analyze button when description is too short', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      await user.click(screen.getByText('Job Description'));

      const descriptionInput = screen.getByPlaceholderText(
        /Paste the complete job description here/i
      );
      await user.type(descriptionInput, 'Short');

      const analyzeButton = screen.getByText('Analyze with AI');
      expect(analyzeButton).toBeDisabled();
    });
  });

  describe('Analyze Functionality', () => {
    it('calls onAnalyze with URL when analyze button is clicked on URL tab', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      const urlInput = screen.getByPlaceholderText(/https:\/\/example.com\/job-posting/i);
      await user.type(urlInput, 'https://example.com/jobs/123');

      const analyzeButton = screen.getByText('Analyze with AI');
      await user.click(analyzeButton);

      // Fast-forward time
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(mockOnAnalyze).toHaveBeenCalledWith({
          url: 'https://example.com/jobs/123',
          description: undefined,
        });
      });
    });

    it('calls onAnalyze with description when analyze button is clicked on description tab', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      await user.click(screen.getByText('Job Description'));

      const descriptionInput = screen.getByPlaceholderText(
        /Paste the complete job description here/i
      );
      const testDescription = 'A'.repeat(60);
      await user.type(descriptionInput, testDescription);

      const analyzeButton = screen.getByText('Analyze with AI');
      await user.click(analyzeButton);

      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(mockOnAnalyze).toHaveBeenCalledWith({
          url: undefined,
          description: testDescription,
        });
      });
    });

    it('shows analyzing state when analyze button is clicked', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      const urlInput = screen.getByPlaceholderText(/https:\/\/example.com\/job-posting/i);
      await user.type(urlInput, 'https://example.com/jobs/123');

      const analyzeButton = screen.getByText('Analyze with AI');
      await user.click(analyzeButton);

      expect(screen.getByText('Analyzing Job...')).toBeInTheDocument();
    });

    it('disables analyze button while analyzing', async () => {
      const user = userEvent.setup({ delay: null });

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      const urlInput = screen.getByPlaceholderText(/https:\/\/example.com\/job-posting/i);
      await user.type(urlInput, 'https://example.com/jobs/123');

      const analyzeButton = screen.getByText('Analyze with AI');
      await user.click(analyzeButton);

      const analyzingButton = screen.getByText('Analyzing Job...');
      expect(analyzingButton).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    it('calls onBack when back button is clicked', async () => {
      const user = userEvent.setup();

      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      const backButton = screen.getByText('Back');
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Features Preview', () => {
    it('displays feature preview cards', () => {
      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      expect(screen.getByText('Keyword Extraction')).toBeInTheDocument();
      expect(screen.getByText('ATS Optimization')).toBeInTheDocument();
      expect(screen.getByText('Match Analysis')).toBeInTheDocument();
    });

    it('displays feature descriptions', () => {
      render(<JobInput onAnalyze={mockOnAnalyze} onBack={mockOnBack} />);

      expect(screen.getByText(/Identify critical keywords and phrases/i)).toBeInTheDocument();
      expect(screen.getByText(/Ensure your document passes ATS systems/i)).toBeInTheDocument();
      expect(screen.getByText(/Calculate your compatibility score/i)).toBeInTheDocument();
    });
  });

  describe('Document Type Prop', () => {
    it('renders with resume document type', () => {
      render(
        <JobInput
          documentType="resume"
          onAnalyze={mockOnAnalyze}
          onBack={mockOnBack}
        />
      );

      expect(screen.getByText('Analyze the Job')).toBeInTheDocument();
    });

    it('renders with cover-letter document type', () => {
      render(
        <JobInput
          documentType="cover-letter"
          onAnalyze={mockOnAnalyze}
          onBack={mockOnBack}
        />
      );

      expect(screen.getByText('Analyze the Job')).toBeInTheDocument();
    });

    it('renders with selection-criteria document type', () => {
      render(
        <JobInput
          documentType="selection-criteria"
          onAnalyze={mockOnAnalyze}
          onBack={mockOnBack}
        />
      );

      expect(screen.getByText('Analyze the Job')).toBeInTheDocument();
    });
  });
});
