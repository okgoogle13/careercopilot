import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme, variant }) => ({
  borderRadius: theme.spacing(1),
  fontSize: '0.75rem',
  height: 'auto',
  padding: theme.spacing(0.5, 1),
  ...(variant === 'outlined' && {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.divider}`,
  }),
}));

export interface BadgeProps extends Omit<ChipProps, 'variant' | 'children'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'default', children, ...props }, ref) => {
    const getColor = (variant: string): ChipProps['color'] => {
      switch (variant) {
        case 'destructive':
          return 'error';
        case 'secondary':
          return 'secondary';
        default:
          return 'primary';
      }
    };

    const getVariant = (variant: string): ChipProps['variant'] => {
      return variant === 'outline' ? 'outlined' : 'filled';
    };

    return (
      <StyledChip
        ref={ref}
        variant={getVariant(variant)}
        color={getColor(variant)}
        label={children}
        size="small"
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';