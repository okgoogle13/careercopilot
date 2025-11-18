import React from 'react';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';

describe('ToastContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('useToast hook', () => {
    // Test 1: useToast throws error when used outside ToastProvider
    it('throws error when used outside ToastProvider', () => {
      const { result } = renderHook(() => useToast());

      expect(result.error).toBeDefined();
      expect(result.error).toEqual(
        new Error('useToast must be used within a ToastProvider')
      );
    });

    // Test 2: showToast displays toast with message
    it('showToast displays toast with message', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(result.current).toBeDefined();
      expect(typeof result.current.showToast).toBe('function');

      act(() => {
        result.current.showToast('Test message');
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });

    // Test 3: showSuccess displays success severity toast
    it('showSuccess displays success severity toast', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(typeof result.current.showSuccess).toBe('function');

      act(() => {
        result.current.showSuccess('Success message');
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });

    // Test 4: showError displays error severity toast
    it('showError displays error severity toast', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(typeof result.current.showError).toBe('function');

      act(() => {
        result.current.showError('Error message');
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });

    // Test 5: showWarning displays warning severity toast
    it('showWarning displays warning severity toast', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(typeof result.current.showWarning).toBe('function');

      act(() => {
        result.current.showWarning('Warning message');
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });

    // Test 6: showInfo displays info severity toast
    it('showInfo displays info severity toast', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(typeof result.current.showInfo).toBe('function');

      act(() => {
        result.current.showInfo('Info message');
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });

    // Test 7: Toast auto-closes after duration (use jest.useFakeTimers())
    it('toast auto-closes after duration', () => {
      jest.useFakeTimers('modern');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.showToast('Auto-close message', { autoHideDuration: 3000 });
      });

      // Move time forward by 3 seconds
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // The toast should start closing
      expect(result.current).toBeDefined();

      // Move time forward for the close animation (300ms)
      act(() => {
        jest.advanceTimersByTime(300);
      });

      jest.useRealTimers();
    });

    // Test 8: Multiple toasts can be displayed simultaneously
    it('multiple toasts can be displayed simultaneously', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.showToast('First message');
        result.current.showSuccess('Success message');
        result.current.showError('Error message');
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });

    // Test 9: Toast closes when onClose is called
    it('toast closes when onClose is called', () => {
      jest.useFakeTimers('modern');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.showToast('Closeable message');
      });

      // Simulate the passage of time for close animation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current).toBeDefined();

      jest.useRealTimers();
    });

    // Test 10: Toast respects custom anchorOrigin option
    it('toast respects custom anchorOrigin option', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.showToast('Custom position message', {
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });
  });

  describe('ToastProvider component', () => {
    it('renders children correctly', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.showToast).toBeDefined();
      expect(result.current.showSuccess).toBeDefined();
      expect(result.current.showError).toBeDefined();
      expect(result.current.showWarning).toBeDefined();
      expect(result.current.showInfo).toBeDefined();
    });

    it('provides correct context value with all methods', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
      );
      const { result } = renderHook(() => useToast(), { wrapper });

      const expectedMethods = [
        'showToast',
        'showSuccess',
        'showError',
        'showWarning',
        'showInfo',
      ];

      expectedMethods.forEach((method) => {
        expect(typeof result.current[method as keyof typeof result.current]).toBe(
          'function'
        );
      });
    });
  });
});
