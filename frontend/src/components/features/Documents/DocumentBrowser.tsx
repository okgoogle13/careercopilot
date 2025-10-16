import React, { useState } from 'react';
import { DocumentCard } from './DocumentCard';
import { DocumentView, Document } from './types';
import { Box, Typography, IconButton, Grid  } from '@mui/material';
import { GridView, ViewList } from '@mui/icons-material';

interface DocumentBrowserProps {
  /**
   * Array of document objects to display
   */
  documents: Document[];
  /**
   * Initial view mode (grid or list)
   * @default 'grid'
   */
  defaultView?: 'grid' | 'list';
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
  const [view, setView] = useState<'grid' | 'list'>(defaultView);
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
    <Box sx={{ width: '100%' }} className={className}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          My Documents
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setView('grid')}
            sx={{
              p: 1,
              borderRadius: 1.5,
              ...(view === 'grid' && {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }),
            }}
            aria-label="Grid view"
          >
            <GridView />
          </IconButton>
          <IconButton
            onClick={() => setView('list')}
            sx={{
              p: 1,
              borderRadius: 1.5,
              ...(view === 'list' && {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }),
            }}
            aria-label="List view"
          >
            <ViewList />
          </IconButton>
        </Box>
      </Box>

      {documents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <Typography variant="h6">No documents found</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Upload your first document to get started
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {documents.map((doc) => (
            <Grid
              key={doc.id}
              item
              xs={12}
              sm={view === 'grid' ? 6 : 12}
              md={view === 'grid' ? 4 : 12}
              lg={view === 'grid' ? 3 : 12}
            >
              <DocumentCard
                document={doc}
                view={view}
                isSelected={selectedDoc === doc.id}
                onSelect={handleSelect}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
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
