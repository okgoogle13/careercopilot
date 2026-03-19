// Harvested from proto:components/ATSScoreCard.tsx — B1
// Token re-skin: all raw Tailwind replaced with KR Solidarity CSS vars
// getScoreBg returns CSS var string (not stroke-* class) for SVG style prop

import React from 'react';
import { motion } from 'framer-motion';
import type { ATSScoreResult, DocumentType } from '../../../types/analysis';

interface ATSScoreCardProps {
  score: ATSScoreResult | null;
  isCalculating: boolean;
  documentType: DocumentType;
}

export function ATSScoreCard({ score, isCalculating, documentType }: ATSScoreCardProps) {
  const getScoreColor = (value: number): string => {
    if (documentType === 'coverLetter') {
      if (value >= 90) return 'text-[var(--sys-color-kr-activistSmokeGreen-base)]';
      if (value >= 80) return 'text-[var(--sys-color-kr-activistSmokeGreen-base)]';
      if (value >= 70) return 'text-[var(--sys-color-stencilYellow-base)]';
      return 'text-[var(--sys-color-solidarityRed-base)]';
    }
    if (value >= 80) return 'text-[var(--sys-color-kr-activistSmokeGreen-base)]';
    if (value >= 60) return 'text-[var(--sys-color-stencilYellow-base)]';
    return 'text-[var(--sys-color-solidarityRed-base)]';
  };

  const getScoreBg = (value: number): string => {
    if (documentType === 'coverLetter') {
      if (value >= 90) return 'var(--sys-color-kr-activistSmokeGreen-base)';
      if (value >= 80) return 'var(--sys-color-kr-activistSmokeGreen-base)';
      if (value >= 70) return 'var(--sys-color-stencilYellow-base)';
      return 'var(--sys-color-solidarityRed-base)';
    }
    if (value >= 80) return 'var(--sys-color-kr-activistSmokeGreen-base)';
    if (value >= 60) return 'var(--sys-color-stencilYellow-base)';
    return 'var(--sys-color-solidarityRed-base)';
  };

  return (
    <div
      style={{
        background: 'var(--sys-color-charcoalBackground-steps-1)',
        borderColor: 'var(--sys-color-concreteGrey-steps-0)',
        borderRadius: 'var(--sys-shape-blockRiot03)',
        borderWidth: 1,
        borderStyle: 'solid',
        padding: '1.5rem',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[var(--sys-color-paperWhite-base)]">
          ATS Score ({documentType === 'resume' ? 'Resume' : 'Cover Letter'})
        </h3>
        {isCalculating && (
          <span className="text-xs text-[var(--sys-color-inkGold-base)] animate-pulse">
            Calculating...
          </span>
        )}
      </div>

      {score && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(score.breakdown).map(([key, value]) => (
              <div
                key={key}
                className="p-3 shadow-sm"
                style={{
                  background: 'color-mix(in srgb, var(--sys-color-charcoalBackground-base) 85%, transparent)',
                  borderColor: 'var(--sys-color-concreteGrey-steps-0)',
                  borderRadius: 'var(--sys-shape-blockRiot02)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                }}
              >
                <div className="text-xs text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider mb-1">
                  {key.replace(/([A-Z])/g, ' $1')}
                </div>
                <div className="text-xl font-bold text-[var(--sys-color-paperWhite-base)]">
                  {value}%
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <span className={`text-6xl font-black ${getScoreColor(score.overallScore)}`}>
              {score.overallScore}%
            </span>
            <p className="text-sm text-[var(--sys-color-worker-ash-base)] mt-2">
              This score is equivalent to industry-standard ATS compliance scanners. It is not an arbitrary calculation.
            </p>
          </div>

          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--sys-color-charcoalBackground-steps-2)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                style={{ stroke: getScoreBg(score.overallScore) }}
                strokeWidth="8"
                strokeDasharray={`${score.overallScore * 2.827} 282.7`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score.overallScore)}`}>
                {score.overallScore}
              </span>
            </div>
          </div>

          <p className="text-center mt-4 text-sm text-[var(--sys-color-worker-ash-base)]">
            {documentType === 'coverLetter' ? (
              <>
                {score.overallScore >= 90 && 'Excellent match! Highly competitive for recruiter review.'}
                {score.overallScore >= 80 && score.overallScore < 90 && 'Optimal match. Good chance of passing ATS.'}
                {score.overallScore >= 70 && score.overallScore < 80 && 'Acceptable match. Some optimization recommended.'}
                {score.overallScore < 70 && 'Failing match. High risk of automatic rejection.'}
              </>
            ) : (
              <>
                {score.overallScore >= 80 && 'Excellent match! Your document is highly optimized.'}
                {score.overallScore >= 60 && score.overallScore < 80 && 'Good match, but some optimization could help.'}
                {score.overallScore < 60 && 'Needs significant optimization to pass ATS filters.'}
              </>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}
