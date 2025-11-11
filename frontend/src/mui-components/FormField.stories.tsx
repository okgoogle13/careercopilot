import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { TextField } from '@mui/material';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Components/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A standardized form field wrapper that provides consistent styling, labels, help text, and error states for form controls.',
      },
    },
  },
  tags: ['autodocs', 'form'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label text for the form field',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the field',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message to display (enables error state)',
    },
    required: {
      control: 'boolean',
      description: 'Makes the field required',
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage with TextField
export const Default: Story = {
  args: {
    label: 'Email Address',
    helperText: 'Enter your email address',
    children: (
      <TextField 
        fullWidth 
        placeholder="you@example.com" 
        onChange={action('input-change')}
      />
    ),
  },
};

// Required field
export const RequiredField: Story = {
  args: {
    ...Default.args,
    required: true,
    label: 'Password',
    helperText: 'Must be at least 8 characters',
    children: (
      <TextField 
        fullWidth 
        type="password"
        placeholder="••••••••"
        onChange={action('input-change')}
      />
    ),
  },
};

// Error state
export const WithError: Story = {
  args: {
    ...Default.args,
    label: 'Username',
    error: 'Username is already taken',
    helperText: 'Choose a unique username',
    children: (
      <TextField 
        fullWidth 
        defaultValue="admin"
        error
        onChange={action('input-change')}
      />
    ),
  },
};

// Without label
const WithoutLabelTemplate: Story = {
  args: {
    helperText: 'This field has no label',
    children: (
      <TextField 
        fullWidth 
        placeholder="Optional field"
        onChange={action('input-change')}
      />
    ),
  },
};

export const WithoutLabel = {
  ...WithoutLabelTemplate,
  parameters: {
    docs: {
      description: {
        story: 'FormField can be used without a label for more compact forms.',
      },
    },
  },
};

// With custom styles
export const WithCustomStyles: Story = {
  args: {
    label: 'Custom Styled Field',
    helperText: 'This field has custom styling',
    sx: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.main',
        },
      },
    },
    children: (
      <TextField 
        fullWidth 
        placeholder="Type something..."
        onChange={action('input-change')}
      />
    ),
  },
};
