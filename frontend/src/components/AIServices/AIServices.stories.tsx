import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { JobMatchingComponent } from './JobMatchingComponent';
import { ContentOptimizationComponent } from './ContentOptimizationComponent';
import { ResumeIntelligenceComponent } from './ResumeIntelligenceComponent';
import { CoverLetterGenerationComponent } from './CoverLetterGenerationComponent';
import { AILoadingState, JobMatchSkeleton, ContentOptimizationSkeleton } from './AILoadingStates';
import {
  AISuccessHeader,
  ScoreDisplay,
  SkillTag,
  ImprovementItem,
  ActionButtons,
  ProgressIndicator,
  FeedbackSection
} from './AIResultsDisplay';
import {
  mockJobMatchingResult,
  mockContentOptimizationResult,
  mockResumeIntelligenceResult,
  mockCoverLetterResult
} from '../../utils/mockData';
import { Brain, Target, Sparkles, FileText, CheckCircle } from 'lucide-react';
import React from 'react';

// Mock the AI services for Storybook
const mockAiServices = {
  getJobMatching: () => Promise.resolve(mockJobMatchingResult),
  optimizeContent: () => Promise.resolve(mockContentOptimizationResult),
  getResumeIntelligence: () => Promise.resolve(mockResumeIntelligenceResult),
  generateCoverLetter: () => Promise.resolve(mockCoverLetterResult),
};

// Job Matching Component Stories
const jobMatchingMeta: Meta<typeof JobMatchingComponent> = {
  title: 'AI Services/Job Matching',
  component: JobMatchingComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'AI-powered job matching component that helps users find relevant job opportunities based on their skills and preferences.',
      },
    },
  },
  argTypes: {
    resumeDocumentId: {
      control: 'text',
      description: 'ID of the user\'s resume document',
    },
    onJobSelected: {
      action: 'job-selected',
      description: 'Callback when a job is selected',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-6xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default jobMatchingMeta;
type JobMatchingStory = StoryObj<typeof jobMatchingMeta>;

export const Default: JobMatchingStory = {
  args: {
    resumeDocumentId: 'sample-resume-123',
    onJobSelected: (jobId) => console.log('Selected job:', jobId),
  },
};

export const WithoutResume: JobMatchingStory = {
  args: {
    resumeDocumentId: undefined,
    onJobSelected: (jobId) => console.log('Selected job:', jobId),
  },
};

export const InteractiveJobMatching: JobMatchingStory = {
  args: {
    resumeDocumentId: 'sample-resume-123',
    onJobSelected: (jobId) => console.log('Selected job:', jobId),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in preferences
    const jobTypeSelect = canvas.getByLabelText(/job type/i);
    await userEvent.selectOptions(jobTypeSelect, 'full-time');

    const locationInput = canvas.getByLabelText(/location preference/i);
    await userEvent.type(locationInput, 'San Francisco, CA');

    const salaryMinInput = canvas.getByLabelText(/min salary/i);
    await userEvent.type(salaryMinInput, '120000');

    // Note: In a real Storybook setup, you might mock the API call here
  },
};

// Content Optimization Component Stories
const contentOptimizationMeta: Meta<typeof ContentOptimizationComponent> = {
  title: 'AI Services/Content Optimization',
  component: ContentOptimizationComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'AI-powered content optimization tool for resumes, cover letters, and professional content.',
      },
    },
  },
  argTypes: {
    initialContent: {
      control: 'text',
      description: 'Initial content to optimize',
    },
    contentType: {
      control: 'select',
      options: ['resume', 'cover_letter', 'linkedin', 'portfolio'],
      description: 'Type of content being optimized',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-6xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export const ContentOptimizationDefault: StoryObj<typeof contentOptimizationMeta> = {
  args: {
    initialContent: '',
    contentType: 'resume',
  },
};

export const ContentOptimizationWithContent: StoryObj<typeof contentOptimizationMeta> = {
  args: {
    initialContent: `John Doe
Software Engineer

Experience:
- Worked on web applications
- Used React and JavaScript
- Collaborated with team members`,
    contentType: 'resume',
  },
};

export const CoverLetterOptimization: StoryObj<typeof contentOptimizationMeta> = {
  args: {
    initialContent: `Dear Hiring Manager,

I am interested in the software engineer position at your company. I have experience with programming and think I would be a good fit.

Best regards,
John Doe`,
    contentType: 'cover_letter',
  },
};

// Resume Intelligence Component Stories
const resumeIntelligenceMeta: Meta<typeof ResumeIntelligenceComponent> = {
  title: 'AI Services/Resume Intelligence',
  component: ResumeIntelligenceComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'AI-powered resume analysis providing career insights and market positioning.',
      },
    },
  },
  argTypes: {
    resumeDocumentId: {
      control: 'text',
      description: 'ID of the user\'s resume document',
    },
    initialResumeContent: {
      control: 'text',
      description: 'Fallback resume content if document not found',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-6xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export const ResumeIntelligenceDefault: StoryObj<typeof resumeIntelligenceMeta> = {
  args: {
    resumeDocumentId: 'sample-resume-123',
  },
};

export const ResumeIntelligenceWithFallback: StoryObj<typeof resumeIntelligenceMeta> = {
  args: {
    resumeDocumentId: undefined,
    initialResumeContent: `John Doe
Senior Software Engineer
5 years experience with React, Node.js, and TypeScript`,
  },
};

// Cover Letter Generation Component Stories
const coverLetterMeta: Meta<typeof CoverLetterGenerationComponent> = {
  title: 'AI Services/Cover Letter Generation',
  component: CoverLetterGenerationComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'AI-powered cover letter generator with company research and personalization.',
      },
    },
  },
  argTypes: {
    resumeDocumentId: {
      control: 'text',
      description: 'ID of the user\'s resume document',
    },
    initialJobDescription: {
      control: 'text',
      description: 'Job description to target',
    },
    initialCompanyName: {
      control: 'text',
      description: 'Target company name',
    },
    initialPositionTitle: {
      control: 'text',
      description: 'Target position title',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-6xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export const CoverLetterDefault: StoryObj<typeof coverLetterMeta> = {
  args: {
    resumeDocumentId: 'sample-resume-123',
  },
};

export const CoverLetterWithInitialData: StoryObj<typeof coverLetterMeta> = {
  args: {
    resumeDocumentId: 'sample-resume-123',
    initialJobDescription: 'We are seeking a Senior Software Engineer to join our team. You will work on building scalable web applications using React and Node.js...',
    initialCompanyName: 'TechCorp Inc',
    initialPositionTitle: 'Senior Software Engineer',
  },
};

// AI Loading States Stories
const loadingStatesMeta: Meta<typeof AILoadingState> = {
  title: 'AI Services/Loading States',
  component: AILoadingState,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Loading states and skeleton components for AI services.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['job-matching', 'content-optimization', 'resume-intelligence', 'cover-letter'],
      description: 'Type of AI service being processed',
    },
    message: {
      control: 'text',
      description: 'Custom loading message',
    },
  },
};

