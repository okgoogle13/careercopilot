import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { DocumentPreview } from '../DocumentPreview';
import type { DocumentPreviewProps } from '../DocumentPreview';

describe('DocumentPreview', () => {
  const defaultProps: DocumentPreviewProps = {
    documentId: 'doc-123',
    onBack: jest.fn(),
    onEdit: jest.fn(),
    onSave: jest.fn(),
    documentType: 'resume',
    templateName: 'Modern Professional',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without errors', () => {
      render(<DocumentPreview {...defaultProps} />);
      expect(screen.getByText('Modern Professional - Preview')).toBeInTheDocument();
    });

    it('renders document type in description', () => {
      render(<DocumentPreview {...defaultProps} />);
      expect(screen.getByText(/review your resume/i)).toBeInTheDocument();
    });

    it('renders preview placeholder', () => {
      render(<DocumentPreview {...defaultProps} />);
      expect(screen.getByText(/document preview content will be rendered here/i)).toBeInTheDocument();
    });
  });

  describe('Document Types', () => {
    it('renders resume type correctly', () => {
      render(<DocumentPreview {...defaultProps} documentType="resume" />);
      expect(screen.getByText(/review your resume/i)).toBeInTheDocument();
    });

    it('renders cover-letter type correctly', () => {
      render(<DocumentPreview {...defaultProps} documentType="cover-letter" />);
      expect(screen.getByText(/review your cover-letter/i)).toBeInTheDocument();
    });

    it('renders selection-criteria type correctly', () => {
      render(<DocumentPreview {...defaultProps} documentType="selection-criteria" />);
      expect(screen.getByText(/review your selection-criteria/i)).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('renders all action buttons', () => {
      render(<DocumentPreview {...defaultProps} />);
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download & save/i })).toBeInTheDocument();
    });

    it('calls onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      render(<DocumentPreview {...defaultProps} />);

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });

    it('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<DocumentPreview {...defaultProps} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      expect(defaultProps.onEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onSave when download button is clicked', async () => {
      const user = userEvent.setup();
      render(<DocumentPreview {...defaultProps} />);

      const saveButton = screen.getByRole('button', { name: /download & save/i });
      await user.click(saveButton);

      expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button Icons', () => {
    it('renders back icon', () => {
      const { container } = render(<DocumentPreview {...defaultProps} />);
      const backIcon = container.querySelector('[data-testid="ArrowBackIcon"]');
      expect(backIcon).toBeInTheDocument();
    });

    it('renders edit icon', () => {
      const { container } = render(<DocumentPreview {...defaultProps} />);
      const editIcon = container.querySelector('[data-testid="EditIcon"]');
      expect(editIcon).toBeInTheDocument();
    });

    it('renders download icon', () => {
      const { container } = render(<DocumentPreview {...defaultProps} />);
      const downloadIcon = container.querySelector('[data-testid="DownloadIcon"]');
      expect(downloadIcon).toBeInTheDocument();
    });
  });

  describe('Template Name Display', () => {
    it('displays custom template name', () => {
      render(<DocumentPreview {...defaultProps} templateName="Executive Pro" />);
      expect(screen.getByText('Executive Pro - Preview')).toBeInTheDocument();
    });

    it('updates when template name changes', () => {
      const { rerender } = render(<DocumentPreview {...defaultProps} templateName="Template A" />);
      expect(screen.getByText('Template A - Preview')).toBeInTheDocument();

      rerender(<DocumentPreview {...defaultProps} templateName="Template B" />);
      expect(screen.getByText('Template B - Preview')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('renders in a container', () => {
      const { container } = render(<DocumentPreview {...defaultProps} />);
      const containerElement = container.querySelector('.MuiContainer-root');
      expect(containerElement).toBeInTheDocument();
    });

    it('renders preview area with minimum height', () => {
      const { container } = render(<DocumentPreview {...defaultProps} />);
      const previewArea = container.querySelector('.MuiPaper-root');
      expect(previewArea).toBeInTheDocument();
    });
  });
});
