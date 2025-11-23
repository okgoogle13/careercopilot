import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // BASE STYLES:
  // - rounded-[24px] (Style Guide Shape)
  // - text-human (Roboto Serif Typography)
  // - inline-flex, centered, transition-colors
  "inline-flex items-center justify-center whitespace-nowrap rounded-[24px] text-human text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary-container hover:bg-primary/90 shadow-[0_0_15px_rgba(208,188,255,0.3)]",
        secondary: "bg-tertiary text-on-tertiary hover:bg-tertiary/90",
        outline: "border border-outline-variant bg-transparent hover:bg-surface-container",
        ghost: "hover:bg-surface-container-high text-on-surface",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-8 py-2", // Taller, pill-like touch target
        sm: "h-9 px-4",
        lg: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Extract the variant and size types from cva
type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
type ButtonSize = VariantProps<typeof buttonVariants>['size'];

// We use HTMLMotionProps to allow framer-motion props (like whileTap)
// combined with our VariantProps
export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild, ...props }, ref) => {
    // PHYSICS: The "Tactile Press" (Press IN, don't lift UP)
    const tactilePhysics = {
      rest: { scale: 1 },
      hover: { scale: 0.98 },
      tap: { scale: 0.95 }
    };

    const MotionButton = motion.button;
    
    return (
      <MotionButton
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={tactilePhysics}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants };
