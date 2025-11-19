import type { Meta, StoryObj } from '@storybook/react';
import { M3Progress } from './M3Progress';

const meta: Meta<typeof M3Progress> = {
  title: 'M3/Feedback/Progress',
  component: M3Progress,
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
type Story = StoryObj<typeof M3Progress>;

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
      <M3Progress variant="filled">Filled</M3Progress>
      <M3Progress variant="outlined">Outlined</M3Progress>
      <M3Progress variant="tonal">Tonal</M3Progress>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Progress color="primary">Primary</M3Progress>
      <M3Progress color="secondary">Secondary</M3Progress>
      <M3Progress color="tertiary">Tertiary</M3Progress>
      <M3Progress color="error">Error</M3Progress>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3Progress size="small">Small</M3Progress>
      <M3Progress size="medium">Medium</M3Progress>
      <M3Progress size="large">Large</M3Progress>
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
