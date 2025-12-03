/**
 * M3 Expressive Dialog Component
 * Implements Material Design 3 Dialog for CareerCopilot
 *
 * Simpler than Modal, optimized for confirmation patterns with built-in buttons.
 * Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Dialog.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import './M3Dialog.css';
import { M3Button } from '../button/M3Button';

export interface M3DialogProps {
  /**
   * If true, dialog is open
   * @default false
   */
  open: boolean;

  /**
   * Callback fired when dialog should close
   */
  onClose: () => void;

  /**
   * Dialog title
   */
  title?: string;

  /**
   * Dialog content/description
   */
  content?: React.ReactNode;

  /**
   * Confirm button label
   * @default 'Confirm'
   */
  confirmLabel?: string;

  /**
   * Cancel button label
   * @default 'Cancel'
   */
  cancelLabel?: string;

  /**
   * Callback fired when confirm button is clicked
   */
  onConfirm?: () => void;

  /**
   * Callback fired when cancel button is clicked
   */
  onCancel?: () => void;

  /**
   * If true, confirm action is destructive (uses error color)
   * @default false
   */
  destructive?: boolean;

  /**
   * If true, clicking backdrop closes dialog
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * If true, pressing Escape closes dialog
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * ARIA label for the dialog
   */
  'aria-labelledby'?: string;

  /**
   * ARIA description for the dialog
   */
  'aria-describedby'?: string;
}

/**
 * M3 Expressive Dialog component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Dialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Delete Item?"
 *   content="This action cannot be undone."
 *   confirmLabel="Delete"
 *   destructive
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export const M3Dialog: React.FC<M3DialogProps> = ({
  open,
  onClose,
  title,
  content,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Save focus when dialog opens
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  // Focus management and keyboard handling
  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    // Focus first focusable element (confirm button)
    const confirmButton = dialog.querySelector<HTMLElement>('.m3-dialog__confirm');
    if (confirmButton) {
      confirmButton.focus();
    }

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
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

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    onClose();
  }, [onConfirm, onClose]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    onClose();
  }, [onCancel, onClose]);

  if (!open) return null;

  const classNames = [
    'm3-dialog',
    destructive && 'm3-dialog--destructive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="m3-dialog__backdrop" onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        className={classNames}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="m3-dialog__title" id={ariaLabelledBy}>
            {title}
          </div>
        )}
        {content && (
          <div className="m3-dialog__content" id={ariaDescribedBy}>
            {content}
          </div>
        )}
        <div className="m3-dialog__actions">
          <M3Button
            variant="text"
            onClick={handleCancel}
            className="m3-dialog__cancel"
          >
            {cancelLabel}
          </M3Button>
          <M3Button
            variant="filled"
            color={destructive ? 'error' : 'primary'}
            onClick={handleConfirm}
            className="m3-dialog__confirm"
          >
            {confirmLabel}
          </M3Button>
        </div>
      </div>
    </div>
  );
};

M3Dialog.displayName = 'M3Dialog';

export default M3Dialog;
