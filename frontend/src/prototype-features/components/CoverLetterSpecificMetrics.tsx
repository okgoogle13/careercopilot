/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component. Maps to /cover-letter-generator in canonical product.
 */
import React from 'react';
import { CoverLetterScoreResult } from '../types';

interface CoverLetterSpecificMetricsProps {
  score: CoverLetterScoreResult;
  wordCount: number;
}

export function CoverLetterSpecificMetrics({ score, wordCount }: CoverLetterSpecificMetricsProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-[var(--sys-color-kr-activistSmokeGreen-base)]';
    if (value >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getBgColor = (value: number) => {
    if (value >= 80) return 'bg-emerald-500';
    if (value >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const MetricBar = ({
    label,
    value,
    tooltip,
  }: {
    label: string;
    value: number;
    tooltip: string;
  }) => (
    <div
      className="space-y-1"
      title={tooltip}
    >
      <div className="flex justify-between text-xs font-bold text-[var(--sys-color-worker-ash-base)]">
        <span>{label}</span>
        <span className={getScoreColor(value)}>{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-[var(--sys-color-charcoalBackground-steps-2)] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${getBgColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 rounded-xl border border-[var(--sys-color-concreteGrey-steps-0)] shadow-xl space-y-4">
      <h4 className="font-bold text-sm text-cyan-400 uppercase tracking-widest">
        Cover Letter Metrics
      </h4>

      <MetricBar
        label="Keyword Placement"
        value={score.keywordPlacement}
        tooltip="Keywords found in the opening paragraph"
      />

      <MetricBar
        label="Narrative Quality"
        value={score.narrativeQuality}
        tooltip="Story quality with specific examples and achievements"
      />

      <MetricBar
        label="Personalization"
        value={score.personalizationScore}
        tooltip="Company-specific research and customization"
      />

      <MetricBar
        label="Professional Tone"
        value={score.toneProfessionalism}
        tooltip="Professionalism in greeting, closing, and overall tone"
      />

      <div className="flex items-center justify-between text-sm pt-2 border-t border-[var(--sys-color-concreteGrey-steps-0)]">
        <span className="text-[var(--sys-color-worker-ash-base)]">Call to Action</span>
        <span
          className={
            score.callToActionPresent
              ? 'text-[var(--sys-color-kr-activistSmokeGreen-base)] font-bold'
              : 'text-rose-400 font-bold'
          }
        >
          {score.callToActionPresent ? '✓ Present' : '✗ Missing'}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--sys-color-worker-ash-base)]">Word Count</span>
        <span
          className={
            wordCount >= 300 && wordCount <= 400
              ? 'text-[var(--sys-color-kr-activistSmokeGreen-base)] font-bold'
              : 'text-amber-400 font-bold'
          }
        >
          {wordCount} / 300-400
        </span>
      </div>
    </div>
  );
}
