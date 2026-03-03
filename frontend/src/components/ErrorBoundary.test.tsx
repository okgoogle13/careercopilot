import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ErrorBoundary from './ErrorBoundary';

const ThrowError = ({ message = 'boom' }: { message?: string }) => {
  throw new Error(message);
};

describe('ErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div>Safe child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe child')).toBeInTheDocument();
  });

  it('renders the default fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go Home/i })).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('renders a custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    expect(screen.queryByText(/Oops! Something went wrong/i)).not.toBeInTheDocument();
  });

  it('keeps the fallback visible when Try Again is clicked and the child still throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError message="persistent error" />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /Try Again/i }));

    expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
  });
});
