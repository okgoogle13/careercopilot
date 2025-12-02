/**
 * ELECTRIC ALCHEMIST: BREADCRUMB COMPONENT
 * Navigation breadcrumbs with Data tier typography
 */

import * as React from 'react';
import { cn } from '../../../lib/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ElectricBreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const ElectricBreadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2', className)}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href ? (
                <a
                  href={item.href}
                  className={cn(
                    'text-data hover:text-primary transition-colors',
                    isLast && 'text-primary'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </a>
              ) : item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={cn(
                    'text-data hover:text-primary transition-colors',
                    isLast && 'text-primary'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={cn(
                    'text-data',
                    isLast && 'text-primary'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-outline" aria-hidden="true">
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

ElectricBreadcrumb.displayName = 'ElectricBreadcrumb';
