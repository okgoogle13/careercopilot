import type { PopoverProps as MuiPopoverProps } from '@mui/material';
import { Popover as MuiPopover } from '@mui/material';
import React from 'react';

export interface PopoverProps extends Omit<MuiPopoverProps, 'open'> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ open = false, onOpenChange, onClose, children, ...props }, ref) => {
    const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
      if (onOpenChange) {
        onOpenChange(false);
      }
      if (onClose) {
        onClose(event, reason);
      }
    };

    return (
      <MuiPopover ref={ref} open={open} onClose={handleClose} {...props}>
        {children}
      </MuiPopover>
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

    return (
      <div ref={ref as React.Ref<HTMLDivElement>} {...props}>
        {children}
      </div>
    );
  }
);

PopoverTrigger.displayName = 'PopoverTrigger';

export type PopoverContentProps = React.HTMLAttributes<HTMLDivElement>;

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

PopoverContent.displayName = 'PopoverContent';
