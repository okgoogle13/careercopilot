import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HeroBanner } from '../HeroBanner';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('HeroBanner', () => {
  const mockOnGetStarted = jest.fn();
  const mockOnWatchDemo = jest.fn();

  beforeEach(() => {
    mockOnGetStarted.mockClear();
    mockOnWatchDemo.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<HeroBanner />);
    expect(screen.getByText(/Land Your Dream Job with AI/i)).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    renderWithTheme(<HeroBanner />);
    expect(screen.getByText('Land Your Dream Job with AI')).toBeInTheDocument();
  });

  it('displays the subheading', () => {
    renderWithTheme(<HeroBanner />);
    expect(screen.getByText(/Create compelling applications/i)).toBeInTheDocument();
  });

  it('renders Get Started button', () => {
    renderWithTheme(<HeroBanner />);
    expect(screen.getByText('Get Started Free')).toBeInTheDocument();
  });

  it('renders Watch Demo button', () => {
    renderWithTheme(<HeroBanner />);
    expect(screen.getByText('Watch Demo')).toBeInTheDocument();
  });

  it('calls onGetStarted when Get Started button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<HeroBanner onGetStarted={mockOnGetStarted} />);

    const button = screen.getByText('Get Started Free');
    await user.click(button);

    expect(mockOnGetStarted).toHaveBeenCalledTimes(1);
  });

  it('calls onWatchDemo when Watch Demo button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<HeroBanner onWatchDemo={mockOnWatchDemo} />);

    const button = screen.getByText('Watch Demo');
    await user.click(button);

    expect(mockOnWatchDemo).toHaveBeenCalledTimes(1);
  });

  it('renders FeatureHighlights component', () => {
    renderWithTheme(<HeroBanner />);
    // FeatureHighlights should render its content
    expect(screen.getByText('AI-Powered Applications')).toBeInTheDocument();
  });

  it('renders both CTA buttons', () => {
    const { container } = renderWithTheme(<HeroBanner />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add responsive tests
  it.todo('displays buttons in column on mobile');
  it.todo('displays buttons in row on desktop');
});
