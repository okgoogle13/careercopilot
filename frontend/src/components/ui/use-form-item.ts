import * as React from 'react';

const FormItemContext = React.createContext<{ id: string } | null>(null);

export const useFormItem = () => {
  const context = React.useContext(FormItemContext);
  if (!context) {
    throw new Error('useFormItem must be used within a <FormItem>');
  }
  return context;
};

export { FormItemContext };
