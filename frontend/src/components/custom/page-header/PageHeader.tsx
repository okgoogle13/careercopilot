/**
 * ELECTRIC ALCHEMIST: PAGE HEADER COMPONENT
 *
 * Page header with breadcrumbs, actions, and design system tokens.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MoreVertical,
  Home,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/electric';
import { Separator } from './Separator';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ActionButton {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'tertiary';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface MenuAction {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  divider?: boolean;
  color?: 'error' | 'warning';
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  status?: {
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  };
  avatar?: {
    src?: string;
    alt: string;
    fallback?: string;
  };
  onBack?: () => void;
  backLabel?: string;
  actions?: ActionButton[];
  menuActions?: MenuAction[];
  children?: React.ReactNode;
  variant?: 'default' | 'compact' | 'detailed';
}

export function PageHeader({
  title,
  subtitle,
  description,
  breadcrumbs,
  status,
  avatar,
  onBack,
  backLabel = 'Back',
  actions = [],
  menuActions = [],
  children,
  variant = 'default',
}: PageHeaderProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  return (
    <div className="sticky top-0 z-50 border-b border-outline-variant bg-surface-container">
      <div className={cn('p-6', isCompact && 'p-4')}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 mb-4" aria-label="breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index === 0 && (
                  <Home className="h-4 w-4 text-on-surface-variant" />
                )}
                <button
                  onClick={crumb.onClick}
                  className={cn(
                    'text-human text-sm',
                    index === breadcrumbs.length - 1
                      ? 'text-on-surface'
                      : 'text-on-surface-variant hover:text-primary'
                  )}
                >
                  {crumb.label}
                </button>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-on-surface-variant" />
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Main Header Content */}
        <div className="flex items-start gap-4">
          {/* Back Button */}
          {onBack && (
            <motion.button
              onClick={onBack}
              className="mt-1 p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors"
              whileHover={{ scale: 0.95 }}
              whileTap={{ scale: 0.9 }}
              aria-label={backLabel}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
          )}

          {/* Avatar */}
          {avatar && (
            <div
              className={cn(
                'flex items-center justify-center rounded-full bg-primary-container text-on-primary-container',
                isCompact ? 'h-10 w-10 text-sm' : 'h-12 w-12 text-base',
                'mt-1 font-medium'
              )}
            >
              {avatar.fallback || avatar.alt[0]?.toUpperCase()}
            </div>
          )}

          {/* Title and Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <h1
                  className={cn(
                    'text-hero font-semibold text-on-surface truncate',
                    isCompact ? 'text-xl' : isDetailed ? 'text-3xl' : 'text-2xl'
                  )}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-human text-base text-on-surface-variant truncate mt-1">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Status */}
              {status && (
                <span
                  className={cn(
                    'px-3 py-1 rounded-[8px] text-data text-xs font-medium mt-1',
                    status.color === 'primary' && 'bg-primary-container text-on-primary-container',
                    status.color === 'secondary' && 'bg-secondary-container text-on-secondary',
                    status.color === 'error' && 'bg-error-container text-on-error',
                    status.color === 'success' && 'bg-primary-container text-on-primary-container',
                    !status.color && 'bg-surface-container-high text-on-surface'
                  )}
                >
                  {status.label}
                </span>
              )}
            </div>

            {/* Description */}
            {description && !isCompact && (
              <p className="text-human text-sm text-on-surface-variant max-w-2xl line-clamp-2 mb-2">
                {description}
              </p>
            )}

            {/* Custom Content */}
            {children && <div className={cn('mt-4', isCompact && 'mt-2')}>{children}</div>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Primary Actions */}
            {actions.slice(0, isCompact ? 1 : 3).map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  size={isCompact ? 'sm' : 'md'}
                  className="hidden sm:flex"
                >
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {action.label}
                </Button>
              );
            })}

            {/* Overflow Menu */}
            {(actions.length > (isCompact ? 1 : 3) || menuActions.length > 0) && (
              <div className="relative" ref={menuRef}>
                <motion.button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="more actions"
                >
                  <MoreVertical className="h-5 w-5" />
                </motion.button>

                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 rounded-[24px] bg-surface-container border border-outline-variant shadow-lg z-50"
                  >
                    <div className="p-2">
                      {actions.slice(isCompact ? 1 : 3).map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.id}
                            onClick={() => {
                              action.onClick();
                              setMenuOpen(false);
                            }}
                            disabled={action.disabled}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-[16px] text-human text-sm text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
                          >
                            {Icon && <Icon className="h-4 w-4" />}
                            {action.label}
                          </button>
                        );
                      })}

                      {actions.length > (isCompact ? 1 : 3) && menuActions.length > 0 && (
                        <Separator className="my-2" />
                      )}

                      {menuActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <React.Fragment key={action.id}>
                            <button
                              onClick={() => {
                                action.onClick();
                                setMenuOpen(false);
                              }}
                              disabled={action.disabled}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-[16px] text-human text-sm transition-colors disabled:opacity-50',
                                action.color === 'error'
                                  ? 'text-error hover:bg-error-container/20'
                                  : action.color === 'warning'
                                    ? 'text-tertiary hover:bg-tertiary-container/20'
                                    : 'text-on-surface hover:bg-surface-container-low'
                              )}
                            >
                              {Icon && <Icon className="h-4 w-4" />}
                              {action.label}
                            </button>
                            {action.divider && <Separator className="my-2" />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;

