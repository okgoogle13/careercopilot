import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from '@jest/globals';

import { ApplicationGeneratorModal } from '../ApplicationGeneratorModal';
import { workflowService } from '@/api/workflowService';

vi.mock('@/api/workflowService', () => ({
  workflowService: {
    generateApplicationPackage: vi.fn(),
  },
}));

describe('ApplicationGeneratorModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    jobTitle: 'Software Engineer',
    jobDescription: 'We are looking for a talented software engineer...',
    companyName: 'Tech Corp',
  };

  const mockApplicationPackage = {
    resume: { content: 'Resume content', atsScore: 85 },
    coverLetter: { content: 'Cover letter content' },
    kscResponses: [
      { criterion: 'Technical skills', response: 'Response 1' },
      { criterion: 'Communication', response: 'Response 2' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders when open', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      expect(screen.getByText('Generate Job Application')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(<ApplicationGeneratorModal {...defaultProps} open={false} />);
      expect(screen.queryByText('Generate Job Application')).not.toBeInTheDocument();
    });

    it('displays dialog title', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      expect(screen.getByText('Generate Job Application')).toBeInTheDocument();
    });

    it('displays job position information', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      expect(screen.getByText('Job Position')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });
  });

  describe('Stepper', () => {
    it('displays all stepper labels', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      expect(screen.getByText('Prepare Documents')).toBeInTheDocument();
      expect(screen.getByText('Customize Content')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('starts at step 0', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      expect(
        screen.getByText("We'll generate a complete application package with:")
      ).toBeInTheDocument();
    });
  });

  describe('Step 0: Prepare Documents', () => {
    it('displays feature list', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);

      expect(screen.getByText(/Tailored resume optimized for this job/i)).toBeInTheDocument();
      expect(screen.getByText(/Custom cover letter addressing the role/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Selection Criteria responses/i)).toBeInTheDocument();
      expect(screen.getByText(/ATS optimization analysis/i)).toBeInTheDocument();
    });

    it('displays generate package button', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      expect(screen.getByText('Generate Package')).toBeInTheDocument();
    });

    it('displays cancel button', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('calls onClose when cancel clicked', async () => {
      const user = userEvent.setup();
      render(<ApplicationGeneratorModal {...defaultProps} />);

      await user.click(screen.getByText('Cancel'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Package Generation', () => {
    it('calls workflowService.generateApplicationPackage when generate clicked', async () => {
      const user = userEvent.setup();
      (workflowService.generateApplicationPackage as any).mockResolvedValue({
        data: mockApplicationPackage,
      });

      render(<ApplicationGeneratorModal {...defaultProps} />);

      await user.click(screen.getByText('Generate Package'));

      expect(workflowService.generateApplicationPackage).toHaveBeenCalledWith({
        jobTitle: 'Software Engineer',
        jobDescription: 'We are looking for a talented software engineer...',
        companyName: 'Tech Corp',
      });
    });

    it('shows loading spinner during generation', async () => {
      const user = userEvent.setup();
      (workflowService.generateApplicationPackage as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockApplicationPackage }), 1000))
      );

      render(<ApplicationGeneratorModal {...defaultProps} />);

      await user.click(screen.getByText('Generate Package'));

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays error message on generation failure', async () => {
      const user = userEvent.setup();
      (workflowService.generateApplicationPackage as any).mockResolvedValue({
        error: true,
        message: 'Generation failed',
      });

      render(<ApplicationGeneratorModal {...defaultProps} />);

      await user.click(screen.getByText('Generate Package'));

      await waitFor(() => {
        expect(screen.getByText('Generation failed')).toBeInTheDocument();
      });
    });

    it('advances to review step after successful generation', async () => {
      const user = userEvent.setup();
      (workflowService.generateApplicationPackage as any).mockResolvedValue({
        data: mockApplicationPackage,
      });

      render(<ApplicationGeneratorModal {...defaultProps} />);

      await user.click(screen.getByText('Generate Package'));

      await waitFor(() => {
        expect(screen.getByText('Review Your Application Package')).toBeInTheDocument();
      });
    });
  });

  describe('Step 2: Review', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      (workflowService.generateApplicationPackage as any).mockResolvedValue({
        data: mockApplicationPackage,
      });

      render(<ApplicationGeneratorModal {...defaultProps} />);
      await user.click(screen.getByText('Generate Package'));

      await waitFor(() => {
        expect(screen.getByText('Review Your Application Package')).toBeInTheDocument();
      });
    });

    it('displays review heading', () => {
      expect(screen.getByText('Review Your Application Package')).toBeInTheDocument();
    });

    it('displays resume section', () => {
      expect(screen.getByText('Resume')).toBeInTheDocument();
      expect(screen.getByText(/Tailored for Software Engineer position/i)).toBeInTheDocument();
    });

    it('displays cover letter section', () => {
      expect(screen.getByText('Cover Letter')).toBeInTheDocument();
      expect(screen.getByText(/Custom message addressing company and role/i)).toBeInTheDocument();
    });

    it('displays KSC responses section when available', () => {
      expect(screen.getByText('Key Selection Criteria')).toBeInTheDocument();
      expect(screen.getByText('KSC 1')).toBeInTheDocument();
      expect(screen.getByText('KSC 2')).toBeInTheDocument();
    });

    it('displays submit application button', () => {
      expect(screen.getByText('Submit Application')).toBeInTheDocument();
    });

    it('displays helper text', () => {
      expect(
        screen.getByText('You can further customize these documents after submission')
      ).toBeInTheDocument();
    });
  });

  describe('Application Submission', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      (workflowService.generateApplicationPackage as any).mockResolvedValue({
        data: mockApplicationPackage,
      });

      render(<ApplicationGeneratorModal {...defaultProps} onSuccess={mockOnSuccess} />);
      await user.click(screen.getByText('Generate Package'));

      await waitFor(() => {
        expect(screen.getByText('Review Your Application Package')).toBeInTheDocument();
      });
    });

    it('shows progress during submission', async () => {
      const user = userEvent.setup();

      await user.click(screen.getByText('Submit Application'));

      expect(screen.getByText('Submitting your application...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows success message after submission', async () => {
      const user = userEvent.setup();

      await user.click(screen.getByText('Submit Application'));

      await waitFor(
        () => {
          expect(screen.getByText('Application Submitted!')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('calls onSuccess with application package', async () => {
      const user = userEvent.setup();

      await user.click(screen.getByText('Submit Application'));

      await waitFor(
        () => {
          expect(mockOnSuccess).toHaveBeenCalledWith(mockApplicationPackage);
        },
        { timeout: 3000 }
      );
    });

    it('closes modal after submission', async () => {
      const user = userEvent.setup();

      await user.click(screen.getByText('Submit Application'));

      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalled();
        },
        { timeout: 4000 }
      );
    });
  });

  describe('Button States', () => {
    it('disables cancel button during loading', async () => {
      const user = userEvent.setup();
      (workflowService.generateApplicationPackage as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockApplicationPackage }), 1000))
      );

      render(<ApplicationGeneratorModal {...defaultProps} />);

      await user.click(screen.getByText('Generate Package'));

      const cancelButton = screen.getByText('Cancel');
      expect(cancelButton).toBeDisabled();
    });

    it('disables generate button during loading', async () => {
      const user = userEvent.setup();
      (workflowService.generateApplicationPackage as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockApplicationPackage }), 1000))
      );

      render(<ApplicationGeneratorModal {...defaultProps} />);

      const generateButton = screen.getByText('Generate Package');
      await user.click(generateButton);

      expect(generateButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has accessible dialog', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has accessible buttons', () => {
      render(<ApplicationGeneratorModal {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onSuccess callback', async () => {
      const user = userEvent.setup();
      (workflowService.generateApplicationPackage as any).mockResolvedValue({
        data: mockApplicationPackage,
      });

      render(<ApplicationGeneratorModal {...defaultProps} onSuccess={undefined} />);

      await user.click(screen.getByText('Generate Package'));

      await waitFor(() => {
        expect(screen.getByText('Review Your Application Package')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Submit Application'));

      // Should not crash without onSuccess
      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalled();
        },
        { timeout: 4000 }
      );
    });

    it('handles package without KSC responses', async () => {
      const user = userEvent.setup();
      (workflowService.generateApplicationPackage as any).mockResolvedValue({
        data: { ...mockApplicationPackage, kscResponses: null },
      });

      render(<ApplicationGeneratorModal {...defaultProps} />);

      await user.click(screen.getByText('Generate Package'));

      await waitFor(() => {
        expect(screen.getByText('Review Your Application Package')).toBeInTheDocument();
      });

      expect(screen.queryByText('Key Selection Criteria')).not.toBeInTheDocument();
    });
  });
});
