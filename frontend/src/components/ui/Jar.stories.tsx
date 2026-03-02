import type { Meta, StoryObj } from '@storybook/react';
import { Jar } from './Jar';
import 'src/styles/design-tokens.css';

const meta: Meta<typeof Jar> = {
  title: 'Components/Jar',
  component: Jar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { value: 'au', label: 'Australia' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
];

export const Default: Story = {
  args: {
    label: 'Country',
    options: defaultOptions,
    placeholder: 'Select a location',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Country',
    options: defaultOptions,
    value: 'au',
  },
};

export const Error: Story = {
  args: {
    label: 'Country',
    options: defaultOptions,
    error: true,
    errorMessage: 'Please select a valid country',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Country',
    options: defaultOptions,
    disabled: true,
  },
};
