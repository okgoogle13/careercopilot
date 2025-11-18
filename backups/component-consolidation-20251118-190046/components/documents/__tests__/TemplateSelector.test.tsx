import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { TemplateSelector } from '../TemplateSelector';
import type { TemplateSelectorProps } from '../TemplateSelector';

describe('TemplateSelector', () => {
  const defaultProps: TemplateSelectorProps = {
    documentType: 'resume',
    onSelectTemplate: jest.fn(),
    onBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without errors', () => {
      render(<TemplateSelector {...defaultProps} />);
      expect(screen.getByText('Choose a Template')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<TemplateSelector {...defaultProps} />);
      expect(screen.getByText(/select a template to get started/i)).toBeInTheDocument();
    });

    it('renders back button', () => {
      render(<TemplateSelector {...defaultProps} />);
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });
  });

  describe('Resume Templates', () => {
    it('displays resume templates when documentType is resume', () => {
      render(<TemplateSelector {...defaultProps} documentType="resume" />);
      expect(screen.getByText('Modern Minimal')).toBeInTheDocument();
      expect(screen.getByText('Executive Pro')).toBeInTheDocument();
      expect(screen.getByText('Creative Portfolio')).toBeInTheDocument();
      expect(screen.getByText('ATS Optimized')).toBeInTheDocument();
    });

    it('does not display cover letter templates when documentType is resume', () => {
      render(<TemplateSelector {...defaultProps} documentType="resume" />);
      expect(screen.queryByText('Professional Cover')).not.toBeInTheDocument();
      expect(screen.queryByText('Modern Cover')).not.toBeInTheDocument();
    });

    it('calls onSelectTemplate with correct template ID when resume template is selected', async () => {
      const user = userEvent.setup();
      render(<TemplateSelector {...defaultProps} documentType="resume" />);

      const selectButtons = screen.getAllByRole('button', { name: /select/i });
      await user.click(selectButtons[0]); // Click first resume template

      expect(defaultProps.onSelectTemplate).toHaveBeenCalledWith('modern-minimal', 'resume');
    });
  });

  describe('Cover Letter Templates', () => {
    it('displays cover letter templates when documentType is cover-letter', () => {
      render(<TemplateSelector {...defaultProps} documentType="cover-letter" />);
      expect(screen.getByText('Professional Cover')).toBeInTheDocument();
      expect(screen.getByText('Modern Cover')).toBeInTheDocument();
    });

    it('does not display resume templates when documentType is cover-letter', () => {
      render(<TemplateSelector {...defaultProps} documentType="cover-letter" />);
      expect(screen.queryByText('Modern Minimal')).not.toBeInTheDocument();
      expect(screen.queryByText('Executive Pro')).not.toBeInTheDocument();
    });

    it('calls onSelectTemplate with correct template ID when cover letter template is selected', async () => {
      const user = userEvent.setup();
      render(<TemplateSelector {...defaultProps} documentType="cover-letter" />);

      const selectButtons = screen.getAllByRole('button', { name: /select/i });
      await user.click(selectButtons[0]); // Click first cover letter template

      expect(defaultProps.onSelectTemplate).toHaveBeenCalledWith('cover-professional', 'cover-letter');
    });
  });

  describe('Selection Criteria Templates', () => {
    it('displays resume templates when documentType is selection-criteria', () => {
      render(<TemplateSelector {...defaultProps} documentType="selection-criteria" />);
      // Selection criteria falls back to resume templates
      expect(screen.getByText('Modern Minimal')).toBeInTheDocument();
      expect(screen.getByText('Executive Pro')).toBeInTheDocument();
    });
  });

  describe('Template Selection', () => {
    it('renders select button for each template', () => {
      render(<TemplateSelector {...defaultProps} documentType="resume" />);
      const selectButtons = screen.getAllByRole('button', { name: /select/i });
      expect(selectButtons.length).toBe(4); // 4 resume templates
    });

    it('calls onSelectTemplate with correct parameters for Executive Pro', async () => {
      const user = userEvent.setup();
      render(<TemplateSelector {...defaultProps} documentType="resume" />);

      const executiveProCard = screen.getByText('Executive Pro').closest('.MuiCard-root');
      const selectButton = executiveProCard?.querySelector('button');
      if (selectButton) {
        await user.click(selectButton);
        expect(defaultProps.onSelectTemplate).toHaveBeenCalledWith('executive-pro', 'resume');
      }
    });

    it('calls onSelectTemplate with correct parameters for ATS Optimized', async () => {
      const user = userEvent.setup();
      render(<TemplateSelector {...defaultProps} documentType="resume" />);

      const atsCard = screen.getByText('ATS Optimized').closest('.MuiCard-root');
      const selectButton = atsCard?.querySelector('button');
      if (selectButton) {
        await user.click(selectButton);
        expect(defaultProps.onSelectTemplate).toHaveBeenCalledWith('ats-optimized', 'resume');
      }
    });
  });

  describe('Back Navigation', () => {
    it('calls onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      render(<TemplateSelector {...defaultProps} />);

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });

    it('renders back icon', () => {
      const { container } = render(<TemplateSelector {...defaultProps} />);
      const backIcon = container.querySelector('[data-testid="ArrowBackIcon"]');
      expect(backIcon).toBeInTheDocument();
    });
  });

  describe('Template Cards', () => {
    it('renders template cards in a grid', () => {
      const { container } = render(<TemplateSelector {...defaultProps} documentType="resume" />);
      const grid = container.querySelector('.MuiGrid-container');
      expect(grid).toBeInTheDocument();
    });

    it('each template card is clickable', () => {
      const { container } = render(<TemplateSelector {...defaultProps} documentType="resume" />);
      const cards = container.querySelectorAll('.MuiCard-root');
      cards.forEach((card) => {
        expect(card).toHaveStyle({ cursor: 'pointer' });
      });
    });
  });

  describe('Document Type Description', () => {
    it('shows resume in description when documentType is resume', () => {
      render(<TemplateSelector {...defaultProps} documentType="resume" />);
      expect(screen.getByText(/select a template to get started with your resume/i)).toBeInTheDocument();
    });

    it('shows cover-letter in description when documentType is cover-letter', () => {
      render(<TemplateSelector {...defaultProps} documentType="cover-letter" />);
      expect(screen.getByText(/select a template to get started with your cover-letter/i)).toBeInTheDocument();
    });

    it('shows selection-criteria in description when documentType is selection-criteria', () => {
      render(<TemplateSelector {...defaultProps} documentType="selection-criteria" />);
      expect(screen.getByText(/select a template to get started with your selection-criteria/i)).toBeInTheDocument();
    });
  });
});
