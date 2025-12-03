/**
 * M3 Expressive Stepper Component
 * Implements Material Design 3 Stepper for CareerCopilot
 *
 * Step tracking component for multi-step processes. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Stepper.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3Stepper.css';

export interface M3Step {
  /**
   * Step label
   */
  label: string;

  /**
   * Optional step description
   */
  description?: string;

  /**
   * Optional step icon
   */
  icon?: React.ReactNode;

  /**
   * If true, step is optional
   */
  optional?: boolean;

  /**
   * If true, step has error
   */
  error?: boolean;
}

export interface M3StepperProps {
  /**
   * Steps array
   */
  steps: M3Step[];

  /**
   * Current active step index (0-based)
   */
  activeStep?: number;

  /**
   * Orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Stepper component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Stepper
 *   steps={[
 *     { label: 'Step 1', description: 'First step' },
 *     { label: 'Step 2', description: 'Second step' },
 *     { label: 'Step 3', description: 'Final step' },
 *   ]}
 *   activeStep={1}
 * />
 * ```
 */
export const M3Stepper: React.FC<M3StepperProps> = ({
  steps,
  activeStep = 0,
  orientation = 'horizontal',
  color = 'primary',
  className = '',
}) => {
  const classNames = [
    'm3-stepper',
    `m3-stepper--${orientation}`,
    `m3-stepper--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getStepState = (index: number): 'completed' | 'active' | 'pending' => {
    if (index < activeStep) return 'completed';
    if (index === activeStep) return 'active';
    return 'pending';
  };

  return (
    <div className={classNames} role="group" aria-label="Stepper">
      {steps.map((step, index) => {
        const state = getStepState(index);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            <div className={`m3-stepper__step m3-stepper__step--${state}`}>
              <div className="m3-stepper__step-connector">
                {state === 'completed' ? (
                  <div className="m3-stepper__step-icon m3-stepper__step-icon--completed">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                ) : step.icon ? (
                  <div className="m3-stepper__step-icon">{step.icon}</div>
                ) : (
                  <div className="m3-stepper__step-circle">
                    {state === 'active' && (
                      <div className="m3-stepper__step-circle-inner" />
                    )}
                  </div>
                )}
              </div>
              <div className="m3-stepper__step-content">
                <div className="m3-stepper__step-label">
                  {step.label}
                  {step.optional && (
                    <span className="m3-stepper__step-optional">(Optional)</span>
                  )}
                </div>
                {step.description && (
                  <div className="m3-stepper__step-description">{step.description}</div>
                )}
              </div>
            </div>
            {!isLast && <div className="m3-stepper__connector" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

M3Stepper.displayName = 'M3Stepper';

export default M3Stepper;