export const JobMatchingLoading: StoryObj<typeof loadingStatesMeta> = {
  args: {
    type: 'job-matching',
  },
};

export const ContentOptimizationLoading: StoryObj<typeof loadingStatesMeta> = {
  args: {
    type: 'content-optimization',
    message: 'Optimizing your resume content with advanced AI algorithms...',
  },
};

export const ResumeIntelligenceLoading: StoryObj<typeof loadingStatesMeta> = {
  args: {
    type: 'resume-intelligence',
  },
};

export const CoverLetterLoading: StoryObj<typeof loadingStatesMeta> = {
  args: {
    type: 'cover-letter',
  },
};

// Skeleton Loading States
export const JobMatchingSkeleton: StoryObj = {
  render: () => <JobMatchSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading state for job matching results.',
      },
    },
  },
};

export const ContentOptimizationSkeleton: StoryObj = {
  render: () => <ContentOptimizationSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading state for content optimization results.',
      },
    },
  },
};

// AI Results Display Components Stories
const resultsDisplayMeta: Meta = {
  title: 'AI Services/Results Display',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Reusable components for displaying AI service results.',
      },
    },
  },
};

export const SuccessHeader: StoryObj = {
  render: () => (
    <AISuccessHeader
      title="Job Matching Complete!"
      subtitle="Found 15 relevant opportunities for you"
      icon={<Target className="h-6 w-6" />}
      score={87}
      processingTime="32 seconds"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Success header component for displaying AI service completion.',
      },
    },
  },
};

