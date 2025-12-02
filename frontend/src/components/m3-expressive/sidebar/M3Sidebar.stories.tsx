import type { Meta, StoryObj } from '@storybook/react';
import { M3Sidebar } from './M3Sidebar';

const meta: Meta<typeof M3Sidebar> = {
  title: 'M3/Surfaces/Sidebar',
  component: M3Sidebar,
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
type Story = StoryObj<typeof M3Sidebar>;

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
      <M3Sidebar variant="filled">Filled</M3Sidebar>
      <M3Sidebar variant="elevated">Elevated</M3Sidebar>
      <M3Sidebar variant="outlined">Outlined</M3Sidebar>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Sidebar color="primary">Primary</M3Sidebar>
      <M3Sidebar color="secondary">Secondary</M3Sidebar>
      <M3Sidebar color="tertiary">Tertiary</M3Sidebar>
      <M3Sidebar color="error">Error</M3Sidebar>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3Sidebar size="small">Small</M3Sidebar>
      <M3Sidebar size="medium">Medium</M3Sidebar>
      <M3Sidebar size="large">Large</M3Sidebar>
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
