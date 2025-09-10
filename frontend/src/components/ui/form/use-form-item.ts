'use client';

import * as React from 'react';
import { FormItemContext } from './form-item-context';

export const useFormItem = () => {
  const context = React.useContext(FormItemContext);
  if (!context) {
    throw new Error('useFormItem must be used within a <FormItem>');
  }
  return context;
};
