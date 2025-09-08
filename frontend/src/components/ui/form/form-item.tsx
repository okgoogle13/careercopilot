"use client";

import * as React from "react";
import { cn } from "../utils";

const FormItemContext = React.createContext<{ id: string } | null>(null);

export const useFormItem = () => {
  const context = React.useContext(FormItemContext);
  if (!context) {
    throw new Error("useFormItem must be used within a <FormItem>");
  }
  return context;
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        data-slot="form-item"
        className={cn("grid gap-2 transition-all duration-200 ease-in-out", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
});

FormItem.displayName = "FormItem";

export { FormItem };
