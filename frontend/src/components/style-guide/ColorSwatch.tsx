import React from 'react';
import { cn } from '@/lib/utils';

interface ColorSwatchProps {
  name: string;
  color: string;
  textColor?: string;
  className?: string;
  showContrast?: boolean;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  name,
  color,
  textColor = 'text-foreground',
  className,
  showContrast = true,
}) => {
  const getContrast = (hexColor: string): number => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = parseInt(hexColor.slice(5, 7), 16) / 255;

    // Calculate relative luminance
    const [r1, g1, b1] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    const l = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
    return l > 0.5 ? 0 : 1; // 0 for dark text, 1 for light text
  };

  const contrast = color.startsWith('var(') ? 0 : getContrast(color);
  const contrastText = contrast > 0.5 ? 'text-black' : 'text-white';

  return (
    <div className={cn('rounded-lg overflow-hidden shadow-sm', className)}>
      <div
        className="h-24 flex items-center justify-center"
        style={
          color.startsWith('var(')
            ? { backgroundColor: `var(${color})` }
            : { backgroundColor: color }
        }
      >
        <span
          className={cn(
            'px-2 py-1 rounded-md text-sm font-medium',
            textColor === 'auto' ? contrastText : textColor,
            'bg-black/10 backdrop-blur-sm'
          )}
        >
          {name}
        </span>
      </div>
      <div className="p-3 bg-background">
        <div className="flex justify-between items-center">
          <code className="text-xs font-mono">{color}</code>
          {showContrast && contrast > 0 && (
            <span
              className={cn(
                'text-xs px-2 py-1 rounded',
                contrast > 4.5
                  ? 'bg-success/20 text-success-foreground'
                  : 'bg-warning/20 text-warning-foreground'
              )}
            >
              {contrast.toFixed(2)}:1
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
