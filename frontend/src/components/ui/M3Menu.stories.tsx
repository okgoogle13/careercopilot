import type { Meta, StoryObj } from '@storybook/react';
import { M3Menu } from './M3Menu';
import { useState } from 'react';

const meta: Meta<typeof M3Menu> = {
  title: 'M3/Navigation/Menu',
  component: M3Menu,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
    closeOnSelect: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Menu>;

const sampleItems = [
  { label: 'Edit', value: 'edit' },
  { label: 'Duplicate', value: 'duplicate' },
  { label: 'Delete', value: 'delete', divider: true },
  { label: 'Export', value: 'export' },
];

export const Basic: Story = {
  args: {
    trigger: (
      <button style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#1976d2', color: 'white', cursor: 'pointer' }}>
        Open Menu
      </button>
    ),
    items: sampleItems,
  },
};

export const WithIcons: Story = {
  args: {
    trigger: (
      <button style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#1976d2', color: 'white', cursor: 'pointer' }}>
        Actions
      </button>
    ),
    items: [
      {
        label: 'Edit',
        value: 'edit',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        ),
      },
      {
        label: 'Copy',
        value: 'copy',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
          </svg>
        ),
      },
      {
        label: 'Delete',
        value: 'delete',
        divider: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        ),
      },
      {
        label: 'Download',
        value: 'download',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />
          </svg>
        ),
      },
    ],
  },
};

export const WithDisabledItems: Story = {
  args: {
    trigger: (
      <button style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#1976d2', color: 'white', cursor: 'pointer' }}>
        Options
      </button>
    ),
    items: [
      { label: 'Edit', value: 'edit' },
      { label: 'Duplicate', value: 'duplicate', disabled: true },
      { label: 'Archive', value: 'archive', disabled: true },
      { label: 'Delete', value: 'delete' },
    ],
  },
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '100px', padding: '100px' }}>
      <M3Menu
        trigger={<button style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}>Top Start</button>}
        items={sampleItems}
        placement="top-start"
      />
      <M3Menu
        trigger={<button style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}>Top End</button>}
        items={sampleItems}
        placement="top-end"
      />
      <M3Menu
        trigger={<button style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}>Bottom Start</button>}
        items={sampleItems}
        placement="bottom-start"
      />
      <M3Menu
        trigger={<button style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}>Bottom End</button>}
        items={sampleItems}
        placement="bottom-end"
      />
    </div>
  ),
};

export const ControlledMenu: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <M3Menu
            trigger={
              <button style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#1976d2', color: 'white', cursor: 'pointer' }}>
                Controlled Menu
              </button>
            }
            items={sampleItems}
            open={open}
            onOpenChange={setOpen}
            onSelect={(value) => setSelected(value)}
          />
        </div>

        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <strong>Menu State:</strong> {open ? 'Open' : 'Closed'}
          <br />
          <strong>Last Selected:</strong> {selected || 'None'}
        </div>

        <button
          onClick={() => setOpen(!open)}
          style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: '#666', color: 'white', cursor: 'pointer' }}
        >
          Toggle Menu
        </button>
      </div>
    );
  },
};

export const IconButtonTrigger: Story = {
  render: () => (
    <M3Menu
      trigger={
        <button style={{ width: '40px', height: '40px', border: 'none', borderRadius: '50%', backgroundColor: '#f5f5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      }
      items={[
        {
          label: 'Settings',
          value: 'settings',
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          ),
        },
        {
          label: 'Profile',
          value: 'profile',
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          ),
        },
        {
          label: 'Logout',
          value: 'logout',
          divider: true,
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
          ),
        },
      ]}
    />
  ),
};

export const ContextMenu: Story = {
  render: () => {
    const [lastAction, setLastAction] = useState<string | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ padding: '40px', border: '2px dashed #ccc', borderRadius: '8px', textAlign: 'center' }}>
          <M3Menu
            trigger={
              <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', cursor: 'pointer' }}>
                Right-click or click this card
              </div>
            }
            items={[
              { label: 'View Details', value: 'view' },
              { label: 'Edit', value: 'edit' },
              { label: 'Share', value: 'share', divider: true },
              { label: 'Delete', value: 'delete' },
            ]}
            onSelect={(value) => setLastAction(value)}
            placement="bottom-start"
          />
        </div>

        {lastAction && (
          <div style={{ padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
            <strong>Action:</strong> {lastAction}
          </div>
        )}
      </div>
    );
  },
};

export const UserMenu: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px', backgroundColor: '#f5f5f5' }}>
      <M3Menu
        trigger={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '24px', backgroundColor: 'white', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
              JD
            </div>
            <span style={{ fontWeight: '500' }}>John Doe</span>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
        }
        items={[
          {
            label: 'Profile',
            value: 'profile',
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            ),
          },
          {
            label: 'Settings',
            value: 'settings',
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            ),
            divider: true,
          },
          {
            label: 'Logout',
            value: 'logout',
            icon: (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
            ),
          },
        ]}
        placement="bottom-end"
      />
    </div>
  ),
};
