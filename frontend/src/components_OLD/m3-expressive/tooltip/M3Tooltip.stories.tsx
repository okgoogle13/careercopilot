import type { Meta, StoryObj } from '@storybook/react';
import { M3Tooltip } from './M3Tooltip';

const meta: Meta<typeof M3Tooltip> = {
  title: 'M3/Feedback/Tooltip',
  component: M3Tooltip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'tonal'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Tooltip>;

export const Primary: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    children: 'Feedback Message',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Tooltip variant="filled">Filled</M3Tooltip>
      <M3Tooltip variant="outlined">Outlined</M3Tooltip>
      <M3Tooltip variant="tonal">Tonal</M3Tooltip>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Tooltip color="primary">Primary</M3Tooltip>
      <M3Tooltip color="secondary">Secondary</M3Tooltip>
      <M3Tooltip color="tertiary">Tertiary</M3Tooltip>
      <M3Tooltip color="error">Error</M3Tooltip>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3Tooltip size="small">Small</M3Tooltip>
      <M3Tooltip size="medium">Medium</M3Tooltip>
      <M3Tooltip size="large">Large</M3Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    disabled: true,
    children: 'Disabled',
  },
};
