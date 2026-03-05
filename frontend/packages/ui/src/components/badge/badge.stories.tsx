import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { Star, Clock, CheckCircle } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'Components/UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Active',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Pending',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Draft',
    variant: 'outline',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Rejected',
    variant: 'destructive',
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <Badge {...args}>
      <CheckCircle className="w-3 h-3" />
      Verified
    </Badge>
  ),
};

export const StarBadge: Story = {
  render: (args) => (
    <Badge
      {...args}
      className="bg-yellow-400/20 text-yellow-600 border-yellow-400/30"
    >
      <Star className="w-3 h-3 fill-yellow-600" />
      Premium
    </Badge>
  ),
};
