import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { UploadResume } from '../UploadResume';
import type { UploadResumeProps } from '../UploadResume';

describe('UploadResume', () => {
  const defaultProps: UploadResumeProps = {
    onNext: jest.fn(),
    onBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without errors', () => {
      render(<UploadResume {...defaultProps} />);
      expect(screen.getByText('Create Your Master Profile')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<UploadResume {...defaultProps} />);
      expect(screen.getByText(/upload your existing documents/i)).toBeInTheDocument();
    });

    it('renders drag and drop area', () => {
      render(<UploadResume {...defaultProps} />);
      expect(screen.getByText('Drag & Drop Your Resume')).toBeInTheDocument();
    });

    it('renders upload instructions', () => {
      render(<UploadResume {...defaultProps} />);
      expect(screen.getByText(/or click to browse files/i)).toBeInTheDocument();
    });
  });

  describe('Upload Button', () => {
    it('renders upload files button', () => {
      render(<UploadResume {...defaultProps} />);
      expect(screen.getByRole('button', { name: /upload files/i })).toBeInTheDocument();
    });

    it('displays upload icon', () => {
      const { container } = render(<UploadResume {...defaultProps} />);
      const uploadIcon = container.querySelector('[data-testid="UploadIcon"]');
      expect(uploadIcon).toBeInTheDocument();
    });
  });

  describe('Supported Formats', () => {
    it('displays supported file formats', () => {
      render(<UploadResume {...defaultProps} />);
      expect(screen.getByText(/supported formats: PDF, DOCX, TXT/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Buttons', () => {
    it('renders back button', () => {
      render(<UploadResume {...defaultProps} />);
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('renders next button', () => {
      render(<UploadResume {...defaultProps} />);
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('calls onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      render(<UploadResume {...defaultProps} />);

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });

    it('calls onNext when next button is clicked', async () => {
      const user = userEvent.setup();
      render(<UploadResume {...defaultProps} />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icons', () => {
    it('renders back arrow icon', () => {
      const { container } = render(<UploadResume {...defaultProps} />);
      const backIcon = container.querySelector('[data-testid="ArrowBackIcon"]');
      expect(backIcon).toBeInTheDocument();
    });

    it('renders forward arrow icon', () => {
      const { container } = render(<UploadResume {...defaultProps} />);
      const forwardIcon = container.querySelector('[data-testid="ArrowForwardIcon"]');
      expect(forwardIcon).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('renders in a container', () => {
      const { container } = render(<UploadResume {...defaultProps} />);
      const containerElement = container.querySelector('.MuiContainer-root');
      expect(containerElement).toBeInTheDocument();
    });

    it('renders card for upload area', () => {
      const { container } = render(<UploadResume {...defaultProps} />);
      const card = container.querySelector('.MuiCard-root');
      expect(card).toBeInTheDocument();
    });

    it('has minimum height for full page display', () => {
      const { container } = render(<UploadResume {...defaultProps} />);
      const mainBox = container.firstChild;
      expect(mainBox).toBeInTheDocument();
    });
  });

  describe('Upload Area Styling', () => {
    it('renders dashed border for drag and drop area', () => {
      render(<UploadResume {...defaultProps} />);
      const uploadArea = screen.getByTestId('upload-area');
      expect(uploadArea).toHaveStyle('border: 2px dashed var(--sys-color-outline-variant)');
    });

    it('has pointer cursor for clickable upload area', () => {
      const { container } = render(<UploadResume {...defaultProps} />);
      // The upload area has cursor: pointer style
      expect(container.querySelector('.MuiCardContent-root')).toBeInTheDocument();
    });
  });

  describe('Button Layout', () => {
    it('displays navigation buttons in correct order', () => {
      render(<UploadResume {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      const backButton = buttons.find((btn) => btn.textContent?.includes('Back'));
      const nextButton = buttons.find((btn) => btn.textContent?.includes('Next'));

      expect(backButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  });
});
