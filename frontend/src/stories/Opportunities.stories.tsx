import type { Meta, StoryObj } from '@storybook/react';
import { Opportunities } from '../features/opportunities/Opportunities';
import { API_ENDPOINTS } from '../config/api';

const meta: Meta<typeof Opportunities> = {
  title: 'Features/Opportunities',
  component: Opportunities,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Opportunities>;

const mockOpportunities = {
  found_links: [
    'https://seek.com.au/job/senior-engineer-123',
    'https://linkedin.com/jobs/view/product-designer-456',
    'https://indeed.com/viewjob?jk=789',
    'https://ethicaljobs.com.au/jobs/community-manager',
  ],
  message:
    'Found 4 hidden opportunities matching "Social Worker" in "Melbourne" via autonomous scouting.',
};

export const Default: Story = {};

export const Scouting: Story = {
  decorators: [
    (Story) => {
      window.fetch = () => new Promise(() => {});
      return <Story />;
    },
  ],
};

export const ResultsFound: Story = {
  decorators: [
    (Story) => {
      window.fetch = async (url) => {
        if (url === API_ENDPOINTS.jobScoutSearch) {
          return new Response(JSON.stringify(mockOpportunities), { status: 200 });
        }
        return new Response(JSON.stringify({}), { status: 200 });
      };
      return <Story />;
    },
  ],
};

export const ErrorState: Story = {
  decorators: [
    (Story) => {
      window.fetch = async () => {
        return new Response(
          JSON.stringify({ detail: 'Scout Agent is currently offline. Please try again later.' }),
          { status: 503 }
        );
      };
      return <Story />;
    },
  ],
};
