import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type PostGenerationContext = 'cover-letter' | 'ksc' | 'ats';

interface NextStep {
  label: string;
  route: string;
  queryParams?: Record<string, string>;
}

const NEXT_STEPS: Record<PostGenerationContext, NextStep[]> = {
  'cover-letter': [
    {
      label: 'Run an ATS check on your resume for this role',
      route: '/analysis',
    },
  ],
  ksc: [
    {
      label: 'Save to My Documents',
      route: '/documents',
    },
    {
      label: 'Generate a cover letter for the same role',
      route: '/cover-letter-generator',
    },
  ],
  ats: [
    {
      label: 'Now generate a tailored cover letter',
      route: '/cover-letter-generator',
    },
  ],
};

interface PostGenerationCTAProps {
  context: PostGenerationContext;
  /** Optional job URL to pass as a query param for pre-filling the next tool */
  jobUrl?: string;
}

/**
 * PostGenerationCTA — M3 recommendation from docs/analysis/user-journey-analysis.md
 *
 * Shown at the bottom of the result step in CoverLetterGenerator (step 4),
 * KSCGenerator (step 3), and AnalysisPage once a score is returned.
 *
 * Connects the AI tools together so each success naturally leads the user
 * to the next step in their job application workflow.
 */
export function PostGenerationCTA({ context, jobUrl }: PostGenerationCTAProps) {
  const navigate = useNavigate();
  const steps = NEXT_STEPS[context];

  const handleNavigate = (step: NextStep) => {
    const params = new URLSearchParams(step.queryParams);
    if (jobUrl) params.set('jobUrl', jobUrl);
    const query = params.toString();
    navigate(`${step.route}${query ? `?${query}` : ''}`);
  };

  return (
    <div className="mt-6 pt-6 border-t border-outline/30">
      <p className="text-[10px] font-annotation uppercase tracking-[0.3em] text-on-surface-variant opacity-60 mb-3">
        {"What's next?"}
      </p>
      <div className="flex flex-wrap gap-3">
        {steps.map((step) => (
          <button
            key={step.route}
            onClick={() => handleNavigate(step)}
            className="
              inline-flex items-center gap-2 px-4 py-2.5 rounded-march
              border border-tertiary/30 text-tertiary bg-tertiary/5
              text-xs font-medium
              hover:bg-tertiary/15 hover:border-tertiary/60
              transition-colors
            "
          >
            {step.label} <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default PostGenerationCTA;
