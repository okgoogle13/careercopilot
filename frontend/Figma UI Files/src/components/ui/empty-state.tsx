import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: React.ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ 
    icon: Icon, 
    title, 
    description, 
    action, 
    secondaryAction,
    className = '',
    children 
  }, ref) => {
    return (
      <div 
        ref={ref}
        className={`
          flex flex-col items-center justify-center
          text-center p-12
          ${className}
        `}
      >
        {/* Icon */}
        {Icon && (
          <div className={`
            p-6 rounded-full mb-6
            bg-gradient-to-br from-[var(--primary)]/20 to-[var(--tertiary)]/20
            border-2 border-[var(--primary)]/30
          `}>
            <Icon className="w-12 h-12 text-[var(--primary)]" />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl text-[var(--on-surface)] mb-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-[var(--on-surface-variant)] max-w-md mb-6">
            {description}
          </p>
        )}

        {/* Custom Content */}
        {children}

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
            {action && (
              <button
                onClick={action.onClick}
                className="
                  px-6 py-3 rounded-[var(--radius-lg)]
                  bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)]
                  text-white border-2 border-transparent
                  transition-all duration-300
                  hover:shadow-[var(--shadow-glow-aurora)] hover:-translate-y-0.5
                "
              >
                {action.label}
              </button>
            )}

            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="
                  px-6 py-3 rounded-[var(--radius-lg)]
                  bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
                  border-2 border-[var(--glass-border)]
                  text-[var(--on-surface)]
                  transition-all duration-300
                  hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-glow-aurora)] hover:-translate-y-0.5
                "
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
