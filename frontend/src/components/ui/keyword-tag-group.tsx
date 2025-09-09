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
      bgClass: 'bg-green-100 border-green-300 text-green-800',
      icon: <Check className="w-3 h-3" />,
      hoverClass: 'hover:bg-green-200'
    },
    missing: {
      bgClass: 'bg-red-100 border-red-300 text-red-800',
      icon: <X className="w-3 h-3" />,
      hoverClass: 'hover:bg-red-200'
    },
    suggested: {
      bgClass: 'bg-blue-100 border-blue-300 text-blue-800',
      icon: <Plus className="w-3 h-3" />,
      hoverClass: 'hover:bg-blue-200'
    },
    accepted: {
      bgClass: 'bg-green-100 border-green-400 text-green-900',
      icon: <Check className="w-3 h-3" />,
      hoverClass: 'hover:bg-green-200'
    },
    rejected: {
      bgClass: 'bg-gray-100 border-gray-300 text-gray-600',
      icon: <Minus className="w-3 h-3" />,
      hoverClass: 'hover:bg-gray-200'
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
                className="h-5 w-5 p-0 hover:bg-green-200 text-green-600"
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
                className="h-5 w-5 p-0 hover:bg-red-200 text-red-600"
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
            className="h-5 w-5 p-0 hover:bg-blue-200 text-blue-600"
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
            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 text-gray-500 hover:text-red-600"
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
            <h4 className="font-semibold text-gray-900">{title}</h4>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {statusCounts.matched > 0 && (
              <Badge variant="outline" className="border-green-300 text-green-700 font-medium">
                {statusCounts.matched} matched
              </Badge>
            )}
            {statusCounts.missing > 0 && (
              <Badge variant="outline" className="border-red-300 text-red-700 font-medium">
                {statusCounts.missing} missing
              </Badge>
            )}
            {statusCounts.suggested > 0 && (
              <Badge variant="outline" className="border-blue-300 text-blue-700 font-medium">
                {statusCounts.suggested} suggested
              </Badge>
            )}
            {statusCounts.accepted > 0 && (
              <Badge variant="outline" className="border-green-400 text-green-800 font-medium">
                {statusCounts.accepted} accepted
              </Badge>
            )}
            {statusCounts.rejected > 0 && (
              <Badge variant="outline" className="border-gray-300 text-gray-600 font-medium">
                {statusCounts.rejected} rejected
              </Badge>
            )}
          </div>
        </div>
      )}

      {showAcceptRejectAll && suggestedKeywords.length > 0 && (
        <div className="flex items-center gap-2 pb-2 border-b">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAcceptAll}
            className="text-green-700 border-green-300 hover:bg-green-50"
          >
            <Check className="w-3 h-3 mr-1" />
            Accept All Suggested
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRejectAll}
            className="text-red-700 border-red-300 hover:bg-red-50"
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
            className="border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-700 font-medium"
          >
            {showAll ? 'Show Less' : `+${hiddenCount} more`}
          </Button>
        )}
      </div>
    </Card>
  );
}
