import React from 'react';
import styles from './dialog.module.css';
import { X } from 'lucide-react';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogContext = React.createContext<{ onClose: () => void } | null>(null);

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onOpenChange, children, ...props }, ref) => {
    const handleClose = () => onOpenChange?.(false);

    if (!open) return null;

    return (
      <div className={styles['dialog-overlay']} onClick={() => handleClose()}>
        <div className={styles['dialog-paper']} onClick={(e) => e.stopPropagation()} ref={ref} {...props}>
          <DialogContext.Provider value={{ onClose: handleClose }}>
            {children}
          </DialogContext.Provider>
        </div>
      </div>
    );
  }
);

Dialog.displayName = 'Dialog';

export const DialogContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={styles['dialog-content']} {...props}>{children}</div>
);

export const DialogHeader = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={styles['dialog-header']} {...props}>{children}</div>
);

export const DialogTitle = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={styles['dialog-title']} {...props}>{children}</h2>
);

export const DialogFooter = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={styles['dialog-footer']} {...props}>{children}</div>
);

export const DialogClose = ({ ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const ctx = React.useContext(DialogContext);
  return <button className={styles['dialog-close']} onClick={ctx?.onClose} {...props}><X size={20} /></button>;
};
