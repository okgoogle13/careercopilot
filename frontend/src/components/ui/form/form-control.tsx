'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../utils';
import { useFormField } from './form-field';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      className={cn(
        'transition-all duration-200 ease-in-out',
        error && 'border-destructive/70 focus-visible:ring-destructive/20'
      )}
      {...props}
    />
  );
});

FormControl.displayName = 'FormControl';

export { FormControl };
