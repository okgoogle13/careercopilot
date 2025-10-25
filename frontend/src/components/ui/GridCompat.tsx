import { Grid as MuiGrid, GridProps as MuiGridProps, gridClasses } from '@mui/material';
import React from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeMap = Partial<Record<Breakpoint, number>>;

export interface GridCompatProps extends Omit<MuiGridProps, 'item' | 'container' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'> {
  size?: SizeMap;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  item?: boolean;
  container?: boolean;
  [key: string]: unknown;
}

const GridCompat = React.forwardRef<HTMLDivElement, GridCompatProps>(
  ({ size, children, className = '', item, container, ...props }, ref) => {
    // Handle the new MUI Grid v2 sizing system
    const sizeProps: Record<string, number> = {};
    const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    
    // Process size prop if provided
    if (size) {
      Object.entries(size).forEach(([key, value]) => {
        if (breakpoints.includes(key as Breakpoint) && typeof value === 'number') {
          sizeProps[`${key}${value}`] = value;
        }
      });
    }
    
    // Process individual breakpoint props
    breakpoints.forEach(bp => {
      const value = props[bp];
      if (typeof value === 'number') {
        sizeProps[`${bp}${value}`] = value;
        // Remove the prop to avoid duplicate props
        delete props[bp];
      }
    });

    // Generate responsive class names
    const responsiveClasses = Object.entries(sizeProps)
      .map(([key, value]) => {
        if (key.startsWith('xs')) return `MuiGrid-${key}`;
        return `${gridClasses[`grid-${key}` as keyof typeof gridClasses]}`;
      })
      .join(' ');

    // Handle item/container props
    const gridProps: MuiGridProps = {
      ...props,
      ...(item && { item: true }),
      ...(container && { container: true }),
      className: `${className} ${responsiveClasses}`.trim(),
    };

    return (
      <MuiGrid ref={ref} {...gridProps}>
        {children}
      </MuiGrid>
    );
  }
);

// Set display name for better debugging
GridCompat.displayName = 'GridCompat';

export default GridCompat;
