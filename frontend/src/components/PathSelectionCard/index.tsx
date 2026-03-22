/* eslint-disable */
import React from 'react';
import { cn } from '@/lib/utils';

export interface PathSelectionCardProps {
  title: string;
  description: string;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export const PathSelectionCard: React.FC<PathSelectionCardProps> = ({
  title,
  description,
  isSelected,
  onSelect,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'text-left rounded-[var(--sys-shape-placard01,8px)] border p-6 transition-all w-full',
        isSelected
          ? 'border-[var(--sys-color-inkGold-base)] bg-[rgba(218,246,116,0.08)]'
          : 'border-[rgba(163,155,143,0.2)] bg-transparent hover:border-[rgba(218,246,116,0.4)]',
        className
      )}
    >
      <p
        className="font-bold text-lg uppercase tracking-tight"
        style={{ color: 'var(--sys-color-worker-ash-base)' }}
      >
        {title}
      </p>
      <p
        className="text-sm mt-2"
        style={{ color: 'var(--sys-color-concreteGrey-base)' }}
      >
        {description}
      </p>
    </button>
  );
};

export default PathSelectionCard;
