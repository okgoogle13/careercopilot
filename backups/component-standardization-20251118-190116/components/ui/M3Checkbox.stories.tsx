import type { Meta, StoryObj } from '@storybook/react';
import { M3Checkbox } from './M3Checkbox';

const meta: Meta<typeof M3Checkbox> = {
  title: 'M3/Inputs/Checkbox',
  component: M3Checkbox,
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
type Story = StoryObj<typeof M3Checkbox>;

export const Primary: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: 'Checkbox',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Checkbox variant="outlined">Outlined</M3Checkbox>
      <M3Checkbox variant="filled">Filled</M3Checkbox>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Checkbox color="primary">Primary</M3Checkbox>
      <M3Checkbox color="secondary">Secondary</M3Checkbox>
      <M3Checkbox color="tertiary">Tertiary</M3Checkbox>
      <M3Checkbox color="error">Error</M3Checkbox>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3Checkbox size="small">Small</M3Checkbox>
      <M3Checkbox size="medium">Medium</M3Checkbox>
      <M3Checkbox size="large">Large</M3Checkbox>
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
