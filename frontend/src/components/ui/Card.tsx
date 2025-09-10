import * as React from 'react';
// Using inline variant logic instead of class-variance-authority for simplicity

import { cn } from './utils';

type CardVariant = 'default' | 'interactive' | 'selected' | 'loading' | 'error';

export interface CardProps extends React.ComponentProps<'div'> {
  variant?: CardVariant;
}

const getCardVariantClasses = (variant: CardVariant = 'default') => {
  const baseClasses =
    'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border transition-all duration-200';

  switch (variant) {
    case 'interactive':
      return `${baseClasses} border-border hover:border-border/80 hover:shadow-lg hover:shadow-primary/10 cursor-pointer`;
    case 'selected':
      return `${baseClasses} border-primary border-2 shadow-lg shadow-primary/20`;
    case 'loading':
      return `${baseClasses} border-border`;
    case 'error':
      return `${baseClasses} border-destructive/50 bg-destructive/5`;
    case 'default':
    default:
      return `${baseClasses} border-border`;
  }
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(getCardVariantClasses(variant), className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.ComponentProps<'h4'>>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} data-slot="card-title" className={cn('leading-none', className)} {...props} />
  )
);

CardTitle.displayName = 'CardTitle';

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <p data-slot="card-description" className={cn('text-muted-foreground', className)} {...props} />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn('px-6 [&:last-child]:pb-6', className)}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 pb-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
