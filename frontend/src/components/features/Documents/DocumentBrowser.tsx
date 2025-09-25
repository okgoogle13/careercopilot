import React, { useState } from 'react';
import { DocumentCard } from './DocumentCard';
import { DocumentView } from './types';
import { cn } from '../../../lib/utils';

export interface Document {
  id: string;
  title: string;
  type: 'resume' | 'cover-letter' | 'portfolio' | 'other';
  lastModified: Date;
  atsScore?: number;
  previewUrl?: string;
  size?: number;
}

interface DocumentBrowserProps {
  /**
   * Array of document objects to display
   */
  documents: Document[];
  /**
   * Initial view mode (grid or list)
   * @default 'grid'
   */
  defaultView?: DocumentView;
  /**
   * Callback when a document is selected
   */
  onSelect?: (doc: Document) => void;
  /**
   * Callback when a document is deleted
   */
  onDelete?: (id: string) => void;
  /**
   * Custom class name for the container
   */
  className?: string;
}

/**
 * DocumentBrowser component for displaying documents in grid or list view
 */
export const DocumentBrowser: React.FC<DocumentBrowserProps> = ({
  documents,
  defaultView = 'grid',
  onSelect,
  onDelete,
  className,
}) => {
  const [view, setView] = useState<DocumentView>(defaultView);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const handleSelect = (doc: Document) => {
    setSelectedDoc(doc.id);
    onSelect?.(doc);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Documents</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('grid')}
            className={cn(
              'p-2 rounded-md',
              view === 'grid' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-highest'
            )}
            aria-label="Grid view"
          >
            <GridIcon />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-2 rounded-md',
              view === 'list' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-highest'
            )}
            aria-label="List view"
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No documents found</p>
          <p className="text-sm mt-2">Upload your first document to get started</p>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-4',
            view === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          )}
        >
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              view={view}
              isSelected={selectedDoc === doc.id}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Icons (can be replaced with your icon library)
const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);
