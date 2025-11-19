import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, IconButton, Avatar } from '@mui/material';
import { AnimatedDropdown } from '../components/ui/AnimatedDropdown';
import { useState } from 'react';

/**
 * AnimatedDropdown - Dropdown menu with animated panel and staggered items
 *
 * Features click-outside detection, Escape key support, keyboard accessibility,
 * and supports both controlled and uncontrolled modes.
 */
const meta = {
  title: 'Components/AnimatedDropdown',
  component: AnimatedDropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dropdown menu component with smooth animations, staggered item entrance, and comprehensive keyboard support. Follows Material Design 3 Expressive motion principles.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnimatedDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample menu items
const basicMenuItems = [
  { label: 'Profile', value: 'profile' },
  { label: 'Settings', value: 'settings' },
  { label: 'Logout', value: 'logout' },
];

const accountMenuItems = [
  { label: 'My Account', value: 'account' },
  { label: 'Billing', value: 'billing' },
  { label: 'Preferences', value: 'preferences' },
  { label: 'Sign Out', value: 'signout' },
];

const actionMenuItems = [
  { label: 'Edit', value: 'edit' },
  { label: 'Duplicate', value: 'duplicate' },
  { label: 'Archive', value: 'archive' },
  { label: 'Delete', value: 'delete' },
];

const statusMenuItems = [
  { label: 'Active', value: 'active' },
  { label: 'Away', value: 'away' },
  { label: 'Busy', value: 'busy' },
  { label: 'Offline', value: 'offline' },
];

const longMenuItems = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Projects', value: 'projects' },
  { label: 'Tasks', value: 'tasks' },
  { label: 'Calendar', value: 'calendar' },
  { label: 'Documents', value: 'documents' },
  { label: 'Reports', value: 'reports' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Settings', value: 'settings' },
];

/**
 * Default dropdown with button trigger
 */
export const Default: Story = {
  render: () => (
    <AnimatedDropdown
      trigger={<Button variant="contained">Open Menu</Button>}
      items={basicMenuItems}
      onSelect={(value) => alert(`Selected: ${value}`)}
    />
  ),
};

/**
 * Dropdown with account menu items
 */
export const AccountMenu: Story = {
  render: () => (
    <AnimatedDropdown
      trigger={
        <Button variant="outlined" sx={{ textTransform: 'none' }}>
          My Account
        </Button>
      }
      items={accountMenuItems}
      onSelect={(value) => console.log(`Selected: ${value}`)}
    />
  ),
};

/**
 * Dropdown with action menu items
 */
export const ActionMenu: Story = {
  render: () => (
    <AnimatedDropdown
      trigger={<Button variant="text">Actions</Button>}
      items={actionMenuItems}
      onSelect={(value) => console.log(`Action: ${value}`)}
    />
  ),
};

/**
 * Dropdown with icon button trigger (three dots menu)
 */
export const WithIconButton: Story = {
  render: () => (
    <AnimatedDropdown
      trigger={
        <IconButton>
          <Box sx={{ fontSize: '1.5rem' }}>⋮</Box>
        </IconButton>
      }
      items={actionMenuItems}
      onSelect={(value) => console.log(`Selected: ${value}`)}
    />
  ),
};

/**
 * Dropdown with avatar trigger
 */
export const WithAvatar: Story = {
  render: () => (
    <AnimatedDropdown
      trigger={
        <IconButton sx={{ p: 0 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: '#a855f7' }}>JD</Avatar>
        </IconButton>
      }
      items={accountMenuItems}
      onSelect={(value) => console.log(`Selected: ${value}`)}
      placement="bottom-end"
    />
  ),
};

/**
 * All placement options
 */
export const AllPlacements: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <AnimatedDropdown
            trigger={<Button variant="outlined">Bottom Start</Button>}
            items={basicMenuItems}
            placement="bottom-start"
            onSelect={(value) => console.log(value)}
          />
          <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>bottom-start</Box>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <AnimatedDropdown
            trigger={<Button variant="outlined">Bottom End</Button>}
            items={basicMenuItems}
            placement="bottom-end"
            onSelect={(value) => console.log(value)}
          />
          <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>bottom-end</Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <AnimatedDropdown
            trigger={<Button variant="outlined">Top Start</Button>}
            items={basicMenuItems}
            placement="top-start"
            onSelect={(value) => console.log(value)}
          />
          <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>top-start</Box>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <AnimatedDropdown
            trigger={<Button variant="outlined">Top End</Button>}
            items={basicMenuItems}
            placement="top-end"
            onSelect={(value) => console.log(value)}
          />
          <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>top-end</Box>
        </Box>
      </Box>
    </Box>
  ),
};

/**
 * Dropdown with custom width
 */
export const CustomWidth: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <AnimatedDropdown
        trigger={<Button variant="outlined">Small (150px)</Button>}
        items={basicMenuItems}
        width={150}
        onSelect={(value) => console.log(value)}
      />

      <AnimatedDropdown
        trigger={<Button variant="outlined">Large (300px)</Button>}
        items={accountMenuItems}
        width={300}
        onSelect={(value) => console.log(value)}
      />
    </Box>
  ),
};

/**
 * Dropdown with disabled items
 */
export const WithDisabledItems: Story = {
  render: () => (
    <AnimatedDropdown
      trigger={<Button variant="contained">Open Menu</Button>}
      items={[
        { label: 'Available Option', value: 'available' },
        { label: 'Disabled Option', value: 'disabled', disabled: true },
        { label: 'Another Available', value: 'another' },
        { label: 'Also Disabled', value: 'also-disabled', disabled: true },
      ]}
      onSelect={(value) => alert(`Selected: ${value}`)}
    />
  ),
};

