/**
 * M3 Expressive Card Component
 * Implements Material Design 3 card with surface colors and elevation
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Surface colors: --md-sys-color-surface-*
 * - Elevation: --md-sys-elevation-level*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 */
import React from 'react';
import './M3Card.css';

export type M3CardVariant = 'filled' | 'elevated' | 'outlined';
export type M3CardState = 'default' | 'dragged' | 'focused';

export interface M3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The visual variant of the card
   * - filled: Surface container color with no elevation
   * - elevated: Surface container low with elevation level 1
   * - outlined: Surface with outline border
   * @default 'elevated'
   */
  variant?: M3CardVariant;

  /**
   * Card interaction state
   * @default 'default'
   */
  state?: M3CardState;

  /**
   * If true, card responds to hover/interaction
   * @default false
   */
  interactive?: boolean;

  /**
   * If true, card is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Content of the card
   */
  children: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Click handler for interactive cards
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * M3 Expressive Card component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Card variant="elevated" interactive>
 *   <M3CardHeader>
 *     <M3CardTitle>Card Title</M3CardTitle>
 *     <M3CardDescription>Card description</M3CardDescription>
 *   </M3CardHeader>
 *   <M3CardContent>
 *     Card content goes here
 *   </M3CardContent>
 *   <M3CardActions>
 *     <M3Button variant="text">Action</M3Button>
 *   </M3CardActions>
 * </M3Card>
 * ```
 */
export const M3Card = React.forwardRef<HTMLDivElement, M3CardProps>(
  (
    {
      variant = 'elevated',
      state = 'default',
      interactive = false,
      disabled = false,
      children,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-card',
      `m3-card--${variant}`,
      `m3-card--${state}`,
      interactive && 'm3-card--interactive',
      disabled && 'm3-card--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        onClick={!disabled ? onClick : undefined}
        data-testid="m3-card"
        role={interactive ? 'button' : undefined}
        tabIndex={interactive && !disabled ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

M3Card.displayName = 'M3Card';

/**
 * Card header section with title and optional description
 */
export interface M3CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const M3CardHeader = React.forwardRef<HTMLDivElement, M3CardHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`m3-card__header ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

M3CardHeader.displayName = 'M3CardHeader';

/**
 * Card title using M3 typography
 */
export interface M3CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export const M3CardTitle = React.forwardRef<HTMLHeadingElement, M3CardTitleProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <h3 ref={ref} className={`m3-card__title ${className}`} {...props}>
        {children}
      </h3>
    );
  }
);

M3CardTitle.displayName = 'M3CardTitle';

/**
 * Card description/subtitle
 */
export interface M3CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export const M3CardDescription = React.forwardRef<HTMLParagraphElement, M3CardDescriptionProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <p ref={ref} className={`m3-card__description ${className}`} {...props}>
        {children}
      </p>
    );
  }
);

M3CardDescription.displayName = 'M3CardDescription';

/**
 * Card content area
 */
export interface M3CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const M3CardContent = React.forwardRef<HTMLDivElement, M3CardContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`m3-card__content ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

M3CardContent.displayName = 'M3CardContent';

/**
 * Card actions/footer area
 */
export interface M3CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const M3CardActions = React.forwardRef<HTMLDivElement, M3CardActionsProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`m3-card__actions ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

M3CardActions.displayName = 'M3CardActions';

export default M3Card;
