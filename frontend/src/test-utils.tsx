import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

// Wrap render with act by default
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => {
  let result: RenderResult;
  act(() => {
    result = render(ui, options);
  });
  return result!;
};

// Re-export everything
export * from '@testing-library/react';
// Override render method
export { customRender as render };

// Helper to wrap async tests with act
export const actAsync = async (callback: () => Promise<void> | void) => {
  await act(async () => {
    await callback();
  });
};

// Helper to wait for state updates
const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

export const waitForStateUpdate = async (count = 1) => {
  for (let i = 0; i < count; i++) {
    await waitForNextTick();
  }
};

// Custom matchers
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeDisabled(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | string[] | number): R;
      toBeChecked(): R;
    }
  }
}
