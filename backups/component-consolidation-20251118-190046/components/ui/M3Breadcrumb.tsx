/**
 * M3 Expressive Breadcrumb Component
 * Implements Material Design 3 breadcrumb navigation with separators
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React from 'react';
import './M3Breadcrumb.css';

export interface BreadcrumbItem {
  /**
   * Display label
   */
  label: string;

  /**
   * URL to navigate to (if undefined, renders as plain text)
   */
  href?: string;

  /**
   * Optional icon
   */
  icon?: React.ReactNode;
}

export interface M3BreadcrumbProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Breadcrumb items
   */
  items: BreadcrumbItem[];

  /**
   * Custom separator (defaults to chevron)
   */
  separator?: React.ReactNode;

  /**
   * Max items to show before collapsing
   * @default undefined (show all)
   */
  maxItems?: number;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * Default chevron separator
 */
const DefaultSeparator = () => (
  <svg
    className="m3-breadcrumb__separator"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 12l4-4-4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * M3 Expressive Breadcrumb component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Jobs', href: '/jobs' },
 *     { label: 'Software Engineer' }
 *   ]}
 * />
 * ```
 */
export const M3Breadcrumb = React.forwardRef<HTMLElement, M3BreadcrumbProps>(
  (
    {
      items,
      separator = <DefaultSeparator />,
      maxItems,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = ['m3-breadcrumb', className].filter(Boolean).join(' ');

    // Handle max items with collapse
    let displayItems = items;
    let showCollapse = false;

    if (maxItems && items.length > maxItems) {
      showCollapse = true;
      // Show first item, ellipsis, and last (maxItems - 1) items
      const firstItem = items[0];
      const lastItems = items.slice(-(maxItems - 1));
      displayItems = [firstItem, ...lastItems];
    }

    return (
      <nav
        ref={ref}
        className={classNames}
        aria-label="Breadcrumb"
        data-testid="m3-breadcrumb"
        {...props}
      >
        <ol className="m3-breadcrumb__list">
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            const isFirst = index === 0;

            return (
              <React.Fragment key={`${item.label}-${index}`}>
                {/* Show ellipsis after first item if collapsed */}
                {showCollapse && isFirst && (
                  <>
                    <li className="m3-breadcrumb__item">
                      {item.href ? (
                        <a href={item.href} className="m3-breadcrumb__link">
                          {item.icon && (
                            <span className="m3-breadcrumb__icon">{item.icon}</span>
                          )}
                          <span className="m3-breadcrumb__label">{item.label}</span>
                        </a>
                      ) : (
                        <span className="m3-breadcrumb__text">
                          {item.icon && (
                            <span className="m3-breadcrumb__icon">{item.icon}</span>
                          )}
                          <span className="m3-breadcrumb__label">{item.label}</span>
                        </span>
                      )}
                    </li>
                    <li className="m3-breadcrumb__separator" aria-hidden="true">
                      {separator}
                    </li>
                    <li className="m3-breadcrumb__item m3-breadcrumb__ellipsis">
                      <span className="m3-breadcrumb__text">...</span>
                    </li>
                    {index < displayItems.length - 1 && (
                      <li className="m3-breadcrumb__separator" aria-hidden="true">
                        {separator}
                      </li>
                    )}
                  </>
                )}

                {/* Regular item (skip first if collapsed) */}
                {!(showCollapse && isFirst) && (
                  <>
                    <li
                      className={`m3-breadcrumb__item ${
                        isLast ? 'm3-breadcrumb__item--current' : ''
                      }`}
                    >
                      {item.href && !isLast ? (
                        <a href={item.href} className="m3-breadcrumb__link">
                          {item.icon && (
                            <span className="m3-breadcrumb__icon">{item.icon}</span>
                          )}
                          <span className="m3-breadcrumb__label">{item.label}</span>
                        </a>
                      ) : (
                        <span
                          className="m3-breadcrumb__text"
                          aria-current={isLast ? 'page' : undefined}
                        >
                          {item.icon && (
                            <span className="m3-breadcrumb__icon">{item.icon}</span>
                          )}
                          <span className="m3-breadcrumb__label">{item.label}</span>
                        </span>
                      )}
                    </li>

                    {/* Separator after item (except last) */}
                    {!isLast && (
                      <li className="m3-breadcrumb__separator" aria-hidden="true">
                        {separator}
                      </li>
                    )}
                  </>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);

M3Breadcrumb.displayName = 'M3Breadcrumb';

export default M3Breadcrumb;
