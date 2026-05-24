import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
  steps = ['Welcome', 'Focus', 'Situation', 'Archive'],
}: OnboardingProgressProps) {
  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between items-center max-w-xl mx-auto">
        {/* Connection lines */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/5 -z-10" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-ink-gold -z-10 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNumber = idx + 1;
          const isComplete = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div
              key={idx}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`
                  w-8 h-8 rounded-march flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                  ${
                    isComplete
                      ? 'bg-ink-gold border-ink-gold text-asphalt-black'
                      : isActive
                        ? 'border-ink-gold text-ink-gold bg-asphalt-black shadow-glow-gold'
                        : 'border-white/10 text-concrete-grey/40 bg-asphalt-black'
                  }
                `}
                aria-current={isActive ? 'step' : undefined}
              >
                {isComplete ? (
                  <Check
                    className="w-4 h-4"
                    strokeWidth={3}
                  />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`
                  font-mono text-[9px] uppercase tracking-wider
                  ${isActive ? 'text-ink-gold font-bold' : 'text-concrete-grey/45'}
                `}
              >
                {steps[idx] ?? `Step ${stepNumber}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
