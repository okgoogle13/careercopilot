import React from 'react';

/**
<<<<<<< HEAD
 * HaeckelIcon component
 * 
 * Provides a central way to render the 25 isolated Haeckel specimens
 * sliced from the Composite Grid.
 * 
 * Grid lookup: icon-haeckel-[row]-[col].png
 * Rows: 1-5
 * Cols: 1-5
=======
 * HaeckelIcon component (REFACTORED)
 * 
 * Legacy Haeckel specimens have been purged. This component now maps
 * legacy grid coordinates to modern Kr-Solidarity UI motifs.
 * 
 * Grid lookup (Legacy): icon-haeckel-[row]-[col].png
>>>>>>> restoration-KR-Rage-Figma-v2.0
 */

export interface HaeckelIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  row: 1 | 2 | 3 | 4 | 5;
  col: 1 | 2 | 3 | 4 | 5;
  size?: number | string;
<<<<<<< HEAD
  colorFilter?: string; // Optional CSS filter for tinting (e.g. sepia, invert)
}

=======
  colorFilter?: string; // Optional CSS filter for tinting
}

const UI_ICON_MAP: Record<string, string> = {
  '1-1': 'KR-UI-008',
  '1-2': 'KR-UI-010',
  '1-3': 'KR-UI-012',
  '2-1': 'KR-UI-013',
  '2-2': 'KR-UI-014',
  '2-3': 'KR-UI-015',
  '3-1': 'KR-UI-018',
  '3-2': 'KR-UI-019',
  '3-3': 'KR-UI-001',
};

>>>>>>> restoration-KR-Rage-Figma-v2.0
export const HaeckelIcon: React.FC<HaeckelIconProps> = ({
  row,
  col,
  size = 48,
  style,
  colorFilter,
  className,
  ...props
}) => {
<<<<<<< HEAD
  const assetPath = `/src/assets/icons/haeckel/icon-haeckel-${row}-${col}.png`;
=======
  const iconId = UI_ICON_MAP[`${row}-${col}`] || 'KR-UI-001';
  // Use standardized path format
  const assetPath = `/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__${iconId}__v1.svg`;
>>>>>>> restoration-KR-Rage-Figma-v2.0

  return (
    <img
      src={assetPath}
<<<<<<< HEAD
      alt={`Haeckel Specimen ${row}-${col}`}
=======
      alt={`Kr-Solidarity Icon ${iconId}`}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
