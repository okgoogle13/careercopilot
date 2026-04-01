import React from 'react';
import { MatchAnalysis, JobOpportunity } from '../../../../types/career';

interface Props {
  analysis: MatchAnalysis;
  job: JobOpportunity;
}

export const MatchScoreHeader: React.FC<Props> = ({ analysis, job }) => {
  return (
    <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-8 rounded-[var(--sys-shape-radius-xl)] border border-[var(--sys-color-concreteGrey-steps-0)] flex items-center gap-8">
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
            stroke="#383632"
            strokeWidth="10"
          />
          {/* Score arc: green=#48DA8B (kr-activist-smoke-green-base), amber=#F6E748 (stencil-yellow-base), red=#F14844 (kr-charcoal-red-base) */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={
              analysis.Overall_Fit_Score >= 80
                ? '#48DA8B'
                : analysis.Overall_Fit_Score >= 60
                  ? '#F6E748'
                  : '#F14844'
            }
            strokeWidth="10"
            strokeDasharray={`${analysis.Overall_Fit_Score * 2.827} 282.7`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)]">
            {analysis.Overall_Fit_Score}%
          </span>
          <span className="text-xs text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">
            Fit Score
          </span>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)] mb-2">
          Match Analysis Complete
        </h2>
        <p className="text-[var(--sys-color-worker-ash-base)] text-lg">
          Your profile is a{' '}
          <strong>
            {analysis.Overall_Fit_Score >= 80
              ? 'strong'
              : analysis.Overall_Fit_Score >= 60
                ? 'moderate'
                : 'weak'}{' '}
            match
          </strong>{' '}
          for the {job.Job_Title} role at {job.Company_Name}.
        </p>
      </div>
    </div>
  );
};
