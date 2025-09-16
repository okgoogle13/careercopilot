import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress, SxProps, Theme } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

const getVariantMapping = (variant: ButtonProps['variant']): MuiButtonProps['variant'] => {
  switch (variant) {
    case 'default':
      return 'contained';
    case 'outline':
      return 'outlined';
    case 'ghost':
    case 'link':
      return 'text';
    case 'secondary':
    case 'destructive':
    default:
      return 'contained';
  }
};

const getSizeMapping = (size: ButtonProps['size']): MuiButtonProps['size'] => {
  switch (size) {
    case 'sm':
      return 'small';
    case 'lg':
      return 'large';
    case 'icon':
    case 'default':
    default:
      return 'medium';
  }
};

const getCustomSx = (variant: ButtonProps['variant'], size: ButtonProps['size'], isLoading?: boolean): SxProps<Theme> => {
  const baseSx: SxProps<Theme> = {
    position: 'relative',
    overflow: 'hidden',
  };

  // Size-specific styles
  if (size === 'icon') {
    baseSx.minWidth = '40px';
    baseSx.width = '40px';
    baseSx.height = '40px';
    baseSx.padding = '8px';
  } else if (size === 'sm') {
    baseSx.padding = '6px 12px';
    baseSx.fontSize = '0.75rem';
  } else if (size === 'lg') {
    baseSx.padding = '16px 32px';
    baseSx.fontSize = '1rem';
  }

  // Variant-specific styles
  if (variant === 'destructive') {
    baseSx.backgroundColor = 'error.main';
    baseSx['&:hover'] = {
      backgroundColor: 'error.dark',
    };
  } else if (variant === 'secondary') {
    baseSx.backgroundColor = 'grey.100';
    baseSx.color = 'text.primary';
    baseSx['&:hover'] = {
      backgroundColor: 'grey.200',
    };
  } else if (variant === 'ghost') {
    baseSx.backgroundColor = 'transparent';
    baseSx['&:hover'] = {
      backgroundColor: 'action.hover',
    };
  } else if (variant === 'link') {
    baseSx.textDecoration = 'underline';
    baseSx.backgroundColor = 'transparent';
    baseSx['&:hover'] = {
      backgroundColor: 'transparent',
      textDecoration: 'underline',
    };
  }

  if (isLoading) {
    baseSx.cursor = 'wait';
  }

  return baseSx;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      isLoading = false,
      loadingText,
      disabled,
      children,
      sx,
      ...props
    },
    ref
  ) => {
    const muiVariant = getVariantMapping(variant);
    const muiSize = getSizeMapping(size);
    const isDisabled = disabled || isLoading;
    const customSx = getCustomSx(variant, size, isLoading);

    return (
      <MuiButton
        ref={ref}
        variant={muiVariant}
        size={muiSize}
        disabled={isDisabled}
        sx={{
          ...customSx,
          ...sx,
        }}
        {...props}
      >
        {isLoading && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'inherit',
            }}
          >
            <CircularProgress size={16} color="inherit" />
            {loadingText && <span style={{ marginLeft: 8 }}>{loadingText}</span>}
          </span>
        )}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            visibility: isLoading ? 'hidden' : 'visible',
          }}
        >
          {children}
        </span>
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };