import React from 'react';
import { Document } from './types';
import { cn } from '../../lib/utils';
import { ATSScoreCircle } from '../analysis/ATSScoreCircle';

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
      <div
        className={cn(
          'flex items-center p-4 rounded-lg cursor-pointer transition-colors',
          'hover:bg-surface-container-highest',
          isSelected && 'ring-2 ring-primary/50 bg-surface-container-highest'
        )}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <div className="flex-shrink-0 mr-4 text-2xl">{icon}</div>
        <div className="flex-grow min-w-0">
          <h3 className="font-medium truncate">{document.title}</h3>
          <p className="text-sm text-muted-foreground">
            {document.type} • {formattedDate}
          </p>
        </div>
        {document.atsScore !== undefined && (
          <div className="ml-4">
            <ATSScoreCircle score={document.atsScore} size="small" />
          </div>
        )}
        <button
          onClick={handleDelete}
          className="ml-4 p-2 rounded-full hover:bg-surface-container-highest"
          aria-label="Delete document"
        >
          🗑️
        </button>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className={cn(
        'group relative p-4 rounded-xl border border-outline-variant',
        'transition-all hover:shadow-md hover:border-primary/30',
        'flex flex-col h-full',
        isSelected && 'ring-2 ring-primary/50 bg-surface-container-high'
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="text-4xl">{icon}</div>
        {document.atsScore !== undefined && (
          <div className="-mt-2 -mr-2">
            <ATSScoreCircle score={document.atsScore} size="small" />
          </div>
        )}
      </div>
      
      <h3 className="font-medium mb-1 truncate">{document.title}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        {document.type} • {formattedDate}
      </p>
      
      <div className="mt-auto pt-3 border-t border-outline-variant">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {document.size ? formatFileSize(document.size) : 'Unknown size'}
          </span>
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-surface-container-highest"
            aria-label="Delete document"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
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
