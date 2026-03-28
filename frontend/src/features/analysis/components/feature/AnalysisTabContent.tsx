import React from 'react';
import { MatchAnalysis, CareerDatabase } from '../../../../types/career';

interface Props {
  analysis: MatchAnalysis;
  careerData: CareerDatabase;
  onNextStep: () => void;
}

export const AnalysisTabContent: React.FC<Props> = ({ analysis, careerData, onNextStep }) => {
  const recommendedAchievements = analysis.Recommended_Achievement_IDs.map((id) =>
    careerData.Structured_Achievements.find((a) => a.Achievement_ID === id)
  ).filter(Boolean);

  const getDisplayLevel = (level: string) => {
    if (level === 'Missing') return 'Growth Area';
    return level;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Skill Gaps */}
      <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 rounded-[var(--sys-shape-radius-xl)] border border-[var(--sys-color-concreteGrey-steps-0)]">
        <h3 className="text-xl font-bold text-[var(--sys-color-inkGold-steps-2)] mb-4 border-b border-[var(--sys-color-concreteGrey-steps-0)] pb-2">
          Skill Gap Analysis
        </h3>
        <div className="space-y-3">
          {analysis.Skill_Gaps.map((gap, i) => {
            const levelStyles = {
              Strong: {
                bg: 'bg-green-900/40',
                border: 'border-green-500/30',
                text: 'text-green-300',
                dot: 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]',
              },
              Partial: {
                bg: 'bg-amber-900/40',
                border: 'border-amber-500/30',
                text: 'text-amber-300',
                dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]',
              },
              Missing: {
                bg: 'bg-orange-900/40',
                border: 'border-orange-500/30',
                text: 'text-orange-300',
                dot: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]',
              },
            }[gap.Match_Level] || {
              bg: 'bg-gray-900/40',
              border: 'border-gray-500/30',
              text: 'text-gray-300',
              dot: 'bg-gray-400',
            };

            return (
              <div
                key={i}
                className={`p-4 rounded-[var(--sys-shape-radius-lg)] border ${levelStyles.bg} ${levelStyles.border}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-[var(--sys-shape-radius-full)] ${levelStyles.dot}`}
                    />
                    <span className={`font-bold ${levelStyles.text}`}>{gap.Skill}</span>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-[var(--sys-shape-radius-full)] ${levelStyles.bg} ${levelStyles.border}`}
                  >
                    {getDisplayLevel(gap.Match_Level)}
                  </span>
                </div>
                <p className="text-sm text-[var(--sys-color-worker-ash-base)] pl-5 border-l-2 border-[var(--sys-color-concreteGrey-steps-0)] ml-1.5 py-1">
                  {gap.Evidence || 'No direct evidence found in the provided documents.'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-8">
        {/* Tailored Summary */}
        <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 rounded-[var(--sys-shape-radius-xl)] border border-[var(--sys-color-concreteGrey-steps-0)] flex flex-col h-full">
          <div>
            <h3 className="text-xl font-bold text-[var(--sys-color-inkGold-steps-2)] mb-4 border-b border-[var(--sys-color-concreteGrey-steps-0)] pb-2">
              Tailored Resume Summary
            </h3>
            <p className="text-[var(--sys-color-paperWhite-base)] leading-relaxed bg-[var(--sys-color-charcoalBackground-base)] p-4 rounded-[var(--sys-shape-radius-lg)] border border-[var(--sys-color-concreteGrey-steps-0)] mb-4">
              {analysis.Tailored_Summary}
            </p>
          </div>
          <div className="mt-auto pt-6">
            <button
              onClick={onNextStep}
              className="w-full bg-[var(--sys-color-solidarityRed-base)] hover:bg-[var(--sys-color-solidarityRed-steps-3)] text-[var(--sys-color-paperWhite-base)] font-bold py-4 px-4 rounded-[var(--sys-shape-radius-lg)] transition-colors text-lg flex items-center justify-center gap-2"
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
