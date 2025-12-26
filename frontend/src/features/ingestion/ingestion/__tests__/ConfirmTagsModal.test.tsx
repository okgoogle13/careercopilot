import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from '@jest/globals';

import { ConfirmTagsModal } from '../../../../components/custom/confirm-tags-modal/ConfirmTagsModal';

describe('ConfirmTagsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const mockData = {
    fileId: 'test-file-123',
    fileName: 'resume.pdf',
    fileSizeBytes: 1048576, // 1 MB
    suggestedTags: {
      roleType: 'Software Engineer',
      subsectors: ['Technology', 'Web Development'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders when open', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('Confirm Document Details')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(
        <ConfirmTagsModal
          open={false}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.queryByText('Confirm Document Details')).not.toBeInTheDocument();
    });

    it('displays dialog title', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('Confirm Document Details')).toBeInTheDocument();
    });
  });

  describe('File Information', () => {
    it('displays file name', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    });

    it('displays formatted file size', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('1 MB')).toBeInTheDocument();
    });

    it('displays file information section', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('File Information')).toBeInTheDocument();
    });
  });

  describe('AI Suggestions Form', () => {
    it('displays AI suggestions heading', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('Confirm AI Suggestions')).toBeInTheDocument();
    });

    it('pre-fills role type from suggested tags', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      const roleInput = screen.getByLabelText('Primary Role Type');
      expect(roleInput).toHaveValue('Software Engineer');
    });

    it('pre-fills subsectors from suggested tags', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      const subsectorsInput = screen.getByLabelText('Industry Subsectors');
      expect(subsectorsInput).toHaveValue('Technology, Web Development');
    });

    it('allows editing role type', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      const roleInput = screen.getByLabelText('Primary Role Type');
      await user.clear(roleInput);
      await user.type(roleInput, 'Senior Developer');

      expect(roleInput).toHaveValue('Senior Developer');
    });

    it('allows editing subsectors', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      const subsectorsInput = screen.getByLabelText('Industry Subsectors');
      await user.clear(subsectorsInput);
      await user.type(subsectorsInput, 'AI, Machine Learning');

      expect(subsectorsInput).toHaveValue('AI, Machine Learning');
    });

    it('displays helper text for subsectors', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('Enter comma-separated values')).toBeInTheDocument();
    });
  });

  describe('Document Type Selection', () => {
    it('displays document type label', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('Document Type*')).toBeInTheDocument();
    });

    it('displays all document type options', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByLabelText('Resume')).toBeInTheDocument();
      expect(screen.getByLabelText('KSC')).toBeInTheDocument();
      expect(screen.getByLabelText('Voice Profile')).toBeInTheDocument();
    });

    it('allows selecting resume option', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      await user.click(screen.getByLabelText('Resume'));
      expect(screen.getByLabelText('Resume')).toBeChecked();
    });

    it('allows selecting KSC option', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      await user.click(screen.getByLabelText('KSC'));
      expect(screen.getByLabelText('KSC')).toBeChecked();
    });

    it('allows selecting Voice Profile option', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      await user.click(screen.getByLabelText('Voice Profile'));
      expect(screen.getByLabelText('Voice Profile')).toBeChecked();
    });
  });

  describe('Form Actions', () => {
    it('displays cancel button', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('displays confirm button', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('Confirm & Extract')).toBeInTheDocument();
    });

    it('calls onClose when cancel clicked', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      await user.click(screen.getByText('Cancel'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with correct data', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      // Select document type
      await user.click(screen.getByLabelText('Resume'));

      // Submit form
      await user.click(screen.getByText('Confirm & Extract'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          fileId: 'test-file-123',
          confirmedTags: {
            roleType: 'Software Engineer',
            subsectors: ['Technology', 'Web Development'],
          },
          documentType: 'resume',
        });
      });
    });

    it('transforms comma-separated subsectors to array', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      // Edit subsectors
      const subsectorsInput = screen.getByLabelText('Industry Subsectors');
      await user.clear(subsectorsInput);
      await user.type(subsectorsInput, 'AI, Machine Learning, Data Science');

      await user.click(screen.getByLabelText('Resume'));
      await user.click(screen.getByText('Confirm & Extract'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            confirmedTags: expect.objectContaining({
              subsectors: ['AI', 'Machine Learning', 'Data Science'],
            }),
          })
        );
      });
    });

    it('shows loading state during submission', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={true}
        />
      );

      expect(screen.getByText('Extracting...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('disables buttons during submission', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={true}
        />
      );

      expect(screen.getByText('Cancel')).toBeDisabled();
      expect(screen.getByText('Extracting...')).toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('shows error when role type is empty', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      const roleInput = screen.getByLabelText('Primary Role Type');
      await user.clear(roleInput);

      await user.click(screen.getByLabelText('Resume'));
      await user.click(screen.getByText('Confirm & Extract'));

      // Form should not submit with empty role type
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows error when subsectors is empty', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      const subsectorsInput = screen.getByLabelText('Industry Subsectors');
      await user.clear(subsectorsInput);

      await user.click(screen.getByLabelText('Resume'));
      await user.click(screen.getByText('Confirm & Extract'));

      // Form should not submit with empty subsectors
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows error when document type not selected', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      await user.click(screen.getByText('Confirm & Extract'));

      // Form should not submit without document type
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('File Size Formatting', () => {
    it('formats bytes correctly', () => {
      const data = { ...mockData, fileSizeBytes: 500 };
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={data}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('500 Bytes')).toBeInTheDocument();
    });

    it('formats KB correctly', () => {
      const data = { ...mockData, fileSizeBytes: 2048 };
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={data}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('2 KB')).toBeInTheDocument();
    });

    it('formats MB correctly', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('1 MB')).toBeInTheDocument();
    });

    it('handles 0 bytes', () => {
      const data = { ...mockData, fileSizeBytes: 0 };
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={data}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByText('0 Bytes')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible dialog', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has accessible form inputs', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      expect(screen.getByLabelText('Primary Role Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Industry Subsectors')).toBeInTheDocument();
    });

    it('has accessible radio buttons', () => {
      render(
        <ConfirmTagsModal
          open={true}
          onClose={mockOnClose}
          data={mockData}
          onSubmit={mockOnSubmit}
          isSubmitting={false}
        />
      );

      expect(screen.getByLabelText('Resume')).toHaveAttribute('type', 'radio');
      expect(screen.getByLabelText('KSC')).toHaveAttribute('type', 'radio');
      expect(screen.getByLabelText('Voice Profile')).toHaveAttribute('type', 'radio');
    });
  });
});
