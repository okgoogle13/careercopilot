import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { forwardRef } from 'react';

export type ButtonVariant = 'contained' | 'outlined' | 'text' | 'glass';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  /**
   * The variant to use.
   * @default 'contained'
   */
  variant?: ButtonVariant;
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * The size of the button.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * The color of the component.
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  /**
   * If `true`, the button will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Element placed before the children.
   */
  startIcon?: React.ReactNode;
  /**
   * Element placed after the children.
   */
  endIcon?: React.ReactNode;
  /**
   * The URL to link to when the button is clicked.
   * If defined, an `a` element will be used as the root node.
   */
  href?: string;
  /**
   * Callback fired when the button is clicked.
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * The content of the button.
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes to apply to the button.
   */
  className?: string;
  /**
   * The type of button.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * If `true`, the button will show a loading state.
   * @default false
   */
  loading?: boolean;
}

/**
 * Buttons allow users to take actions, and make choices, with a single tap.
 *
 * ## Features
 * - Multiple variants: contained, outlined, text, and glass
 * - Different colors and sizes
 * - Loading state
 * - Full-width support
 * - Icons support
 * - Accessible by default
 *
 * ## API
 * - [Button API](https://mui.com/material-ui/api/button/)
 *
 * ## Usage
 *
 * ```tsx
 * import { Button } from '@careercopilot/ui';
 *
 * function MyComponent() {
 *   return (
 *     <div>
 *       <Button variant="contained" color="primary">
 *         Primary Button
 *       </Button>
 *       <Button variant="outlined" color="secondary">
 *         Secondary Button
 *       </Button>
 *     </div>
 *   );
 * }
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  children,
  className,
  type = 'button',
  ...rest
}, ref) => {
  // Handle loading state
  const buttonStartIcon = loading ? (
    <span className="animate-spin">
      <svg
        className="h-5 w-5 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
  ) : startIcon;

  const buttonEndIcon = loading ? null : endIcon;

  // Map custom variants to MUI variants
  const muiVariant = variant === 'glass' ? 'contained' : variant;

  return (
    <MuiButton
      ref={ref}
      variant={muiVariant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={buttonStartIcon}
      endIcon={buttonEndIcon}
      className={`${variant === 'glass' ? 'glass-button' : ''} ${className || ''}`}
      type={type}
      {...rest}
    >
      {children}
    </MuiButton>
  );
});

Button.displayName = 'Button';

export default Button;
