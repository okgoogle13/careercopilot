import type { Meta, StoryObj } from '@storybook/react';
import Button, { type ButtonProps } from './Button';
import { Download, Add } from '@mui/icons-material';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Buttons allow users to take actions, and make choices, with a single tap.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text', 'glass'],
      description: 'The variant to use.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'contained' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
      description: 'The color of the component.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the component.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'If `true`, the component is disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'If `true`, the button will take up the full width of its container.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    loading: {
      control: 'boolean',
      description: 'If `true`, the button will show a loading state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

// Default button
/**
 * The default button component. Use this for primary actions.
 */
export const Primary: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Button',
  },
};

// Secondary button
/**
 * A secondary button for less prominent actions.
 */
export const Secondary: Story = {
  args: {
    variant: 'outlined',
    color: 'secondary',
    children: 'Button',
  },
};

// Text button
/**
 * A text button for less prominent actions.
 */
export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Button',
  },
};

// Glass button
/**
 * A glass button for modern UI elements.
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
    children: 'Glass Button',
  },
};

// With start icon
/**
 * A button with an icon at the start.
 */
export const WithStartIcon: Story = {
  args: {
    variant: 'contained',
    startIcon: <Download />,
    children: 'Download',
  },
};

// With end icon
/**
 * A button with an icon at the end.
 */
export const WithEndIcon: Story = {
  args: {
    variant: 'contained',
    endIcon: <Add />,
    children: 'Add Item',
  },
};

// Loading state
/**
 * A button in a loading state.
 */
export const Loading: Story = {
  args: {
    variant: 'contained',
    loading: true,
    children: 'Loading...',
  },
};

// Disabled state
/**
 * A disabled button.
 */
export const Disabled: Story = {
  args: {
    variant: 'contained',
    disabled: true,
    children: 'Disabled',
  },
};

// Full width
/**
 * A button that takes the full width of its container.
 */
export const FullWidth: Story = {
  args: {
    variant: 'contained',
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

// Sizes
/**
 * Buttons in different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button
        size="small"
        variant="contained"
      >
        Small
      </Button>
      <Button
        size="medium"
        variant="contained"
      >
        Medium
      </Button>
      <Button
        size="large"
        variant="contained"
      >
        Large
      </Button>
    </div>
  ),
};

// Colors
/**
 * Buttons in different colors.
 */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', maxWidth: '600px' }}>
      <Button
        variant="contained"
        color="primary"
      >
        Primary
      </Button>
      <Button
        variant="contained"
        color="secondary"
      >
        Secondary
      </Button>
      <Button
        variant="contained"
        color="error"
      >
        Error
      </Button>
      <Button
        variant="contained"
        color="warning"
      >
        Warning
      </Button>
      <Button
        variant="contained"
        color="info"
      >
        Info
      </Button>
      <Button
        variant="contained"
        color="success"
      >
        Success
      </Button>
    </div>
  ),
};
