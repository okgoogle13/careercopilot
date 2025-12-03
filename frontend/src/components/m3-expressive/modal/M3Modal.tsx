/**
 * M3 Expressive Modal Component
 * Implements Material Design 3 Modal for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Modal.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import './M3Modal.css';

export interface M3ModalProps {
  /**
   * If true, modal is open
   * @default false
   */
  open: boolean;

  /**
   * Callback fired when modal should close
   */
  onClose: () => void;

  /**
   * Size variant
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * If true, clicking backdrop closes modal
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * If true, pressing Escape closes modal
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Optional header/title content
   */
  header?: React.ReactNode;

  /**
   * Optional footer/actions content
   */
  footer?: React.ReactNode;

  /**
   * Modal content
   */
  children?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * ARIA label for the modal
   */
  'aria-labelledby'?: string;

  /**
   * ARIA description for the modal
   */
  'aria-describedby'?: string;
}

/**
 * M3 Expressive Modal component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Modal open={isOpen} onClose={() => setIsOpen(false)}>
 *   <M3Modal.Header>Title</M3Modal.Header>
 *   <div>Content</div>
 *   <M3Modal.Footer>
 *     <M3Button onClick={handleSave}>Save</M3Button>
 *   </M3Modal.Footer>
 * </M3Modal>
 * ```
 */
export const M3Modal: React.FC<M3ModalProps> & {
  Header: React.FC<{ children: React.ReactNode; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode; className?: string }>;
} = ({
  open,
  onClose,
  size = 'medium',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  header,
  footer,
  children,
  className = '',
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Save focus when modal opens
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!open) return;

    const modal = modalRef.current;
    if (!modal) return;

    // Focus first focusable element
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const focusableElements = modal.querySelectorAll<HTMLElement>(focusableSelectors);
    const firstFocusable = Array.from(focusableElements).find(
      (el) => el.offsetParent !== null
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Handle Tab key for focus trap
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = Array.from(
        modal.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter((el) => el.offsetParent !== null);

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscape);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [open, closeOnEscape, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose]
  );

  if (!open) return null;

  const classNames = [
    'm3-modal',
    `m3-modal--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="m3-modal__backdrop" onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        className={classNames}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onClick={(e) => e.stopPropagation()}
      >
        {header && (
          <div className="m3-modal__header">
            {header}
            <button
              className="m3-modal__close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className="m3-modal__content">{children}</div>
        {footer && <div className="m3-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

// Header sub-component
M3Modal.Header = ({ children, className = '' }) => (
  <div className={`m3-modal__header-content ${className}`}>{children}</div>
);

// Footer sub-component
M3Modal.Footer = ({ children, className = '' }) => (
  <div className={`m3-modal__footer-content ${className}`}>{children}</div>
);

M3Modal.displayName = 'M3Modal';

export default M3Modal;
