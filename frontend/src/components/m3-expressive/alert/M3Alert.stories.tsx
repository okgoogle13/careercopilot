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
      description: 'The severity level of the alert',
    },
    onClose: {
      action: 'closed',
      description: 'Callback fired when close button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Alert>;

/**
 * Primary story showing default info severity
 */
export const Primary: Story = {
  args: {
    severity: 'info',
    children: 'This is an informational alert message',
  },
};

/**
 * All severity variants: info, success, warning, error
 */
export const AllSeverities: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <M3Alert severity="info">This is an info alert — check it out!</M3Alert>
      <M3Alert severity="success">This is a success alert — great job!</M3Alert>
      <M3Alert severity="warning">This is a warning alert — be careful!</M3Alert>
      <M3Alert severity="error">This is an error alert — something went wrong!</M3Alert>
    </div>
  ),
};

/**
 * Alerts with close button functionality
 */
export const WithCloseButton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <M3Alert severity="info" onClose={() => alert('Info alert closed')}>
        You can close this alert
      </M3Alert>
      <M3Alert severity="success" onClose={() => alert('Success alert closed')}>
        Operation completed successfully
      </M3Alert>
      <M3Alert severity="error" onClose={() => alert('Error alert closed')}>
        Failed to complete operation
      </M3Alert>
    </div>
  ),
};

/**
 * Alerts with custom icons
 */
export const WithCustomIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <M3Alert
        severity="info"
        icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
          </svg>
        }
      >
        Custom info icon alert
      </M3Alert>
      <M3Alert
        severity="success"
        icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z"/>
          </svg>
        }
        onClose={() => {}}
      >
        Success with custom icon and close button
      </M3Alert>
    </div>
  ),
};

/**
 * Alert with long message to test text wrapping
 */
export const LongMessage: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <M3Alert severity="warning" onClose={() => {}}>
        This is a very long alert message that should wrap to multiple lines when the container width is limited.
        It tests the component's ability to handle longer content gracefully and ensure proper text wrapping and spacing.
        The alert should maintain readability and visual hierarchy even with extended content like this example demonstrates.
      </M3Alert>
    </div>
  ),
};
