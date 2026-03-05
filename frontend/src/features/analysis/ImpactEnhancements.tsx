import { Lightbulb, ArrowRight } from 'lucide-react';
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
    <div className="bg-surface-container rounded-tech p-8 border border-outline-variant shadow-elevation-1">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-tertiary" />
        <h2 className="text-title-large font-bold text-on-surface">Impact Enhancements</h2>
      </div>

      <p className="text-body-medium text-on-surface-variant mb-6">
        Strategic rewrites using the <strong>Google XYZ Formula</strong>: Accomplished [X] as
        measured by [Y], by doing [Z]
      </p>

      <div className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-surface-container-low rounded-pebble p-6 border border-outline"
          >
            {/* Original Text */}
            <div className="mb-4">
              <span className="text-label-small text-on-surface-variant uppercase tracking-wider font-mono">
                Original
              </span>
              <p className="text-body-large text-on-surface-variant line-through opacity-60 mt-1">
                {suggestion.original}
              </p>
            </div>

            {/* Arrow Indicator */}
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="w-5 h-5 text-primary" />
              <span className="text-label-medium text-primary font-bold">ENHANCED</span>
            </div>

            {/* Suggested Rewrite */}
            <div className="mb-4">
              <p className="text-body-large font-bold text-[var(--sys-color-primary)]">
                {suggestion.suggestion}
              </p>
            </div>

            {/* Contextual Why */}
            {suggestion.contextualWhy && (
              <div className="bg-tertiary-container/20 rounded-pebble p-4 border-l-4 border-tertiary">
                <span className="text-label-small text-on-tertiary-container uppercase tracking-wider font-bold">
                  💡 Why This Works:
                </span>
                <p className="text-body-medium text-on-tertiary-container mt-2">
                  {suggestion.contextualWhy}
                </p>
              </div>
            )}

            {/* Type Badge */}
            <div className="mt-4">
              <span
                className={`inline-flex px-3 py-1 rounded-pebble text-label-small font-bold ${
                  suggestion.type === 'number'
                    ? 'bg-primary-container text-on-primary-container'
                    : suggestion.type === 'percentage'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : suggestion.type === 'scale'
                        ? 'bg-tertiary-container text-on-tertiary-container'
                        : 'bg-error-container text-on-error-container'
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
