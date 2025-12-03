/**
 * M3 Expressive Breadcrumb Component
 * Implements Material Design 3 Breadcrumb for CareerCopilot
 *
 * Navigation breadcrumb showing the current page hierarchy.
 * Uses CSS variables from m3-design-tokens.css.
 */
import React from 'react';
import './M3Breadcrumb.css';

export interface M3BreadcrumbItem {
  /**
   * Item label
   */
  label: string;

  /**
   * Item href or path
   */
  href?: string;

  /**
   * Click handler (if href is not provided)
   */
  onClick?: () => void;

  /**
   * If true, item is the current page (last item)
   */
  current?: boolean;
}

export interface M3BreadcrumbProps {
  /**
   * Breadcrumb items
   */
  items: M3BreadcrumbItem[];

  /**
   * Separator between items
   * @default '/'
   */
  separator?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Breadcrumb component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Details', current: true }
 *   ]}
 * />
 * ```
 */
export const M3Breadcrumb: React.FC<M3BreadcrumbProps> = ({
  items,
  separator = '/',
  className = '',
}) => {
  if (items.length === 0) return null;

  const classNames = [
    'm3-breadcrumb',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={classNames} aria-label="Breadcrumb">
      <ol className="m3-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current || isLast;

          return (
            <li key={index} className="m3-breadcrumb__item">
              {isCurrent ? (
                <span
                  className="m3-breadcrumb__link m3-breadcrumb__link--current"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="m3-breadcrumb__link"
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="m3-breadcrumb__link"
                      onClick={item.onClick}
                    >
                      {item.label}
                    </button>
                  )}
                </>
              )}
              {!isLast && (
                <span className="m3-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

M3Breadcrumb.displayName = 'M3Breadcrumb';

export default M3Breadcrumb;
