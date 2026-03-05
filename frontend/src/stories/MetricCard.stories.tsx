import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from '../components/shared/MetricCard';
import { Target, TrendingUp, Users, Clock, Award } from 'lucide-react';

const meta: Meta<typeof MetricCard> = {
  title: 'Shared/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false },
    label: { control: 'text' },
    value: { control: 'text' },
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
    },
    hoverable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {
  args: {
    label: 'ATS Match Score',
    value: '94%',
    icon: Target,
    iconColor: 'text-primary',
  },
};

export const RetentionRate: Story = {
  args: {
    label: 'Retention Rate',
    value: '88%',
    icon: TrendingUp,
    iconColor: 'text-secondary',
    variant: 'filled',
  },
};

export const ActiveUsers: Story = {
  args: {
    label: 'Hiring Partners',
    value: '12',
    icon: Users,
    iconColor: 'text-tertiary',
  },
};

export const TimeSaved: Story = {
  args: {
    label: 'Application Time',
    value: '-15min',
    icon: Clock,
    iconColor: 'text-warning',
  },
};

export const GridDisplay: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Job Matches"
        value="25"
        icon={Award}
      />
      <MetricCard
        label="Invitations"
        value="5"
        icon={TrendingUp}
        variant="filled"
        iconColor="text-secondary"
      />
      <MetricCard
        label="Days In Queue"
        value="2.5"
        icon={Clock}
        iconColor="text-error"
      />
      <MetricCard
        label="Connection Strength"
        value="High"
        icon={Target}
        iconColor="text-primary"
      />
    </div>
  ),
};
