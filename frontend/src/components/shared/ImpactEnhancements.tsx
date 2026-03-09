import { ArrowRight, Lightbulb } from 'lucide-react';
import type { QuantifierSuggestion } from '../../hooks/useAnalysis';

interface ImpactEnhancementsProps {
  suggestions: QuantifierSuggestion[];
}

/**
 * Impact Enhancements - The Quantifier Visualization
 * Displays Google XYZ Formula rewrites with contextual explanations
 */
export function ImpactEnhancements({ suggestions }: ImpactEnhancementsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--color-asphalt-black-light)] rounded-megaphone p-8 border border-white/10 shadow-elevation-1">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-[var(--color-ink-gold)]" />
        <h2 className="text-3xl font-display text-[var(--color-paper-white)]">
          Impact Enhancements
        </h2>
      </div>

      <p className="text-field-note text-[var(--color-concrete-grey-dark)] mb-6">
        Strategic rewrites using the <strong>Google XYZ Formula</strong>: Accomplished [X] as
        measured by [Y], by doing [Z]
      </p>

      <div className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-[var(--color-asphalt-black-dark)] rounded-pebble p-6 border border-white/5"
          >
            {/* Original Text */}
            <div className="mb-4">
              <span className="text-[10px] text-[var(--color-concrete-grey-dark)] uppercase tracking-widest font-mono">
                Original
              </span>
              <p className="text-[15px] text-[var(--color-concrete-grey-dark)] line-through opacity-60 mt-1">
                &ldquo;{suggestion.original}&rdquo;
              </p>
            </div>

            {/* Arrow Indicator */}
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="w-5 h-5 text-[var(--color-ink-gold)]" />
              <span className="text-[11px] text-[var(--color-ink-gold)] font-bold tracking-tighter">
                ENHANCED
              </span>
            </div>

            {/* Suggested Rewrite */}
            <div className="mb-4">
              <p className="text-lg font-bold text-[var(--color-paper-white)] leading-relaxed">
                {suggestion.suggestion}
              </p>
            </div>

            {/* Contextual Why */}
            {suggestion.contextualWhy && (
              <div className="bg-[var(--color-concrete-grey-base)]/20 rounded-pebble p-4 border-l-4 border-[var(--color-concrete-grey-base)]">
                <span className="text-[10px] text-[var(--color-concrete-grey)] uppercase tracking-wider font-bold">
                  💡 Why This Works:
                </span>
                <p className="text-sm text-[var(--color-concrete-grey)]/80 mt-2 font-primary">
                  {suggestion.contextualWhy}
                </p>
              </div>
            )}

            {/* Type Badge */}
            <div className="mt-4">
              <span
                className={`inline-flex px-3 py-1 rounded-march text-[10px] font-bold tracking-wider ${
                  suggestion.type === 'number'
                    ? 'bg-[var(--color-ink-gold)]/10 text-[var(--color-ink-gold)]'
                    : suggestion.type === 'percentage'
                      ? 'bg-blue-500/10 text-blue-400'
                      : suggestion.type === 'scale'
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'bg-[var(--color-solidarity-red)]/10 text-[var(--color-solidarity-red)]'
                }`}
              >
                {suggestion.type.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
