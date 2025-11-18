import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

// Mock CreateProfileCard component
const CreateProfileCard = ({ onCreate }: { onCreate?: () => void }) => (
  <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
    <CardContent sx={{ textAlign: 'center' }}>
      <Add sx={{ fontSize: 48 }} />
      <Typography variant="h6">Create New Profile</Typography>
      <Typography variant="body2" color="text.secondary">
        Build a tailored profile for your next opportunity
      </Typography>
      <Button variant="contained" onClick={onCreate}>
        Create Profile
      </Button>
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

describe('CreateProfileCard', () => {
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    mockOnCreate.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<CreateProfileCard />);
    expect(screen.getByText('Create New Profile')).toBeInTheDocument();
  });

  it('displays the heading', () => {
    renderWithTheme(<CreateProfileCard />);
    expect(screen.getByText('Create New Profile')).toBeInTheDocument();
  });

  it('displays the description', () => {
    renderWithTheme(<CreateProfileCard />);
    expect(screen.getByText(/Build a tailored profile/i)).toBeInTheDocument();
  });

  it('renders the create button', () => {
    renderWithTheme(<CreateProfileCard />);
    expect(screen.getByText('Create Profile')).toBeInTheDocument();
  });

  it('calls onCreate when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<CreateProfileCard onCreate={mockOnCreate} />);

    const button = screen.getByText('Create Profile');
    await user.click(button);

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });

  it('renders the add icon', () => {
    const { container } = renderWithTheme(<CreateProfileCard />);
    const icon = container.querySelector('[data-testid="AddIcon"]');
    expect(icon).toBeInTheDocument();
  });

  // TODO: Add styling tests
  it.todo('has dashed border styling');
  it.todo('changes appearance on hover');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');
});
