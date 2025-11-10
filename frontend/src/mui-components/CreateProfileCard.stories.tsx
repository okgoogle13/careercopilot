import type { Meta, StoryObj } from '@storybook/react';
import { CreateProfileCard } from './CreateProfileCard';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Components/CreateProfileCard',
  component: CreateProfileCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onCreate: { action: 'createProfile' },
  },
} satisfies Meta<typeof CreateProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCreate: action('onCreate'),
  },
};

export const WithCustomClickHandler: Story = {
  args: {
    onCreate: () => {
      console.log('Custom create handler called');
      action('customCreate')();
    },
  },
};
