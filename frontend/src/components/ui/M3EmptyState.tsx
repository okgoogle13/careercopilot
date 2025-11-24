/**
 * M3 Expressive EmptyState Component
 * Implements Material Design 3 feedback component with M3 styling
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React from 'react';
import './M3EmptyState.css';



export interface M3EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional illustration or icon to display
   */
  illustration?: React.ReactNode;

  /**
   * Title text (required)
   */
  title: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Optional action button or element
   */
  action?: React.ReactNode;

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
 *   title="No items found"
 *   description="Try adjusting your filters"
 *   action={<button>Clear Filters</button>}
 * />
 * ```
 */
export const M3EmptyState = React.forwardRef<HTMLDivElement, M3EmptyStateProps>(
  (
    {
      illustration,
      title,
      description,
      action,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-empty-state',
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
        {illustration && (
          <div className="m3-empty-state__illustration">
            {illustration}
          </div>
        )}
        <h3 className="m3-empty-state__title">{title}</h3>
        {description && (
          <p className="m3-empty-state__description">{description}</p>
        )}
        {action && (
          <div className="m3-empty-state__action">{action}</div>
        )}
      </div>
    );
  }
);

M3EmptyState.displayName = 'M3EmptyState';

export default M3EmptyState;
