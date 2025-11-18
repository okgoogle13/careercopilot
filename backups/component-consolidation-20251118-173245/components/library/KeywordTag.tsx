import { Close as X, Add as Plus, Check } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Button, IconButton } from '@mui/material';

import { Badge } from '../ui/badge';

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
      icon: <Check sx={{}} />,
      hoverClass: 'hover:bg-accent-green/30 hover:border-accent-green',
    },
    missing: {
      bgClass: 'bg-accent-red/20 border-accent-red/50 text-accent-red',
      icon: <X sx={{}} />,
      hoverClass: 'hover:bg-accent-red/30 hover:border-accent-red',
    },
    suggested: {
      bgClass: 'bg-brand-primary/20 border-brand-primary/50 text-brand-light',
      icon: <Plus sx={{}} />,
      hoverClass: 'hover:bg-brand-primary/30 hover:border-brand-primary',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 1.5,
      px: 3,
      py: 1.5,
      borderRadius: "9999px",
      border: 1,
      cursor: "pointer",
      fontWeight: 500,}}
      onClick={onClick}
    >
      {/* Status Icon */}
      <span sx={{}}>{config.icon}</span>

      {/* Keyword Text */}
      <span sx={{
      typography: "body1",
      fontWeight: 500,
      
    }}>{keyword}</span>

      {/* Action Buttons */}
      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      ml: 1
    }}>
        {status === 'suggested' && onAdd && (
          <Button
            size="small"
            variant="text"
            sx={{
      p: 0,
      '&:hover': {},
      '&:hover': {}
    }}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
          >
            <Plus sx={{}} />
          </Button>
        )}

        {removable && onRemove && (
          <Button
            size="small"
            variant="text"
            sx={{
      p: 0,
      opacity: 0,
      '&:hover': {},
      '&:hover': {}
    }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X sx={{}} />
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
    <div sx={{}}>
      {title && (
        <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
          <h4 sx={{
      fontWeight: 600,}}>{title}</h4>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      typography: "body2"
    }}>
            {statusCounts.matched && (
              <Badge
                variant="outline"
                sx={{
      fontWeight: 500
    }}
              >
                {statusCounts.matched} matched
              </Badge>
            )}
            {statusCounts.missing && (
              <Badge variant="outline" sx={{
      fontWeight: 500
    }}>
                {statusCounts.missing} missing
              </Badge>
            )}
            {statusCounts.suggested && (
              <Badge
                variant="outline"
                sx={{
      fontWeight: 500
    }}
              >
                {statusCounts.suggested} suggested
              </Badge>
            )}
          </div>
        </div>
      )}

      <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}>
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
            sx={{
      '&:hover': {},
      '&:hover': {},
      cursor: "pointer",
      fontWeight: 500
    }}
          >
            +{hiddenCount} more
          </Badge>
        )}
      </div>
    </div>
  );
}
