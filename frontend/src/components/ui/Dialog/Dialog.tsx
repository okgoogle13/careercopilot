import React, { ReactNode, useState } from 'react';
import { M3Dialog } from '../../M3Dialog/M3Dialog';
import { M3Button } from '../../M3Button/M3Button';

export interface DialogProps {
  /**
   * The title of the dialog
   */
  title?: string;
  /**
   * The content of the dialog
   */
  content?: ReactNode;
  /**
   * The text content of the dialog
   */
  contentText?: string;
  /**
   * The actions to display in the dialog
   */
  actions?: ReactNode;
  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Whether to show the default cancel button
   * @default true
   */
  showCancelButton?: boolean;
  /**
   * The text of the cancel button
   * @default 'Cancel'
   */
  cancelButtonText?: string;
  /**
   * Whether to show the default confirm button
   * @default true
   */
  showConfirmButton?: boolean;
  /**
   * The text of the confirm button
   * @default 'Confirm'
   */
  confirmButtonText?: string;
  /**
   * The color of the confirm button
   * @default 'primary'
   */
  confirmButtonColor?: 'primary' | 'secondary' | 'error';
  /**
   * Whether the confirm button is in a loading state
   * @default false
   */
  isConfirmLoading?: boolean;
  /**
   * Whether the dialog is open
   * @default false
   */
  open?: boolean;
  /**
   * Callback when the dialog is closed
   */
  onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown' | 'closeButton' | 'cancelButton') => void;
  /**
   * Callback when the confirm button is clicked
   */
  onConfirm?: () => void | Promise<void>;
  /**
   * The maximum width of the dialog
   * @default 'medium'
   */
  maxWidth?: 'small' | 'medium' | 'large' | 'full';
  /**
   * Additional className
   */
  className?: string;
  /**
   * Whether to disable the backdrop click to close the dialog
   * @default false
   */
  disableBackdropClick?: boolean;
  /**
   * Whether to disable the escape key to close the dialog
   * @default false
   */
  disableEscapeKeyDown?: boolean;
  /**
   * Whether to show a divider between the title and content
   * @default true
   */
  divider?: boolean;
}

/**
 * Dialog component - Migrated to M3Dialog
 * Uses Material Design 3 tokens instead of MUI theme
 * Supports controlled and uncontrolled open state
 */
export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(({
  title,
  content,
  contentText,
  actions,
  showCloseButton = true,
  showCancelButton = true,
  cancelButtonText = 'Cancel',
  showConfirmButton = true,
  confirmButtonText = 'Confirm',
  confirmButtonColor = 'primary',
  isConfirmLoading = false,
  open: openProp,
  onClose,
  onConfirm,
  maxWidth = 'medium',
  className = '',
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  divider = true,
  children,
}, ref) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown' | 'closeButton' | 'cancelButton') => {
    if (reason === 'backdropClick' && disableBackdropClick) {
      return;
    }

    if (reason === 'escapeKeyDown' && disableEscapeKeyDown) {
      return;
    }

    if (!isControlled) {
      setInternalOpen(false);
    }

    onClose?.(event, reason);
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    if (!isControlled) {
      setInternalOpen(false);
    }
  };

  const mapColorToVariant = (color: 'primary' | 'secondary' | 'error'): 'primary' | 'secondary' | 'error' => color;

  return (
    <M3Dialog
      ref={ref}
      open={open}
      onClose={() => handleClose({}, 'closeButton')}
      maxWidth={maxWidth}
      className={className}
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
    >
      {/* Dialog Header */}
      {title && (
        <div className="m3-dialog-header">
          <div className="m3-dialog-title">{title}</div>
          {showCloseButton && (
            <button
              type="button"
              className="m3-dialog-close"
              onClick={() => handleClose({}, 'closeButton')}
              aria-label="Close dialog"
            >
              <svg className="m3-dialog-close-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>
      )}

      {divider && title && <div className="m3-dialog-divider" />}

      {/* Dialog Content */}
      <div className="m3-dialog-content">
        {contentText ? (
          <p className="m3-dialog-text">{contentText}</p>
        ) : (
          content || children
        )}
      </div>

      {/* Dialog Actions */}
      {(showCancelButton || showConfirmButton || actions) && (
        <div className="m3-dialog-actions">
          {actions || (
            <>
              {showCancelButton && (
                <M3Button
                  variant="text"
                  onClick={() => handleClose({}, 'cancelButton')}
                  disabled={isConfirmLoading}
                >
                  {cancelButtonText}
                </M3Button>
              )}
              {showConfirmButton && (
                <M3Button
                  variant="filled"
                  color={mapColorToVariant(confirmButtonColor)}
                  onClick={handleConfirm}
                  disabled={isConfirmLoading}
                >
                  {confirmButtonText}
                </M3Button>
              )}
            </>
          )}
        </div>
      )}
    </M3Dialog>
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;
