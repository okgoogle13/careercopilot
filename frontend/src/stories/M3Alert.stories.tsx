import type { Meta, StoryObj } from '@storybook/react';
import { Signal } from '../components/ui/M3Alert';

const meta: Meta<typeof M3Alert> = {
  title: 'M3 Components/Alert',
  component: M3Alert,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
    },
    variant: {
      control: 'select',
      options: ['filled', 'tonal', 'outlined'],
    },
    title: { control: 'text' },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof M3Alert>;

export const Info: Story = {
  args: {
    severity: 'info',
    variant: 'tonal',
    children: 'This is an informational message about your career progress.',
  },
};

export const Success: Story = {
  args: {
    severity: 'success',
    variant: 'filled',
    title: 'Profile Optimized',
    children: 'Your resume has been successfully scanned and optimized for ATS.',
    onClose: () => {},
  },
};

export const Warning: Story = {
  args: {
    severity: 'warning',
    variant: 'outlined',
    title: 'Attention Required',
    children:
      'Some required fields are missing in your profile. Complete them to improve job matching.',
  },
};

export const ErrorState: Story = {
  args: {
    severity: 'error',
    variant: 'filled',
    title: 'Upload Failed',
    children: 'There was an error connecting to the server. Please check your internet connection.',
    onClose: () => {},
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Signal
        severity="info"
        title="Info"
      >
        Informational message container.
      </Signal>
      <Signal
        severity="success"
        title="Success"
      >
        Successful operation feedback.
      </Signal>
      <Signal
        severity="warning"
        title="Warning"
      >
        Potential issue found in your application.
      </Signal>
      <Signal
        severity="error"
        title="Error"
      >
        Critical failure in the ingestion pipeline.
      </Signal>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Signal
        variant="filled"
        severity="info"
      >
        Filled (High Emphasis)
      </Signal>
      <Signal
        variant="tonal"
        severity="info"
      >
        Tonal (Medium Emphasis)
      </Signal>
      <Signal
        variant="outlined"
        severity="info"
      >
        Outlined (Low Emphasis)
      </Signal>
    </div>
  ),
};
