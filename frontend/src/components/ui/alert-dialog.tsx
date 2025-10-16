import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  Button,
} from '@mui/material';

export interface AlertDialogProps extends DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AlertDialog = React.forwardRef<HTMLDivElement, AlertDialogProps>(
  ({ open, onOpenChange, children, onClose, ...props }, ref) => {
    const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
      if (onOpenChange) {
        onOpenChange(false);
      }
      if (onClose) {
        onClose(event, reason);
      }
    };

    return (
      <Dialog ref={ref} open={open} onClose={handleClose} {...props}>
        {children}
      </Dialog>
    );
  }
);

AlertDialog.displayName = 'AlertDialog';

export interface AlertDialogTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  ({ children, asChild, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, { ...props, ref } as any);
    }

    return (
      <Button ref={ref as any} {...props}>
        {children}
      </Button>
    );
  }
);

AlertDialogTrigger.displayName = 'AlertDialogTrigger';

export interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <DialogContent ref={ref} {...props}>
        {children}
      </DialogContent>
    );
  }
);

AlertDialogContent.displayName = 'AlertDialogContent';

export interface AlertDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AlertDialogHeader = React.forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ children, ...props }, ref) => {
    return (
      <DialogTitle ref={ref} {...props}>
        {children}
      </DialogTitle>
    );
  }
);

AlertDialogHeader.displayName = 'AlertDialogHeader';

export interface AlertDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  ({ children, ...props }, ref) => {
    return (
      <DialogTitle ref={ref as React.Ref<HTMLDivElement>} {...props}>
        {children}
      </DialogTitle>
    );
  }
);

AlertDialogTitle.displayName = 'AlertDialogTitle';

export interface AlertDialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDialogDescriptionProps
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} {...props}>
      {children}
    </div>
  );
});

AlertDialogDescription.displayName = 'AlertDialogDescription';

export interface AlertDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AlertDialogFooter = React.forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ children, ...props }, ref) => {
    return (
      <DialogActions ref={ref} {...props}>
        {children}
      </DialogActions>
    );
  }
);

AlertDialogFooter.displayName = 'AlertDialogFooter';

export interface AlertDialogActionProps extends React.ComponentProps<typeof Button> {}

export const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ children, ...props }, ref) => {
    return (
      <Button ref={ref} {...props}>
        {children}
      </Button>
    );
  }
);

AlertDialogAction.displayName = 'AlertDialogAction';

export interface AlertDialogCancelProps extends React.ComponentProps<typeof Button> {}

export const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ children, ...props }, ref) => {
    return (
      <Button ref={ref} variant="outlined" {...props}>
        {children}
      </Button>
    );
  }
);

AlertDialogCancel.displayName = 'AlertDialogCancel';
