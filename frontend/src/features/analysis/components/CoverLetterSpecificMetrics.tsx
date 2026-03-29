/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component. Maps to /cover-letter-generator in canonical product.
 */
import { CheckCircle, BookOpen, User, MessageSquare } from 'lucide-react';
import { CoverLetterScoreResult } from '../../../types/career';
import { SolidarityMetric } from '../../../components/kerala-rage/SolidarityMetric';

interface CoverLetterSpecificMetricsProps {
  score: CoverLetterScoreResult;
  wordCount: number;
}

export function CoverLetterSpecificMetrics({ score, wordCount }: CoverLetterSpecificMetricsProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-[var(--sys-color-kr-activistSmokeGreen-base)]';
    if (value >= 60) return 'text-[var(--sys-color-inkGold-base)]';
    return 'text-[var(--sys-color-solidarityRed-base)]';
  };

  return (
    <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-8 rounded-2xl border border-[var(--sys-color-outline-variant)] shadow-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-lg text-[var(--sys-color-stencilYellow-base)] uppercase tracking-[0.2em] type-solidarityProtest">
          Cover Letter Analysis
        </h4>
        <div className="px-4 py-1.5 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] rounded-full">
          <span className="text-xs font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-widest">
            {wordCount} Words
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SolidarityMetric
          icon={CheckCircle}
          label="Keyword Placement"
          value={score.keywordPlacement}
          iconColor={getScoreColor(score.keywordPlacement)}
          annotation="Opening impact"
        />

        <SolidarityMetric
          icon={BookOpen}
          label="Narrative Quality"
          value={score.narrativeQuality}
          iconColor={getScoreColor(score.narrativeQuality)}
          annotation="STAR alignment"
        />

        <SolidarityMetric
          icon={User}
          label="Personalization"
          value={score.personalizationScore}
          iconColor={getScoreColor(score.personalizationScore)}
          annotation="Research depth"
        />

        <SolidarityMetric
          icon={MessageSquare}
          label="Professional Tone"
          value={score.toneProfessionalism}
          iconColor={getScoreColor(score.toneProfessionalism)}
          annotation="Tone quality"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] rounded-xl">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${score.callToActionPresent ? 'bg-[var(--sys-color-kr-activistSmokeGreen-base)]' : 'bg-[var(--sys-color-solidarityRed-base)]'}`}
          />
          <span className="text-sm font-bold text-[var(--sys-color-paperWhite-base)] uppercase tracking-wider">
            Call to Action
          </span>
        </div>
        <span
          className={`text-sm font-bold uppercase tracking-widest ${score.callToActionPresent ? 'text-[var(--sys-color-kr-activistSmokeGreen-base)]' : 'text-[var(--sys-color-solidarityRed-base)]'}`}
        >
          {score.callToActionPresent ? '✓ Present' : '✗ Missing'}
        </span>
      </div>
    </div>
  );
}
