/**
 * M3 Expressive ActionCard Component
 * Implements Material Design 3 card with action buttons
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Elevation: --md-sys-elevation-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 */
import React from 'react';
import './M3ActionCard.css';

export interface M3ActionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant
   * @default 'elevated'
   */
  variant?: 'elevated' | 'filled' | 'outlined';

  /**
   * Card title
   */
  title?: string;

  /**
   * Card subtitle
   */
  subtitle?: string;

  /**
   * Card description
   */
  description?: string;

  /**
   * Media content (image, video, etc.)
   */
  media?: React.ReactNode;

  /**
   * Action buttons
   */
  actions?: React.ReactNode;

  /**
   * If true, card is clickable
   * @default false
   */
  clickable?: boolean;

  /**
   * Click handler for clickable cards
   */
  onCardClick?: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * M3 Expressive ActionCard component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3ActionCard
 *   title="Card Title"
 *   description="Card description"
 *   actions={<button>Action</button>}
 * />
 * ```
 */
export const M3ActionCard = React.forwardRef<HTMLDivElement, M3ActionCardProps>(
  (
    {
      variant = 'elevated',
      title,
      subtitle,
      description,
      media,
      actions,
      clickable = false,
      onCardClick,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-action-card',
      `m3-action-card--${variant}`,
      clickable && 'm3-action-card--clickable',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleClick = () => {
      if (clickable && onCardClick) {
        onCardClick();
      }
    };

    const hasHeader = title || subtitle;

    return (
      <div
        ref={ref}
        className={classNames}
        onClick={handleClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick();
                }
              }
            : undefined
        }
        data-testid="m3-action-card"
        {...props}
      >
        {media && <div className="m3-action-card__media">{media}</div>}

        <div className="m3-action-card__content">
          {hasHeader && (
            <div className="m3-action-card__header">
              {title && <h3 className="m3-action-card__title">{title}</h3>}
              {subtitle && <p className="m3-action-card__subtitle">{subtitle}</p>}
            </div>
          )}

          {description && (
            <p className="m3-action-card__description">{description}</p>
          )}

          {children && <div className="m3-action-card__body">{children}</div>}
        </div>

        {actions && <div className="m3-action-card__actions">{actions}</div>}
      </div>
    );
  }
);

M3ActionCard.displayName = 'M3ActionCard';

export default M3ActionCard;
