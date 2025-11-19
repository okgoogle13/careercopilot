import type { TooltipProps as MuiTooltipProps } from '@mui/material';
import { Tooltip as MuiTooltip } from '@mui/material';
import React from 'react';

export type TooltipProps = MuiTooltipProps;

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
      return React.cloneElement(children, { ...props, ref } as any);
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

export type TooltipProviderProps = React.HTMLAttributes<HTMLDivElement>;

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
