/**
 * AnalysisTabContent — AN4 Harvest
 * Shows skill gap analysis and the AI-tailored resume summary for
 * the analysis workbench. Uses KR Solidarity v6.0 semantic tokens.
 */
import React from 'react';
import type { MatchAnalysis, CareerDatabase } from '../../../types/career';

interface AnalysisTabContentProps {
  analysis: MatchAnalysis;
  careerData: CareerDatabase;
  onNextStep: () => void;
}

type MatchLevel = 'Strong' | 'Partial' | 'Missing';

const LEVEL_STYLES: Record<MatchLevel, { bg: string; border: string; text: string; dot: string }> =
  {
    Strong: {
      bg: 'bg-[var(--sys-color-kr-activistSmokeGreen-base)]/10',
      border: 'border-[var(--sys-color-kr-activistSmokeGreen-base)]/30',
      text: 'text-[var(--sys-color-kr-activistSmokeGreen-base)]',
      dot: 'bg-[var(--sys-color-kr-activistSmokeGreen-base)] shadow-[0_0_8px_color-mix(in_srgb,var(--sys-color-kr-activistSmokeGreen-base)_50%,transparent)]',
    },
    Partial: {
      bg: 'bg-[var(--sys-color-stencilYellow-base)]/10',
      border: 'border-[var(--sys-color-stencilYellow-base)]/30',
      text: 'text-[var(--sys-color-stencilYellow-base)]',
      dot: 'bg-[var(--sys-color-stencilYellow-base)] shadow-[0_0_8px_color-mix(in_srgb,var(--sys-color-stencilYellow-base)_50%,transparent)]',
    },
    Missing: {
      bg: 'bg-[var(--sys-color-solidarityRed-base)]/10',
      border: 'border-[var(--sys-color-solidarityRed-base)]/30',
      text: 'text-[var(--sys-color-solidarityRed-base)]',
      dot: 'bg-[var(--sys-color-solidarityRed-base)] shadow-[0_0_8px_color-mix(in_srgb,var(--sys-color-solidarityRed-base)_50%,transparent)]',
    },
  };

function getDisplayLevel(level: string): string {
  return level === 'Missing' ? 'Growth Area' : level;
}

export const AnalysisTabContent: React.FC<AnalysisTabContentProps> = ({
  analysis,
  careerData,
  onNextStep,
}) => {
  const recommendedAchievements = analysis.Recommended_Achievement_IDs.map((id) =>
    careerData.Structured_Achievements.find((a) => a.Achievement_ID === id)
  ).filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Skill Gap Analysis */}
      <div
        className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 border border-[var(--sys-color-outline-variant)]"
        style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
      >
        <h3 className="text-xl font-bold text-[var(--sys-color-inkGold-base)] mb-4 border-b border-[var(--sys-color-outline-variant)] pb-2 uppercase tracking-tight">
          Skill Gap Analysis
        </h3>
        <div className="space-y-3">
          {analysis.Skill_Gaps.map((gap, i) => {
            const styles = LEVEL_STYLES[gap.Match_Level as MatchLevel] ?? {
              bg: 'bg-[var(--sys-color-concreteGrey-base)]/10',
              border: 'border-[var(--sys-color-concreteGrey-base)]/30',
              text: 'text-[var(--sys-color-concreteGrey-base)]',
              dot: 'bg-[var(--sys-color-concreteGrey-base)]',
            };

            return (
              <div
                key={i}
                className={`p-4 border ${styles.bg} ${styles.border}`}
                style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 ${styles.dot}`}
                      style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                    />
                    <span className={`font-bold ${styles.text}`}>{gap.Skill}</span>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 ${styles.bg} ${styles.border} border`}
                    style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                  >
                    {getDisplayLevel(gap.Match_Level)}
                  </span>
                </div>
                <p className="text-sm text-[var(--sys-color-worker-ash-base)] pl-5 border-l-2 border-[var(--sys-color-outline-variant)] ml-1.5 py-1">
                  {gap.Evidence || 'No direct evidence found in the provided documents.'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tailored Summary + CTA */}
      <div className="space-y-8">
        <div
          className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 border border-[var(--sys-color-outline-variant)] flex flex-col h-full"
          style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
        >
          <div>
            <h3 className="text-xl font-bold text-[var(--sys-color-inkGold-base)] mb-4 border-b border-[var(--sys-color-outline-variant)] pb-2 uppercase tracking-tight">
              Tailored Resume Summary
            </h3>
            <p
              className="text-[var(--sys-color-paperWhite-base)] leading-relaxed bg-[var(--sys-color-charcoalBackground-base)] p-4 border border-[var(--sys-color-outline-variant)] mb-4"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              {analysis.Tailored_Summary}
            </p>
            {recommendedAchievements.length > 0 && (
              <p className="text-xs text-[var(--sys-color-concreteGrey-base)] uppercase tracking-widest">
                {recommendedAchievements.length} achievements recommended for this role
              </p>
            )}
          </div>
          <div className="mt-auto pt-6">
            <button
              id="analysis-tab-next-step"
              onClick={onNextStep}
              className="w-full bg-[var(--sys-color-solidarityRed-base)] hover:bg-[var(--sys-color-solidarityRed-steps-3)] text-[var(--sys-color-paperWhite-base)] font-bold py-4 px-4 transition-colors text-lg flex items-center justify-center gap-2 uppercase tracking-wide"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              Next: Tailor Resume
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
