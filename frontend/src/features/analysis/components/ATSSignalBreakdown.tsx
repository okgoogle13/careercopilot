import React from 'react';
import { Placard } from '@/components/ui';
import { AlertCircle, Check, Zap } from 'lucide-react';
import type { AtsResult } from '@/stores/analysisPipelineStore';

interface ATSSignalBreakdownProps {
  atsResult: AtsResult | undefined;
}

const SignalMeter: React.FC<{ label: string; value: number; max: number }> = ({
  label,
  value,
  max,
}) => {
  const percentage = (value / max) * 100;
  const isWarning = percentage < 60;
  const isSuccess = percentage >= 80;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--sys-color-paperWhite-base)]">
          {label}
        </span>
        <span
          className={`text-sm font-bold ${
            isSuccess
              ? 'text-[var(--sys-color-solidarityGreen-base)]'
              : isWarning
                ? 'text-[var(--sys-color-solidarityRed-base)]'
                : 'text-[var(--sys-color-inkGold-base)]'
          }`}
        >
          {value}/{max}
        </span>
      </div>
      <div className="h-2 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            isSuccess
              ? 'bg-[var(--sys-color-solidarityGreen-base)]'
              : isWarning
                ? 'bg-[var(--sys-color-solidarityRed-base)]'
                : 'bg-[var(--sys-color-inkGold-base)]'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export const ATSSignalBreakdown: React.FC<ATSSignalBreakdownProps> = ({ atsResult }) => {
  if (!atsResult) {
    return null;
  }

  const keywordScore = atsResult.keywordMatch;
  const semanticScore = Math.round(atsResult.semanticScore * 100);
  const formattingScore = Math.round(atsResult.formattingScore * 100);
  const extractionFlagCount = atsResult.extractionFlags.length;

  return (
    <Placard elevation="raised" className="border-concreteGrey-base/10 p-8 bg-charcoalBackground-base/20">
      <div className="space-y-8">
        <div>
          <h3 className="font-display text-xl font-bold text-inkGold-base mb-6 flex items-center gap-2 uppercase tracking-tight">
            <Zap className="w-5 h-5" /> Signal Breakdown
          </h3>
          <p className="text-sm text-paperWhite-base/70 mb-8">
            Four signals determine your ATS alignment. Improve the red zones first.
          </p>
        </div>

        <div className="space-y-6">
          <SignalMeter label="Keyword Overlap" value={keywordScore} max={100} />

          <SignalMeter label="Semantic Score" value={semanticScore} max={100} />

          <SignalMeter label="Formatting Quality" value={formattingScore} max={100} />

          {extractionFlagCount > 0 && (
            <div className="space-y-3 p-4 bg-[var(--sys-color-solidarityRed-base)]/10 rounded-march border border-[var(--sys-color-solidarityRed-base)]/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[var(--sys-color-solidarityRed-base)]" />
                <span className="text-sm font-medium text-[var(--sys-color-paperWhite-base)]">
                  Extraction Flags: {extractionFlagCount}
                </span>
              </div>
              <ul className="space-y-1 text-sm text-[var(--sys-color-paperWhite-base)]/80">
                {atsResult.extractionFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--sys-color-solidarityRed-base)]">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {extractionFlagCount === 0 && (
            <div className="flex items-center gap-2 p-4 bg-[var(--sys-color-solidarityGreen-base)]/10 rounded-march border border-[var(--sys-color-solidarityGreen-base)]/20">
              <Check className="w-4 h-4 text-[var(--sys-color-solidarityGreen-base)]" />
              <span className="text-sm font-medium text-[var(--sys-color-solidarityGreen-base)]">
                No extraction flags detected
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-concreteGrey-base/20">
          <p className="text-xs text-paperWhite-base/60">
            <strong>Next step:</strong> Address any red-zone signals to improve your overall fit score.
          </p>
        </div>
      </div>
    </Placard>
  );
};
