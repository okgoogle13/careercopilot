import React from 'react';
import { Chip, ChipProps, SxProps, Theme } from '@mui/material';

interface BadgeProps extends Omit<ChipProps, 'variant'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  asChild?: boolean;
}

const getBadgeVariantSx = (variant: BadgeProps['variant'] = 'default'): SxProps<Theme> => {
  const baseSx: SxProps<Theme> = {
    borderRadius: 1.5,
    height: 'auto',
    minHeight: '24px',
    fontSize: '0.75rem',
    fontWeight: 500,
    border: 1,
    '& .MuiChip-label': {
      px: 1,
      py: 0.25,
    },
  };

  switch (variant) {
    case 'default':
      return {
        ...baseSx,
        borderColor: 'transparent',
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
      };
    case 'secondary':
      return {
        ...baseSx,
        borderColor: 'transparent',
        backgroundColor: 'grey.100',
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'grey.200',
        },
      };
    case 'destructive':
      return {
        ...baseSx,
        borderColor: 'transparent',
        backgroundColor: 'error.main',
        color: 'error.contrastText',
        '&:hover': {
          backgroundColor: 'error.dark',
        },
      };
    case 'outline':
      return {
        ...baseSx,
        borderColor: 'divider',
        backgroundColor: 'transparent',
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      };
    default:
      return baseSx;
  }
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'default', sx, ...props }, ref) => {
    const variantSx = getBadgeVariantSx(variant);

    return (
      <Chip
        ref={ref}
        size="small"
        sx={{
          ...variantSx,
          ...sx,
        }}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };