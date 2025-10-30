/**
 * Accessibility Utilities
 * Helper functions for ARIA labels, keyboard navigation, and semantic HTML
 */

/**
 * Generate ARIA label for common UI patterns
 */
export const ariaLabels = {
  loading: 'Loading content',
  error: 'Error occurred',
  success: 'Operation successful',
  menu: 'Options menu',
  close: 'Close dialog',
  submit: 'Submit form',
  cancel: 'Cancel operation',
  delete: 'Delete item',
  edit: 'Edit item',
  download: 'Download file',
  upload: 'Upload file',
  search: 'Search',
  filter: 'Filter results',
  sort: 'Sort results',
  notification: 'Notification',
  profile: 'User profile menu',
  navigation: 'Main navigation',
};

/**
 * Common ARIA attributes for components
 */
export const createAriaAttributes = (
  label: string,
  disabled?: boolean,
  invalid?: boolean,
  required?: boolean,
  expanded?: boolean
) => ({
  'aria-label': label,
  ...(disabled && { 'aria-disabled': true }),
  ...(invalid && { 'aria-invalid': true }),
  ...(required && { 'aria-required': true }),
  ...(expanded !== undefined && { 'aria-expanded': expanded }),
});

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Focus first interactive element in container
   */
  focusFirstElement: (container: HTMLElement | null) => {
    if (!container) return;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  },

  /**
   * Focus last interactive element in container
   */
  focusLastElement: (container: HTMLElement | null) => {
    if (!container) return;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      (focusableElements[focusableElements.length - 1] as HTMLElement).focus();
    }
  },

  /**
   * Restore focus to previously focused element
   */
  createFocusManager: () => {
    let previouslyFocused: HTMLElement | null = null;

    return {
      saveFocus: () => {
        previouslyFocused = document.activeElement as HTMLElement;
      },
      restoreFocus: () => {
        if (previouslyFocused) {
          previouslyFocused.focus();
        }
      },
    };
  },
};

/**
 * Keyboard navigation helpers
 */
export const keyboardNavigation = {
  /**
   * Handle arrow key navigation for lists
   */
  handleArrowNavigation: (
    event: React.KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number
  ) => {
    let newIndex = currentIndex;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      newIndex = (currentIndex + 1) % items.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      newIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      newIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      newIndex = items.length - 1;
    }

    return newIndex;
  },

  /**
   * Check if key is Enter or Space
   */
  isActivationKey: (key: string): boolean => {
    return key === 'Enter' || key === ' ';
  },
};

/**
 * Semantic HTML helpers
 */
export const semanticHTML = {
  /**
   * Get appropriate heading level based on context
   */
  getHeadingLevel: (depth: number): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' => {
    const level = Math.min(Math.max(depth, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6;
    return `h${level}` as any;
  },

  /**
   * Check if element is form-related
   */
  isFormElement: (element: Element): boolean => {
    const formElements = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'];
    return formElements.includes(element.tagName);
  },
};

/**
 * Screen reader announcements
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Hide visually but keep for screen readers
  announcement.textContent = message;
  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Contrast ratio checker (simple version)
 */
export const getContrastRatio = (rgb1: string, rgb2: string): number => {
  const getLuminance = (rgb: string): number => {
    const values = rgb.match(/\d+/g);
    if (!values || values.length < 3) return 0;

    const [r, g, b] = values.map((v) => {
      const val = parseInt(v) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Accessible color palette validator
 */
export const validateColorContrast = (
  foreground: string,
  background: string,
  minRatio = 4.5
): boolean => {
  return getContrastRatio(foreground, background) >= minRatio;
};
