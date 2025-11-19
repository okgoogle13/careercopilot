import type { Meta, StoryObj } from '@storybook/react';
import { M3Tabs } from './M3Tabs';

const meta: Meta<typeof M3Tabs> = {
  title: 'M3/Surfaces/Tabs',
  component: M3Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'elevated', 'outlined'],
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
type Story = StoryObj<typeof M3Tabs>;

export const Primary: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    children: 'Card Content',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Tabs variant="filled">Filled</M3Tabs>
      <M3Tabs variant="elevated">Elevated</M3Tabs>
      <M3Tabs variant="outlined">Outlined</M3Tabs>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Tabs color="primary">Primary</M3Tabs>
      <M3Tabs color="secondary">Secondary</M3Tabs>
      <M3Tabs color="tertiary">Tertiary</M3Tabs>
      <M3Tabs color="error">Error</M3Tabs>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3Tabs size="small">Small</M3Tabs>
      <M3Tabs size="medium">Medium</M3Tabs>
      <M3Tabs size="large">Large</M3Tabs>
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
