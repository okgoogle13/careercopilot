import React from 'react';
import styles from './M3Dialog.module.css';
import { X } from 'lucide-react';

export interface M3DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const M3DialogContext = React.createContext({ onClose: () => {} });

export const M3Dialog = React.forwardRef((props, ref) => {
  const { open, onOpenChange, children } = props;
  const handleClose = () => onOpenChange?.(false);

  if (!open) return null;

  return React.createElement(
    'div',
    { className: styles['dialog-overlay'], onClick: () => handleClose() },
    React.createElement(
      M3DialogContext.Provider,
      { value: { onClose: handleClose } },
      React.createElement(
        'div',
        {
          className: styles['dialog-paper'],
          onClick: (e) => e.stopPropagation(),
          ref: ref,
        },
        children
      )
    )
  );
});

M3Dialog.displayName = 'M3Dialog';

export const M3DialogContent = React.forwardRef((props, ref) => {
  return React.createElement('div', { ...props, ref: ref, className: styles['dialog-content'] });
});

M3DialogContent.displayName = 'M3DialogContent';

export const M3DialogHeader = React.forwardRef((props, ref) => {
  return React.createElement('div', { ...props, ref: ref, className: styles['dialog-header'] });
});

M3DialogHeader.displayName = 'M3DialogHeader';

export const M3DialogTitle = React.forwardRef((props, ref) => {
  return React.createElement('h2', { ...props, ref: ref, className: styles['dialog-title'] });
});

M3DialogTitle.displayName = 'M3DialogTitle';

export const M3DialogFooter = React.forwardRef((props, ref) => {
  return React.createElement('div', { ...props, ref: ref, className: styles['dialog-footer'] });
});

M3DialogFooter.displayName = 'M3DialogFooter';

export const M3DialogClose = React.forwardRef((props, ref) => {
  const ctx = React.useContext(M3DialogContext);
  return React.createElement(
    'button',
    {
      ...props,
      ref: ref,
      className: styles['dialog-close'],
      onClick: ctx.onClose,
      type: 'button',
    },
    React.createElement(X, { size: 20 })
  );
});

M3DialogClose.displayName = 'M3DialogClose';
