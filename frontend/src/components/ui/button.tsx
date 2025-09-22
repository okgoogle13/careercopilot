import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';

import { cn } from './utils';
import { buttonVariants, type ButtonVariants } from './button-variants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      disabled,
      isLoading = false,
      loadingText,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || isLoading;

    return (
      <Comp
        data-slot="button"
        data-loading={isLoading}
        className={cn(
          buttonVariants({ variant, size, className }),
          'relative overflow-hidden',
          isLoading && 'cursor-wait'
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText && <span className="ms-2">{loadingText}</span>}
          </span>
        )}
        <span className={cn('flex items-center gap-2', isLoading && 'invisible')}>{children}</span>
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
