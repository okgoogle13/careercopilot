import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './utils';

const buttonVariants = cva(
  "btn-pebble inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-field-note font-semibold transition-all duration-standard ease-viscous-breeze disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-wattle-gold/50",
  {
    variants: {
      variant: {
        default: 'bg-wattle-gold text-asphalt-black hover:bg-wattle-glow shadow-standard hover:shadow-elevated hover:animate-bloom-lift',
        destructive:
          'bg-waratah-red text-paper-white hover:bg-waratah-glow shadow-standard hover:shadow-elevated focus-visible:ring-waratah-red/50',
        outline:
          'border-2 border-concrete-grey bg-transparent text-kr-leaf-mist hover:bg-concrete-grey/10 hover:border-kr-leaf-mist',
        secondary: 'bg-concrete-grey text-paper-white hover:bg-kr-leaf-dusk shadow-subtle',
        ghost: 'hover:bg-concrete-grey text-concrete-grey hover:text-paper-white',
        link: 'text-wattle-gold underline-offset-4 hover:underline hover:text-wattle-glow',
      },
      size: {
        default: 'h-10 px-5 py-2 has-[>svg]:px-4',
        sm: 'h-8 px-4 has-[>svg]:px-3 text-xs',
        lg: 'h-12 px-8 has-[>svg]:px-6 text-base',
        icon: 'size-10 rounded-seed',
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
