import { Grid as MuiGrid, GridProps as MuiGridProps } from '@mui/material';
import React from 'react';

export type SizeMap = Partial<{
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}>;

export interface GridCompatProps extends MuiGridProps {
  size?: SizeMap;
  xs?: unknown;
  sm?: unknown;
  md?: unknown;
  lg?: unknown;
  xl?: unknown;
  // allow arbitrary responsive props (other migration-time props)
  [key: string]: unknown;
}

const GridCompat = React.forwardRef<HTMLDivElement, GridCompatProps>(
  ({ size, children, ...props }, ref) => {
    const sizeProps: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>> = {};
    const s = size as SizeMap | undefined;
    if (s) {
      if (s.xs !== undefined) sizeProps.xs = s.xs;
      if (s.sm !== undefined) sizeProps.sm = s.sm;
      if (s.md !== undefined) sizeProps.md = s.md;
      if (s.lg !== undefined) sizeProps.lg = s.lg;
      if (s.xl !== undefined) sizeProps.xl = s.xl;
    }

    // If responsive props already provided directly (xs, sm, md...), allow them via props (they will override size)
    const combinedProps: MuiGridProps = {
      ...sizeProps,
      ...props,
    } as MuiGridProps;

    return (
      // forward ref to underlying MUI Grid
      <MuiGrid
        ref={ref as React.Ref<HTMLDivElement>}
        {...(combinedProps as unknown as MuiGridProps)}
      >
        {children as React.ReactNode}
      </MuiGrid>
    );
  }
);

GridCompat.displayName = 'GridCompat';

export default GridCompat;
