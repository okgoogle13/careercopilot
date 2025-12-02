/**
 * ELECTRIC ALCHEMIST: BENTO CARD COMPONENT
 *
 * Grid-based card with:
 * - Tactile Press physics
 * - Optional Pop-Out graphics
 * - Hero variant with gradient scrim
 * - Irregular rotation for hero text
 */

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';
import { tactilePress } from '../../../lib/motion';

/**
 * Card variant styles
 */
const cardVariants = cva(
  // Base styles
  [
    'relative',
    'rounded-card', // 28px radius
    'border border-solid border-outline-variant',
    'p-card-padding', // 24px
    'pt-card-padding-top', // 48px (for Pop-Out graphics)
    'overflow-visible', // Allow Pop-Out elements to break boundaries
    'transition-colors duration-150',
  ],
  {
    variants: {
      variant: {
        // Standard: Surface Container Low
        default: [
          'bg-surface-container-low',
          'text-primary',
        ],
        // Hero: Primary Container with gradient scrim
        hero: [
          'bg-primary-container',
          'text-on-primary-container',
          'border-primary-container',
          // Gradient scrim applied via ::after pseudo-element
        ],
        // Tertiary: Expressive accent
        tertiary: [
          'bg-tertiary-container',
          'text-on-tertiary',
          'border-tertiary-container',
        ],
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
    },
  }
);

export interface ElectricCardProps
  extends Omit<HTMLMotionProps<'div'>, 'variants'>,
    VariantProps<typeof cardVariants> {
  /**
   * Content to render inside the card
   */
  children: React.ReactNode;
  /**
   * Optional Pop-Out graphic element (positioned absolutely at top: -40px)
   */
  popOutGraphic?: React.ReactNode;
}

/**
 * Electric Bento Card Component
 *
 * @example
 * <ElectricCard variant="default">
 *   <h3 className="text-hero">Project Dashboard</h3>
 *   <p className="text-human">Track your progress across all projects.</p>
 * </ElectricCard>
 *
 * @example
 * <ElectricCard
 *   variant="hero"
 *   interactive
 *   popOutGraphic={<div className="pop-out-graphic">🚀</div>}
 * >
 *   <h2 className="text-hero text-hero-irregular">New Project</h2>
 * </ElectricCard>
 */
export const ElectricCard = React.forwardRef<HTMLDivElement, ElectricCardProps>(
  ({ className, variant, interactive, children, popOutGraphic, ...props }, ref) => {
    // Apply Tactile Press physics only if interactive
    const motionProps = interactive
      ? {
          variants: tactilePress,
          initial: 'rest' as const,
          whileHover: 'hover' as const,
          whileTap: 'tap' as const,
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant, interactive }), className)}
        {...motionProps}
        {...props}
      >
        {/* Pop-Out Graphic */}
        {popOutGraphic && (
          <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 z-pop-out drop-shadow-xl">
            {popOutGraphic}
          </div>
        )}

        {/* Card Content */}
        <div className="relative z-base">{children}</div>

        {/* Gradient Scrim for Hero Cards */}
        {variant === 'hero' && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none rounded-card"
            style={{
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent)',
            }}
          />
        )}
      </motion.div>
    );
  }
);

ElectricCard.displayName = 'ElectricCard';
