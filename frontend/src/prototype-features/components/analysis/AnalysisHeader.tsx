/* eslint-disable */
import React from 'react';

interface AnalysisHeaderProps {
  score: number;
  jobTitle: string;
  companyName: string;
}

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({ score, jobTitle, companyName }) => {
  const strokeColor =
    score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-8 rounded-[var(--sys-shape-radius-xl)] border border-[var(--sys-color-concreteGrey-steps-0)] flex items-center gap-8">
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={`${score * 2.827} 282.7`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)]">
            {score}%
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
            {score >= 80 ? 'strong' : score >= 60 ? 'moderate' : 'weak'} match
          </strong>{' '}
          for the {jobTitle} role at {companyName}.
        </p>
      </div>
    </div>
  );
};
