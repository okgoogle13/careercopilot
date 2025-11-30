import type { HTMLAttributes } from 'react';
import React from 'react';
import styles from './tooltip.module.css';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayMs?: number;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ title, side = 'top', delayMs = 200, children, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => setOpen(true), delayMs);
    };

    const handleMouseLeave = () => {
      clearTimeout(timeoutRef.current);
      setOpen(false);
    };

    React.useEffect(() => {
      return () => clearTimeout(timeoutRef.current);
    }, []);

    return (
      <div
        ref={ref}
        className={[styles['tooltip-root'], className].filter(Boolean).join(' ')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
        {open && (
          <div className={`${styles['tooltip-popper']} ${styles['tooltip-popper--open']}`} data-popper-placement={side}>
            <div className={styles['tooltip-tooltip']} role="tooltip">{title}</div>
            <div className={styles['tooltip-arrow']} data-popper-placement={side} />
          </div>
        )}
      </div>
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
    return <div ref={ref as React.Ref<HTMLDivElement>} {...props}>{children}</div>;
  }
);

TooltipTrigger.displayName = 'TooltipTrigger';

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>
);

TooltipContent.displayName = 'TooltipContent';

export type TooltipProviderProps = React.HTMLAttributes<HTMLDivElement>;

export const TooltipProvider = React.forwardRef<HTMLDivElement, TooltipProviderProps>(
  ({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>
);

TooltipProvider.displayName = 'TooltipProvider';
