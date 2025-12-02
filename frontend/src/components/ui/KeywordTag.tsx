/**
 * ELECTRIC ALCHEMIST: KEYWORD TAG COMPONENT
 *
 * Keyword tag with status variants and design system tokens.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tactilePress } from '@/lib/motion';
import { Badge } from './Badge';

interface KeywordTagProps {
  keyword: string;
  status: 'matched' | 'missing' | 'suggested';
  removable?: boolean;
  onRemove?: () => void;
  onAdd?: () => void;
  onClick?: () => void;
}

const statusConfig = {
  matched: {
    bg: 'bg-primary-container/20 border-primary-container/50 text-primary',
    icon: Check,
    hover: 'hover:bg-primary-container/30 hover:border-primary-container',
  },
  missing: {
    bg: 'bg-error-container/20 border-error-container/50 text-error',
    icon: X,
    hover: 'hover:bg-error-container/30 hover:border-error-container',
  },
  suggested: {
    bg: 'bg-tertiary-container/20 border-tertiary-container/50 text-tertiary',
    icon: Plus,
    hover: 'hover:bg-tertiary-container/30 hover:border-tertiary-container',
  },
};

export function KeywordTag({
  keyword,
  status,
  removable = false,
  onRemove,
  onAdd,
  onClick,
}: KeywordTagProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-3 px-3 py-1.5 rounded-full border cursor-pointer',
        'text-human text-sm font-medium',
        config.bg,
        config.hover,
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
      variants={tactilePress}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
    >
      <Icon className="h-4 w-4" />
      <span>{keyword}</span>
      <div className="flex items-center gap-1 ml-1">
        {status === 'suggested' && onAdd && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="p-0 hover:opacity-70 transition-opacity"
            variants={tactilePress}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        )}
        {removable && onRemove && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-0 opacity-0 group-hover:opacity-100 hover:opacity-70 transition-opacity"
            variants={tactilePress}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

interface KeywordTagGroupProps {
  keywords: Array<{
    keyword: string;
    status: 'matched' | 'missing' | 'suggested';
    id?: string;
  }>;
  title?: string;
  onTagRemove?: (keyword: string) => void;
  onTagAdd?: (keyword: string) => void;
  onTagClick?: (keyword: string) => void;
  maxVisible?: number;
}

export function KeywordTagGroup({
  keywords,
  title,
  onTagRemove,
  onTagAdd,
  onTagClick,
  maxVisible,
}: KeywordTagGroupProps) {
  const visibleKeywords = maxVisible ? keywords.slice(0, maxVisible) : keywords;
  const hiddenCount = maxVisible ? Math.max(0, keywords.length - maxVisible) : 0;

  const statusCounts = keywords.reduce(
    (acc, { status }) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-hero text-base font-semibold text-on-surface">{title}</h4>
          <div className="flex items-center gap-2">
            {statusCounts.matched && (
              <Badge variant="outline" className="text-data text-xs font-medium">
                {statusCounts.matched} matched
              </Badge>
            )}
            {statusCounts.missing && (
              <Badge variant="outline" className="text-data text-xs font-medium">
                {statusCounts.missing} missing
              </Badge>
            )}
            {statusCounts.suggested && (
              <Badge variant="outline" className="text-data text-xs font-medium">
                {statusCounts.suggested} suggested
              </Badge>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {visibleKeywords.map(({ keyword, status, id }, index) => (
          <KeywordTag
            key={id || index}
            keyword={keyword}
            status={status}
            removable={status !== 'missing'}
            onRemove={() => onTagRemove?.(keyword)}
            onAdd={() => onTagAdd?.(keyword)}
            onClick={() => onTagClick?.(keyword)}
          />
        ))}
        {hiddenCount > 0 && (
          <Badge variant="outline" className="cursor-pointer text-data text-xs font-medium">
            +{hiddenCount} more
          </Badge>
        )}
      </div>
    </div>
  );
}

export default KeywordTag;

