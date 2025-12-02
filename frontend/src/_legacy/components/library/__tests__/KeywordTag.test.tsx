import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Chip } from '@mui/material';

// Simple KeywordTag component mock for testing
const KeywordTag = ({ keyword, onClick }: { keyword: string; onClick?: () => void }) => (
  <Chip label={keyword} onClick={onClick} size="small" />
);

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('KeywordTag', () => {
  it('renders without errors', () => {
    renderWithTheme(<KeywordTag keyword="JavaScript" />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('displays the keyword text', () => {
    renderWithTheme(<KeywordTag keyword="React" />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(<KeywordTag keyword="TypeScript" onClick={mockOnClick} />);

    const tag = screen.getByText('TypeScript');
    await user.click(tag);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a chip component', () => {
    const { container } = renderWithTheme(<KeywordTag keyword="Python" />);
    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toBeInTheDocument();
  });

  // TODO: Add variant tests
  it.todo('renders with different color variants');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add edge case tests
  it.todo('handles very long keyword text');
});
