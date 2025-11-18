import type { Meta, StoryObj } from '@storybook/react';
import { M3Switch } from './M3Switch';

const meta: Meta<typeof M3Switch> = {
  title: 'M3/Inputs/Switch',
  component: M3Switch,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
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
type Story = StoryObj<typeof M3Switch>;

export const Primary: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: 'Switch',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Switch variant="outlined">Outlined</M3Switch>
      <M3Switch variant="filled">Filled</M3Switch>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Switch color="primary">Primary</M3Switch>
      <M3Switch color="secondary">Secondary</M3Switch>
      <M3Switch color="tertiary">Tertiary</M3Switch>
      <M3Switch color="error">Error</M3Switch>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3Switch size="small">Small</M3Switch>
      <M3Switch size="medium">Medium</M3Switch>
      <M3Switch size="large">Large</M3Switch>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    disabled: true,
    children: 'Disabled',
  },
};
