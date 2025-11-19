import type { Meta, StoryObj } from '@storybook/react';
import { M3Textarea } from './M3Textarea';

const meta: Meta<typeof M3Textarea> = {
  title: 'M3/Inputs/Textarea',
  component: M3Textarea,
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
type Story = StoryObj<typeof M3Textarea>;

export const Primary: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: 'Textarea',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Textarea variant="outlined">Outlined</M3Textarea>
      <M3Textarea variant="filled">Filled</M3Textarea>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Textarea color="primary">Primary</M3Textarea>
      <M3Textarea color="secondary">Secondary</M3Textarea>
      <M3Textarea color="tertiary">Tertiary</M3Textarea>
      <M3Textarea color="error">Error</M3Textarea>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3Textarea size="small">Small</M3Textarea>
      <M3Textarea size="medium">Medium</M3Textarea>
      <M3Textarea size="large">Large</M3Textarea>
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
