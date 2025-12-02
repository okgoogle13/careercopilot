/**
 * ELECTRIC ALCHEMIST: RADIO GROUP COMPONENT
 * Radio button group with Tactile Press physics
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/cn';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ElectricRadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const ElectricRadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {options.map((option) => {
        const radioId = `${name}-${option.value}`;
        const isChecked = value === option.value;

        return (
          <div key={option.value} className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <input
                type="radio"
                id={radioId}
                name={name}
                value={option.value}
                checked={isChecked}
                disabled={option.disabled}
                onChange={(e) => onChange?.(e.target.value)}
                className={cn(
                  'peer h-5 w-5 shrink-0 rounded-full',
                  'border-2 border-outline-variant',
                  'bg-surface-container',
                  'cursor-pointer',
                  'transition-all duration-150',
                  'checked:border-primary-container',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              />
              <div
                className={cn(
                  'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                  'h-2.5 w-2.5 rounded-full bg-on-primary-container',
                  'opacity-0 peer-checked:opacity-100',
                  'transition-opacity duration-150'
                )}
              />
            </motion.div>
            <label
              htmlFor={radioId}
              className="text-ai cursor-pointer select-none"
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
};

ElectricRadioGroup.displayName = 'ElectricRadioGroup';
