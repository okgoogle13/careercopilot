import type { Meta, StoryObj } from '@storybook/react';
import { M3ErrorAlert } from '../components/shared/M3ErrorAlert';

const meta: Meta<typeof M3ErrorAlert> = {
  title: 'Shared/ErrorAlert',
  component: M3ErrorAlert,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    retryLabel: { control: 'text' },
    onRetry: { action: 'retried' },
    onDismiss: { action: 'dismissed' },
  },
};

export default meta;
type Story = StoryObj<typeof M3ErrorAlert>;

export const Default: Story = {
  args: {
    message: 'An unexpected error occurred while processing your request.',
  },
};

export const WithRetry: Story = {
  args: {
    message: 'Connection failed. Please check your network and try again.',
    onRetry: () => console.log('Retrying...'),
    retryLabel: 'Reconnect',
  },
};

export const FullFeatured: Story = {
  args: {
    message: 'Your session has expired. Please sign in again to continue.',
    onRetry: () => console.log('Signing in...'),
    onDismiss: () => console.log('Dismissed'),
    retryLabel: 'Login',
  },
};

export const LongMessage: Story = {
  args: {
    message:
      'The server responded with a 500 status code. This might be due to a temporary outage or maintenance. Our engineers have been notified and are working on a fix. Please try again in a few minutes or contact support if the problem persists.',
    onRetry: () => {},
    onDismiss: () => {},
  },
};
