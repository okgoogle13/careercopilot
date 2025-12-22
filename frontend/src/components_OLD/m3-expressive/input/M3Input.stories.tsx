import type { Meta, StoryObj } from '@storybook/react';
import { M3Input } from './M3Input';

/**
 * M3 Expressive Input Component
 *
 * Implements Material Design 3 Expressive input fields.
 * Use for text entry, forms, and data collection.
 *
 * Variants:
 * - **Filled**: Background with bottom border (default)
 * - **Outlined**: Transparent with full border
 *
 * Features:
 * - Support for all HTML input types (text, email, password, etc.)
 * - Error state with helper text
 * - Label and helper text support
 * - Full accessibility support
 */
const meta: Meta<typeof M3Input> = {
  component: M3Input,
  title: 'M3 Expressive/Input',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
      description: 'Input style variant',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
      description: 'Color role from M3 palette',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Input size',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'HTML input type',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, input is disabled',
    },
    error: {
      control: 'boolean',
      description: 'If true, input is in error state',
    },
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Input (Filled + Primary)
 */
export const Default: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'medium',
    placeholder: 'Enter text',
  },
};

/**
 * All Variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <M3Input variant="filled" placeholder="Filled input" />
      <M3Input variant="outlined" placeholder="Outlined input" />
    </div>
  ),
};

/**
 * All Sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3Input size="small" placeholder="Small input" />
      <M3Input size="medium" placeholder="Medium input" />
      <M3Input size="large" placeholder="Large input" />
    </div>
  ),
};

/**
 * All Color Roles
 */
export const ColorRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3Input color="primary" placeholder="Primary" />
      <M3Input color="secondary" placeholder="Secondary" />
      <M3Input color="tertiary" placeholder="Tertiary" />
      <M3Input color="error" placeholder="Error" />
    </div>
  ),
};

/**
 * Filled Variant
 */
export const FilledVariant: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled input',
  },
};

/**
 * Outlined Variant
 */
export const OutlinedVariant: Story = {
  args: {
    variant: 'outlined',
    placeholder: 'Outlined input',
  },
};

/**
 * Different Input Types
 */
export const InputTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3Input type="text" placeholder="Text input" />
      <M3Input type="email" placeholder="Email input" />
      <M3Input type="password" placeholder="Password input" />
      <M3Input type="number" placeholder="Number input" />
      <M3Input type="tel" placeholder="Phone input" />
      <M3Input type="url" placeholder="URL input" />
      <M3Input type="search" placeholder="Search input" />
    </div>
  ),
};

/**
 * With Label
 */
export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
  },
};

/**
 * With Helper Text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    helperText: 'Must be at least 8 characters',
  },
};

/**
 * With Label and Helper Text
 */
export const WithLabelAndHelper: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    helperText: 'Choose a unique username',
  },
};

/**
 * Disabled State
 */
export const Disabled: Story = {
  args: {
    variant: 'filled',
    disabled: true,
    placeholder: 'Disabled input',
    value: 'Cannot edit this',
  },
};

/**
 * Error State
 */
export const ErrorState: Story = {
  args: {
    error: true,
    label: 'Email',
    placeholder: 'Enter email',
    helperText: 'Please enter a valid email address',
    value: 'invalid-email',
  },
};

/**
 * Error State with Outlined Variant
 */
export const ErrorOutlined: Story = {
  args: {
    variant: 'outlined',
    error: true,
    label: 'Password',
    type: 'password',
    helperText: 'Password must be at least 8 characters',
  },
};

/**
 * All Variants with Error
 */
export const VariantsWithError: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <M3Input
        variant="filled"
        error
        label="Filled Error"
        helperText="This field has an error"
      />
      <M3Input
        variant="outlined"
        error
        label="Outlined Error"
        helperText="This field has an error"
      />
    </div>
  ),
};

/**
 * All Colors with Error
 */
export const ColorsWithError: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3Input color="primary" error helperText="Primary error" />
      <M3Input color="secondary" error helperText="Secondary error" />
      <M3Input color="tertiary" error helperText="Tertiary error" />
      <M3Input color="error" error helperText="Error color error" />
    </div>
  ),
};

/**
 * Form Example
 */
export const FormExample: Story = {
  render: () => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '400px',
        padding: '24px',
      }}
      onSubmit={(e) => {
        e.preventDefault();
        alert('Form submitted!');
      }}
    >
      <M3Input
        variant="filled"
        label="Full Name"
        placeholder="John Doe"
        required
      />
      <M3Input
        variant="filled"
        type="email"
        label="Email Address"
        placeholder="john@example.com"
        helperText="We'll never share your email"
        required
      />
      <M3Input
        variant="outlined"
        type="password"
        label="Password"
        placeholder="Enter password"
        helperText="Must be at least 8 characters"
        required
      />
      <M3Input
        variant="outlined"
        type="tel"
        label="Phone Number"
        placeholder="+1 (555) 123-4567"
      />
      <button
        type="submit"
        style={{
          padding: '12px 24px',
          backgroundColor: '#00897B',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </form>
  ),
};

/**
 * Interactive Demo
 */
export const Interactive: Story = {
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'medium',
    label: 'Interactive Input',
    placeholder: 'Type something...',
    helperText: 'This is an interactive demo',
  },
};
