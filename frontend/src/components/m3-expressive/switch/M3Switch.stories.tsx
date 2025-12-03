import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { M3Switch } from './M3Switch';

/**
 * M3 Expressive Switch Component
 *
 * Implements Material Design 3 switch/toggle.
 * Use for binary on/off settings, feature toggles, and preferences.
 *
 * Features:
 * - On/off toggle states
 * - Multiple color roles
 * - Three size options
 * - Label support (left or right)
 * - Icon support (optional)
 * - Keyboard navigation
 * - Disabled state
 */

const meta: Meta<typeof M3Switch> = {
  component: M3Switch,
  title: 'M3 Expressive/Switch',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
      description: 'Color role from M3 palette',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Switch size',
    },
    checked: {
      control: 'boolean',
      description: 'If true, switch is checked (on)',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, switch is disabled',
    },
    label: {
      control: 'text',
      description: 'Label text for the switch',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Label position',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Switch (Primary + Medium)
 */
export const Default: Story = {
  args: {
    color: 'primary',
    size: 'medium',
  },
};

/**
 * All Sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Switch size="small" label="Small switch" />
      <M3Switch size="medium" label="Medium switch" />
      <M3Switch size="large" label="Large switch" />
    </div>
  ),
};

/**
 * All Color Roles
 */
export const ColorRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Switch color="primary" checked label="Primary" />
      <M3Switch color="secondary" checked label="Secondary" />
      <M3Switch color="tertiary" checked label="Tertiary" />
      <M3Switch color="error" checked label="Error" />
    </div>
  ),
};

/**
 * On State
 */
export const On: Story = {
  args: {
    checked: true,
    label: 'Switch is on',
  },
};

/**
 * Off State
 */
export const Off: Story = {
  args: {
    checked: false,
    label: 'Switch is off',
  },
};

/**
 * All States
 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Switch label="Off" />
      <M3Switch checked label="On" />
      <M3Switch disabled label="Disabled" />
      <M3Switch checked disabled label="On & Disabled" />
    </div>
  ),
};

/**
 * With Label (Right)
 */
export const WithLabel: Story = {
  args: {
    label: 'Enable notifications',
  },
};

/**
 * With Label (Left)
 */
export const LabelLeft: Story = {
  args: {
    label: 'Dark mode',
    labelPosition: 'left',
  },
};

/**
 * Disabled State
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled switch',
  },
};

/**
 * Disabled On
 */
export const DisabledOn: Story = {
  args: {
    checked: true,
    disabled: true,
    label: 'Disabled and on',
  },
};

/**
 * All Colors with Labels
 */
export const ColorsWithLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Switch color="primary" checked label="Primary switch" />
      <M3Switch color="secondary" checked label="Secondary switch" />
      <M3Switch color="tertiary" checked label="Tertiary switch" />
      <M3Switch color="error" checked label="Error switch" />
    </div>
  ),
};

/**
 * With Icons
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Switch
        checked
        onIcon={<span>✓</span>}
        offIcon={<span>✗</span>}
        label="With icons"
      />
      <M3Switch
        checked={false}
        onIcon={<span>✓</span>}
        offIcon={<span>✗</span>}
        label="With icons (off)"
      />
    </div>
  ),
};

/**
 * Interactive Demo
 */
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
        <M3Switch
          checked={checked}
          onChange={(newChecked) => setChecked(newChecked)}
          label="Interactive switch"
        />
        <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <div><strong>State:</strong> {checked ? 'On' : 'Off'}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setChecked(true)}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Turn On
          </button>
          <button
            onClick={() => setChecked(false)}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Turn Off
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Settings Example
 */
export const SettingsExample: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoSave, setAutoSave] = useState(true);
    const [analytics, setAnalytics] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px', padding: '24px' }}>
        <h3 style={{ margin: 0 }}>Settings</h3>
        <M3Switch
          checked={notifications}
          onChange={setNotifications}
          label="Push notifications"
        />
        <M3Switch
          checked={darkMode}
          onChange={setDarkMode}
          label="Dark mode"
        />
        <M3Switch
          checked={autoSave}
          onChange={setAutoSave}
          label="Auto-save"
        />
        <M3Switch
          checked={analytics}
          onChange={setAnalytics}
          label="Analytics tracking"
        />
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <div><strong>Notifications:</strong> {notifications ? 'On' : 'Off'}</div>
          <div><strong>Dark Mode:</strong> {darkMode ? 'On' : 'Off'}</div>
          <div><strong>Auto-save:</strong> {autoSave ? 'On' : 'Off'}</div>
          <div><strong>Analytics:</strong> {analytics ? 'On' : 'Off'}</div>
        </div>
      </div>
    );
  },
};

/**
 * Label Positions
 */
export const LabelPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <M3Switch label="Label on right (default)" labelPosition="right" />
      <M3Switch label="Label on left" labelPosition="left" />
      <M3Switch checked label="Label on right (on)" labelPosition="right" />
      <M3Switch checked label="Label on left (on)" labelPosition="left" />
    </div>
  ),
};

/**
 * Form Example
 */
export const FormExample: Story = {
  render: () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [marketing, setMarketing] = useState(false);

    return (
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '300px',
          padding: '24px',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          alert('Form submitted!');
        }}
      >
        <h3 style={{ margin: 0 }}>Notification Preferences</h3>
        <M3Switch
          checked={emailNotifications}
          onChange={setEmailNotifications}
          label="Email notifications"
        />
        <M3Switch
          checked={smsNotifications}
          onChange={setSmsNotifications}
          label="SMS notifications"
        />
        <M3Switch
          checked={marketing}
          onChange={setMarketing}
          label="Marketing emails"
        />
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#00897B',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Save Preferences
        </button>
      </form>
    );
  },
};
