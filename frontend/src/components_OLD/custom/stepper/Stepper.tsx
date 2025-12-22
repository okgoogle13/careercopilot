/**
 * ELECTRIC ALCHEMIST: STEPPER COMPONENT
 *
 * Step indicator with checkmarks and design system tokens.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep?: number;
  steps: string[];
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ activeStep = 0, steps, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-4', className)}
        {...props}
      >
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isPending = index > activeStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    'border-2 transition-colors duration-150',
                    isCompleted &&
                      'bg-primary-container border-primary-container text-on-primary-container',
                    isActive &&
                      'bg-surface-container border-primary text-primary',
                    isPending &&
                      'bg-surface-container-low border-outline-variant text-on-surface-variant'
                  )}
                  initial={{ scale: 1 }}
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  ) : (
                    <span className="text-data text-sm font-medium">{index + 1}</span>
                  )}
                </motion.div>
                <span
                  className={cn(
                    'text-human text-xs text-center max-w-[100px]',
                    isActive && 'text-primary',
                    isCompleted && 'text-on-surface',
                    isPending && 'text-on-surface-variant'
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-px flex-1 transition-colors duration-150',
                    isCompleted ? 'bg-primary-container' : 'bg-outline-variant'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';

export default Stepper;

