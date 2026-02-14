import React from 'react';

/**
 * HaeckelIcon component
 * 
 * Provides a central way to render the 25 isolated Haeckel specimens
 * sliced from the Composite Grid.
 * 
 * Grid lookup: icon-haeckel-[row]-[col].png
 * Rows: 1-5
 * Cols: 1-5
 */

export interface HaeckelIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  row: 1 | 2 | 3 | 4 | 5;
  col: 1 | 2 | 3 | 4 | 5;
  size?: number | string;
  colorFilter?: string; // Optional CSS filter for tinting (e.g. sepia, invert)
}

export const HaeckelIcon: React.FC<HaeckelIconProps> = ({
  row,
  col,
  size = 48,
  style,
  colorFilter,
  className,
  ...props
}) => {
  const assetPath = `/src/assets/icons/haeckel/icon-haeckel-${row}-${col}.png`;

  return (
    <img
      src={assetPath}
      alt={`Haeckel Specimen ${row}-${col}`}
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        objectFit: 'contain',
        filter: colorFilter,
        ...style,
      }}
      {...props}
    />
  );
};
