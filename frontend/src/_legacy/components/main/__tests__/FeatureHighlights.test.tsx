import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FeatureHighlights } from '../FeatureHighlights';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('FeatureHighlights', () => {
  it('renders without errors', () => {
    renderWithTheme(<FeatureHighlights />);
    expect(screen.getByText('AI-Powered Applications')).toBeInTheDocument();
  });

  it('displays all four features', () => {
    renderWithTheme(<FeatureHighlights />);

    expect(screen.getByText('AI-Powered Applications')).toBeInTheDocument();
    expect(screen.getByText('Smart Job Matching')).toBeInTheDocument();
    expect(screen.getByText('Track Progress')).toBeInTheDocument();
    expect(screen.getByText('Interview Prep')).toBeInTheDocument();
  });

  it('displays feature descriptions', () => {
    renderWithTheme(<FeatureHighlights />);

    expect(screen.getByText(/Generate tailored resumes/i)).toBeInTheDocument();
    expect(screen.getByText(/Find opportunities that match/i)).toBeInTheDocument();
    expect(screen.getByText(/Monitor your application success/i)).toBeInTheDocument();
    expect(screen.getByText(/Practice with AI-generated questions/i)).toBeInTheDocument();
  });

  it('renders icons for all features', () => {
    const { container } = renderWithTheme(<FeatureHighlights />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(4);
  });

  it('renders in a grid layout', () => {
    const { container } = renderWithTheme(<FeatureHighlights />);
    const grid = container.querySelector('.MuiGrid-container');
    expect(grid).toBeInTheDocument();
  });

  // TODO: Add responsive tests
  it.todo('displays features in 4 columns on desktop');
  it.todo('displays features in 2 columns on tablet');
  it.todo('displays features in 1 column on mobile');
});
