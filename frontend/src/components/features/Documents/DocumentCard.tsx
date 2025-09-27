import React from 'react';
import { Document } from './types';
import { ATSScoreCircle } from '../Analysis/ATSScoreCircle';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

export interface DocumentCardProps {
  document: Document;
  view: 'grid' | 'list';
  isSelected?: boolean;
  onSelect?: (doc: Document) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}

const DOCUMENT_ICONS = {
  resume: '📄',
  'cover-letter': '✉️',
  'selection-criteria': '📋',
  portfolio: '📁',
  other: '📎',
} as const;

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  view,
  isSelected = false,
  onSelect,
  onDelete,
}) => {
  const handleClick = () => {
    onSelect?.(document);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(document.id, e);
  };

  const icon = DOCUMENT_ICONS[document.type] || DOCUMENT_ICONS.other;
  const formattedDate = document.lastModified.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (view === 'list') {
    return (
      <Paper
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'colors 200ms',
          '&:hover': {
            backgroundColor: 'action.hover'
          },
          ...(isSelected && {
            outline: 2,
            outlineColor: 'primary.main',
            backgroundColor: 'action.selected'
          })
        }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <Box sx={{ flexShrink: 0, mr: 2, fontSize: '2rem' }}>{icon}</Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {document.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {document.type} • {formattedDate}
          </Typography>
        </Box>
        {document.atsScore !== undefined && (
          <Box sx={{ ml: 2 }}>
            <ATSScoreCircle score={document.atsScore} size="small" />
          </Box>
        )}
        <IconButton
          onClick={handleDelete}
          sx={{ ml: 2 }}
          aria-label="Delete document"
        >
          <Delete />
        </IconButton>
      </Paper>
    );
  }

  // Grid view
  return (
    <Paper
      sx={{
        position: 'relative',
        p: 2,
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
        transition: 'all 200ms',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 2,
          borderColor: 'primary.main',
          borderOpacity: 0.3
        },
        ...(isSelected && {
          outline: 2,
          outlineColor: 'primary.main',
          backgroundColor: 'action.selected'
        })
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Box sx={{ fontSize: '2.5rem' }}>{icon}</Box>
        {document.atsScore !== undefined && (
          <Box sx={{ mt: -1, mr: -1 }}>
            <ATSScoreCircle score={document.atsScore} size="small" />
          </Box>
        )}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        {document.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {document.type} • {formattedDate}
      </Typography>

      <Box sx={{ mt: 'auto', pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {document.size ? formatFileSize(document.size) : 'Unknown size'}
          </Typography>
          <IconButton
            onClick={handleDelete}
            size="small"
            sx={{
              opacity: 0,
              '.MuiPaper-root:hover &': {
                opacity: 1
              }
            }}
            aria-label="Delete document"
          >
            <Delete />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

function formatFileSize(bytes?: number): string {
  if (!bytes) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
