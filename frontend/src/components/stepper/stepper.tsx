import React from 'react';
import styles from './stepper.module.css';
import { Check } from 'lucide-react';

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep?: number;
  steps: string[];
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ activeStep = 0, steps, className, ...props }, ref) => (
    <div className={styles.stepper + (className ? ' ' + className : '')} ref={ref} {...props}>
      {steps.map((step, index) => (
        <div key={index} className={styles['step-item']}>
          <div className={styles['step-indicator'] + ' ' + (index < activeStep ? styles['step-indicator--completed'] : index === activeStep ? styles['step-indicator--active'] : '')}>
            {index < activeStep ? <Check size={16} /> : <span>{index + 1}</span>}
          </div>
          <span className={styles['step-label']}>{step}</span>
          {index < steps.length - 1 && <div className={styles['step-connector']} />}
        </div>
      ))}
    </div>
  )
);

Stepper.displayName = 'Stepper';
