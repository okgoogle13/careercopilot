/**
 * ELECTRIC ALCHEMIST: SWITCH COMPONENT
 * Toggle switch with Tactile Press physics
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/cn';

export interface ElectricSwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const ElectricSwitch = React.forwardRef<HTMLInputElement, ElectricSwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const switchId = id || React.useId();

    return (
      <div className="flex items-center gap-3">
        <motion.label
          htmlFor={switchId}
          className="relative inline-block h-6 w-11 cursor-pointer"
          whileTap={{ scale: 0.95 }}
        >
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'h-6 w-11 rounded-full',
              'bg-surface-container-high border border-outline-variant',
              'transition-colors duration-150',
              'peer-checked:bg-primary-container peer-checked:border-primary-container',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-tertiary peer-focus-visible:ring-offset-2',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed'
            )}
          />
          <motion.div
            className={cn(
              'absolute top-0.5 left-0.5 h-5 w-5 rounded-full',
              'bg-outline',
              'transition-all duration-150',
              'peer-checked:translate-x-5 peer-checked:bg-on-primary-container'
            )}
            layout
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
          />
        </motion.label>
        {label && (
          <label
            htmlFor={switchId}
            className="text-ai cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

ElectricSwitch.displayName = 'ElectricSwitch';
