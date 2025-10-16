import { Close as X, Add as Plus, Check } from '@mui/icons-material';
import { Badge } from '../ui/badge';
import { Button, IconButton } from '@mui/material';

interface KeywordTagProps {
  keyword: string;
  status: 'matched' | 'missing' | 'suggested';
  removable?: boolean;
  onRemove?: () => void;
  onAdd?: () => void;
  onClick?: () => void;
}

export function KeywordTag({
  keyword,
  status,
  removable = false,
  onRemove,
  onAdd,
  onClick,
}: KeywordTagProps) {
  const statusConfig = {
    matched: {
      bgClass: 'bg-accent-green/20 border-accent-green/50 text-accent-green',
      icon: <Check className="w-3 h-3" />,
      hoverClass: 'hover:bg-accent-green/30 hover:border-accent-green',
    },
    missing: {
      bgClass: 'bg-accent-red/20 border-accent-red/50 text-accent-red',
      icon: <X className="w-3 h-3" />,
      hoverClass: 'hover:bg-accent-red/30 hover:border-accent-red',
    },
    suggested: {
      bgClass: 'bg-brand-primary/20 border-brand-primary/50 text-brand-light',
      icon: <Plus className="w-3 h-3" />,
      hoverClass: 'hover:bg-brand-primary/30 hover:border-brand-primary',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer group font-medium ${config.bgClass} ${config.hoverClass}`}
      onClick={onClick}
    >
      {/* Status Icon */}
      <span className="shrink-0">{config.icon}</span>

      {/* Keyword Text */}
      <span className="text-sm font-medium truncate">{keyword}</span>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 ml-1">
        {status === 'suggested' && onAdd && (
          <Button
            size="small"
            variant="text"
            className="h-5 w-5 p-0 hover:bg-brand-primary/30 text-brand-light hover:text-brand-primary"
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
            size="small"
            variant="text"
            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent-red/30 text-content-secondary hover:text-accent-red"
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
    <div className="space-y-3">
      {title && (
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-content-primary">{title}</h4>
          <div className="flex items-center gap-2 text-xs">
            {statusCounts.matched && (
              <Badge
                variant="outline"
                className="border-accent-green/50 text-accent-green font-medium"
              >
                {statusCounts.matched} matched
              </Badge>
            )}
            {statusCounts.missing && (
              <Badge variant="outline" className="border-accent-red/50 text-accent-red font-medium">
                {statusCounts.missing} missing
              </Badge>
            )}
            {statusCounts.suggested && (
              <Badge
                variant="outline"
                className="border-brand-primary/50 text-brand-light font-medium"
              >
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
          <Badge
            variant="outline"
            className="border-subtle text-content-secondary hover:border-brand-primary hover:text-brand-light cursor-pointer transition-colors font-medium"
          >
            +{hiddenCount} more
          </Badge>
        )}
      </div>
    </div>
  );
}
