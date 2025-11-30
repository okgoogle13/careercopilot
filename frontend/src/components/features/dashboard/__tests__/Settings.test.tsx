import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Settings } from '../Settings';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('Settings', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without errors', () => {
    renderWithTheme(<Settings onBack={mockOnBack} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    renderWithTheme(<Settings onBack={mockOnBack} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage your account preferences and data')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Settings onBack={mockOnBack} />);

    const backButton = screen.getByText('Back to Dashboard');
    await user.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('displays profile information section', () => {
    renderWithTheme(<Settings onBack={mockOnBack} />);
    expect(screen.getByText('Profile Information')).toBeInTheDocument();
  });

  it('displays default profile values', () => {
    renderWithTheme(<Settings onBack={mockOnBack} />);

    const nameInput = screen.getByDisplayValue('Nishant Dougall');
    const emailInput = screen.getByDisplayValue('nishant.dougall@email.com');
    const phoneInput = screen.getByDisplayValue('+61 4XX XXX XXX');

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
  });

  it('updates profile name when input changes', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Settings onBack={mockOnBack} />);

    const nameInput = screen.getByDisplayValue('Nishant Dougall') as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'John Doe');

    expect(nameInput.value).toBe('John Doe');
  });

  it('displays notification preferences section', () => {
    renderWithTheme(<Settings onBack={mockOnBack} />);
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
    expect(screen.getByText('Email Alerts')).toBeInTheDocument();
    expect(screen.getByText('Job Match Notifications')).toBeInTheDocument();
    expect(screen.getByText('Application Updates')).toBeInTheDocument();
    expect(screen.getByText('Weekly Digest')).toBeInTheDocument();
  });

  it('displays data management section', () => {
    renderWithTheme(<Settings onBack={mockOnBack} />);
    expect(screen.getByText('Data Management')).toBeInTheDocument();
    expect(screen.getByText('Export Data')).toBeInTheDocument();
    expect(screen.getByText('Import Data')).toBeInTheDocument();
  });

  it('displays danger zone section', () => {
    renderWithTheme(<Settings onBack={mockOnBack} />);
    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('shows delete confirmation when delete button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Settings onBack={mockOnBack} />);

    const deleteButtons = screen.getAllByText('Delete Account');
    await user.click(deleteButtons[0]);

    expect(screen.getByText('Are you absolutely sure? This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Yes, Delete Forever')).toBeInTheDocument();
  });

  it('cancels delete confirmation', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Settings onBack={mockOnBack} />);

    // Click delete button
    const deleteButtons = screen.getAllByText('Delete Account');
    await user.click(deleteButtons[0]);

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    // Confirmation should be hidden
    expect(screen.queryByText('Are you absolutely sure? This action cannot be undone.')).not.toBeInTheDocument();
  });

  it('displays account information section', () => {
    renderWithTheme(<Settings onBack={mockOnBack} />);
    expect(screen.getByText('Account Information')).toBeInTheDocument();
    expect(screen.getByText('Account created')).toBeInTheDocument();
    expect(screen.getByText(/last login/i)).toBeInTheDocument();
    expect(screen.getByText('Data usage')).toBeInTheDocument();
  });

  it('renders Update Profile button', () => {
    renderWithTheme(<Settings onBack={mockOnBack} />);
    expect(screen.getByText('Update Profile')).toBeInTheDocument();
  });

  it('renders Export and Import buttons', () => {
    renderWithTheme(<Settings onBack={mockOnBack} />);
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Import')).toBeInTheDocument();
  });

  // TODO: Add switch toggle tests
  it.todo('toggles notification switches correctly');

  // TODO: Add form submission tests
  it.todo('submits profile update on button click');
  it.todo('handles export data action');
  it.todo('handles import data action');

  // TODO: Add validation tests
  it.todo('validates email format');
  it.todo('validates phone number format');

  // TODO: Add edge case tests
  it.todo('handles very long names');
  it.todo('prevents multiple simultaneous delete confirmations');
});
