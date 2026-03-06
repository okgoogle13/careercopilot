import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from './utils';

/**
 * Button - Kerala Rage kr-solidarity Button Component
 *
 * Versatile button component using Kerala Rage kr-solidarity semantic tokens with CVA variants.
 * Archetype: Seed (atomic interaction primitive)
 *
 * **Kerala Rage Design Token Usage:**
 * - Colors: Kerala Rage kr-solidarity semantic palette (inkGold, solidarityRed, concreteGrey, worker-ash)
 * - Typography: Work Sans (field-note font family)
 * - Motion: Spring physics cubic-bezier(0.34, 1.56, 0.64, 1) with scale transforms
 * - Shape: Asymmetric border radius via rounded-pebble/rounded-stone utilities
 *
 * **Variants:**
 * - default: inkGold background (primary CTA)
 * - destructive: solidarityRed background (dangerous actions)
 * - outline: concreteGrey border with transparent background
 * - secondary: concreteGrey background (less prominent actions)
 * - ghost: Minimal styling with hover states
 * - link: Text-only with underline on hover
 *
 * **Sizes:**
 * - default: h-11, medium padding
 * - sm: h-9, compact padding
 * - lg: h-14, large padding
 * - icon: Circular (size-11)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-field-note font-semibold transition-all duration-standard var(--ease-viscous-breeze) disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--sys-color-inkGold-base)] active:scale-95 hover:scale-105",
  {
    variants: {
      variant: {
        default:
          'bg-[var(--sys-color-inkGold-base)] text-[var(--sys-color-charcoalBackground-base)] hover:shadow-standard',
        destructive: 'bg-[var(--sys-color-solidarityRed-base)] text-white hover:shadow-standard',
        outline:
          'border-2 border-[var(--sys-color-concreteGrey-base)] bg-transparent text-[var(--sys-color-worker-ash-base)] hover:border-[var(--sys-color-concreteGrey-steps-4)] hover:bg-white/5',
        secondary:
          'bg-[var(--sys-color-concreteGrey-steps-2)] text-[var(--sys-color-charcoalBackground-base)] hover:bg-[var(--sys-color-concreteGrey-steps-3)]',
        ghost:
          'text-[var(--sys-color-concreteGrey-steps-4)] hover:bg-white/5 hover:text-[var(--sys-color-worker-ash-base)]',
        link: 'text-[var(--sys-color-inkGold-base)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2 has-[>svg]:px-4 rounded-pebble',
        sm: 'h-9 px-4 has-[>svg]:px-3 rounded-stone',
        lg: 'h-14 px-8 has-[>svg]:px-6 text-base rounded-pebble',
        icon: 'size-11 rounded-sentry', // Symmetric circular for icon buttons
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
