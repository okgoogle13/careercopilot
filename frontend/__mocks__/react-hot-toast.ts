import * as React from 'react';

type ToastOptions = {
  duration?: number;
  position?: string;
  // Add other toast options as needed
};

import { jest } from '@jest/globals';

const toast = {
  success: jest.fn((message: string, options?: ToastOptions) => 'toast-success'),
  error: jest.fn((message: string, options?: ToastOptions) => 'toast-error'),
  loading: jest.fn((message: string, options?: ToastOptions) => 'toast-loading'),
  dismiss: jest.fn((toastId?: string) => {}),
  promise: jest.fn((promise: Promise<any>, msgs: any, opts?: any) => promise),
};

// Create a proper React component for Toaster
export const Toaster: React.FC = () => {
  return React.createElement('div', { 'data-testid': 'toaster' });
};

// Add type for the toast object
export type ToastType = typeof toast;

export default toast;
