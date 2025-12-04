/**
 * ELECTRIC ALCHEMIST: EMPTY STATE COMPONENT
 * Display empty states with optional action
 */

import * as React from 'react';
import { cn } from '../../../lib/cn';
import { ElectricButton } from '../button';

export interface ElectricEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const ElectricEmptyState: React.FC<ElectricEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'p-12 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-6 opacity-50">
          {icon}
        </div>
      )}
      <h3 className="text-hero text-hero-sm mb-3">{title}</h3>
      {description && (
        <p className="text-human text-outline max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <ElectricButton onClick={action.onClick} variant="tertiary">
          {action.label}
        </ElectricButton>
      )}
    </div>
  );
};

ElectricEmptyState.displayName = 'ElectricEmptyState';
