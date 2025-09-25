import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from './Button';
import { Stack, Typography } from '@mui/material';

// Meta information about the component
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['contained', 'outlined', 'text'],
      },
    },
    color: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'large'],
      },
    },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

// Basic button stories
export const Primary: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'contained',
    color: 'secondary',
    children: 'Secondary Button',
  },
};

// Variant stories
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Button',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

// Size stories
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button',
  },
};

// State stories
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading Button',
  },
};

// Interactive example
export const Interactive = () => {
  return (
    <Stack spacing={2} maxWidth={300}>
      <Typography variant="h6">Click the button to see the action</Typography>
      <Button onClick={action('Button clicked!')} variant="contained">
        Click Me
      </Button>
    </Stack>
  );
};

// Showcase all variants and colors
export const AllVariants = () => (
  <Stack spacing={2}>
    {['contained', 'outlined', 'text'].map((variant) => (
      <Stack key={variant} direction="row" spacing={2} alignItems="center" mb={4}>
        <Typography variant="subtitle1" minWidth={100}>
          {variant}
        </Typography>
        {['primary', 'secondary', 'success', 'error', 'info', 'warning'].map((color) => (
          <Button
            key={`${variant}-${color}`}
            variant={variant as any}
            color={color as any}
            onClick={() => console.log(`${variant} ${color} clicked`)}
          >
            {color}
          </Button>
        ))}
      </Stack>
    ))}
  </Stack>
);

// Documentation with MDX
export const Documentation = () => (
  <Stack spacing={3}>
    <Typography variant="h4">Button Component</Typography>
    <Typography variant="body1">
      The Button component is a customizable button that extends Material-UI's Button with
      additional features.
    </Typography>

    <Typography variant="h5">When to Use</Typography>
    <ul>
      <li>To trigger an action or event, such as submitting a form or opening a dialog</li>
      <li>To navigate to another page or section</li>
      <li>To perform a specific action like save, cancel, or delete</li>
    </ul>

    <Typography variant="h5">Props</Typography>
    <Typography variant="body2">
      The Button component accepts all props from Material-UI's Button component, plus the following
      additional props:
    </Typography>
    <ul>
      <li>
        <strong>loading</strong> (boolean): Shows a loading indicator
      </li>
      <li>
        <strong>fullWidth</strong> (boolean): Makes the button take full width of its container
      </li>
    </ul>
  </Stack>
);
