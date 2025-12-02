import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// CVA Definition (Ensures Tailwind classes are correctly applied)
const buttonVariants = cva(
  // BASE STYLES: Use tokens for rounded-[24px], text-human
  "inline-flex items-center justify-center whitespace-nowrap rounded-[24px] text-human text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-container text-on-primary-container border-primary-container hover:bg-primary shadow-[0_0_15px_rgba(208,188,255,0.3)]",
        secondary: "bg-surface-container text-primary border-outline-variant hover:bg-surface-container-high",
        outline: "border border-outline-variant bg-transparent text-primary hover:bg-surface-container-low",
        ghost: "bg-transparent text-primary border-transparent hover:bg-surface-container-low",
        link: "text-primary underline-offset-4 hover:underline bg-transparent border-transparent",
      },
      size: {
        default: "h-11 px-8 py-2",
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

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    // PHYSICS: The "Tactile Press" from tokens.json
    const tactilePhysics = {
      rest: { scale: 1 },
      hover: { scale: 0.98 },
      tap: { scale: 0.95 }
    };

    return (
      <motion.button
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
