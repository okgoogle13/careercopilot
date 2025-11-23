import type { Meta, StoryObj } from '@storybook/react';
import { M3Popover } from './M3Popover';

const meta: Meta<typeof M3Popover> = {
  title: 'M3/Feedback/Popover',
  component: M3Popover,
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
type Story = StoryObj<typeof M3Popover>;

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
      <M3Popover variant="filled">Filled</M3Popover>
      <M3Popover variant="outlined">Outlined</M3Popover>
      <M3Popover variant="tonal">Tonal</M3Popover>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Popover color="primary">Primary</M3Popover>
      <M3Popover color="secondary">Secondary</M3Popover>
      <M3Popover color="tertiary">Tertiary</M3Popover>
      <M3Popover color="error">Error</M3Popover>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3Popover size="small">Small</M3Popover>
      <M3Popover size="medium">Medium</M3Popover>
      <M3Popover size="large">Large</M3Popover>
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
