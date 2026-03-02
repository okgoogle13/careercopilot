import type { Meta, StoryObj } from '@storybook/react';
import { Lens } from './Lens';
import 'src/styles/design-tokens.css';

const meta: Meta<typeof Lens> = {
  title: 'Components/Lens',
  component: Lens,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showCounter: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    variant: 'outlined',
    helperText: "We'll never share your email.",
  },
};

export const Filled: Story = {
  args: {
    label: 'Username',
    placeholder: 'antigravity_agent',
    variant: 'filled',
  },
};

export const Error: Story = {
  args: {
    label: 'Password',
    type: 'password',
    defaultValue: '123',
    error: true,
    errorMessage: 'Password must be at least 8 characters.',
  },
};

export const WithCounter: Story = {
  args: {
    label: 'Description',
    placeholder: 'Tell us about yourself...',
    showCounter: true,
    maxLength: 100,
    defaultValue: 'Building powerful agentic AI...',
  },
};

export const Disabled: Story = {
  args: {
    label: 'API Key',
    defaultValue: 'sk-xxxxxxxx',
    disabled: true,
  },
};
