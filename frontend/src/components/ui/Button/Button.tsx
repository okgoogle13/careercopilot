import type {
  ButtonProps as MuiButtonProps} from '@mui/material';
import {
  Button as MuiButton,
  CircularProgress,
} from '@mui/material';
import React from 'react';

export interface ButtonProps extends Omit<MuiButtonProps, 'color' | 'size'> {
  /**
   * The variant to use
   * @default 'contained'
   */
  variant?: 'contained' | 'outlined' | 'text';
  /**
   * The color of the component
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /**
   * The size of the component
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If `true`, the button will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  /**
   * If `true`, the button will be disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the button will show a loading indicator
   * @default false
   */
  loading?: boolean;
  /**
   * The type of the button
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * The URL to link to when the button is clicked
   */
  href?: string;
  /**
   * The content of the button
   */
  children: React.ReactNode;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Callback fired when the button is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A customizable button component that extends Material-UI's Button with additional features.
 * It supports different variants, colors, sizes, and loading states.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'contained',
      color = 'primary',
      size = 'medium',
      fullWidth = false,
      disabled = false,
      loading = false,
      type = 'button',
      href,
      children,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const buttonProps = {
      variant,
      color: color as 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
      size,
      fullWidth,
      disabled: disabled || loading,
      type,
      href,
      className: `career-button ${className}`,
      onClick,
      ...props,
    };

    return (
      <MuiButton
        ref={ref}
        {...buttonProps}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : props.startIcon}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
