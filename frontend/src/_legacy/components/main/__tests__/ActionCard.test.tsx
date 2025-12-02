import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Dashboard } from '@mui/icons-material';
import { ActionCard } from '../ActionCard';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('ActionCard', () => {
  const mockOnClick = jest.fn();
  const defaultProps = {
    title: 'Test Action',
    description: 'Test description',
    icon: Dashboard,
    onClick: mockOnClick,
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<ActionCard {...defaultProps} />);
    expect(screen.getByText('Test Action')).toBeInTheDocument();
  });

  it('displays the title', () => {
    renderWithTheme(<ActionCard {...defaultProps} title="Create Resume" />);
    expect(screen.getByText('Create Resume')).toBeInTheDocument();
  });

  it('displays the description', () => {
    renderWithTheme(<ActionCard {...defaultProps} description="Build your resume" />);
    expect(screen.getByText('Build your resume')).toBeInTheDocument();
  });

  it('renders default action button with "Get Started" text', () => {
    renderWithTheme(<ActionCard {...defaultProps} />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('displays custom action text when provided', () => {
    renderWithTheme(<ActionCard {...defaultProps} actionText="Start Now" />);
    expect(screen.getByText('Start Now')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ActionCard {...defaultProps} />);

    const card = screen.getByText('Test Action').closest('.MuiCard-root');
    if (card) {
      await user.click(card);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });

  it('calls onClick when action button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ActionCard {...defaultProps} />);

    const button = screen.getByText('Get Started');
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays status as "Available" by default', () => {
    renderWithTheme(<ActionCard {...defaultProps} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('displays "In Progress" status', () => {
    renderWithTheme(<ActionCard {...defaultProps} status="in-progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('displays "Completed" status', () => {
    renderWithTheme(<ActionCard {...defaultProps} status="completed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('displays "Blocked" status', () => {
    renderWithTheme(<ActionCard {...defaultProps} status="blocked" />);
    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  it('shows completed message when status is completed', () => {
    renderWithTheme(<ActionCard {...defaultProps} status="completed" />);
    expect(screen.getByText('Task completed successfully!')).toBeInTheDocument();
  });

  it('shows blocked message when status is blocked', () => {
    renderWithTheme(<ActionCard {...defaultProps} status="blocked" />);
    expect(screen.getByText(/This action is currently unavailable/i)).toBeInTheDocument();
  });

  it('does not show action button when completed', () => {
    renderWithTheme(<ActionCard {...defaultProps} status="completed" />);
    expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
  });

  it('disables button when status is blocked', () => {
    renderWithTheme(<ActionCard {...defaultProps} status="blocked" />);
    const button = screen.getByText('Get Started');
    expect(button).toBeDisabled();
  });

  it('displays AI badge when aiPowered is true', () => {
    renderWithTheme(<ActionCard {...defaultProps} aiPowered={true} />);
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('displays progress bar when progress prop is provided', () => {
    renderWithTheme(<ActionCard {...defaultProps} progress={50} />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('displays estimated time when provided', () => {
    renderWithTheme(<ActionCard {...defaultProps} estimatedTime="5 minutes" />);
    expect(screen.getByText('Estimated time: 5 minutes')).toBeInTheDocument();
  });

  it('displays badge when provided', () => {
    renderWithTheme(<ActionCard {...defaultProps} badge={{ text: 'New' }} />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('displays metadata when provided', () => {
    const metadata = [
      { label: 'Tasks', value: 5 },
      { label: 'Points', value: 100 },
    ];
    renderWithTheme(<ActionCard {...defaultProps} metadata={metadata} />);
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Points')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders secondary action button when provided', () => {
    const mockSecondaryAction = jest.fn();
    renderWithTheme(
      <ActionCard
        {...defaultProps}
        secondaryActionText="Learn More"
        onSecondaryAction={mockSecondaryAction}
      />
    );
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('disables card when disabled prop is true', () => {
    renderWithTheme(<ActionCard {...defaultProps} disabled={true} />);
    const button = screen.getByText('Get Started');
    expect(button).toBeDisabled();
  });

  // TODO: Add variant tests
  it.todo('renders with primary variant styling');
  it.todo('renders with urgent variant styling');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add edge case tests
  it.todo('handles very long titles gracefully');
  it.todo('handles progress values of 0 and 100');
});
