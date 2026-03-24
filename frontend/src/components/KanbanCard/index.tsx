import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface KanbanCardProps {
  /** Technical ID */
  id: string;
  /** Task title */
  title: string;
  /** Detailed description */
  description: string;
  /** Current status label */
  status: string;
  /** Importance level */
  priority: 'low' | 'medium' | 'high';
  /** Optional deadline string */
  dueDate?: string;
  /** Callback for drag selection */
  onDragStart?: () => void;
  /** Callback for click interaction */
  onSelect?: () => void;
}

const priorityColors: Record<string, string> = {
  low: 'var(--sys-color-activistSmokeGreen-base, #48DA8B)',
  medium: 'var(--sys-color-inkGold-base, #DAF674)',
  high: 'var(--sys-color-solidarityRed-base, #F14714)',
};

export const KanbanCard: React.FC<KanbanCardProps> = ({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  onDragStart,
  onSelect,
}) => {
  return (
    <motion.div
      layoutId={id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      className={cn(
        'relative rounded-[var(--sys-shape-placard01,8px)] border cursor-pointer select-none',
        'bg-[var(--sys-color-charcoalBackground-base)] border-[var(--sys-color-outline-variant,rgba(163,155,143,0.2))]',
        'p-4 space-y-2 transition-all'
      )}
      style={{
        borderLeft: `3px solid ${priorityColors[priority] ?? priorityColors.medium}`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--sys-color-worker-ash-base)] leading-tight line-clamp-2">
          {title}
        </p>
        <span
          className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded shrink-0"
          style={{
            background: 'rgba(163,155,143,0.1)',
            color: 'var(--sys-color-concreteGrey-base)',
          }}
        >
          {status}
        </span>
      </div>

      {description && (
        <p className="text-xs text-[var(--sys-color-concreteGrey-base)] line-clamp-2">
          {description}
        </p>
      )}

      {dueDate && (
        <p className="text-[10px] font-mono text-[var(--sys-color-concreteGrey-base)] opacity-60">
          {dueDate}
        </p>
      )}
    </motion.div>
  );
};

export default KanbanCard;
