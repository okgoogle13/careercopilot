import * as React from 'react';
import { cn } from '../../lib/utils';

export type StoneMode = 'gallery' | 'laboratory';
export type StoneElevation = 'flat' | 'raised' | 'floating';

export interface StoneProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: StoneMode;
  elevation?: StoneElevation;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const modeClasses: Record<StoneMode, string> = {
  gallery: 'bg-surface-gallery-parchment text-on-surface-gallery-parchment',
  laboratory: 'bg-surface-laboratory-parchment text-on-surface-laboratory-parchment',
};

const elevationClasses: Record<StoneElevation, string> = {
  flat: 'shadow-none',
  raised: 'shadow-sm',
  floating: 'shadow-md',
};

export const Stone: React.FC<StoneProps> = ({
  mode = 'gallery',
  elevation = 'flat',
  header,
  footer,
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'rounded-[var(--radius-stone)] border border-outline-variant p-4',
      modeClasses[mode],
      elevationClasses[elevation],
      className
    )}
    {...props}
  >
    {header ? <div className="mb-3">{header}</div> : null}
    <div>{children}</div>
    {footer ? <div className="mt-3">{footer}</div> : null}
  </div>
);
