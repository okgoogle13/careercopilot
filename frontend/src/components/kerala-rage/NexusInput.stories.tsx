import type { Meta, StoryObj } from '@storybook/react';
import { NexusInput } from './NexusInput';

const meta: Meta<typeof NexusInput> = {
  title: 'KeralaRage/NexusInput',
  component: NexusInput,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'radio',
      options: ['none', 'search'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    error: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof NexusInput>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    icon: 'none',
  },
};

export const SearchBar: Story = {
  args: {
    placeholder: 'Search opportunities...',
    icon: 'search',
  },
};

export const Loading: Story = {
  args: {
    placeholder: 'Searching...',
    icon: 'search',
    loading: true,
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: 'Invalid input...',
    icon: 'none',
    error: true,
    value: 'Malient',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};
