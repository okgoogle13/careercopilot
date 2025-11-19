import type { Meta, StoryObj } from '@storybook/react';
import { M3SearchInput } from './M3SearchInput';

const meta: Meta<typeof M3SearchInput> = {
  title: 'M3/Inputs/SearchInput',
  component: M3SearchInput,
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
type Story = StoryObj<typeof M3SearchInput>;

export const Primary: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: 'SearchInput',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3SearchInput variant="outlined">Outlined</M3SearchInput>
      <M3SearchInput variant="filled">Filled</M3SearchInput>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3SearchInput color="primary">Primary</M3SearchInput>
      <M3SearchInput color="secondary">Secondary</M3SearchInput>
      <M3SearchInput color="tertiary">Tertiary</M3SearchInput>
      <M3SearchInput color="error">Error</M3SearchInput>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3SearchInput size="small">Small</M3SearchInput>
      <M3SearchInput size="medium">Medium</M3SearchInput>
      <M3SearchInput size="large">Large</M3SearchInput>
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
