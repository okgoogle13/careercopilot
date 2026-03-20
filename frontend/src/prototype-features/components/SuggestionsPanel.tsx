/* eslint-disable */
/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React from 'react';
import { ATSScoreResult, DocumentType } from '../types';

interface SuggestionsPanelProps {
  score: ATSScoreResult | null;
  documentType: DocumentType;
}

export function SuggestionsPanel({ score, documentType }: SuggestionsPanelProps) {
  if (!score || score.suggestions.length === 0) return null;

  return (
    <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 rounded-xl border border-[var(--sys-color-concreteGrey-steps-0)] shadow-xl space-y-4">
      <h4 className="font-bold text-sm text-cyan-400 uppercase tracking-widest">
        Optimization Suggestions
      </h4>
      <ul className="space-y-3">
        {score.suggestions.map((suggestion, i) => (
          <li
            key={i}
            className="flex gap-3 text-sm text-[var(--sys-color-paperWhite-base)] bg-[var(--sys-color-charcoalBackground-base)] p-3 rounded border border-[var(--sys-color-concreteGrey-steps-0)]"
          >
            <span className="text-amber-500 font-bold shrink-0">!</span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>

      {documentType === 'resume' && score.missingKeywords.length > 0 && (
        <div className="pt-4 border-t border-[var(--sys-color-concreteGrey-steps-0)]">
          <h5 className="text-xs font-bold text-[var(--sys-color-worker-ash-base)] uppercase mb-2">
            Missing Keywords
          </h5>
          <div className="flex flex-wrap gap-2">
            {score.missingKeywords.slice(0, 10).map((kw, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-rose-900/20 text-rose-300 border border-rose-500/30 rounded text-[10px] font-bold uppercase tracking-wider"
              >
                {kw}
              </span>
            ))}
            {score.missingKeywords.length > 10 && (
              <span className="text-[10px] text-[var(--sys-color-worker-ash-base)] self-center">
                +{score.missingKeywords.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
