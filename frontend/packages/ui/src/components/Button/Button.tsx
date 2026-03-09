import { forwardRef } from 'react';

export type ButtonVariant = 'contained' | 'outlined' | 'text' | 'glass';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
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
    },
    ref
  ) => {
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
    ) : (
      startIcon
    );

    const buttonEndIcon = loading ? null : endIcon;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center font-body gap-2 transition-all duration-300 ${
          fullWidth ? 'w-full' : ''
        } ${className || ''}`}
        style={{ borderRadius: 'var(--shape-blockRiot03)' }}
        type={type}
        {...rest}
      >
        {buttonStartIcon}
        {children}
        {buttonEndIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
