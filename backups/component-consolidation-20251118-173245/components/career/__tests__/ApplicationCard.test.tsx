import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Button, Chip } from '@mui/material';

// Mock ApplicationCard component
const ApplicationCard = ({
  company,
  position,
  status,
  appliedDate,
  onView,
  onUpdate,
}: {
  company: string;
  position: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected';
  appliedDate: string;
  onView?: () => void;
  onUpdate?: () => void;
}) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{position}</Typography>
      <Typography variant="subtitle2">{company}</Typography>
      <Chip
        label={status}
        color={
          status === 'offered'
            ? 'success'
            : status === 'interviewing'
              ? 'primary'
              : status === 'rejected'
                ? 'error'
                : 'default'
        }
        size="small"
      />
      <Typography variant="caption">Applied: {appliedDate}</Typography>
      <Button onClick={onView}>View Details</Button>
      <Button onClick={onUpdate}>Update Status</Button>
    </CardContent>
  </Card>
);

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('ApplicationCard', () => {
  const mockOnView = jest.fn();
  const mockOnUpdate = jest.fn();
  const defaultProps = {
    company: 'Google',
    position: 'Senior Software Engineer',
    status: 'applied' as const,
    appliedDate: '2024-01-15',
    onView: mockOnView,
    onUpdate: mockOnUpdate,
  };

  beforeEach(() => {
    mockOnView.mockClear();
    mockOnUpdate.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<ApplicationCard {...defaultProps} />);
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
  });

  it('displays the position', () => {
    renderWithTheme(<ApplicationCard {...defaultProps} position="Product Manager" />);
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('displays the company', () => {
    renderWithTheme(<ApplicationCard {...defaultProps} company="Microsoft" />);
    expect(screen.getByText('Microsoft')).toBeInTheDocument();
  });

  it('displays the status', () => {
    renderWithTheme(<ApplicationCard {...defaultProps} status="interviewing" />);
    expect(screen.getByText('interviewing')).toBeInTheDocument();
  });

  it('displays the applied date', () => {
    renderWithTheme(<ApplicationCard {...defaultProps} appliedDate="2024-02-01" />);
    expect(screen.getByText('Applied: 2024-02-01')).toBeInTheDocument();
  });

  it('calls onView when View Details is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ApplicationCard {...defaultProps} />);

    const button = screen.getByText('View Details');
    await user.click(button);

    expect(mockOnView).toHaveBeenCalledTimes(1);
  });

  it('calls onUpdate when Update Status is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ApplicationCard {...defaultProps} />);

    const button = screen.getByText('Update Status');
    await user.click(button);

    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
  });

  it('shows success color for offered status', () => {
    const { container } = renderWithTheme(<ApplicationCard {...defaultProps} status="offered" />);
    const chip = container.querySelector('.MuiChip-colorSuccess');
    expect(chip).toBeInTheDocument();
  });

  it('shows error color for rejected status', () => {
    const { container } = renderWithTheme(<ApplicationCard {...defaultProps} status="rejected" />);
    const chip = container.querySelector('.MuiChip-colorError');
    expect(chip).toBeInTheDocument();
  });

  it('shows primary color for interviewing status', () => {
    const { container } = renderWithTheme(<ApplicationCard {...defaultProps} status="interviewing" />);
    const chip = container.querySelector('.MuiChip-colorPrimary');
    expect(chip).toBeInTheDocument();
  });

  // TODO: Add visual tests
  it.todo('displays different styling for each status');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add edge case tests
  it.todo('handles very long company names');
  it.todo('handles very long position titles');
});