export const ScoreDisplays: StoryObj = {
  render: () => (
    <div className="flex gap-6">
      <ScoreDisplay score={92} label="ATS Score" description="Excellent" />
      <ScoreDisplay score={76} label="Match Score" description="Good" size="sm" />
      <ScoreDisplay score={45} label="Readability" description="Needs Work" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Score display components in different sizes and score ranges.',
      },
    },
  },
};

export const SkillTags: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <SkillTag skill="React" level="expert" demand="high" verified />
      <SkillTag skill="TypeScript" level="advanced" demand="high" />
      <SkillTag skill="Node.js" level="intermediate" demand="medium" />
      <SkillTag skill="GraphQL" level="beginner" demand="high" />
      <SkillTag skill="Python" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Skill tags with different proficiency levels and market demand indicators.',
      },
    },
  },
};

export const ImprovementItemExample: StoryObj = {
  render: () => (
    <ImprovementItem
      type="Impact Quantification"
      original="Improved application performance"
      improved="Reduced application load time by 60% through code optimization and lazy loading implementation"
      reason="Quantified achievements are more compelling and demonstrate measurable impact to potential employers"
      impactScore={9}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Improvement item showing before/after content with reasoning.',
      },
    },
  },
};

export const ActionButtonsExample: StoryObj = {
  render: () => (
    <ActionButtons
      onCopy={() => console.log('Copy clicked')}
      onDownload={() => console.log('Download clicked')}
      onShare={() => console.log('Share clicked')}
      onBookmark={() => console.log('Bookmark clicked')}
      onView={() => console.log('View clicked')}
      copyText="Sample content to copy"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Action buttons for AI results - copy, download, share, bookmark, view.',
      },
    },
  },
};

export const ProgressIndicatorExample: StoryObj = {
  render: () => (
    <ProgressIndicator
      steps={[
        { label: 'Upload Resume', completed: true },
        { label: 'AI Analysis', completed: true },
        { label: 'Generate Matches', current: true, completed: false },
        { label: 'Review Results', completed: false },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress indicator showing multi-step AI processing workflow.',
      },
    },
  },
};

export const FeedbackSectionExample: StoryObj = {
  render: () => (
    <FeedbackSection
      title="Rate this job matching result"
      onFeedback={(rating, comment) =>
        console.log('Feedback:', { rating, comment })
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'User feedback section for rating AI service results.',
      },
    },
  },
};

// Interactive Stories with Actions
export const InteractiveContentOptimization: StoryObj<typeof contentOptimizationMeta> = {
  args: {
    initialContent: 'John Doe\nSoftware Engineer\nExperienced developer',
    contentType: 'resume',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Set target role
    const targetRoleInput = canvas.getByLabelText(/target role/i);
    await userEvent.clear(targetRoleInput);
    await userEvent.type(targetRoleInput, 'Senior Software Engineer');

    // Set target company
    const targetCompanyInput = canvas.getByLabelText(/target company/i);
    await userEvent.type(targetCompanyInput, 'Google');

    // Select additional optimization goal
    const readabilityCheckbox = canvas.getByRole('checkbox', { name: /readability improvement/i });
    await userEvent.click(readabilityCheckbox);

    // Verify form state
    await expect(targetRoleInput).toHaveValue('Senior Software Engineer');
    await expect(targetCompanyInput).toHaveValue('Google');
    await expect(readabilityCheckbox).toBeChecked();
  },
};

export const InteractiveCoverLetterGeneration: StoryObj<typeof coverLetterMeta> = {
  args: {
    resumeDocumentId: 'sample-resume-123',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in job details
    const companyNameInput = canvas.getByLabelText(/company name/i);
    await userEvent.type(companyNameInput, 'Google');

    const positionInput = canvas.getByLabelText(/position title/i);
    await userEvent.type(positionInput, 'Senior Software Engineer');

    const jobDescriptionTextarea = canvas.getByLabelText(/job description/i);
    await userEvent.type(jobDescriptionTextarea, 'We are seeking a Senior Software Engineer...');

    // Fill in personal background
    const nameInput = canvas.getByLabelText(/full name/i);
    await userEvent.type(nameInput, 'John Doe');

    // Change tone
    const toneSelect = canvas.getByLabelText(/tone/i);
    await userEvent.selectOptions(toneSelect, 'enthusiastic');

    // Verify form state
    await expect(companyNameInput).toHaveValue('Google');
    await expect(positionInput).toHaveValue('Senior Software Engineer');
    await expect(toneSelect).toHaveValue('enthusiastic');
  },
};
