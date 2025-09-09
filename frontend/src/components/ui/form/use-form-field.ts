"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormFieldContext } from "./form-field-context";

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField must be used within a <FormField>");
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
