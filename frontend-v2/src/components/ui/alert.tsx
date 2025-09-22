import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AlertProps {
  children: ReactNode;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  className?: string;
}

export function Alert({ children, variant = 'default', className }: AlertProps) {
  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        {
          'bg-background text-foreground': variant === 'default',
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive':
            variant === 'destructive',
          'border-yellow-500/50 text-yellow-700 bg-yellow-50 dark:border-yellow-500 dark:text-yellow-400 dark:bg-yellow-950/20':
            variant === 'warning',
          'border-green-500/50 text-green-700 bg-green-50 dark:border-green-500 dark:text-green-400 dark:bg-green-950/20':
            variant === 'success',
        },
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
}

interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function AlertDescription({ children, className }: AlertDescriptionProps) {
  return (
    <div className={cn('text-sm [&_p]:leading-relaxed', className)}>
      {children}
    </div>
  );
}

interface AlertTitleProps {
  children: ReactNode;
  className?: string;
}

export function AlertTitle({ children, className }: AlertTitleProps) {
  return (
    <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)}>
      {children}
    </h5>
  );
}