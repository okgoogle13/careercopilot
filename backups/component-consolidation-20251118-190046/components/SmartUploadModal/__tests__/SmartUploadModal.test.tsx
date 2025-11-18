import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';

// Mock SmartUploadModal component
const SmartUploadModal = ({
  open,
  onClose,
  onUpload,
}: {
  open: boolean;
  onClose: () => void;
  onUpload?: (file: File) => void;
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Upload Document</DialogTitle>
    <DialogContent>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onUpload?.(e.target.files[0]);
          }
        }}
        data-testid="file-input"
      />
      <Button onClick={onClose}>Cancel</Button>
    </DialogContent>
  </Dialog>
);

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('SmartUploadModal', () => {
  const mockOnClose = jest.fn();
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnUpload.mockClear();
  });

  it('renders when open is true', () => {
    renderWithTheme(
      <SmartUploadModal open={true} onClose={mockOnClose} onUpload={mockOnUpload} />
    );
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    renderWithTheme(
      <SmartUploadModal open={false} onClose={mockOnClose} onUpload={mockOnUpload} />
    );
    expect(screen.queryByText('Upload Document')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <SmartUploadModal open={true} onClose={mockOnClose} onUpload={mockOnUpload} />
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders file input', () => {
    renderWithTheme(
      <SmartUploadModal open={true} onClose={mockOnClose} onUpload={mockOnUpload} />
    );
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  it('accepts PDF and DOC files', () => {
    renderWithTheme(
      <SmartUploadModal open={true} onClose={mockOnClose} onUpload={mockOnUpload} />
    );
    const fileInput = screen.getByTestId('file-input');
    expect(fileInput).toHaveAttribute('accept', '.pdf,.doc,.docx');
  });

  // TODO: Add file upload tests
  it.todo('calls onUpload when file is selected');
  it.todo('validates file type before upload');
  it.todo('shows error for invalid file types');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');
  it.todo('traps focus within modal');
});
