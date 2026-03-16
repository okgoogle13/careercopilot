import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { JobAnalysisResultsPanel } from '../JobAnalysisResultsPanel';
import type { AnalyzeJobFromUrlResponse } from '@/types/masterResume';

jest.mock('@careercopilot/ui', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <section {...props}>{children}</section>
    ),
  },
}));

jest.mock('lucide-react', () => ({
  Link2: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      data-testid="icon-link"
    />
  ),
}));

const mockResult: AnalyzeJobFromUrlResponse = {
  job_title: 'Community Services Officer',
  company_name: 'Solidarity Works',
  normalized_job_description: 'Support people and coordinate outcomes.',
  ats_preview: {
    score: 87,
    matched_keywords: ['case management', 'stakeholder engagement'],
    missing_keywords: ['trauma-informed'],
  },
  chunk_matches: [
    {
      chunk_id: 'chunk-1',
      label: 'Stakeholder alignment',
      score: 0.67,
      matched_terms: ['stakeholder engagement'],
      snippet: 'Worked with community stakeholders to align services.',
    },
    {
      chunk_id: 'chunk-2',
      label: 'Trauma-informed practice',
      score: 0.21,
      matched_terms: [],
      snippet: 'Needs stronger trauma-informed examples.',
    },
  ],
  artifacts: {
    tailored_resume: 'resume',
    cover_letter: 'cover-letter',
    ksc_response: 'ksc',
  },
  export_pack: {},
};

describe('JobAnalysisResultsPanel', () => {
  it('renders ATS summary and chunk match details', () => {
    render(
      <JobAnalysisResultsPanel
        result={mockResult}
        onNavigateToTracker={jest.fn()}
      />
    );

    expect(screen.getByText('87')).toBeInTheDocument();
    expect(screen.getByText('Community Services Officer')).toBeInTheDocument();
    expect(screen.getByText('Solidarity Works')).toBeInTheDocument();
    expect(screen.getByText('Stakeholder alignment')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
    expect(screen.getByText('terms: none')).toBeInTheDocument();
  });

  it('calls the tracker callback from the CTA', () => {
    const onNavigateToTracker = jest.fn();

    render(
      <JobAnalysisResultsPanel
        result={mockResult}
        onNavigateToTracker={onNavigateToTracker}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /go to tracker/i }));

    expect(onNavigateToTracker).toHaveBeenCalledTimes(1);
  });
});
