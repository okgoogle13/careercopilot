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

/**
 * KanbanCard
 *
 * The "Command Center" task unit.
 * Features heavy tactile physics and high-contrast priority markers.
 */
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
  const priorityColor =
    priority === 'high'
      ? 'text-solidarity-red'
      : priority === 'medium'
        ? 'text-ink-gold'
        : 'text-smoke-green';

  return (
    <motion.div
      layout
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98, rotateZ: 1 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={onDragStart}
      onClick={onSelect}
      className={cn(
        'p-6 bg-charcoal-100 border border-blueprint-grey/20',
        'rounded-stone shadow-viscous cursor-grab active:cursor-grabbing',
        'relative flex flex-col gap-4 overflow-hidden'
      )}
      role="listitem"
      aria-label={`Kanban Task: ${title}`}
    >
      <div className="flex justify-between items-center relative z-10">
        <span className="font-jetbrains-mono text-[10px] text-blueprint-grey/40 uppercase tracking-widest">
          ID: {id}
        </span>
        <span className="px-2 py-0.5 bg-blueprint-grey/10 text-blueprint-grey rounded-seed text-[10px] uppercase font-bold">
          {status}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-paper-white uppercase tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-[10px] text-paper-white/60 font-mono uppercase tracking-widest line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex justify-between items-end mt-4 relative z-10">
        <div className={cn('text-xs font-bold uppercase tracking-widest', priorityColor)}>
          {priority}
        </div>
        {dueDate && (
          <div className="text-[10px] font-jetbrains-mono text-blueprint-grey uppercase">
            Due: {dueDate}
          </div>
        )}
      </div>

      {/* Subtle screenprint substrate */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('/assets/kr-solidarity/texture/kr-solidarity__atmospheric__texture--asphalt-grain--v2.png')] mix-blend-overlay" />
    </motion.div>
  );
};
