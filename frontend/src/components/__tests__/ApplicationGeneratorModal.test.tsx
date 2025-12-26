import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

import { ApplicationGeneratorModal } from '../ApplicationGeneratorModal';

describe('ApplicationGeneratorModal', () => {
  const mockOnClose = jest.fn();
  const mockOnGenerate = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onGenerate: mockOnGenerate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders when open', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      expect(screen.getByText('Generate Application')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(<ApplicationGeneratorModal {...defaultProps} open={false} />);
      expect(screen.queryByText('Generate Application')).not.toBeInTheDocument();
    });

    it('displays input fields', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      expect(screen.getByLabelText(/Job Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Resume\/CV Text/i)).toBeInTheDocument();
    });

    it('displays action buttons', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: /Generate Application/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClose when cancel clicked', async () => {
      const user = userEvent.setup();
      render(<ApplicationGeneratorModal {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /Cancel/i }));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onGenerate when generate clicked with valid inputs', async () => {
      const user = userEvent.setup();
      // Mock promise to resolve immediately
      mockOnGenerate.mockResolvedValue(undefined);

      render(<ApplicationGeneratorModal {...defaultProps} />);

      const jobInput = screen.getByLabelText(/Job Description/i);
      const resumeInput = screen.getByLabelText(/Resume\/CV Text/i);

      await user.type(jobInput, 'Software Engineer Job');
      await user.type(resumeInput, 'My Resume Content');

      const generateButton = screen.getByRole('button', { name: /Generate Application/i });
      expect(generateButton).toBeEnabled();

      await user.click(generateButton);

      expect(mockOnGenerate).toHaveBeenCalledWith('Software Engineer Job', 'My Resume Content');
    });

    it('disables generate button when inputs are empty', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      const generateButton = screen.getByRole('button', { name: /Generate Application/i });
      expect(generateButton).toBeDisabled();
    });
  });

  describe('States', () => {
    it('shows loading state', () => {
      render(<ApplicationGeneratorModal {...defaultProps} loading={true} />);
      expect(screen.getByText(/Generating.../i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Generating.../i })).toBeDisabled();
    });

    it('shows success state', () => {
      render(<ApplicationGeneratorModal {...defaultProps} success={true} />);
      expect(screen.getByText('Application Generated Successfully!')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(<ApplicationGeneratorModal {...defaultProps} error="Something went wrong" />);
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });
});
