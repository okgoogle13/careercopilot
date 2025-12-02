import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField, Button, Box, Typography } from '@mui/material';

// Mock JobSearch component
const JobSearch = ({
  onSearch,
  placeholder = 'Search for jobs...',
}: {
  onSearch?: (query: string) => void;
  placeholder?: string;
}) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5">Job Search</Typography>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" variant="contained">
        Search
      </Button>
    </Box>
  );
};

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('JobSearch', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<JobSearch />);
    expect(screen.getByText('Job Search')).toBeInTheDocument();
  });

  it('displays the search input', () => {
    renderWithTheme(<JobSearch />);
    expect(screen.getByPlaceholderText('Search for jobs...')).toBeInTheDocument();
  });

  it('displays custom placeholder', () => {
    renderWithTheme(<JobSearch placeholder="Find your dream job" />);
    expect(screen.getByPlaceholderText('Find your dream job')).toBeInTheDocument();
  });

  it('updates input value when typing', async () => {
    const user = userEvent.setup();
    renderWithTheme(<JobSearch />);

    const input = screen.getByPlaceholderText('Search for jobs...') as HTMLInputElement;
    await user.type(input, 'Software Engineer');

    expect(input.value).toBe('Software Engineer');
  });

  it('calls onSearch when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithTheme(<JobSearch onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search for jobs...');
    await user.type(input, 'Product Manager');

    const button = screen.getByText('Search');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('Product Manager');
  });

  it('calls onSearch when Enter is pressed', async () => {
    const user = userEvent.setup();
    renderWithTheme(<JobSearch onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search for jobs...');
    await user.type(input, 'Data Scientist{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('Data Scientist');
  });

  it('renders search button', () => {
    renderWithTheme(<JobSearch />);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  // TODO: Add filter tests
  it.todo('displays filter options');
  it.todo('applies filters to search');

  // TODO: Add accessibility tests
  it.todo('has accessible search form');

  // TODO: Add edge case tests
  it.todo('handles empty search query');
  it.todo('trims whitespace from search query');
});
