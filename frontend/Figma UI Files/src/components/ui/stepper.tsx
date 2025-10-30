import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  clickableSteps?: boolean;
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ 
    steps, 
    currentStep, 
    onStepClick,
    orientation = 'horizontal',
    className = '',
    clickableSteps = false
  }, ref) => {
    const handleStepClick = (index: number) => {
      if (clickableSteps && onStepClick && index <= currentStep) {
        onStepClick(index);
      }
    };

    const getStepStatus = (index: number): 'completed' | 'current' | 'upcoming' => {
      if (index < currentStep) return 'completed';
      if (index === currentStep) return 'current';
      return 'upcoming';
    };

    if (orientation === 'vertical') {
      return (
        <div ref={ref} className={`flex flex-col ${className}`}>
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = clickableSteps && index <= currentStep;

            return (
              <div key={index} className="flex gap-4">
                {/* Step Indicator */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isClickable}
                    className={`
                      relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                      border-2 transition-all duration-300
                      ${status === 'completed'
                        ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] border-transparent shadow-[var(--shadow-glow-aurora)]'
                        : status === 'current'
                          ? 'bg-[var(--surface-container)] border-[var(--primary)] shadow-[var(--shadow-glow-aurora)]'
                          : 'bg-[var(--glass-bg)] border-[var(--glass-border)]'
                      }
                      ${isClickable && 'cursor-pointer hover:scale-110'}
                    `}
                  >
                    {status === 'completed' ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : step.icon ? (
                      <span className={status === 'current' ? 'text-[var(--primary)]' : 'text-[var(--on-surface-variant)]'}>
                        {step.icon}
                      </span>
                    ) : (
                      <span className={`${status === 'current' ? 'text-[var(--primary)]' : 'text-[var(--on-surface-variant)]'}`}>
                        {index + 1}
                      </span>
                    )}
                  </button>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-16 my-1">
                      <div
                        className={`
                          w-full h-full transition-all duration-300
                          ${index < currentStep
                            ? 'bg-gradient-to-b from-[var(--primary)] to-[var(--tertiary)]'
                            : 'bg-[var(--glass-border)]'
                          }
                        `}
                      />
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-16">
                  <h4 className={`${status === 'current' ? 'text-[var(--on-surface)]' : 'text-[var(--on-surface-variant)]'}`}>
                    {step.label}
                  </h4>
                  {step.description && (
                    <p className="text-sm text-[var(--on-surface-variant)] mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Horizontal orientation
    return (
      <div ref={ref} className={`flex items-center ${className}`}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = clickableSteps && index <= currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                    border-2 transition-all duration-300
                    ${status === 'completed'
                      ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] border-transparent shadow-[var(--shadow-glow-aurora)]'
                      : status === 'current'
                        ? 'bg-[var(--surface-container)] border-[var(--primary)] shadow-[var(--shadow-glow-aurora)]'
                        : 'bg-[var(--glass-bg)] border-[var(--glass-border)]'
                    }
                    ${isClickable && 'cursor-pointer hover:scale-110'}
                  `}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : step.icon ? (
                    <span className={status === 'current' ? 'text-[var(--primary)]' : 'text-[var(--on-surface-variant)]'}>
                      {step.icon}
                    </span>
                  ) : (
                    <span className={`${status === 'current' ? 'text-[var(--primary)]' : 'text-[var(--on-surface-variant)]'}`}>
                      {index + 1}
                    </span>
                  )}
                </button>
                
                <div className="text-center">
                  <p className={`text-sm ${status === 'current' ? 'text-[var(--on-surface)]' : 'text-[var(--on-surface-variant)]'}`}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-[var(--on-surface-variant)] mt-1 hidden md:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 -mt-10">
                  <div
                    className={`
                      w-full h-full transition-all duration-300
                      ${index < currentStep
                        ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)]'
                        : 'bg-[var(--glass-border)]'
                      }
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';
