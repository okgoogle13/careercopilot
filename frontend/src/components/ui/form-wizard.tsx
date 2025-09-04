import React, { useState, useCallback } from 'react';
import { Check, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  optional?: boolean;
  validation?: () => boolean | Promise<boolean>;
  onEnter?: () => void | Promise<void>;
  onLeave?: () => void | Promise<void>;
}

export interface FormWizardProps {
  steps: WizardStep[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  className?: string;
  showStepNumbers?: boolean;
  showProgress?: boolean;
  allowStepNavigation?: boolean;
  completedSteps?: number[];
  orientation?: 'horizontal' | 'vertical';
}

export function FormWizard({
  steps,
  currentStep = 0,
  onStepChange,
  onComplete,
  className,
  showStepNumbers = true,
  showProgress = true,
  allowStepNavigation = false,
  completedSteps = [],
  orientation = 'horizontal',
}: FormWizardProps) {
  const [internalCurrentStep, setInternalCurrentStep] = useState(currentStep);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const activeStep = onStepChange ? currentStep : internalCurrentStep;
  const currentStepData = steps[activeStep];

  const handleStepChange = useCallback(
    async (newStep: number) => {
      if (newStep === activeStep) return;

      setLoading(true);
      setErrors({});

      try {
        // Validate current step if moving forward
        if (newStep > activeStep && currentStepData.validation) {
          const isValid = await currentStepData.validation();
          if (!isValid) {
            setErrors({ [activeStep]: 'Please complete all required fields in this step' });
            return;
          }
        }

        // Call onLeave for current step
        if (currentStepData.onLeave) {
          await currentStepData.onLeave();
        }

        // Update step
        if (onStepChange) {
          onStepChange(newStep);
        } else {
          setInternalCurrentStep(newStep);
        }

        // Call onEnter for new step
        const newStepData = steps[newStep];
        if (newStepData.onEnter) {
          await newStepData.onEnter();
        }
      } catch (error) {
        setErrors({ [activeStep]: error instanceof Error ? error.message : 'An error occurred' });
      } finally {
        setLoading(false);
      }
    },
    [activeStep, currentStepData, onStepChange, steps]
  );

  const handleNext = useCallback(async () => {
    if (activeStep < steps.length - 1) {
      await handleStepChange(activeStep + 1);
    } else {
      // Last step - complete wizard
      setLoading(true);
      try {
        if (currentStepData.validation) {
          const isValid = await currentStepData.validation();
          if (!isValid) {
            setErrors({ [activeStep]: 'Please complete all required fields in this step' });
            return;
          }
        }
        onComplete?.();
      } catch (error) {
        setErrors({ [activeStep]: error instanceof Error ? error.message : 'An error occurred' });
      } finally {
        setLoading(false);
      }
    }
  }, [activeStep, steps.length, handleStepChange, currentStepData, onComplete]);

  const handlePrevious = useCallback(() => {
    if (activeStep > 0) {
      handleStepChange(activeStep - 1);
    }
  }, [activeStep, handleStepChange]);

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      if (allowStepNavigation || stepIndex <= Math.max(...completedSteps, activeStep)) {
        handleStepChange(stepIndex);
      }
    },
    [allowStepNavigation, completedSteps, activeStep, handleStepChange]
  );

  const isStepCompleted = useCallback(
    (stepIndex: number) => {
      return completedSteps.includes(stepIndex) || stepIndex < activeStep;
    },
    [completedSteps, activeStep]
  );

  const isStepAccessible = useCallback(
    (stepIndex: number) => {
      return allowStepNavigation || stepIndex <= Math.max(...completedSteps, activeStep);
    },
    [allowStepNavigation, completedSteps, activeStep]
  );

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className='mb-8'>
          <div className='flex justify-between text-sm text-muted-foreground mb-2'>
            <span>
              Step {activeStep + 1} of {steps.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className='w-full bg-secondary rounded-full h-2'>
            <div
              className='bg-primary h-2 rounded-full transition-all duration-300'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Step Navigation */}
      <div
        className={cn(
          'mb-8',
          orientation === 'horizontal'
            ? 'flex items-center justify-center space-x-4 overflow-x-auto'
            : 'space-y-2'
        )}
      >
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = isStepCompleted(index);
          const isAccessible = isStepAccessible(index);

          return (
            <div
              key={step.id}
              className={cn(
                'flex items-center',
                orientation === 'vertical' && 'w-full',
                orientation === 'horizontal' && index < steps.length - 1 && 'flex-shrink-0'
              )}
            >
              <button
                onClick={() => handleStepClick(index)}
                disabled={!isAccessible || loading}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  isActive && 'bg-primary/10 border-primary',
                  !isActive && isAccessible && 'hover:bg-muted',
                  !isAccessible && 'cursor-not-allowed opacity-50',
                  orientation === 'vertical' && 'w-full text-left',
                  orientation === 'horizontal' && 'min-w-0'
                )}
              >
                {/* Step Icon */}
                <div
                  className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isActive && !isCompleted && 'bg-primary text-primary-foreground',
                    !isActive &&
                      !isCompleted &&
                      'bg-muted text-muted-foreground border-2 border-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className='w-4 h-4' />
                  ) : showStepNumbers ? (
                    index + 1
                  ) : (
                    <Circle className='w-4 h-4' />
                  )}
                </div>

                {/* Step Content */}
                <div className={cn('min-w-0', orientation === 'horizontal' && 'hidden sm:block')}>
                  <div
                    className={cn(
                      'font-medium text-sm',
                      isActive && 'text-primary',
                      !isActive && 'text-foreground'
                    )}
                  >
                    {step.title}
                    {step.optional && (
                      <span className='text-xs text-muted-foreground ml-1'>(Optional)</span>
                    )}
                  </div>
                  {step.description && (
                    <div className='text-xs text-muted-foreground mt-1'>{step.description}</div>
                  )}
                </div>
              </button>

              {/* Connector Line */}
              {orientation === 'horizontal' && index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-px flex-1 mx-2 transition-all',
                    isCompleted ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            {currentStepData.title}
            {currentStepData.optional && (
              <span className='text-sm font-normal text-muted-foreground'>(Optional)</span>
            )}
          </CardTitle>
          {currentStepData.description && (
            <p className='text-sm text-muted-foreground'>{currentStepData.description}</p>
          )}
        </CardHeader>
        <CardContent>
          {/* Error Display */}
          {errors[activeStep] && (
            <div className='mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md'>
              <p className='text-sm text-destructive'>{errors[activeStep]}</p>
            </div>
          )}

          {/* Step Content */}
          <div className='mb-6'>{currentStepData.content}</div>

          {/* Navigation Buttons */}
          <div className='flex items-center justify-between'>
            <Button
              variant='outline'
              onClick={handlePrevious}
              disabled={activeStep === 0 || loading}
              className='flex items-center gap-2'
            >
              <ChevronLeft className='w-4 h-4' />
              Previous
            </Button>

            <div className='flex items-center gap-2'>
              {activeStep < steps.length - 1 ? (
                <Button onClick={handleNext} disabled={loading} className='flex items-center gap-2'>
                  {loading ? 'Validating...' : 'Next'}
                  <ChevronRight className='w-4 h-4' />
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={loading} className='flex items-center gap-2'>
                  {loading ? 'Completing...' : 'Complete'}
                  <Check className='w-4 h-4' />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Stepper component for non-form use cases
export interface StepperProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    optional?: boolean;
  }>;
  currentStep: number;
  completedSteps?: number[];
  orientation?: 'horizontal' | 'vertical';
  showNumbers?: boolean;
  onStepClick?: (step: number) => void;
  allowStepNavigation?: boolean;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  completedSteps = [],
  orientation = 'horizontal',
  showNumbers = true,
  onStepClick,
  allowStepNavigation = false,
  className,
}: StepperProps) {
  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.includes(stepIndex) || stepIndex < currentStep;
  };

  const isStepAccessible = (stepIndex: number) => {
    return allowStepNavigation || stepIndex <= Math.max(...completedSteps, currentStep);
  };

  return (
    <div
      className={cn(
        orientation === 'horizontal' ? 'flex items-center justify-center space-x-4' : 'space-y-2',
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = isStepCompleted(index);
        const isAccessible = isStepAccessible(index);

        return (
          <div
            key={step.id}
            className={cn('flex items-center', orientation === 'vertical' && 'w-full')}
          >
            <button
              onClick={() => onStepClick?.(index)}
              disabled={!isAccessible}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg transition-all',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isActive && 'bg-primary/10',
                !isActive && isAccessible && 'hover:bg-muted',
                !isAccessible && 'cursor-not-allowed opacity-50',
                orientation === 'vertical' && 'w-full text-left'
              )}
            >
              {/* Step Icon */}
              <div
                className={cn(
                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isActive && !isCompleted && 'bg-primary text-primary-foreground',
                  !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className='w-3 h-3' />
                ) : showNumbers ? (
                  index + 1
                ) : (
                  <Circle className='w-3 h-3' />
                )}
              </div>

              {/* Step Content */}
              <div className='min-w-0'>
                <div className={cn('font-medium text-sm', isActive && 'text-primary')}>
                  {step.title}
                  {step.optional && (
                    <span className='text-xs text-muted-foreground ml-1'>(Optional)</span>
                  )}
                </div>
                {step.description && (
                  <div className='text-xs text-muted-foreground mt-1'>{step.description}</div>
                )}
              </div>
            </button>

            {/* Connector Line */}
            {orientation === 'horizontal' && index < steps.length - 1 && (
              <div className={cn('h-px w-8 mx-2', isCompleted ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
