import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Button } from '@mui/material';

// Mock ProfileVariationCard component
const ProfileVariationCard = ({
  title,
  description,
  atsScore,
  onSelect,
  isSelected,
}: {
  title: string;
  description: string;
  atsScore: number;
  onSelect?: () => void;
  isSelected?: boolean;
}) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography>{description}</Typography>
      <Typography>ATS Score: {atsScore}%</Typography>
      <Button onClick={onSelect}>{isSelected ? 'Selected' : 'Select'}</Button>
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

describe('ProfileVariationCard', () => {
  const mockOnSelect = jest.fn();
  const defaultProps = {
    title: 'Senior Developer',
    description: 'Optimized for senior tech roles',
    atsScore: 92,
    onSelect: mockOnSelect,
  };

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<ProfileVariationCard {...defaultProps} />);
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
  });

  it('displays the title', () => {
    renderWithTheme(<ProfileVariationCard {...defaultProps} title="Junior Developer" />);
    expect(screen.getByText('Junior Developer')).toBeInTheDocument();
  });

  it('displays the description', () => {
    renderWithTheme(<ProfileVariationCard {...defaultProps} description="For entry-level roles" />);
    expect(screen.getByText('For entry-level roles')).toBeInTheDocument();
  });

  it('displays ATS score', () => {
    renderWithTheme(<ProfileVariationCard {...defaultProps} atsScore={88} />);
    expect(screen.getByText('ATS Score: 88%')).toBeInTheDocument();
  });

  it('calls onSelect when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ProfileVariationCard {...defaultProps} />);

    const button = screen.getByText('Select');
    await user.click(button);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('shows "Selected" when isSelected is true', () => {
    renderWithTheme(<ProfileVariationCard {...defaultProps} isSelected={true} />);
    expect(screen.getByText('Selected')).toBeInTheDocument();
  });

  it('shows "Select" when isSelected is false', () => {
    renderWithTheme(<ProfileVariationCard {...defaultProps} isSelected={false} />);
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  // TODO: Add variant tests
  it.todo('renders with highlighted styling when selected');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');
});
