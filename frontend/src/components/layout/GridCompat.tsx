/**
 * ELECTRIC ALCHEMIST: GRID COMPATIBILITY COMPONENT
 *
 * Compatibility wrapper for ElectricGrid to replace MUI Grid.
 * Migrated to use ElectricGrid from Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { ElectricGrid, ElectricGridProps } from '@/components/electric';
import { cn } from '@/lib/utils';

export interface GridCompatProps extends Omit<ElectricGridProps, 'cols'> {
  size?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  item?: boolean;
  container?: boolean;
}

const GridCompat = React.forwardRef<HTMLDivElement, GridCompatProps>(
  ({ size, xs, sm, md, lg, xl, item, container, className, children, ...props }, ref) => {
    // Determine grid columns based on breakpoint props
    let cols: ElectricGridProps['cols'] = 1;

    if (container) {
      // Container grid - use default 3 columns
      cols = 3;
    } else if (item) {
      // Item grid - calculate columns from size props
      const sizeMap = size || { xs, sm, md, lg, xl };
      const maxSize = Math.max(
        sizeMap.xl || 0,
        sizeMap.lg || 0,
        sizeMap.md || 0,
        sizeMap.sm || 0,
        sizeMap.xs || 0
      );

      // Map MUI 12-column system to ElectricGrid cols
      if (maxSize >= 12) cols = 1;
      else if (maxSize >= 6) cols = 2;
      else if (maxSize >= 4) cols = 3;
      else if (maxSize >= 3) cols = 4;
      else cols = 1;
    }

    return (
      <ElectricGrid
        ref={ref}
        cols={cols}
        gap="md"
        className={cn(className)}
        {...props}
      >
        {children}
      </ElectricGrid>
    );
  }
);

GridCompat.displayName = 'GridCompat';

export { GridCompat };
export default GridCompat;

