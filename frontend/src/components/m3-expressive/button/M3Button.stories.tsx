import type { Meta, StoryObj } from '@storybook/react';
import { M3Button } from './M3Button';

/**
 * M3 Expressive Button Component
 *
 * Implements Material Design 3 Expressive button variants.
 * Use for primary actions, navigation, and form submissions.
 *
 * Variants:
 * - **Filled**: High emphasis, use for primary actions
 * - **Elevated**: High emphasis with depth, use for floating actions
 * - **Tonal**: Medium emphasis, subtle appearance
 * - **Outlined**: Medium emphasis with border
 * - **Text**: Low emphasis, minimal style
 */
const meta: Meta<typeof M3Button> = {
  component: M3Button,
  title: 'M3 Expressive/Button',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'elevated', 'outlined', 'text', 'tonal'],
      description: 'Button style variant',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
      description: 'Color role from M3 palette',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    fullWidth: {
      control: 'boolean',
      description: 'If true, button takes full width of container',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, button is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button (Filled + Primary)
 */
export const Default: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'medium',
    children: 'Click Me',
  },
};

/**
 * All Variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <M3Button variant="filled">Filled</M3Button>
      <M3Button variant="elevated">Elevated</M3Button>
      <M3Button variant="tonal">Tonal</M3Button>
      <M3Button variant="outlined">Outlined</M3Button>
      <M3Button variant="text">Text</M3Button>
    </div>
  ),
};

/**
 * All Sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <M3Button size="small">Small</M3Button>
      <M3Button size="medium">Medium</M3Button>
      <M3Button size="large">Large</M3Button>
    </div>
  ),
};

/**
 * All Color Roles
 */
export const ColorRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <M3Button color="primary">Primary</M3Button>
      <M3Button color="secondary">Secondary</M3Button>
      <M3Button color="tertiary">Tertiary</M3Button>
      <M3Button color="error">Error</M3Button>
    </div>
  ),
};

/**
 * Filled Variant
 */
export const FilledVariant: Story = {
  args: {
    variant: 'filled',
    children: 'Filled Button',
  },
};

/**
 * Elevated Variant
 */
export const ElevatedVariant: Story = {
  args: {
    variant: 'elevated',
    children: 'Elevated Button',
  },
};

/**
 * Tonal Variant
 */
export const TonalVariant: Story = {
  args: {
    variant: 'tonal',
    children: 'Tonal Button',
  },
};

/**
 * Outlined Variant
 */
export const OutlinedVariant: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Button',
  },
};

/**
 * Text Variant
 */
export const TextVariant: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

/**
 * Disabled State
 */
export const Disabled: Story = {
  args: {
    variant: 'filled',
    disabled: true,
    children: 'Disabled Button',
  },
};

/**
 * Full Width
 */
export const FullWidth: Story = {
  args: {
    variant: 'filled',
    fullWidth: true,
    children: 'Full Width Button',
  },
};

/**
 * With Icons
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <M3Button startIcon={<span>↓</span>}>Download</M3Button>
      <M3Button endIcon={<span>→</span>}>Next</M3Button>
      <M3Button startIcon={<span>✓</span>} endIcon={<span>→</span>}>
        Save & Continue
      </M3Button>
    </div>
  ),
};

/**
 * Error State
 */
export const ErrorColor: Story = {
  args: {
    variant: 'filled',
    color: 'error',
    children: 'Delete',
  },
};

/**
 * Interactive Demo
 */
export const Interactive: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'medium',
    children: 'Click Me',
    onClick: () => alert('Button clicked!'),
  },
};
