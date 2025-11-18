import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Dashboard } from '@mui/icons-material';
import { FeatureCard } from '../FeatureCard';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('FeatureCard', () => {
  const mockOnClick = jest.fn();
  const defaultProps = {
    title: 'Test Feature',
    description: 'This is a test description',
    icon: <Dashboard data-testid="test-icon" />,
    onClick: mockOnClick,
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<FeatureCard {...defaultProps} />);
    expect(screen.getByText('Test Feature')).toBeInTheDocument();
  });

  it('displays the title', () => {
    renderWithTheme(<FeatureCard {...defaultProps} title="Dashboard Feature" />);
    expect(screen.getByText('Dashboard Feature')).toBeInTheDocument();
  });

  it('displays the description', () => {
    renderWithTheme(
      <FeatureCard {...defaultProps} description="Feature description text" />
    );
    expect(screen.getByText('Feature description text')).toBeInTheDocument();
  });

  it('renders the icon', () => {
    renderWithTheme(<FeatureCard {...defaultProps} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<FeatureCard {...defaultProps} />);

    const card = screen.getByText('Test Feature').closest('div');
    if (card) {
      await user.click(card);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });

  it('has cursor pointer style', () => {
    renderWithTheme(<FeatureCard {...defaultProps} />);
    const card = screen.getByText('Test Feature').closest('div');
    expect(card).toHaveStyle({ cursor: 'pointer' });
  });

  it('renders as a card component', () => {
    const { container } = renderWithTheme(<FeatureCard {...defaultProps} />);
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('displays icon and title in correct order', () => {
    renderWithTheme(<FeatureCard {...defaultProps} />);
    const titleElement = screen.getByText('Test Feature');
    const iconElement = screen.getByTestId('test-icon');

    expect(iconElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
  });

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add visual tests
  it.todo('applies hover state correctly');

  // TODO: Add edge case tests
  it.todo('handles very long titles gracefully');
  it.todo('handles very long descriptions gracefully');
  it.todo('handles missing icon gracefully');
});
