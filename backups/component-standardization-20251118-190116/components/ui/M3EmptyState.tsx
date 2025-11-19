/**
 * M3 Expressive EmptyState Component
 * Implements Material Design 3 empty state placeholders
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 */
import React from 'react';
import './M3EmptyState.css';

export interface M3EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon or illustration to display
   */
  icon?: React.ReactNode;

  /**
   * Title text
   */
  title: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Primary action button
   */
  primaryAction?: React.ReactNode;

  /**
   * Secondary action button
   */
  secondaryAction?: React.ReactNode;

  /**
   * Size variant
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive EmptyState component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3EmptyState
 *   icon={<SearchIcon />}
 *   title="No results found"
 *   description="Try adjusting your search criteria"
 *   primaryAction={<button>Clear Search</button>}
 * />
 * ```
 */
export const M3EmptyState = React.forwardRef<HTMLDivElement, M3EmptyStateProps>(
  (
    {
      icon,
      title,
      description,
      primaryAction,
      secondaryAction,
      size = 'medium',
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-empty-state',
      `m3-empty-state--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        data-testid="m3-empty-state"
        {...props}
      >
        {icon && <div className="m3-empty-state__icon">{icon}</div>}

        <div className="m3-empty-state__content">
          <h3 className="m3-empty-state__title">{title}</h3>
          {description && (
            <p className="m3-empty-state__description">{description}</p>
          )}
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="m3-empty-state__actions">
            {primaryAction && (
              <div className="m3-empty-state__action m3-empty-state__action--primary">
                {primaryAction}
              </div>
            )}
            {secondaryAction && (
              <div className="m3-empty-state__action m3-empty-state__action--secondary">
                {secondaryAction}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

M3EmptyState.displayName = 'M3EmptyState';

export default M3EmptyState;
