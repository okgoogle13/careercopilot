/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React from 'react';
import { ATSScoreResult } from '../../../types/career';
import { Placard } from '@/components/ui';
import { Target, AlertTriangle } from 'lucide-react';

interface SuggestionsPanelProps {
  score: ATSScoreResult | null;
  documentType: 'resume' | 'coverLetter';
}

export function SuggestionsPanel({ score, documentType }: SuggestionsPanelProps) {
  if (!score || score.recommendations.length === 0) return null;

  return (
    <Placard
      elevation="raised"
      className="p-8 border-[var(--kr-color-concrete-grey-steps-0)] bg-[var(--sys-color-charcoalBackground-steps-1)] space-y-6"
    >
      <header className="flex items-center gap-3">
        <Target className="w-5 h-5 text-[var(--sys-color-inkGold-base)]" />
        <h4 className="font-display font-black text-sm text-[var(--sys-color-paperWhite-base)] uppercase tracking-widest">
          Optimization Suggestions
        </h4>
      </header>

      <ul className="grid grid-cols-1 gap-4">
        {score.recommendations.map((suggestion, i) => (
          <li
            key={i}
            className="flex gap-4 text-sm text-[var(--sys-color-worker-ash-base)] bg-[var(--sys-color-charcoalBackground-base)]/50 p-4 border border-[var(--kr-color-concrete-grey-steps-0)]"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <AlertTriangle className="w-5 h-5 text-[var(--sys-color-stencilYellow-base)] shrink-0" />
            <span className="leading-relaxed">{suggestion}</span>
          </li>
        ))}
      </ul>

      {documentType === 'resume' && score.missingKeywords.length > 0 && (
        <div className="pt-6 border-t border-[var(--kr-color-concrete-grey-steps-0)]">
          <h5 className="font-mono text-[10px] font-bold text-[var(--sys-color-concreteGrey-base)] uppercase tracking-[0.2em] mb-4">
            [ CRITICAL MISSING KEYWORDS ]
          </h5>
          <div className="flex flex-wrap gap-2">
            {score.missingKeywords.slice(0, 12).map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[var(--sys-color-solidarityRed-base)]/10 text-[var(--sys-color-solidarityRed-base)] border border-[var(--sys-color-solidarityRed-base)]/30 text-[10px] font-black uppercase tracking-widest"
                style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
              >
                {kw}
              </span>
            ))}
            {score.missingKeywords.length > 12 && (
              <span className="text-[10px] font-mono text-[var(--sys-color-concreteGrey-base)] self-center ml-2">
                +{score.missingKeywords.length - 12} MORE
              </span>
            )}
          </div>
        </div>
      )}
    </Placard>
  );
}
