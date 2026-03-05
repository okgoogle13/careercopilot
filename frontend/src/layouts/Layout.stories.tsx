import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';
import { MemoryRouter } from 'react-router-dom';
import { MetricCard } from '../components/ui/metric-card';
import { Briefcase, Users, TrendingUp } from 'lucide-react';

const meta: Meta<typeof Layout> = {
  title: 'Layouts/MainLayout',
  component: Layout,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const DashboardMock: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-4xl tier-display mb-8">Executive Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            icon={Briefcase}
            label="Active Applications"
            value="12"
            variant="filled"
          />
          <MetricCard
            icon={Users}
            label="Network Contacts"
            value="342"
            variant="outlined"
          />
          <MetricCard
            icon={TrendingUp}
            label="Interview Rate"
            value="28%"
            variant="filled"
            iconColor="text-[#81b29a]"
          />
        </div>
        <div className="mt-8 p-12 rounded-[32px] bg-surface-container border border-outline-variant">
          <h2 className="text-2xl tier-display mb-4">Recent Activity</h2>
          <p className="tier-body text-on-surface-variant">
            No recent activity detected. Connect your LinkedIn to start tracking.
          </p>
        </div>
      </div>
    ),
  },
};

export const EmptyPage: Story = {
  args: {
    children: (
      <div className="flex items-center justify-center h-screen">
        <p className="tier-data">Loading application state...</p>
      </div>
    ),
  },
};
