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
<<<<<<< HEAD
    <div className="bg-[var(--color-specimen-night-light)] rounded-stone p-8 border border-white/10 shadow-elevation-1">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-[var(--color-wattle-gold)]" />
        <h2 className="text-3xl font-bloom text-[var(--color-parchment)]">Impact Enhancements</h2>
      </div>

      <p className="text-field-note text-[var(--color-flannel-flower-dark)] mb-6">
=======
    <div className="bg-[var(--color-asphalt-black-light)] rounded-stone p-8 border border-white/10 shadow-elevation-1">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-[var(--color-ink-gold)]" />
        <h2 className="text-3xl font-bloom text-[var(--color-paper-white)]">Impact Enhancements</h2>
      </div>

      <p className="text-field-note text-[var(--color-concrete-grey-dark)] mb-6">
>>>>>>> restoration-KR-Rage-Figma-v2.0
        Strategic rewrites using the <strong>Google XYZ Formula</strong>: Accomplished [X] as
        measured by [Y], by doing [Z]
      </p>

      <div className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
<<<<<<< HEAD
            className="bg-[var(--color-specimen-night-dark)] rounded-pebble p-6 border border-white/5"
          >
            {/* Original Text */}
            <div className="mb-4">
              <span className="text-[10px] text-[var(--color-flannel-flower-dark)] uppercase tracking-widest font-annotation">
                Original
              </span>
              <p className="text-[15px] text-[var(--color-flannel-flower-dark)] line-through opacity-60 mt-1">
=======
            className="bg-[var(--color-asphalt-black-dark)] rounded-pebble p-6 border border-white/5"
          >
            {/* Original Text */}
            <div className="mb-4">
              <span className="text-[10px] text-[var(--color-concrete-grey-dark)] uppercase tracking-widest font-annotation">
                Original
              </span>
              <p className="text-[15px] text-[var(--color-concrete-grey-dark)] line-through opacity-60 mt-1">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                &ldquo;{suggestion.original}&rdquo;
              </p>
            </div>

            {/* Arrow Indicator */}
            <div className="flex items-center gap-2 mb-4">
<<<<<<< HEAD
              <ArrowRight className="w-5 h-5 text-[var(--color-wattle-gold)]" />
              <span className="text-[11px] text-[var(--color-wattle-gold)] font-bold tracking-tighter">
=======
              <ArrowRight className="w-5 h-5 text-[var(--color-ink-gold)]" />
              <span className="text-[11px] text-[var(--color-ink-gold)] font-bold tracking-tighter">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                ENHANCED
              </span>
            </div>

            {/* Suggested Rewrite */}
            <div className="mb-4">
<<<<<<< HEAD
              <p className="text-lg font-bold text-[var(--color-parchment)] leading-relaxed">
=======
              <p className="text-lg font-bold text-[var(--color-paper-white)] leading-relaxed">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                {suggestion.suggestion}
              </p>
            </div>

            {/* Contextual Why */}
            {suggestion.contextualWhy && (
<<<<<<< HEAD
              <div className="bg-[var(--color-eucalypt-smoke-base)]/20 rounded-pebble p-4 border-l-4 border-[var(--color-eucalypt-smoke-base)]">
                <span className="text-[10px] text-[var(--color-flannel-flower)] uppercase tracking-wider font-bold">
                  💡 Why This Works:
                </span>
                <p className="text-sm text-[var(--color-flannel-flower)]/80 mt-2 font-field-note">
=======
              <div className="bg-[var(--color-concrete-grey-base)]/20 rounded-pebble p-4 border-l-4 border-[var(--color-concrete-grey-base)]">
                <span className="text-[10px] text-[var(--color-concrete-grey)] uppercase tracking-wider font-bold">
                  💡 Why This Works:
                </span>
                <p className="text-sm text-[var(--color-concrete-grey)]/80 mt-2 font-field-note">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                  {suggestion.contextualWhy}
                </p>
              </div>
            )}

            {/* Type Badge */}
            <div className="mt-4">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                  suggestion.type === 'number'
<<<<<<< HEAD
                    ? 'bg-[var(--color-wattle-gold)]/10 text-[var(--color-wattle-gold)]'
=======
                    ? 'bg-[var(--color-ink-gold)]/10 text-[var(--color-ink-gold)]'
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    : suggestion.type === 'percentage'
                      ? 'bg-blue-500/10 text-blue-400'
                      : suggestion.type === 'scale'
                        ? 'bg-purple-500/10 text-purple-400'
<<<<<<< HEAD
                        : 'bg-[var(--color-waratah-crimson)]/10 text-[var(--color-waratah-crimson)]'
=======
                        : 'bg-[var(--color-solidarity-red)]/10 text-[var(--color-solidarity-red)]'
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
}
=======
}
>>>>>>> restoration-KR-Rage-Figma-v2.0
