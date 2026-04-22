import React from 'react';
import { motion } from 'framer-motion';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

interface JobCardProps {
  id: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  deadline?: Date;
  onApply?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  id,
  jobTitle,
  company,
  matchScore,
  status,
  deadline,
  onApply,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'offer':
        return 'bg-sage text-surface';
      case 'interview':
        return 'bg-ink text-surface';
      case 'rejected':
        return 'bg-solidarity-red-base text-charcoal-background-base';
      default:
        return 'bg-surface-container text-worker-ash-muted';
    }
  };

  const getMatchBadgeColor = () => {
    if (matchScore >= 80) return 'bg-sage text-surface';
    if (matchScore >= 60) return 'bg-ink text-surface';
    return 'bg-solidarity-red-base text-charcoal-background-base';
  };

  return (
    <motion.div
      className="group relative overflow-hidden rounded-tech bg-surface-container p-6 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.01,
        y: -4,
      }}
      transition={KrDarkSpring}
      data-testid={`kanban-card-${id}`}
      style={{
        backgroundImage:
          'radial-gradient(circle, color-mix(in srgb, var(--sys-color-paperWhite-base) 2%, transparent) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-primary mb-1 text-xl font-black uppercase tracking-tight text-worker-ash-base">
            {jobTitle}
          </h3>
          <p className="font-proclamation text-sm text-worker-ash-muted">{company}</p>
        </div>

        {/* Match Score Badge */}
        <div
          className={`rounded-gem px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide ${getMatchBadgeColor()}`}
        >
          {matchScore}%
        </div>
      </div>

      {/* Status Pill */}
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`inline-block rounded-march px-3 py-1 font-primary text-xs font-medium capitalize ${getStatusColor()}`}
        >
          {status}
        </span>
        {deadline && (
          <span className="font-mono text-xs uppercase tracking-wide text-worker-ash-muted">
            Due: {deadline.toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Action Button */}
      {onApply && status === 'applied' && (
        <motion.button
          onClick={onApply}
          className="w-full rounded-march bg-solidarity-red-base py-3 font-primary text-sm font-medium text-charcoal-background-base transition-all hover:brightness-110"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Application
        </motion.button>
      )}

      {/* Hover Glow Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 to-transparent" />
      </div>
    </motion.div>
  );
};

export default JobCard;
