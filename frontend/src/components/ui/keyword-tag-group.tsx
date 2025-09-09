import React, { useState } from 'react';
import { X, Plus, Check, Minus } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import { Card } from './card';
import { cn } from '@/lib/utils';

interface KeywordTagProps {
  keyword: string;
  status: 'matched' | 'missing' | 'suggested' | 'accepted' | 'rejected';
  removable?: boolean;
  onRemove?: () => void;
  onAdd?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onClick?: () => void;
}

export function KeywordTag({
  keyword,
  status,
  removable = false,
  onRemove,
  onAdd,
  onAccept,
  onReject,
  onClick
}: KeywordTagProps) {
  const statusConfig = {
    matched: {
      bgClass: 'bg-brand-green/10 border-brand-green/20 text-brand-green dark:bg-brand-green/20 dark:border-brand-green/30',
      icon: <Check className="w-3 h-3" />,
      hoverClass: 'hover:bg-brand-green/20 dark:hover:bg-brand-green/30'
    },
    missing: {
      bgClass: 'bg-destructive/10 border-destructive/20 text-destructive dark:bg-destructive/20 dark:border-destructive/30',
      icon: <X className="w-3 h-3" />,
      hoverClass: 'hover:bg-destructive/20 dark:hover:bg-destructive/30'
    },
    suggested: {
      bgClass: 'bg-primary/10 border-primary/20 text-primary dark:bg-primary/20 dark:border-primary/30',
      icon: <Plus className="w-3 h-3" />,
      hoverClass: 'hover:bg-primary/20 dark:hover:bg-primary/30'
    },
    accepted: {
      bgClass: 'bg-brand-green/10 border-brand-green/30 text-brand-green dark:bg-brand-green/20 dark:border-brand-green/40',
      icon: <Check className="w-3 h-3" />,
      hoverClass: 'hover:bg-brand-green/20 dark:hover:bg-brand-green/30'
    },
    rejected: {
      bgClass: 'bg-muted border-muted-foreground/20 text-muted-foreground',
      icon: <Minus className="w-3 h-3" />,
      hoverClass: 'hover:bg-muted/80'
    }
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer group font-medium',
        config.bgClass,
        config.hoverClass
      )}
      onClick={onClick}
    >
      <span className="shrink-0">
        {config.icon}
      </span>

      <span className="text-sm font-medium truncate">
        {keyword}
      </span>

      <div className="flex items-center gap-1 ml-1">
        {status === 'suggested' && (
          <>
            {onAccept && (
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 hover:bg-brand-green/20 text-brand-green"
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept();
                }}
              >
                <Check className="w-3 h-3" />
              </Button>
            )}
            {onReject && (
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 hover:bg-destructive/20 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </>
        )}

        {status === 'suggested' && onAdd && (
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0 hover:bg-primary/20 text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
          >
            <Plus className="w-3 h-3" />
          </Button>
        )}

        {removable && onRemove && (
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

interface KeywordTagGroupProps {
  keywords: Array<{
    keyword: string;
    status: 'matched' | 'missing' | 'suggested' | 'accepted' | 'rejected';
    id?: string;
  }>;
  title?: string;
  description?: string;
  onTagRemove?: (keyword: string) => void;
  onTagAdd?: (keyword: string) => void;
  onTagAccept?: (keyword: string) => void;
  onTagReject?: (keyword: string) => void;
  onTagClick?: (keyword: string) => void;
  maxVisible?: number;
  showAcceptRejectAll?: boolean;
  className?: string;
}

export function KeywordTagGroup({
  keywords,
  title,
  description,
  onTagRemove,
  onTagAdd,
  onTagAccept,
  onTagReject,
  onTagClick,
  maxVisible,
  showAcceptRejectAll = false,
  className
}: KeywordTagGroupProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleKeywords = maxVisible && !showAll
    ? keywords.slice(0, maxVisible)
    : keywords;
  const hiddenCount = maxVisible && !showAll
    ? Math.max(0, keywords.length - maxVisible)
    : 0;

  const statusCounts = keywords.reduce((acc, { status }) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const suggestedKeywords = keywords.filter(k => k.status === 'suggested');

  const handleAcceptAll = () => {
    suggestedKeywords.forEach(k => onTagAccept?.(k.keyword));
  };

  const handleRejectAll = () => {
    suggestedKeywords.forEach(k => onTagReject?.(k.keyword));
  };

  return (
    <Card className={cn('p-4 space-y-4', className)}>
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {statusCounts.matched > 0 && (
              <Badge variant="outline" className="border-brand-green/30 text-brand-green font-medium">
                {statusCounts.matched} matched
              </Badge>
            )}
            {statusCounts.missing > 0 && (
              <Badge variant="outline" className="border-destructive/30 text-destructive font-medium">
                {statusCounts.missing} missing
              </Badge>
            )}
            {statusCounts.suggested > 0 && (
              <Badge variant="outline" className="border-primary/30 text-primary font-medium">
                {statusCounts.suggested} suggested
              </Badge>
            )}
            {statusCounts.accepted > 0 && (
              <Badge variant="outline" className="border-brand-green/40 text-brand-green font-medium">
                {statusCounts.accepted} accepted
              </Badge>
            )}
            {statusCounts.rejected > 0 && (
              <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground font-medium">
                {statusCounts.rejected} rejected
              </Badge>
            )}
          </div>
        </div>
      )}

      {showAcceptRejectAll && suggestedKeywords.length > 0 && (
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAcceptAll}
            className="text-brand-green border-brand-green/30 hover:bg-brand-green/10"
          >
            <Check className="w-3 h-3 mr-1" />
            Accept All Suggested
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRejectAll}
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <X className="w-3 h-3 mr-1" />
            Reject All Suggested
          </Button>
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
            onAccept={() => onTagAccept?.(keyword)}
            onReject={() => onTagReject?.(keyword)}
            onClick={() => onTagClick?.(keyword)}
          />
        ))}

        {hiddenCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="border-border text-muted-foreground hover:border-primary hover:text-primary font-medium"
          >
            {showAll ? 'Show Less' : `+${hiddenCount} more`}
          </Button>
        )}
      </div>
    </Card>
  );
}
