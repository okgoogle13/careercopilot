import React from 'react';
import styles from './popover.module.css';

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  anchorEl?: HTMLElement | null;
  anchorOrigin?: {
    vertical: 'top' | 'bottom' | 'center';
    horizontal: 'left' | 'right' | 'center';
  };
  transformOrigin?: {
    vertical: 'top' | 'bottom' | 'center';
    horizontal: 'left' | 'right' | 'center';
  };
}

const PopoverContext = React.createContext<{ onClose: () => void } | null>(null);

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({
    open = false,
    onOpenChange,
    anchorEl,
    anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
    transformOrigin = { vertical: 'top', horizontal: 'left' },
    children,
    ...props
  }, ref) => {
    const handleClose = () => onOpenChange?.(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });

    React.useEffect(() => {
      if (!open || !anchorEl) return;

      const rect = anchorEl.getBoundingClientRect();
      const top = anchorOrigin.vertical === 'bottom' ? rect.bottom : rect.top;
      const left = anchorOrigin.horizontal === 'left' ? rect.left : rect.right;

      setPosition({ top, left });
    }, [open, anchorEl, anchorOrigin]);

    if (!open) return null;

    return (
      <div className={styles['popover-root']} onClick={handleClose}>
        <div
          ref={ref}
          className={styles['popover-paper']}
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          <PopoverContext.Provider value={{ onClose: handleClose }}>
            {children}
          </PopoverContext.Provider>
        </div>
      </div>
    );
  }
);

Popover.displayName = 'Popover';

export interface PopoverTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<HTMLElement, PopoverTriggerProps>(
  ({ children, asChild, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, { ...props, ref } as any);
    }
    return <div ref={ref as React.Ref<HTMLDivElement>} {...props}>{children}</div>;
  }
);

PopoverTrigger.displayName = 'PopoverTrigger';

export type PopoverContentProps = React.HTMLAttributes<HTMLDivElement>;

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, ...props }, ref) => {
    return <div ref={ref} {...props}>{children}</div>;
  }
);

PopoverContent.displayName = 'PopoverContent';
