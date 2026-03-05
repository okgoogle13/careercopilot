import React from 'react';
import { motion } from 'framer-motion';

interface EvidenceCardProps {
  content: string;
  tags: string[];
  matchScore: number;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  content,
  tags,
  matchScore,
  onSelect,
  isSelected = false,
}) => {
  const getScoreColor = () => {
    if (matchScore >= 80) return 'text-sage';
    if (matchScore >= 60) return 'text-ink';
    return 'text-terracotta';
  };

  return (
    <motion.div
      className={`group relative cursor-pointer overflow-hidden rounded-tech border-2 p-6 transition-all ${
        isSelected
          ? 'border-sage bg-sage/5'
          : 'border-transparent bg-surface-container hover:border-sage/30'
      }`}
      onClick={onSelect}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{
        scale: 1.01,
        y: -2,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 27,
      }}
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* Match Score Badge */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wide text-white/40">
          STAR Evidence
        </span>
        <span className={`font-mono text-sm font-bold ${getScoreColor()}`}>
          {matchScore}% Match
        </span>
      </div>

      {/* Content */}
      <p className="font-leaf mb-4 text-sm leading-relaxed text-white/80">{content}</p>

      {/* Competency Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            className="rounded-gem bg-sage/20 px-2 py-1 font-leaf text-xs font-medium text-sage"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          className="absolute right-4 top-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sage">
            <svg
              className="h-4 w-4 text-surface"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Hover Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 to-transparent" />
      </div>
    </motion.div>
  );
};

export default EvidenceCard;
