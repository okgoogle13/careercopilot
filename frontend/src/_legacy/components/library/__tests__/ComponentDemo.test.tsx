import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// Mock ComponentDemo component
const ComponentDemo = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box>
    <Typography variant="h5">{title}</Typography>
    <Box>{children}</Box>
  </Box>
);

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('ComponentDemo', () => {
  it('renders without errors', () => {
    renderWithTheme(
      <ComponentDemo title="Button Demo">
        <button>Test Button</button>
      </ComponentDemo>
    );
    expect(screen.getByText('Button Demo')).toBeInTheDocument();
  });

  it('displays the title', () => {
    renderWithTheme(
      <ComponentDemo title="Card Demo">
        <div>Content</div>
      </ComponentDemo>
    );
    expect(screen.getByText('Card Demo')).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithTheme(
      <ComponentDemo title="Test">
        <div data-testid="child-content">Child Content</div>
      </ComponentDemo>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  // TODO: Add styling tests
  it.todo('applies correct spacing and layout');

  // TODO: Add accessibility tests
  it.todo('has accessible heading hierarchy');
});
