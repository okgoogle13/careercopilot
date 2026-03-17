import type { Meta, StoryObj } from '@storybook/react';
import { JobQueue } from '../features/jobs/JobQueue';
import { API_ENDPOINTS } from '../config/api';
import { Toaster } from 'sonner';

/**
 * JobQueue Page Story
 *
 * This story demonstrates the JobQueue page which displays
 * jobs clipped from the browser extension.
 *
 * NOTE: Since the component uses the global `fetch` API directly,
 * we are mocking it in the story decorators.
 */
const meta: Meta<typeof JobQueue> = {
  title: 'Features/Jobs/JobQueue',
  component: JobQueue,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen">
        <Toaster position="top-right" />
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JobQueue>;

const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Engineer (React)',
    company: 'Atlassian',
    url: 'https://seek.com.au/job/1',
    status: 'ready_to_apply',
    date_clipped: '2026-01-05T09:30:00Z',
    notes: 'Requires experience with design systems and Material 3.',
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'Canva',
    url: 'https://seek.com.au/job/2',
    status: 'pending_analysis',
    date_clipped: '2026-01-06T11:15:00Z',
  },
  {
    id: '3',
    title: 'Machine Learning Specialist',
    company: 'Google',
    url: 'https://seek.com.au/job/3',
    status: 'applied',
    date_clipped: '2026-01-04T15:45:00Z',
    notes: 'Applied via internal referral.',
  },
];

export const Default: Story = {
  decorators: [
    (Story) => {
      window.fetch = async (url) => {
        if (url === API_ENDPOINTS.jobQueue) {
          return new Response(JSON.stringify(mockJobs), { status: 200 });
        }
        return new Response(JSON.stringify({}), { status: 200 });
      };
      return <Story />;
    },
  ],
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      // Mock fetch that hangs forever
      window.fetch = () => new Promise(() => {});
      return <Story />;
    },
  ],
};

export const Empty: Story = {
  decorators: [
    (Story) => {
      window.fetch = async (url) => {
        if (url === API_ENDPOINTS.jobQueue) {
          return new Response(JSON.stringify([]), { status: 200 });
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
        return new Response(JSON.stringify({ detail: 'Failed to connect to backend server.' }), {
          status: 500,
          statusText: 'Internal Server Error',
        });
      };
      return <Story />;
    },
  ],
};

export const ActionStates: Story = {
  decorators: [
    (Story) => {
      window.fetch = async (url) => {
        if (url === API_ENDPOINTS.jobQueue) {
          return new Response(JSON.stringify(mockJobs), { status: 200 });
        }
        // Simulate analysis result
        if (url.toString().includes('analyze')) {
          await new Promise((r) => setTimeout(r, 1500));
          return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
        }
        return new Response(JSON.stringify({}), { status: 200 });
      };
      return <Story />;
    },
  ],
};
