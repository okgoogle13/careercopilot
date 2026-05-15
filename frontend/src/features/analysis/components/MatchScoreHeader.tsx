/**
 * MatchScoreHeader — AN5 Harvest
 * Circular progress gauge showing the overall fit score alongside
 * a qualitative match summary. KR Solidarity v6.0 compliant.
 */
import React from 'react';
import type { MatchAnalysis, JobOpportunity } from '../../../types/career';

interface MatchScoreHeaderProps {
  analysis: MatchAnalysis;
  job: JobOpportunity;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--sys-color-kr-activistSmokeGreen-base)';
  if (score >= 60) return 'var(--sys-color-stencilYellow-base)';
  return 'var(--sys-color-solidarityRed-base)';
}

function getMatchStrength(score: number): string {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'moderate';
  return 'weak';
}

export const MatchScoreHeader: React.FC<MatchScoreHeaderProps> = ({ analysis, job }) => {
  const score = analysis.Overall_Fit_Score;
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
  const scoreColor = getScoreColor(score);

  return (
    <div
      className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-8 border border-[var(--kr-color-concrete-grey-steps-0)] flex items-center gap-8"
      style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
    >
      {/* Circular score gauge */}
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
            stroke="var(--kr-color-concrete-grey-steps-0)"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={scoreColor}
            strokeWidth="10"
            strokeDasharray={strokeDasharray}
            strokeLinecap="butt"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[var(--sys-color-paperWhite-base)] leading-none">
            {score}%
          </span>
          <span className="text-xs text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mt-1">
            Fit Score
          </span>
        </div>
      </div>

      {/* Textual summary */}
      <div>
        <h2 className="font-display text-3xl font-black text-[var(--sys-color-paperWhite-base)] mb-2 uppercase tracking-tight">
          Match Analysis Complete
        </h2>
        <p className="text-[var(--sys-color-worker-ash-base)] text-lg">
          Your profile is a{' '}
          <strong className="text-[var(--sys-color-paperWhite-base)]">
            {getMatchStrength(score)} match
          </strong>{' '}
          for the {job.Job_Title} role at {job.Company_Name}.
        </p>
      </div>
    </div>
  );
};
