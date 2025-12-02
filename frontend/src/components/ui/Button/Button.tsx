/**
 * ELECTRIC ALCHEMIST: BUTTON COMPONENT
 *
 * Implements Tactile Press physics (scale 0.98 hover, 0.95 tap)
 * with 5 visual variants aligned to the Alchemist Palette.
 */

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { tactilePress } from '@/lib/motion';

/**
 * Button variant styles using CVA (Class Variance Authority)
 */
const buttonVariants = cva(
  // Base styles (applied to all variants)
  [
    'inline-flex items-center justify-center',
    'text-ai font-ai', // Typography: AI Voice tier (used for UI text)
    'rounded-[24px]', // 24px radius
    'border border-solid',
    'cursor-pointer',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        // Primary: Light on Dark
        default: [
          'bg-primary-container text-on-primary-container',
          'border-primary-container',
          'hover:bg-primary', // Use primary for hover effect
          'focus-visible:ring-primary',
        ],
        // Secondary: Surface Container
        secondary: [
          'bg-surface-container text-primary',
          'border-outline-variant',
          'hover:bg-surface-container-high',
          'focus-visible:ring-outline',
        ],
        // Outline: Transparent with border
        outline: [
          'bg-transparent text-primary',
          'border-outline-variant',
          'hover:bg-surface-container-low',
          'focus-visible:ring-outline',
        ],
        // Ghost: No border or background
        ghost: [
          'bg-transparent text-primary',
          'border-transparent',
          'hover:bg-surface-container-low',
          'focus-visible:ring-outline',
        ],
        // Tertiary: Expressive Accent
        tertiary: [
          'bg-tertiary-container text-on-tertiary',
          'border-tertiary-container',
          'hover:bg-tertiary',
          'focus-visible:ring-tertiary',
        ],
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'variants'>,
    VariantProps<typeof buttonVariants> {
  /**
   * Content to render inside the button
   */
  children: React.ReactNode;
}

/**
 * Electric Button Component
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        variants={tactilePress}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
export { Button, buttonVariants };
