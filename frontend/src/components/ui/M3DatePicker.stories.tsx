import type { Meta, StoryObj } from '@storybook/react';
import { M3DatePicker } from './M3DatePicker';

const meta: Meta<typeof M3DatePicker> = {
  title: 'M3/Inputs/DatePicker',
  component: M3DatePicker,
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
type Story = StoryObj<typeof M3DatePicker>;

export const Primary: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: 'DatePicker',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3DatePicker variant="outlined">Outlined</M3DatePicker>
      <M3DatePicker variant="filled">Filled</M3DatePicker>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3DatePicker color="primary">Primary</M3DatePicker>
      <M3DatePicker color="secondary">Secondary</M3DatePicker>
      <M3DatePicker color="tertiary">Tertiary</M3DatePicker>
      <M3DatePicker color="error">Error</M3DatePicker>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3DatePicker size="small">Small</M3DatePicker>
      <M3DatePicker size="medium">Medium</M3DatePicker>
      <M3DatePicker size="large">Large</M3DatePicker>
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
