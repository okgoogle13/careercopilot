import React from 'react';
import { MatchAnalysis, JobOpportunity } from '../../../../types/career';

interface Props {
  analysis: MatchAnalysis;
  job: JobOpportunity;
}

export const MatchScoreHeader: React.FC<Props> = ({ analysis, job }) => {
  const fitScore = Math.max(0, Math.min(100, analysis.Overall_Fit_Score));
  const scoreColor =
    fitScore >= 80
      ? 'var(--kr-color-kr-activist-smoke-green-base)'
      : fitScore >= 60
        ? 'var(--kr-color-stencil-yellow-base)'
        : 'var(--kr-color-kr-charcoal-red-base)';

  return (
    <div className="bg-[var(--kr-color-charcoal-background-steps-1)] p-8 rounded-megaphone border border-[var(--kr-color-concrete-grey-steps-0)] flex items-center gap-8">
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--kr-color-asphalt-black-steps-4)"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={scoreColor}
            strokeWidth="10"
            strokeDasharray={`${fitScore * 2.827} 282.7`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[var(--kr-color-paper-white-base)]">
            {fitScore}%
          </span>
          <span className="text-xs text-[var(--kr-color-worker-ash-base)] uppercase tracking-wider">
            Fit Score
          </span>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-[var(--kr-color-paper-white-base)] mb-2">
          Match Analysis Complete
        </h2>
        <p className="text-[var(--kr-color-worker-ash-base)] text-lg">
          Your profile is a{' '}
          <strong>{fitScore >= 80 ? 'strong' : fitScore >= 60 ? 'moderate' : 'weak'} match</strong>{' '}
          for the {job.Job_Title} role at {job.Company_Name}.
        </p>
      </div>
    </div>
  );
};
