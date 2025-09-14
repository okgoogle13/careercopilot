'use client';

import * as React from 'react';
import { cn } from '../utils';
import { FormItemContext } from './form-item-context';

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();
    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          ref={ref}
          data-slot='form-item'
          className={cn('grid gap-2 transition-all duration-200 ease-in-out', className)}
          {...props}
        />
      </FormItemContext.Provider>
    );
  }
);

FormItem.displayName = 'FormItem';

export { FormItem };
