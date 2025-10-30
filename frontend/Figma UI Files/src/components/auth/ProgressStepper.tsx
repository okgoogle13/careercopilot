import React from 'react';
import { Check, Circle, ArrowRight } from 'lucide-react';
import { cn } from '../ui/utils';

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
}

export interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: number[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'compact';
  className?: string;
  onStepClick?: (stepIndex: number) => void;
  showDescription?: boolean;
}

export function ProgressStepper({
  steps,
  currentStep,
  completedSteps = [],
  orientation = 'horizontal',
  variant = 'default',
  className,
  onStepClick,
  showDescription = true,
}: ProgressStepperProps) {
  const isStepCompleted = (stepIndex: number) => completedSteps.includes(stepIndex);
  const isStepCurrent = (stepIndex: number) => stepIndex === currentStep;
  const isStepClickable = (stepIndex: number) =>
    onStepClick && (isStepCompleted(stepIndex) || stepIndex <= currentStep);

  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' => {
    if (isStepCompleted(stepIndex)) return 'completed';
    if (isStepCurrent(stepIndex)) return 'current';
    return 'upcoming';
  };

  const StepIndicator = ({ step, index }: { step: Step; index: number }) => {
    const status = getStepStatus(index);
    const clickable = isStepClickable(index);

    return (
      <div
        className={cn(
          'flex items-center',
          orientation === 'horizontal' ? 'flex-col' : 'flex-row',
          clickable && 'cursor-pointer',
          className
        )}
        onClick={clickable ? () => onStepClick!(index) : undefined}
      >
        {/* Step Circle */}
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full border-2 transition-all duration-300',
            variant === 'compact' ? 'w-8 h-8' : 'w-12 h-12',

            // Completed state
            status === 'completed' && [
              'bg-primary border-primary text-on-primary',
              clickable && 'hover:bg-primary/90 hover:scale-110',
            ],

            // Current state
            status === 'current' && [
              'bg-primary/10 border-primary text-primary',
              'ring-4 ring-primary/20',
              clickable && 'hover:bg-primary/20',
            ],

            // Upcoming state
            status === 'upcoming' && [
              'bg-surface-container border-outline-variant text-on-surface-variant',
              clickable && 'hover:border-outline hover:bg-surface-container-high',
            ]
          )}
        >
          {status === 'completed' ? (
            <Check
              className={cn('text-on-primary', variant === 'compact' ? 'w-4 h-4' : 'w-6 h-6')}
            />
          ) : step.icon ? (
            <div className={cn(variant === 'compact' ? 'w-4 h-4' : 'w-6 h-6')}>{step.icon}</div>
          ) : (
            <span className={cn('font-semibold', variant === 'compact' ? 'text-sm' : 'text-base')}>
              {index + 1}
            </span>
          )}

          {/* Optional indicator */}
          {step.optional && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-background" />
          )}
        </div>

        {/* Step Content */}
        {variant !== 'compact' && (
          <div
            className={cn(
              'text-center',
              orientation === 'horizontal' ? 'mt-3 max-w-32' : 'ml-4 flex-1'
            )}
          >
            <div
              className={cn(
                'font-medium transition-colors duration-300',
                status === 'completed' && 'text-primary',
                status === 'current' && 'text-foreground',
                status === 'upcoming' && 'text-muted-foreground'
              )}
            >
              {step.title}
              {step.optional && <span className="text-xs text-secondary ml-1">(Optional)</span>}
            </div>

            {showDescription && step.description && (
              <div
                className={cn(
                  'text-xs mt-1 transition-colors duration-300',
                  status === 'upcoming' ? 'text-muted-foreground' : 'text-on-surface-variant'
                )}
              >
                {step.description}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const StepConnector = ({ index }: { index: number }) => {
    if (index === steps.length - 1) return null;

    const isCompleted =
      isStepCompleted(index) && (isStepCompleted(index + 1) || isStepCurrent(index + 1));

    return (
      <div
        className={cn(
          'transition-colors duration-300',
          orientation === 'horizontal' ? 'flex-1 h-0.5 mx-4 min-w-8' : 'w-0.5 h-8 ml-6 my-2',
          isCompleted ? 'bg-primary' : 'bg-outline-variant'
        )}
      >
        {orientation === 'horizontal' && variant !== 'compact' && (
          <div className="relative h-full flex items-center justify-center">
            <ArrowRight
              className={cn(
                'w-4 h-4 transition-colors duration-300',
                isCompleted ? 'text-primary' : 'text-outline-variant'
              )}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'w-full',
        orientation === 'horizontal' ? 'flex items-start justify-center' : 'flex flex-col',
        className
      )}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <StepIndicator step={step} index={index} />
          <StepConnector index={index} />
        </React.Fragment>
      ))}
    </div>
  );
}

// Progress Summary Component
interface ProgressSummaryProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: number[];
  className?: string;
}

export function ProgressSummary({
  steps,
  currentStep,
  completedSteps = [],
  className,
}: ProgressSummaryProps) {
  const totalSteps = steps.length;
  const completed = completedSteps.length;
  const progress = Math.round((completed / totalSteps) * 100);

  return (
    <div className={cn('bg-surface-container rounded-lg p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">Setup Progress</span>
        <span className="text-sm text-muted-foreground">
          {completed}/{totalSteps} completed
        </span>
      </div>

      <div className="w-full bg-surface-container-low rounded-full h-2 mb-3">
        <div
          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-xs text-muted-foreground">
        Current: {steps[currentStep]?.title || 'Complete'}
      </div>
    </div>
  );
}
