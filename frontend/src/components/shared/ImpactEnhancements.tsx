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
    <div className="bg-charcoalBackground-base rounded-megaphone p-8 border border-concreteGrey-steps-1 shadow-elevation-1">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-solidarityRed-base" />
        <h2 className="text-3xl font-display text-worker-ash-base">Impact Enhancements</h2>
      </div>

      <p className="text-field-note text-worker-ash-base/70 mb-6">
        Strategic rewrites using the <strong>Google XYZ Formula</strong>: Accomplished [X] as
        measured by [Y], by doing [Z]
      </p>

      <div className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-charcoalBackground-steps-1 rounded-pebble p-6 border border-concreteGrey-steps-0"
          >
            {/* Original Text */}
            <div className="mb-4">
              <span className="text-[10px] text-concreteGrey-steps-2 uppercase tracking-widest font-mono">
                Original
              </span>
              <p className="text-[15px] text-concreteGrey-steps-2 line-through opacity-60 mt-1">
                &ldquo;{suggestion.original}&rdquo;
              </p>
            </div>

            {/* Arrow Indicator */}
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="w-5 h-5 text-inkGold-base" />
              <span className="text-[11px] text-inkGold-base font-bold tracking-tighter">
                ENHANCED
              </span>
            </div>

            {/* Suggested Rewrite */}
            <div className="mb-4">
              <p className="text-lg font-bold text-worker-ash-base leading-relaxed">
                {suggestion.suggestion}
              </p>
            </div>

            {/* Contextual Why */}
            {suggestion.contextualWhy && (
              <div className="bg-concreteGrey-base/20 rounded-pebble p-4 border-l-4 border-concreteGrey-base">
                <span className="text-[10px] text-concreteGrey-steps-2 uppercase tracking-wider font-bold">
                  💡 Why This Works:
                </span>
                <p className="text-sm text-concreteGrey-steps-2/80 mt-2 font-primary">
                  {suggestion.contextualWhy}
                </p>
              </div>
            )}

            {/* Type Badge */}
            <div className="mt-4">
              <span
                className={`inline-flex px-3 py-1 rounded-march text-[10px] font-bold tracking-wider ${
                  suggestion.type === 'number'
                    ? 'bg-inkGold-base/10 text-inkGold-base'
                    : suggestion.type === 'percentage'
                      ? 'bg-[var(--sys-color-protestMetalBlue-steps-0)] text-protestMetalBlue-base'
                      : suggestion.type === 'scale'
                        ? 'bg-[var(--sys-color-stencilYellow-steps-1)]/20 text-[var(--sys-color-stencilYellow-base)]'
                        : 'bg-[var(--sys-color-solidarityRed-steps-0)]/20 text-[var(--sys-color-solidarityRed-base)]'
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
