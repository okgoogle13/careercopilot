import React from 'react';
import styles from './alert-dialog.module.css';
import { X } from 'lucide-react';

export interface AlertDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AlertDialogContext = React.createContext({ onClose: () => {} });

export const AlertDialog = React.forwardRef((props, ref) => {
  const { open, onOpenChange, children } = props;
  const handleClose = () => onOpenChange?.(false);

  if (!open) return null;

  return React.createElement(
    'div',
    {
      className: styles['alert-dialog-overlay'],
      onClick: () => handleClose(),
    },
    React.createElement(
      AlertDialogContext.Provider,
      { value: { onClose: handleClose } },
      React.createElement(
        'div',
        {
          className: styles['alert-dialog-paper'],
          onClick: (e) => e.stopPropagation(),
          ref: ref,
        },
        children
      )
    )
  );
});

AlertDialog.displayName = 'AlertDialog';

export const AlertDialogTrigger = React.forwardRef((props, ref) => {
  const { children, asChild } = props;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ref } as any);
  }
  return React.createElement('button', { ref: ref, ...props }, children);
});

AlertDialogTrigger.displayName = 'AlertDialogTrigger';

export const AlertDialogContent = React.forwardRef((props, ref) => {
  return React.createElement(
    'div',
    { ...props, ref: ref, className: styles['alert-dialog-content'] }
  );
});

AlertDialogContent.displayName = 'AlertDialogContent';

export const AlertDialogHeader = React.forwardRef((props, ref) => {
  return React.createElement(
    'div',
    { ...props, ref: ref, className: styles['alert-dialog-header'] }
  );
});

AlertDialogHeader.displayName = 'AlertDialogHeader';

export const AlertDialogTitle = React.forwardRef((props, ref) => {
  return React.createElement(
    'h2',
    { ...props, ref: ref, className: styles['alert-dialog-title'] }
  );
});

AlertDialogTitle.displayName = 'AlertDialogTitle';

export const AlertDialogDescription = React.forwardRef((props, ref) => {
  return React.createElement(
    'p',
    { ...props, ref: ref, className: styles['alert-dialog-description'] }
  );
});

AlertDialogDescription.displayName = 'AlertDialogDescription';

export const AlertDialogFooter = React.forwardRef((props, ref) => {
  return React.createElement(
    'div',
    { ...props, ref: ref, className: styles['alert-dialog-footer'] }
  );
});

AlertDialogFooter.displayName = 'AlertDialogFooter';

export const AlertDialogAction = React.forwardRef((props, ref) => {
  return React.createElement(
    'button',
    { ...props, ref: ref, className: styles['alert-dialog-action'] }
  );
});

AlertDialogAction.displayName = 'AlertDialogAction';

export const AlertDialogCancel = React.forwardRef((props, ref) => {
  return React.createElement(
    'button',
    { ...props, ref: ref, className: styles['alert-dialog-cancel'] }
  );
});

AlertDialogCancel.displayName = 'AlertDialogCancel';
