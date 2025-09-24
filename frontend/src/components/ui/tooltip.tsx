import React from 'react';
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from '@mui/material';

export interface TooltipProps extends MuiTooltipProps {}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiTooltip ref={ref} {...props}>
        {children}
      </MuiTooltip>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ children, asChild, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, { ref, ...props });
    }

    return (
      <div ref={ref as React.Ref<HTMLDivElement>} {...props}>
        {children}
      </div>
    );
  }
);

TooltipTrigger.displayName = 'TooltipTrigger';

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, side = 'top', ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

TooltipContent.displayName = 'TooltipContent';

export interface TooltipProviderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TooltipProvider = React.forwardRef<HTMLDivElement, TooltipProviderProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

TooltipProvider.displayName = 'TooltipProvider';
