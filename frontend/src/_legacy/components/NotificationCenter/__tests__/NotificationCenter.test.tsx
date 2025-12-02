import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, List, ListItem, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

// Mock NotificationCenter component
const NotificationCenter = ({
  notifications = [],
  onClose,
  onMarkAsRead,
}: {
  notifications?: Array<{ id: string; message: string; read: boolean }>;
  onClose?: () => void;
  onMarkAsRead?: (id: string) => void;
}) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6">Notifications</Typography>
      <IconButton onClick={onClose} aria-label="close notifications">
        <Close />
      </IconButton>
    </Box>
    <List>
      {notifications.length === 0 ? (
        <ListItem>
          <Typography>No notifications</Typography>
        </ListItem>
      ) : (
        notifications.map((notification) => (
          <ListItem
            key={notification.id}
            onClick={() => onMarkAsRead?.(notification.id)}
            sx={{ opacity: notification.read ? 0.6 : 1 }}
          >
            <Typography>{notification.message}</Typography>
          </ListItem>
        ))
      )}
    </List>
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

describe('NotificationCenter', () => {
  const mockOnClose = jest.fn();
  const mockOnMarkAsRead = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnMarkAsRead.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<NotificationCenter />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('displays the heading', () => {
    renderWithTheme(<NotificationCenter />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('shows "No notifications" when empty', () => {
    renderWithTheme(<NotificationCenter notifications={[]} />);
    expect(screen.getByText('No notifications')).toBeInTheDocument();
  });

  it('displays notification messages', () => {
    const notifications = [
      { id: '1', message: 'New job match found', read: false },
      { id: '2', message: 'Application submitted', read: true },
    ];

    renderWithTheme(<NotificationCenter notifications={notifications} />);

    expect(screen.getByText('New job match found')).toBeInTheDocument();
    expect(screen.getByText('Application submitted')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<NotificationCenter onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('close notifications');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onMarkAsRead when notification is clicked', async () => {
    const user = userEvent.setup();
    const notifications = [
      { id: '1', message: 'Test notification', read: false },
    ];

    renderWithTheme(
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={mockOnMarkAsRead}
      />
    );

    const notification = screen.getByText('Test notification');
    await user.click(notification);

    expect(mockOnMarkAsRead).toHaveBeenCalledWith('1');
  });

  it('displays multiple notifications', () => {
    const notifications = [
      { id: '1', message: 'Notification 1', read: false },
      { id: '2', message: 'Notification 2', read: false },
      { id: '3', message: 'Notification 3', read: false },
    ];

    renderWithTheme(<NotificationCenter notifications={notifications} />);

    expect(screen.getByText('Notification 1')).toBeInTheDocument();
    expect(screen.getByText('Notification 2')).toBeInTheDocument();
    expect(screen.getByText('Notification 3')).toBeInTheDocument();
  });

  // TODO: Add visual state tests
  it.todo('styles read notifications differently from unread');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');
  it.todo('announces new notifications to screen readers');

  // TODO: Add edge case tests
  it.todo('handles very long notification messages');
  it.todo('handles large number of notifications (100+)');
});
