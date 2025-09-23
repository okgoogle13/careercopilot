import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';
import { Close, Add, Check, Remove } from '@mui/icons-material';

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
  onClick,
}: KeywordTagProps) {
  const statusConfig = {
    matched: {
      sx: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: 'rgba(76, 175, 80, 0.2)',
        color: '#4caf50',
        '&:hover': {
          backgroundColor: 'rgba(76, 175, 80, 0.2)'
        }
      },
      icon: <Check fontSize="small" />,
    },
    missing: {
      sx: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderColor: 'rgba(244, 67, 54, 0.2)',
        color: '#f44336',
        '&:hover': {
          backgroundColor: 'rgba(244, 67, 54, 0.2)'
        }
      },
      icon: <Close fontSize="small" />,
    },
    suggested: {
      sx: {
        backgroundColor: 'rgba(var(--md-sys-color-primary), 0.1)',
        borderColor: 'rgba(var(--md-sys-color-primary), 0.2)',
        color: 'primary.main',
        '&:hover': {
          backgroundColor: 'rgba(var(--md-sys-color-primary), 0.2)'
        }
      },
      icon: <Add fontSize="small" />,
    },
    accepted: {
      sx: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: 'rgba(76, 175, 80, 0.3)',
        color: '#4caf50',
        '&:hover': {
          backgroundColor: 'rgba(76, 175, 80, 0.2)'
        }
      },
      icon: <Check fontSize="small" />,
    },
    rejected: {
      sx: {
        backgroundColor: 'action.hover',
        borderColor: 'divider',
        color: 'text.secondary',
        '&:hover': {
          backgroundColor: 'action.selected'
        }
      },
      icon: <Remove fontSize="small" />,
    },
  };

  const config = statusConfig[status];

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        px: 1.5,
        py: 0.75,
        borderRadius: '1rem',
        border: '1px solid',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        fontWeight: 500,
        ...config.sx
      }}
    >
      <Box sx={{ display: 'flex', flexShrink: 0 }}>{config.icon}</Box>

      <Typography
        variant="body2"
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {keyword}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 0.5 }}>
        {status === 'suggested' && (
          <>
            {onAccept && (
              <IconButton
                size="small"
                sx={{
                  width: 20,
                  height: 20,
                  p: 0,
                  color: '#4caf50',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.2)'
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept();
                }}
              >
                <Check sx={{ fontSize: 12 }} />
              </IconButton>
            )}
            {onReject && (
              <IconButton
                size="small"
                sx={{
                  width: 20,
                  height: 20,
                  p: 0,
                  color: '#f44336',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.2)'
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                }}
              >
                <Close sx={{ fontSize: 12 }} />
              </IconButton>
            )}
          </>
        )}

        {status === 'suggested' && onAdd && (
          <IconButton
            size="small"
            sx={{
              width: 20,
              height: 20,
              p: 0,
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
                opacity: 0.2
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
          >
            <Add sx={{ fontSize: 12 }} />
          </IconButton>
        )}

        {removable && onRemove && (
          <IconButton
            size="small"
            sx={{
              width: 20,
              height: 20,
              p: 0,
              opacity: 0,
              color: 'text.secondary',
              transition: 'all 0.2s ease-in-out',
              '.group:hover &': {
                opacity: 1
              },
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                color: '#f44336'
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Close sx={{ fontSize: 12 }} />
          </IconButton>
        )}
      </Box>
    </Box>
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
}: KeywordTagGroupProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleKeywords = maxVisible && !showAll ? keywords.slice(0, maxVisible) : keywords;
  const hiddenCount = maxVisible && !showAll ? Math.max(0, keywords.length - maxVisible) : 0;

  const statusCounts = keywords.reduce(
    (acc, { status }) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const suggestedKeywords = keywords.filter((k) => k.status === 'suggested');

  const handleAcceptAll = () => {
    suggestedKeywords.forEach((k) => onTagAccept?.(k.keyword));
  };

  const handleRejectAll = () => {
    suggestedKeywords.forEach((k) => onTagReject?.(k.keyword));
  };

  return (
    <Card sx={{ p: 2 }}>
      {title && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {description}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem' }}>
            {statusCounts.matched > 0 && (
              <Chip
                label={`${statusCounts.matched} matched`}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: 'rgba(76, 175, 80, 0.3)',
                  color: '#4caf50',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            )}
            {statusCounts.missing > 0 && (
              <Chip
                label={`${statusCounts.missing} missing`}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: 'rgba(244, 67, 54, 0.3)',
                  color: '#f44336',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            )}
            {statusCounts.suggested > 0 && (
              <Chip
                label={`${statusCounts.suggested} suggested`}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: 'rgba(var(--md-sys-color-primary), 0.3)',
                  color: 'primary.main',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            )}
            {statusCounts.accepted > 0 && (
              <Chip
                label={`${statusCounts.accepted} accepted`}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: 'rgba(76, 175, 80, 0.4)',
                  color: '#4caf50',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            )}
            {statusCounts.rejected > 0 && (
              <Chip
                label={`${statusCounts.rejected} rejected`}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: 'rgba(158, 158, 158, 0.3)',
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            )}
          </Box>
        </Box>
      )}

      {showAcceptRejectAll && suggestedKeywords.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1, mb: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleAcceptAll}
              startIcon={<Check sx={{ fontSize: 12 }} />}
              sx={{
                color: '#4caf50',
                borderColor: 'rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.1)'
                }
              }}
            >
              Accept All Suggested
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleRejectAll}
              startIcon={<Close sx={{ fontSize: 12 }} />}
              sx={{
                color: '#f44336',
                borderColor: 'rgba(244, 67, 54, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.1)'
                }
              }}
            >
              Reject All Suggested
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
        </Box>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
            variant="outlined"
            size="small"
            onClick={() => setShowAll(!showAll)}
            sx={{
              borderColor: 'divider',
              color: 'text.secondary',
              fontWeight: 500,
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main'
              }
            }}
          >
            {showAll ? 'Show Less' : `+${hiddenCount} more`}
          </Button>
        )}
      </Box>
    </Card>
  );
}
