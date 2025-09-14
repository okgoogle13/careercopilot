'use client';

import * as React from 'react';
import { cn } from '../utils';
import { useFormField } from './form-field';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message) : children;

  if (!body) {
    return null;
  }

  return (
    <div className='relative'>
      <div className='absolute -left-1 top-0 h-full w-0.5 bg-destructive rounded-full' />
      <p
        ref={ref}
        data-slot='form-message'
        id={formMessageId}
        className={cn(
          'text-destructive text-xs pl-3 py-1.5 animate-in fade-in-0 zoom-in-95',
          'transition-all duration-200 ease-in-out',
          'dark:text-destructive-foreground dark:bg-destructive/10 dark:px-2 dark:py-1.5 dark:rounded-md',
          className
        )}
        {...props}
      >
        {body}
      </p>
    </div>
  );
});

FormMessage.displayName = 'FormMessage';

export { FormMessage };
