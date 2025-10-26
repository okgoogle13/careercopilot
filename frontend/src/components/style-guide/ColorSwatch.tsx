import { Box, Typography, Paper } from '@mui/material';
import React from 'react';

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
    <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 1 }} className={className}>
      <Box
        sx={{
          height: 96,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color.startsWith('var(') ? `var(${color})` : color,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 500,
            color: textColor === 'auto' ? (contrast > 0.5 ? 'black' : 'white') : 'inherit',
            backgroundColor: 'rgba(0,0,0,0.1)',
            backdropFilter: 'blur(2px)',
          }}
        >
          {name}
        </Typography>
      </Box>
      <Box sx={{ p: 1.5, backgroundColor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" component="code" sx={{ fontFamily: 'monospace' }}>
            {color}
          </Typography>
          {showContrast && contrast > 0 && (
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 0.5,
                backgroundColor: contrast > 4.5 ? 'success.light' : 'warning.light',
                color: contrast > 4.5 ? 'success.contrastText' : 'warning.contrastText',
              }}
            >
              {contrast.toFixed(2)}:1
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
