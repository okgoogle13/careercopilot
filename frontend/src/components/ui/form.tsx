'use client';

import * as React from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';

import { cn } from './utils';

type FormFieldContextValue = {
  name: string;
};

export const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField must be used within a <FormField>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const id = React.useId();

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

FormField.displayName = 'FormField';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : children;

  if (!body) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute -left-1 top-0 h-full w-0.5 bg-destructive rounded-full" />
      <p
        ref={ref}
        data-slot="form-message"
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

export { FormProvider as Form, FormField, FormMessage };
