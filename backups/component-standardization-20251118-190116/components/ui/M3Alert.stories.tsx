import type { Meta, StoryObj } from '@storybook/react';
import { M3Alert } from './M3Alert';

const meta: Meta<typeof M3Alert> = {
  title: 'M3/Feedback/Alert',
  component: M3Alert,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    variant: {
      control: 'select',
      options: ['standard', 'filled', 'outlined'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Alert>;

export const Info: Story = {
  args: {
    severity: 'info',
    children: 'This is an informational alert message.',
  },
};

export const Success: Story = {
  args: {
    severity: 'success',
    children: 'Your changes have been saved successfully!',
  },
};

export const Warning: Story = {
  args: {
    severity: 'warning',
    children: 'Please review your input before proceeding.',
  },
};

export const Error: Story = {
  args: {
    severity: 'error',
    children: 'An error occurred while processing your request.',
  },
};

export const WithTitle: Story = {
  args: {
    severity: 'success',
    title: 'Success',
    children: 'Your profile has been updated successfully.',
  },
};

export const Closable: Story = {
  args: {
    severity: 'info',
    title: 'Notification',
    closable: true,
    children: 'Click the close button to dismiss this alert.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <M3Alert severity="info" variant="standard" title="Standard">
        This is a standard info alert
      </M3Alert>
      <M3Alert severity="info" variant="filled" title="Filled">
        This is a filled info alert
      </M3Alert>
      <M3Alert severity="info" variant="outlined" title="Outlined">
        This is an outlined info alert
      </M3Alert>
    </div>
  ),
};

export const AllSeverities: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <M3Alert severity="info" title="Info">
        This is an informational message
      </M3Alert>
      <M3Alert severity="success" title="Success">
        Operation completed successfully
      </M3Alert>
      <M3Alert severity="warning" title="Warning">
        Please review before continuing
      </M3Alert>
      <M3Alert severity="error" title="Error">
        An error has occurred
      </M3Alert>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <M3Alert
      severity="warning"
      title="Update Available"
      action={
        <button
          style={{
            padding: '6px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Update
        </button>
      }
    >
      A new version is available. Click update to install.
    </M3Alert>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <M3Alert
      severity="info"
      title="Custom Icon"
      icon={
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px' }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      }
    >
      This alert has a custom star icon
    </M3Alert>
  ),
};

export const LongContent: Story = {
  render: () => (
    <M3Alert severity="info" title="Detailed Information" closable>
      This is a longer alert message that contains more detailed information. It demonstrates how the
      alert component handles multiple lines of text. The content wraps naturally and maintains proper
      spacing and alignment with the icon and close button. This ensures good readability even with
      longer content.
    </M3Alert>
  ),
};

export const NoIcon: Story = {
  args: {
    severity: 'info',
    title: 'No Icon Alert',
    icon: null,
    children: 'This alert has no icon displayed.',
  },
};

export const FilledVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <M3Alert severity="info" variant="filled" closable>
        Info filled alert
      </M3Alert>
      <M3Alert severity="success" variant="filled" closable>
        Success filled alert
      </M3Alert>
      <M3Alert severity="warning" variant="filled" closable>
        Warning filled alert
      </M3Alert>
      <M3Alert severity="error" variant="filled" closable>
        Error filled alert
      </M3Alert>
    </div>
  ),
};

export const OutlinedVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <M3Alert severity="info" variant="outlined" closable>
        Info outlined alert
      </M3Alert>
      <M3Alert severity="success" variant="outlined" closable>
        Success outlined alert
      </M3Alert>
      <M3Alert severity="warning" variant="outlined" closable>
        Warning outlined alert
      </M3Alert>
      <M3Alert severity="error" variant="outlined" closable>
        Error outlined alert
      </M3Alert>
    </div>
  ),
};
