import type { Meta, StoryObj } from '@storybook/react';
import { M3Slider } from './M3Slider';

const meta: Meta<typeof M3Slider> = {
  title: 'M3/Inputs/Slider',
  component: M3Slider,
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
type Story = StoryObj<typeof M3Slider>;

export const Primary: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: 'Slider',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Slider variant="outlined">Outlined</M3Slider>
      <M3Slider variant="filled">Filled</M3Slider>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', flexWrap: 'wrap' } }>
      <M3Slider color="primary">Primary</M3Slider>
      <M3Slider color="secondary">Secondary</M3Slider>
      <M3Slider color="tertiary">Tertiary</M3Slider>
      <M3Slider color="error">Error</M3Slider>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={ { display: 'flex', gap: '16px', alignItems: 'center' } }>
      <M3Slider size="small">Small</M3Slider>
      <M3Slider size="medium">Medium</M3Slider>
      <M3Slider size="large">Large</M3Slider>
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
