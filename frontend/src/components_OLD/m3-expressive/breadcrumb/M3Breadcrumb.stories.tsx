import type { Meta, StoryObj } from '@storybook/react';
import { M3Breadcrumb } from './M3Breadcrumb';

const meta: Meta<typeof M3Breadcrumb> = {
  title: 'M3/Buttons/Breadcrumb',
  component: M3Breadcrumb,
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
type Story = StoryObj<typeof M3Breadcrumb>;

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
      <M3Breadcrumb variant="filled">Filled</M3Breadcrumb>
      <M3Breadcrumb variant="tonal">Tonal</M3Breadcrumb>
      <M3Breadcrumb variant="outlined">Outlined</M3Breadcrumb>
      <M3Breadcrumb variant="text">Text</M3Breadcrumb>
      <M3Breadcrumb variant="elevated">Elevated</M3Breadcrumb>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Breadcrumb color="primary">Primary</M3Breadcrumb>
      <M3Breadcrumb color="secondary">Secondary</M3Breadcrumb>
      <M3Breadcrumb color="tertiary">Tertiary</M3Breadcrumb>
      <M3Breadcrumb color="error">Error</M3Breadcrumb>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3Breadcrumb size="small">Small</M3Breadcrumb>
      <M3Breadcrumb size="medium">Medium</M3Breadcrumb>
      <M3Breadcrumb size="large">Large</M3Breadcrumb>
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