/**
 * Dropdown with icons
 */
export const WithIcons: Story = {
  render: () => (
    <AnimatedDropdown
      trigger={<Button variant="outlined">User Menu</Button>}
      items={[
        { label: 'Profile', value: 'profile', icon: <Box sx={{ fontSize: '1.25rem' }}>👤</Box> },
        {
          label: 'Settings',
          value: 'settings',
          icon: <Box sx={{ fontSize: '1.25rem' }}>⚙️</Box>,
        },
        {
          label: 'Notifications',
          value: 'notifications',
          icon: <Box sx={{ fontSize: '1.25rem' }}>🔔</Box>,
        },
        { label: 'Logout', value: 'logout', icon: <Box sx={{ fontSize: '1.25rem' }}>🚪</Box> },
      ]}
      onSelect={(value) => console.log(`Selected: ${value}`)}
    />
  ),
};

/**
 * Long menu with scrolling
 */
export const LongMenu: Story = {
  render: () => (
    <AnimatedDropdown
      trigger={<Button variant="contained">Navigation</Button>}
      items={longMenuItems}
      onSelect={(value) => console.log(`Navigate to: ${value}`)}
    />
  ),
};

/**
 * Status selector dropdown
 */
export const StatusSelector: Story = {
  render: () => {
    const [selectedStatus, setSelectedStatus] = useState('active');

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box>Current Status:</Box>
        <AnimatedDropdown
          trigger={
            <Button
              variant="outlined"
              sx={{
                textTransform: 'capitalize',
                borderColor:
                  selectedStatus === 'active'
                    ? '#10b981'
                    : selectedStatus === 'busy'
                      ? '#ef4444'
                      : '#9ca3af',
              }}
            >
              {selectedStatus}
            </Button>
          }
          items={statusMenuItems}
          onSelect={(value) => setSelectedStatus(value)}
        />
      </Box>
    );
  },
};

/**
 * Controlled mode example
 */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [lastSelected, setLastSelected] = useState('');

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <AnimatedDropdown
          trigger={<Button variant="contained">Controlled Menu</Button>}
          items={basicMenuItems}
          open={open}
          onOpenChange={setOpen}
          onSelect={(value) => {
            setLastSelected(value);
            setOpen(false);
          }}
        />

        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          Open: {open ? 'Yes' : 'No'}
        </Box>

        {lastSelected && (
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            Last Selected: {lastSelected}
          </Box>
        )}

        <Button variant="outlined" size="small" onClick={() => setOpen(!open)}>
          Toggle Menu Programmatically
        </Button>
      </Box>
    );
  },
};

/**
 * Context menu style (right-click menu)
 */
export const ContextMenuStyle: Story = {
  render: () => (
    <Box
      sx={{
        p: 4,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ mb: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
        Document Actions
      </Box>
      <AnimatedDropdown
        trigger={
          <Box
            sx={{
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            Right-click menu simulation
          </Box>
        }
        items={actionMenuItems}
        placement="bottom-start"
        onSelect={(value) => console.log(`Action: ${value}`)}
      />
    </Box>
  ),
};

/**
 * Multiple dropdowns in a toolbar
 */
export const InToolbar: Story = {
  render: () => (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 2,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <AnimatedDropdown
        trigger={<Button variant="text">File</Button>}
        items={[
          { label: 'New', value: 'new' },
          { label: 'Open', value: 'open' },
          { label: 'Save', value: 'save' },
        ]}
        onSelect={(value) => console.log(`File: ${value}`)}
      />

      <AnimatedDropdown
        trigger={<Button variant="text">Edit</Button>}
        items={[
          { label: 'Undo', value: 'undo' },
          { label: 'Redo', value: 'redo' },
          { label: 'Cut', value: 'cut' },
          { label: 'Copy', value: 'copy' },
          { label: 'Paste', value: 'paste' },
        ]}
        onSelect={(value) => console.log(`Edit: ${value}`)}
      />

      <AnimatedDropdown
        trigger={<Button variant="text">View</Button>}
        items={[
          { label: 'Zoom In', value: 'zoomin' },
          { label: 'Zoom Out', value: 'zoomout' },
          { label: 'Full Screen', value: 'fullscreen' },
        ]}
        onSelect={(value) => console.log(`View: ${value}`)}
      />
    </Box>
  ),
};

/**
 * Dropdown in card header
 */
export const InCardHeader: Story = {
  render: () => (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        width: 400,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ fontWeight: 600 }}>Project Dashboard</Box>
        <AnimatedDropdown
          trigger={
            <IconButton size="small">
              <Box sx={{ fontSize: '1.25rem' }}>⋯</Box>
            </IconButton>
          }
          items={[
            { label: 'Refresh', value: 'refresh' },
            { label: 'Export', value: 'export' },
            { label: 'Settings', value: 'settings' },
          ]}
          placement="bottom-end"
          onSelect={(value) => console.log(`Card action: ${value}`)}
        />
      </Box>
      <Box sx={{ p: 3 }}>
        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Card content goes here...</Box>
      </Box>
    </Box>
  ),
};

/**
 * Mobile-friendly dropdown (full width)
 */
export const MobileFriendly: Story = {
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 320 }}>
      <AnimatedDropdown
        trigger={
          <Button variant="contained" fullWidth>
            Select Option
          </Button>
        }
        items={accountMenuItems}
        width={320}
        onSelect={(value) => console.log(`Selected: ${value}`)}
      />
    </Box>
  ),
};
