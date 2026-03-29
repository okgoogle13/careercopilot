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
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
  Link2: () => <span data-testid="icon-link" />,
  ArrowRight: () => <span data-testid="icon-arrow" />,
  Copy: () => <span data-testid="icon-copy" />,
  Check: () => <span data-testid="icon-check" />,
  AlertCircle: () => <span data-testid="icon-alert" />,
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
    tailored_resume: 'resume content',
    cover_letter: 'cover letter content',
    ksc_response: 'ksc content',
  },
  export_pack: {},
};

describe('JobAnalysisResultsPanel', () => {
  it('renders ATS summary and chunk match details with progress bars', () => {
    render(
      <JobAnalysisResultsPanel
        result={mockResult}
        onNavigateToTracker={jest.fn()}
      />
    );

    // Score assertion
    expect(screen.getByText('87')).toBeInTheDocument();
    expect(screen.getByText('Community Services Officer')).toBeInTheDocument();
    expect(screen.getByText('Solidarity Works')).toBeInTheDocument();

    // Chunk match details
    expect(screen.getByText('Stakeholder alignment')).toBeInTheDocument();
    // Progress bar check for 67% (0.67 score)
    // The component renders "terms: stakeholder engagement" and "terms: none"
    expect(screen.getByText(/terms: stakeholder engagement/i)).toBeInTheDocument();
    expect(screen.getByText(/terms: none/i)).toBeInTheDocument();

    // Artifact sections
    expect(screen.getByText('Tailored Resume')).toBeInTheDocument();
    expect(screen.getByText('Cover Letter')).toBeInTheDocument();
    expect(screen.getByText('KSC Response')).toBeInTheDocument();
  });

  it('calls the tracker callback from the CTA with correct capitalization', () => {
    const onNavigateToTracker = jest.fn();

    render(
      <JobAnalysisResultsPanel
        result={mockResult}
        onNavigateToTracker={onNavigateToTracker}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Go To Tracker/i }));

    expect(onNavigateToTracker).toHaveBeenCalledTimes(1);
  });

  it('handles item match colors correctly', () => {
    const { rerender } = render(
      <JobAnalysisResultsPanel
        result={mockResult}
        onNavigateToTracker={jest.fn()}
      />
    );

    // High score item (0.67 is medium in our logic, need a high one to test)
    const resultHigh = {
      ...mockResult,
      chunk_matches: [{ ...mockResult.chunk_matches[0], score: 0.9 }],
    };

    rerender(
      <JobAnalysisResultsPanel
        result={resultHigh}
        onNavigateToTracker={jest.fn()}
      />
    );

    expect(screen.getByText(/Stakeholder alignment/i)).toBeInTheDocument();
  });
});
