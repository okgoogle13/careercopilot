import type { Meta, StoryObj } from '@storybook/react';
import { SmartIngestion as IngestionPage } from '../features/ingestion/SmartIngestion';
import { EntryType } from '../types/api';

const meta: Meta<typeof IngestionPage> = {
  title: 'Features/Ingestion/SmartIngestion',
  component: IngestionPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof IngestionPage>;

const mockCareerData = {
  Personal_Information: {
    FullName: 'Alex Mercer',
    Phone: '+61 400 000 000',
    Email: 'alex.mercer@example.com',
    Location: 'Sydney, NSW',
    Portfolio_Website_URLs: ['https://alexmercer.dev'],
  },
  Career_Profile: {
    Target_Titles: ['Senior Frontend Architect', 'Technical Product Manager'],
    Master_Summary_Points: [
      'Over 10 years of experience in modern JavaScript frameworks.',
      'Specialist in design systems and accessible UI architecture.',
    ],
  },
  Master_Skills_Inventory: [
    {
      Skill_Name: 'React',
      Category: 'Frontend',
      Subtype: ['Frameworks'],
      Proficiency: 'Expert',
      Years_Experience: 8,
    },
    {
      Skill_Name: 'TypeScript',
      Category: 'Languages',
      Subtype: ['Web'],
      Proficiency: 'Expert',
      Years_Experience: 6,
    },
  ],
  Career_Entries: [
    {
      Entry_ID: 'work-1',
      Entry_Type: EntryType.WORK_EXPERIENCE,
      Organization: 'Global Tech Corp',
      Role: 'Lead Frontend Engineer',
      StartDate: '2020-01-01',
      EndDate: 'Present',
      Location: 'Remote',
      Core_Responsibilities_Scope:
        'Led a team of 15 developers in rebuilding the core platform UI.',
      Subtype_Tags: ['Management', 'React'],
    },
  ],
  Structured_Achievements: [
    {
      Achievement_ID: 'ach-1',
      Entry_ID: 'work-1',
      Original_Text: 'Reduced bundle size by 40% using code splitting.',
      Action_Verb: 'Architected',
      Noun_Task: 'code splitting strategy',
      Metric: '40% reduction in bundle size',
      Strategy: 'Webpack optimization and dynamic imports',
      Outcome: 'Significantly improved initial load times and Lighthouse scores.',
      Skills_Used: ['Webpack', 'React'],
      Tools_Used: ['Lighthouse'],
      Subtype_Tags: ['Performance'],
      Needs_Review_Flag: false,
    },
    {
      Achievement_ID: 'ach-2',
      Entry_ID: 'work-1',
      Original_Text: 'Managed a team.',
      Action_Verb: 'Supervised',
      Noun_Task: 'engineering team',
      Metric: 'N/A',
      Strategy: 'Agile methodologies',
      Outcome: 'Delivered projects on time.',
      Skills_Used: ['Agile'],
      Tools_Used: ['Jira'],
      Subtype_Tags: ['Leadership'],
      Needs_Review_Flag: true,
      Improvement_Suggestions: {
        Action_Verb: 'Spearheaded',
        Metric: 'team of 15 engineers across 3 timezones',
        Outcome: 'increased velocity by 25% while maintaining code quality',
      },
    },
  ],
  KSC_Responses: [
    {
      KSC_ID: 'ksc-1',
      KSC_Prompt: 'Demonstrated experience in leadership.',
      Situation: 'A conflict arose during a critical sprint.',
      Task: 'Resolve the conflict and ship the feature.',
      Action: 'Facilitated a technical workshop to reach consensus.',
      Result: 'Shipped the feature with zero regressions.',
      Skills_Used: ['Leadership', 'Conflict Resolution'],
      Subtype_Tags: ['Soft Skills'],
      Original_Text: 'I led my team through a hard time.',
      Needs_Review_Flag: true,
      STAR_Feedback: 'The result could be more quantified. How much did the team velocity improve?',
      Improvement_Suggestions: {
        Result:
          'The feature was delivered 2 days ahead of schedule, resulting in a successful client launch.',
      },
    },
  ],
};

export const Idle: Story = {};

export const SelectedFiles: Story = {
  // This is hard to mock exactly because File objects are browser-native and state is internal.
  // But we can document that this is the initial state.
};

export const LoadingStages: Story = {
  decorators: [
    (Story) => {
      // Mock fetch to simulate slow ingestion
      window.fetch = () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(new Response(JSON.stringify(mockCareerData), { status: 200 }));
          }, 5000);
        });
      return <Story />;
    },
  ],
};

export const ErrorState: Story = {
  decorators: [
    (Story) => {
      window.fetch = async () => {
        return new Response(JSON.stringify({ detail: 'File format not supported or corrupted.' }), {
          status: 400,
        });
      };
      return <Story />;
    },
  ],
};

export const ValidationStep: Story = {
  decorators: [
    (Story) => {
      // Direct jump to success by mocking the hook return if we were using dependency injection,
      // but here we just mock the fetch call that the hook makes.
      // After the upload completes in the story, the user will see the dashboard.
      window.fetch = async () => {
        return new Response(JSON.stringify(mockCareerData), { status: 200 });
      };
      return <Story />;
    },
  ],
};
