/**
 * @file A custom, versatile Button component for the application.
 *
 * This component wraps the Material-UI (MUI) Button component to provide a set of
 * predefined visual variants consistent with the application's design system (e.g., 'ghost', 'outline').
 * It abstracts away the MUI implementation details and provides a simpler API
 * while remaining highly customizable and extensible.
 */
import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * A private styled version of the MUI Button.
 * It applies base styles and custom styles for 'ghost' and 'outline' variants.
 * @internal
 */
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

/**
 * Props for the custom Button component.
 * It extends the standard MUI Button props but omits the original `variant` prop
 * to replace it with a custom set of variants.
 */
export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  /**
   * The visual style of the button.
   * - `default`: The standard filled button.
   * - `destructive`: A button for actions that delete data, typically red.
   * - `outline`: A button with a border and transparent background.
   * - `secondary`: A secondary action button.
   * - `ghost`: A button with no border or background, used for subtle actions.
   * - `link`: A button that looks like a hyperlink.
   * @default 'default'
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/**
 * A custom Button component that provides several predefined styles.
 *
 * This component is a wrapper around Material-UI's Button, providing a consistent
 * look and feel across the application. It maps its own `variant` prop to the
 * appropriate MUI `variant` and applies custom styling.
 *
 * @param {ButtonProps} props - The props for the component.
 * @param {React.Ref<HTMLButtonElement>} ref - The ref to forward to the underlying button element.
 * @returns {JSX.Element} The rendered Button component.
 *
 * @example
 * <Button variant="destructive" onClick={() => alert('Deleted!')}>
 *   Delete
 * </Button>
 *
 * @example
 * <Button variant="ghost" startIcon={<SettingsIcon />}>
 *   Settings
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', children, ...props }, ref) => {
    /**
     * Maps the custom variant prop to a valid MUI Button variant.
     * @param {string} v - The custom variant name.
     * @returns {MuiButtonProps['variant']} The corresponding MUI variant.
     */
    const getMuiVariant = (v: string): MuiButtonProps['variant'] => {
      switch (v) {
        case 'outline':
        case 'ghost':
        case 'secondary':
          return 'outlined'; // Using 'outlined' as a base for custom styling
        case 'link':
          return 'text';
        case 'destructive':
        case 'default':
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
        color={variant === 'destructive' ? 'error' : 'primary'}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
