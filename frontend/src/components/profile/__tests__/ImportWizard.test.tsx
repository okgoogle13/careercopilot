import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from '@jest/globals';

import { ImportWizard } from '../ImportWizard';

describe('ImportWizard', () => {
  const mockOnClose = vi.fn();
  const mockOnImportComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders when open', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);
      expect(screen.getByText('Import from LinkedIn')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(<ImportWizard open={false} onClose={mockOnClose} />);
      expect(screen.queryByText('Import from LinkedIn')).not.toBeInTheDocument();
    });

    it('displays dialog title', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);
      expect(screen.getByText('Import from LinkedIn')).toBeInTheDocument();
    });
  });

  describe('Step 1: Connect', () => {
    it('shows connect to LinkedIn step initially', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);
      expect(screen.getByText('Connect to LinkedIn')).toBeInTheDocument();
    });

    it('displays LinkedIn icon', () => {
      const { container } = render(<ImportWizard open={true} onClose={mockOnClose} />);
      expect(container.querySelector('[data-testid="LinkedInIcon"]')).toBeInTheDocument();
    });

    it('shows security message', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);
      expect(
        screen.getByText(/Your LinkedIn data is processed securely/i)
      ).toBeInTheDocument();
    });

    it('displays connect button', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);
      expect(screen.getByText('Connect to LinkedIn')).toBeInTheDocument();
    });

    it('shows connecting message during connection', async () => {
      const user = userEvent.setup();
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      const nextButton = screen.getByText('Connect to LinkedIn');
      await user.click(nextButton);

      expect(screen.getByText('Connecting to LinkedIn...')).toBeInTheDocument();
    });

    it('shows progress indicator during connection', async () => {
      const user = userEvent.setup();
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      const nextButton = screen.getByText('Connect to LinkedIn');
      await user.click(nextButton);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('advances to preview step after successful connection', async () => {
      const user = userEvent.setup();
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      const nextButton = screen.getByText('Connect to LinkedIn');
      await user.click(nextButton);

      await waitFor(
        () => {
          expect(screen.getByText('Preview Imported Data')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Step 2: Preview Data', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      const nextButton = screen.getByText('Connect to LinkedIn');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Preview Imported Data')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('displays preview heading', () => {
      expect(screen.getByText('Preview Imported Data')).toBeInTheDocument();
    });

    it('shows instruction text', () => {
      expect(
        screen.getByText(/Review the information we found/i)
      ).toBeInTheDocument();
    });

    it('displays profile information section', () => {
      expect(screen.getByText('Profile Information')).toBeInTheDocument();
      expect(screen.getByText(/Name:/)).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('displays work experience section', () => {
      expect(screen.getByText(/Work Experience \(2 positions\)/i)).toBeInTheDocument();
    });

    it('displays education section', () => {
      expect(screen.getByText(/Education \(1 entries\)/i)).toBeInTheDocument();
    });

    it('displays skills section', () => {
      expect(screen.getByText(/Skills \(6 skills\)/i)).toBeInTheDocument();
      expect(screen.getByText(/JavaScript, React, Node.js/i)).toBeInTheDocument();
    });

    it('has checkboxes for each section', () => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThanOrEqual(4);
    });

    it('all sections are checked by default', () => {
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    it('allows unchecking profile section', async () => {
      const user = userEvent.setup();
      const checkboxes = screen.getAllByRole('checkbox');
      const profileCheckbox = checkboxes[0];

      await user.click(profileCheckbox);
      expect(profileCheckbox).not.toBeChecked();
    });

    it('allows unchecking experience section', async () => {
      const user = userEvent.setup();
      const checkboxes = screen.getAllByRole('checkbox');
      const experienceCheckbox = checkboxes[1];

      await user.click(experienceCheckbox);
      expect(experienceCheckbox).not.toBeChecked();
    });
  });

  describe('Step 3: Confirm Import', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      // Step 1: Connect
      await user.click(screen.getByText('Connect to LinkedIn'));
      await waitFor(() => {
        expect(screen.getByText('Preview Imported Data')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Step 2: Preview
      await user.click(screen.getByText('Next'));
    });

    it('displays ready to import heading', () => {
      expect(screen.getByText('Ready to Import')).toBeInTheDocument();
    });

    it('shows confirmation message', () => {
      expect(
        screen.getByText(/We're ready to import your selected LinkedIn data/i)
      ).toBeInTheDocument();
    });

    it('displays import summary', () => {
      expect(screen.getByText('Import Summary')).toBeInTheDocument();
    });

    it('lists all sections in summary', () => {
      expect(screen.getByText('Profile Information')).toBeInTheDocument();
      expect(screen.getByText('Work Experience')).toBeInTheDocument();
      expect(screen.getByText('Education')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
    });

    it('shows info alert about creating new profile', () => {
      expect(
        screen.getByText(/This will create a new profile with your imported LinkedIn data/i)
      ).toBeInTheDocument();
    });

    it('displays import data button', () => {
      expect(screen.getByText('Import Data')).toBeInTheDocument();
    });
  });

  describe('Stepper Navigation', () => {
    it('displays all step labels', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      expect(screen.getByText('Connect')).toBeInTheDocument();
      expect(screen.getByText('Preview Data')).toBeInTheDocument();
      expect(screen.getByText('Confirm Import')).toBeInTheDocument();
    });

    it('displays step descriptions', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      expect(screen.getByText('Connect to LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('Review imported information')).toBeInTheDocument();
      expect(screen.getByText('Confirm and import data')).toBeInTheDocument();
    });

    it('shows back button', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('back button is disabled on first step', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);
      const backButton = screen.getByText('Back');
      expect(backButton).toBeDisabled();
    });

    it('back button works on subsequent steps', async () => {
      const user = userEvent.setup();
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      // Go to step 2
      await user.click(screen.getByText('Connect to LinkedIn'));
      await waitFor(() => {
        expect(screen.getByText('Preview Imported Data')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Back button should be enabled
      const backButton = screen.getByText('Back');
      expect(backButton).toBeEnabled();

      // Click back
      await user.click(backButton);

      // Should return to step 1
      await waitFor(() => {
        expect(screen.getByText('Connect to LinkedIn')).toBeInTheDocument();
      });
    });
  });

  describe('Dialog Actions', () => {
    it('displays cancel button', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('calls onClose when cancel button clicked', async () => {
      const user = userEvent.setup();
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      await user.click(screen.getByText('Cancel'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('disables buttons during connection', async () => {
      const user = userEvent.setup();
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      const nextButton = screen.getByText('Connect to LinkedIn');
      await user.click(nextButton);

      const cancelButton = screen.getByText('Cancel');
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Import Completion', () => {
    it('calls onImportComplete with data', async () => {
      const user = userEvent.setup();
      render(
        <ImportWizard
          open={true}
          onClose={mockOnClose}
          onImportComplete={mockOnImportComplete}
        />
      );

      // Complete all steps
      await user.click(screen.getByText('Connect to LinkedIn'));
      await waitFor(() => {
        expect(screen.getByText('Preview Imported Data')).toBeInTheDocument();
      }, { timeout: 3000 });

      await user.click(screen.getByText('Next'));
      await user.click(screen.getByText('Import Data'));

      expect(mockOnImportComplete).toHaveBeenCalled();
    });

    it('closes dialog after import completion', async () => {
      const user = userEvent.setup();
      render(
        <ImportWizard
          open={true}
          onClose={mockOnClose}
          onImportComplete={mockOnImportComplete}
        />
      );

      // Complete all steps
      await user.click(screen.getByText('Connect to LinkedIn'));
      await waitFor(() => {
        expect(screen.getByText('Preview Imported Data')).toBeInTheDocument();
      }, { timeout: 3000 });

      await user.click(screen.getByText('Next'));
      await user.click(screen.getByText('Import Data'));

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has accessible dialog', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has accessible buttons', () => {
      render(<ImportWizard open={true} onClose={mockOnClose} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('has accessible checkboxes', async () => {
      const user = userEvent.setup();
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      await user.click(screen.getByText('Connect to LinkedIn'));
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onImportComplete callback', async () => {
      const user = userEvent.setup();
      render(<ImportWizard open={true} onClose={mockOnClose} />);

      // Should not crash when completing import without callback
      await user.click(screen.getByText('Connect to LinkedIn'));
      await waitFor(() => {
        expect(screen.getByText('Preview Imported Data')).toBeInTheDocument();
      }, { timeout: 3000 });

      await user.click(screen.getByText('Next'));
      await user.click(screen.getByText('Import Data'));

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('resets state when closed and reopened', async () => {
      const { rerender } = render(<ImportWizard open={true} onClose={mockOnClose} />);

      // Close dialog
      rerender(<ImportWizard open={false} onClose={mockOnClose} />);

      // Reopen dialog
      rerender(<ImportWizard open={true} onClose={mockOnClose} />);

      // Should show step 1 again
      expect(screen.getByText('Connect to LinkedIn')).toBeInTheDocument();
    });
  });
});
