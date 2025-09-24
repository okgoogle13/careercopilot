import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom styled button that maintains compatibility with existing code
const StyledButton = styled(MuiButton)<{ customvariant?: string }>(({ theme, customvariant }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 500,
  ...(customvariant === 'ghost' && {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    border: 'none',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
  ...(customvariant === 'outline' && {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
}));

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', children, ...props }, ref) => {
    // Map custom variants to MUI variants
    const getMuiVariant = (variant: string): MuiButtonProps['variant'] => {
      switch (variant) {
        case 'outline':
        case 'ghost':
          return 'outlined';
        case 'link':
          return 'text';
        case 'secondary':
          return 'outlined';
        case 'destructive':
          return 'contained';
        default:
          return 'contained';
      }
    };

    const muiVariant = getMuiVariant(variant);

    return (
      <StyledButton
        ref={ref}
        variant={muiVariant}
        customvariant={variant}
        {...props}
        color={variant === 'destructive' ? 'error' : 'primary'}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';