import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider, useFormContext, type FieldValues, type FieldPath } from "react-hook-form";

import { cn } from "./utils";
import { Label } from "./label";

const Form = FormProvider;

interface FormFieldContextValue {
  name: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = ({
  ...props
}: {
  name: string;
  children: React.ReactNode;
}) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      {props.children}
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItemContext = React.createContext<{
  id: string;
}>({} as { id: string });

export { Form, FormField, useFormField, FormItemContext };
