import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

/**
 * OnboardingProgress — step indicator for the onboarding sequence.
 *
 * Rendered in OnboardingPage (step 1) and IngestionPage (step 2) so users
 * always know where they are in the activation flow.
 */
export function OnboardingProgress({ currentStep, totalSteps, steps }: OnboardingProgressProps) {
  return (
    <div
      className="flex items-center justify-center"
      role="list"
      aria-label={`Onboarding progress: step ${currentStep} of ${totalSteps}`}
    >
      {steps.map((label, idx) => {
        const stepNumber = idx + 1;
        const isComplete = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div
            key={label}
            role="listitem"
            className="flex items-center"
          >
            {/* Step node */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                  ${
                    isComplete
                      ? 'bg-ink-gold border-ink-gold text-asphalt-black'
                      : isActive
                        ? 'bg-transparent border-ink-gold text-ink-gold'
                        : 'bg-transparent border-concrete-grey/30 text-concrete-grey/30'
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
                  text-[10px] font-annotation uppercase tracking-[0.15em] whitespace-nowrap
                  ${isActive ? 'text-ink-gold' : isComplete ? 'text-concrete-grey' : 'text-concrete-grey/30'}
                `}
              >
                {label}
              </span>
            </div>

            {/* Connector line between steps */}
            {idx < steps.length - 1 && (
              <div
                className={`
                  h-px w-12 md:w-20 mx-2 mb-5 transition-all duration-300
                  ${isComplete ? 'bg-ink-gold/60' : 'bg-concrete-grey/20'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OnboardingProgress;
