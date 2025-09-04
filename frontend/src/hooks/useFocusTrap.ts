// Focus trap hook for modal accessibility
import { useEffect, useRef } from 'react';

interface FocusTrapOptions {
  active: boolean;
  initialFocus?: boolean;
  restoreFocus?: boolean;
}

export const useFocusTrap = (options: FocusTrapOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!options.active) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the currently focused element
    if (options.restoreFocus !== false) {
      previousActiveElement.current = document.activeElement;
    }

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(', ');

      return Array.from(container.querySelectorAll(focusableSelectors)).filter(
        (element: Element) => {
          const htmlElement = element as HTMLElement;
          return htmlElement.offsetWidth > 0 && htmlElement.offsetHeight > 0 && !htmlElement.hidden;
        }
      ) as HTMLElement[];
    };

    // Handle tab key navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab: moving backwards
        if (activeElement === firstElement || !container.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forwards
        if (activeElement === lastElement || !container.contains(activeElement)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Set initial focus
    if (options.initialFocus !== false) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        // Focus the first focusable element, or the container if no focusable elements
        const elementToFocus = focusableElements[0] || container;
        elementToFocus.focus();
      }
    }

    // Add event listener for tab navigation
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to the previously focused element
      if (options.restoreFocus !== false && previousActiveElement.current) {
        const elementToRestore = previousActiveElement.current as HTMLElement;
        if (elementToRestore.focus) {
          elementToRestore.focus();
        }
      }
    };
  }, [options.active, options.initialFocus, options.restoreFocus]);

  return containerRef;
};

// Hook for managing escape key handling
export const useEscapeKey = (callback: () => void, active: boolean = true) => {
  useEffect(() => {
    if (!active) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback, active]);
};
