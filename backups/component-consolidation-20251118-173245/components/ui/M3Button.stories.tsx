import type { Meta, StoryObj } from '@storybook/react';
import { M3Button } from './M3Button';

const meta: Meta<typeof M3Button> = {
  title: 'M3/Buttons/Button',
  component: M3Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'tonal', 'outlined', 'text', 'elevated'],
      description: 'The visual variant of the button',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
      description: 'The color role from M3 palette',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button shows a loading indicator',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Button>;

// Primary Story
export const Primary: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    children: 'Button',
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <M3Button variant="filled">Filled</M3Button>
      <M3Button variant="tonal">Tonal</M3Button>
      <M3Button variant="outlined">Outlined</M3Button>
      <M3Button variant="text">Text</M3Button>
      <M3Button variant="elevated">Elevated</M3Button>
    </div>
  ),
};

// All Colors
export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <M3Button color="primary">Primary</M3Button>
      <M3Button color="secondary">Secondary</M3Button>
      <M3Button color="tertiary">Tertiary</M3Button>
      <M3Button color="error">Error</M3Button>
    </div>
  ),
};

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <M3Button size="small">Small</M3Button>
      <M3Button size="medium">Medium</M3Button>
      <M3Button size="large">Large</M3Button>
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <M3Button startIcon={<span>→</span>}>Start Icon</M3Button>
      <M3Button endIcon={<span>←</span>}>End Icon</M3Button>
      <M3Button startIcon={<span>✓</span>} endIcon={<span>→</span>}>
        Both Icons
      </M3Button>
    </div>
  ),
};

// Loading State
export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <M3Button loading>Loading</M3Button>
      <M3Button variant="tonal" loading>
        Loading Tonal
      </M3Button>
      <M3Button variant="outlined" loading>
        Loading Outlined
      </M3Button>
    </div>
  ),
};

// Disabled State
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <M3Button disabled>Disabled</M3Button>
      <M3Button variant="tonal" disabled>
        Disabled Tonal
      </M3Button>
      <M3Button variant="outlined" disabled>
        Disabled Outlined
      </M3Button>
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
};

// Color Matrix
export const ColorMatrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {(['filled', 'tonal', 'outlined', 'text'] as const).map((variant) =>
        (['primary', 'secondary', 'tertiary', 'error'] as const).map((color) => (
          <M3Button key={`${variant}-${color}`} variant={variant} color={color}>
            {variant} {color}
          </M3Button>
        ))
      )}
    </div>
  ),
};

// Interactive Playground
export const Playground: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
    children: 'Customize Me',
  },
};
