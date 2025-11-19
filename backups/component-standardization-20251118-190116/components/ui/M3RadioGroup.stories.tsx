import type { Meta, StoryObj } from '@storybook/react';
import { M3RadioGroup } from './M3RadioGroup';

const meta: Meta<typeof M3RadioGroup> = {
  title: 'M3/Inputs/RadioGroup',
  component: M3RadioGroup,
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
type Story = StoryObj<typeof M3RadioGroup>;

export const Primary: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: 'RadioGroup',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3RadioGroup variant="outlined">Outlined</M3RadioGroup>
      <M3RadioGroup variant="filled">Filled</M3RadioGroup>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3RadioGroup color="primary">Primary</M3RadioGroup>
      <M3RadioGroup color="secondary">Secondary</M3RadioGroup>
      <M3RadioGroup color="tertiary">Tertiary</M3RadioGroup>
      <M3RadioGroup color="error">Error</M3RadioGroup>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3RadioGroup size="small">Small</M3RadioGroup>
      <M3RadioGroup size="medium">Medium</M3RadioGroup>
      <M3RadioGroup size="large">Large</M3RadioGroup>
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
