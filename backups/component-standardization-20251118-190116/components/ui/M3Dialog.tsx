/**
 * M3 Expressive Dialog Component
 * Implements Material Design 3 dialog with animations and scrim
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React, { useEffect, useState } from 'react';
import './M3Dialog.css';

export interface M3DialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;

  /**
   * Callback when dialog should close
   */
  onClose?: () => void;

  /**
   * Content of the dialog
   */
  children: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * If true, clicking backdrop won't close dialog
   * @default false
   */
  disableBackdropClick?: boolean;

  /**
   * If true, pressing escape won't close dialog
   * @default false
   */
  disableEscapeKeyDown?: boolean;

  /**
   * Maximum width of the dialog
   * @default 'medium'
   */
  maxWidth?: 'small' | 'medium' | 'large' | 'full';

  /**
   * If true, dialog takes full width up to maxWidth
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * M3 Expressive Dialog component using design tokens.
 *
 * Example usage:
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <M3Dialog open={open} onClose={() => setOpen(false)}>
 *   <M3DialogHeader>
 *     <M3DialogTitle>Dialog Title</M3DialogTitle>
 *     <M3DialogClose onClose={() => setOpen(false)} />
 *   </M3DialogHeader>
 *   <M3DialogContent>
 *     <M3DialogDescription>
 *       Dialog content goes here
 *     </M3DialogDescription>
 *   </M3DialogContent>
 *   <M3DialogActions>
 *     <M3Button variant="text" onClick={() => setOpen(false)}>
 *       Cancel
 *     </M3Button>
 *     <M3Button variant="filled" onClick={() => setOpen(false)}>
 *       Confirm
 *     </M3Button>
 *   </M3DialogActions>
 * </M3Dialog>
 * ```
 */
export const M3Dialog = React.forwardRef<HTMLDivElement, M3DialogProps>(
  (
    {
      open,
      onClose,
      children,
      className = '',
      disableBackdropClick = false,
      disableEscapeKeyDown = false,
      maxWidth = 'medium',
      fullWidth = false,
    },
    ref
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (open) {
        setIsAnimating(true);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
      } else {
        // Allow body scroll
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [open]);

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !disableEscapeKeyDown && onClose) {
          onClose();
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [open, onClose, disableEscapeKeyDown]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && !disableBackdropClick && onClose) {
        onClose();
      }
    };

    if (!open && !isAnimating) return null;

    const dialogClassNames = [
      'm3-dialog__paper',
      `m3-dialog__paper--${maxWidth}`,
      fullWidth && 'm3-dialog__paper--full-width',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        className={`m3-dialog ${open ? 'm3-dialog--open' : 'm3-dialog--closing'}`}
        role="presentation"
        onAnimationEnd={() => {
          if (!open) setIsAnimating(false);
        }}
      >
        <div className="m3-dialog__backdrop" onClick={handleBackdropClick} />
        <div className="m3-dialog__container" onClick={handleBackdropClick}>
          <div ref={ref} className={dialogClassNames} role="dialog" aria-modal="true">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

M3Dialog.displayName = 'M3Dialog';

/**
 * Dialog header section
 */
export interface M3DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const M3DialogHeader = React.forwardRef<HTMLDivElement, M3DialogHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`m3-dialog__header ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

M3DialogHeader.displayName = 'M3DialogHeader';

/**
 * Dialog title
 */
export interface M3DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export const M3DialogTitle = React.forwardRef<HTMLHeadingElement, M3DialogTitleProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <h2 ref={ref} className={`m3-dialog__title ${className}`} {...props}>
        {children}
      </h2>
    );
  }
);

M3DialogTitle.displayName = 'M3DialogTitle';

/**
 * Dialog description
 */
export interface M3DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export const M3DialogDescription = React.forwardRef<HTMLParagraphElement, M3DialogDescriptionProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <p ref={ref} className={`m3-dialog__description ${className}`} {...props}>
        {children}
      </p>
    );
  }
);

M3DialogDescription.displayName = 'M3DialogDescription';

/**
 * Dialog content area
 */
export interface M3DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const M3DialogContent = React.forwardRef<HTMLDivElement, M3DialogContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`m3-dialog__content ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

M3DialogContent.displayName = 'M3DialogContent';

/**
 * Dialog actions/footer
 */
export interface M3DialogActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const M3DialogActions = React.forwardRef<HTMLDivElement, M3DialogActionsProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`m3-dialog__actions ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

M3DialogActions.displayName = 'M3DialogActions';

/**
 * Dialog close button
 */
export interface M3DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose?: () => void;
  className?: string;
}

export const M3DialogClose = React.forwardRef<HTMLButtonElement, M3DialogCloseProps>(
  ({ onClose, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`m3-dialog__close ${className}`}
        onClick={onClose}
        aria-label="Close dialog"
        {...props}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
      </button>
    );
  }
);

M3DialogClose.displayName = 'M3DialogClose';

export default M3Dialog;
