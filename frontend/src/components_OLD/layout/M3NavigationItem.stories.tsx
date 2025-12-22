import type { Meta, StoryObj } from '@storybook/react';
import { M3NavigationItem } from './M3NavigationItem';

const meta: Meta<typeof M3NavigationItem> = {
  title: 'M3/Buttons/NavigationItem',
  component: M3NavigationItem,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'tonal', 'outlined', 'text', 'elevated'],
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
type Story = StoryObj<typeof M3NavigationItem>;

export const Primary: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    children: 'Click Me',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3NavigationItem variant="filled">Filled</M3NavigationItem>
      <M3NavigationItem variant="tonal">Tonal</M3NavigationItem>
      <M3NavigationItem variant="outlined">Outlined</M3NavigationItem>
      <M3NavigationItem variant="text">Text</M3NavigationItem>
      <M3NavigationItem variant="elevated">Elevated</M3NavigationItem>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3NavigationItem color="primary">Primary</M3NavigationItem>
      <M3NavigationItem color="secondary">Secondary</M3NavigationItem>
      <M3NavigationItem color="tertiary">Tertiary</M3NavigationItem>
      <M3NavigationItem color="error">Error</M3NavigationItem>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3NavigationItem size="small">Small</M3NavigationItem>
      <M3NavigationItem size="medium">Medium</M3NavigationItem>
      <M3NavigationItem size="large">Large</M3NavigationItem>
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
