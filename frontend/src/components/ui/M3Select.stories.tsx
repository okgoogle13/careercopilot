import type { Meta, StoryObj } from '@storybook/react';
import { M3Select } from './M3Select';

const meta: Meta<typeof M3Select> = {
  title: 'M3/Inputs/Select',
  component: M3Select,
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
type Story = StoryObj<typeof M3Select>;

export const Primary: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: 'Select',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Select variant="outlined">Outlined</M3Select>
      <M3Select variant="filled">Filled</M3Select>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Select color="primary">Primary</M3Select>
      <M3Select color="secondary">Secondary</M3Select>
      <M3Select color="tertiary">Tertiary</M3Select>
      <M3Select color="error">Error</M3Select>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3Select size="small">Small</M3Select>
      <M3Select size="medium">Medium</M3Select>
      <M3Select size="large">Large</M3Select>
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
