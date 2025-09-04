import type { StoryObj } from '@storybook/react';
import React from 'react';
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
  FeedbackSection,
} from './AIResultsDisplay';
import { Target } from 'lucide-react';

// Default export for Storybook
export default {
  title: 'AI Services',
  parameters: {
    layout: 'padded',
  },
};

type Story = StoryObj;

// Job Matching Stories
export const JobMatchingDefault: Story = {
  render: () => (
    <JobMatchingComponent
      resumeDocumentId='sample-resume-123'
      onJobSelected={jobId => console.log('Selected job:', jobId)}
    />
  ),
};

// Content Optimization Stories
export const ContentOptimizationDefault: Story = {
  render: () => <ContentOptimizationComponent />,
};

export const ContentOptimizationWithContent: Story = {
  render: () => (
    <ContentOptimizationComponent
      initialContent='John Doe\nSoftware Engineer\nExperienced in React and TypeScript'
      contentType='resume'
    />
  ),
};

// Resume Intelligence Stories
export const ResumeIntelligenceDefault: Story = {
  render: () => <ResumeIntelligenceComponent />,
};

// Cover Letter Stories
export const CoverLetterDefault: Story = {
  render: () => <CoverLetterGenerationComponent />,
};

// Loading States Stories
export const JobMatchingSkeleton: Story = {
  render: () => <JobMatchSkeleton />,
};

export const ContentOptimizationSkeletonStory: Story = {
  render: () => <ContentOptimizationSkeleton />,
};

export const LoadingState: Story = {
  render: () => (
    <AILoadingState
      message='Analyzing your resume...'
      estimatedTime={30}
      currentStep='Processing content'
      steps={['Upload', 'Process', 'Analyze', 'Generate']}
    />
  ),
};

// Results Display Components
export const SuccessHeader: Story = {
  render: () => (
    <AISuccessHeader
      title='Job Matching Complete!'
      subtitle='Found 15 relevant opportunities for you'
      icon={<Target className='h-6 w-6' />}
      className='mb-4'
    />
  ),
};

export const ScoreDisplayExample: Story = {
  render: () => <ScoreDisplay score={85} label='Match Score' color='green' />,
};

export const SkillTagsExample: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <SkillTag skill='React' level='expert' />
      <SkillTag skill='TypeScript' level='advanced' />
      <SkillTag skill='Node.js' level='intermediate' />
    </div>
  ),
};

export const ImprovementItemExample: Story = {
  render: () => (
    <ImprovementItem
      title='Add more quantified achievements'
      description='Include specific numbers and metrics to demonstrate your impact'
      impact='high'
      category='content'
    />
  ),
};

export const ActionButtonsExample: Story = {
  render: () => (
    <ActionButtons
      onCopy={() => console.log('Copied!')}
      onDownload={() => console.log('Downloaded!')}
      onShare={() => console.log('Shared!')}
    />
  ),
};

export const ProgressIndicatorExample: Story = {
  render: () => (
    <ProgressIndicator current={2} total={4} steps={['Upload', 'Process', 'Analyze', 'Generate']} />
  ),
};

export const FeedbackSectionExample: Story = {
  render: () => (
    <FeedbackSection onFeedback={(rating, comment) => console.log('Feedback:', rating, comment)} />
  ),
};
