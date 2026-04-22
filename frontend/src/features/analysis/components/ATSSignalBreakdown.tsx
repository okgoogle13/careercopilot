/**
 * ATS Signal Breakdown Component
 *
 * Displays the 4 sub-signals of the ATS analysis:
 * - Keyword Density Score
 * - Semantic Score
 * - Education/Experience Score
 * - Formatting Score
 *
 * Each signal is scaled to 0-100 for clarity and displayed using KR Solidarity v6.1
 * semantic tokens.
 */

import React from 'react';
import { useAnalysisPipelineStore } from '@/stores/analysisPipelineStore';
import { motion } from 'framer-motion';

interface ATSSignalBreakdownProps {
  assetId: string;
}

interface SignalDefinition {
  key: keyof SignalBreakdown;
  label: string;
  description?: string;
}

interface SignalBreakdown {
  keywordDensityScore: number;
  semanticScore: number;
  educationExperienceScore: number;
  formattingScore: number;
}

/**
 * Mapping of breakdown fields to display names and descriptions
 */
const SIGNAL_DEFINITIONS: SignalDefinition[] = [
  {
    key: 'keywordDensityScore',
    label: 'Keyword Density',
    description: 'How well your resume matches job keywords',
  },
  {
    key: 'semanticScore',
    label: 'Semantic Score',
    description: 'Contextual relevance to the job',
  },
  {
    key: 'educationExperienceScore',
    label: 'Education & Experience',
    description: 'Alignment of background with role',
  },
  {
    key: 'formattingScore',
    label: 'Formatting Score',
    description: 'ATS parsing and readability',
  },
];

/**
 * Helper: Determine status color based on score threshold
 */
function getSignalStatus(score: number): 'excellent' | 'good' | 'acceptable' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'acceptable';
  return 'poor';
}

/**
 * Helper: Get semantic token color variable for a signal status
 */
function getStatusColor(status: 'excellent' | 'good' | 'acceptable' | 'poor'): string {
  const colorMap = {
    excellent: 'var(--kr-color-activist-smoke-green-base)',
    good: 'var(--kr-color-ink-gold-base)',
    acceptable: 'var(--kr-color-stencil-yellow-base)',
    poor: 'var(--kr-color-solidarity-red-base)',
  };
  return colorMap[status];
}

/**
 * Individual signal card component
 */
function SignalCard({
  signal,
  score,
}: {
  signal: SignalDefinition;
  score: number;
}): React.ReactElement {
  const status = getSignalStatus(score);
  const statusColor = getStatusColor(status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
        borderRadius: 'var(--kr-archetypes-placard-shape-base)',
        borderColor: 'var(--kr-color-concrete-grey-usage)',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: 'var(--kr-shadow-elevation2-placard)',
      }}
      className="relative overflow-hidden transition-all duration-medium1 ease-m3-expressive backdrop-blur-xl p-6 flex flex-col justify-between h-full"
      data-archetype="placard"
    >
      <div className="mb-4">
        <h3
          className="text-sm font-semibold uppercase tracking-wider mb-1"
          style={{ color: 'var(--kr-color-worker-ash-base)' }}
        >
          {signal.label}
        </h3>
        {signal.description && (
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'var(--kr-color-worker-ash-steps-1)' }}
          >
            {signal.description}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div
          className="text-4xl font-bold tabular-nums"
          style={{ color: statusColor }}
        >
          {score}
        </div>
        <div
          className="text-xs uppercase tracking-wider"
          style={{ color: statusColor }}
        >
          {status}
        </div>
      </div>

      {/* Progress bar visualization */}
      <div className="mt-4 w-full bg-charcoal-background-steps-0 rounded-full overflow-hidden">
        <motion.div
          className="h-2 rounded-full"
          style={{ backgroundColor: statusColor }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

/**
 * Main component: Renders the 4 ATS signals
 */
export const ATSSignalBreakdown: React.FC<ATSSignalBreakdownProps> = ({ assetId }) => {
  const { getPipeline } = useAnalysisPipelineStore();
  const pipeline = getPipeline(assetId);
  const atsResult = pipeline?.atsResult;

  // If no breakdown data, show empty state
  if (!atsResult?.breakdown) {
    return (
      <div className="w-full">
        <div
          style={{
            backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
            borderRadius: 'var(--kr-archetypes-placard-shape-base)',
            borderColor: 'var(--kr-color-concrete-grey-usage)',
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
          className="p-6"
          data-archetype="placard"
        >
          <div
            className="text-center py-8"
            style={{ color: 'var(--kr-color-worker-ash-base)' }}
          >
            <p className="text-sm">
              No ATS analysis available. Run an analysis to see signal breakdown.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const breakdown = atsResult.breakdown as SignalBreakdown;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: 'var(--kr-color-paper-white-base)' }}
        >
          ATS Signal Breakdown
        </h2>
        <p
          className="text-sm"
          style={{ color: 'var(--kr-color-worker-ash-base)' }}
        >
          Detailed analysis of your resume's performance across key ATS criteria
        </p>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SIGNAL_DEFINITIONS.map((signal) => (
          <SignalCard
            key={signal.key}
            signal={signal}
            score={breakdown[signal.key]}
          />
        ))}
      </div>
    </div>
  );
};

ATSSignalBreakdown.displayName = 'ATSSignalBreakdown';
