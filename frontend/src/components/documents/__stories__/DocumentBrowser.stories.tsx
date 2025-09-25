import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DocumentBrowser } from '../../features/documents/DocumentBrowser';
import { Document } from '../types';

type DocumentType = Document['type'];

// Generate sample documents
const generateDocuments = (count: number): Document[] => {
  const types: DocumentType[] = ['resume', 'cover-letter', 'portfolio', 'other'];
  const tags = [
    ['frontend', 'react', 'typescript'],
    ['backend', 'node', 'python'],
    ['fullstack', 'devops'],
    ['design', 'ui/ux'],
    ['mobile', 'react-native'],
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const hasAtsScore = Math.random() > 0.3; // 70% chance of having ATS score
    const docTags = Math.random() > 0.5 ? tags[Math.floor(Math.random() * tags.length)] : [];
    
    return {
      id: `doc-${i + 1}`,
      title: `Document ${i + 1} - ${type.replace('-', ' ')}`.replace(/\b\w/g, l => l.toUpperCase()),
      type,
      lastModified: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      atsScore: hasAtsScore ? Math.floor(Math.random() * 30) + 70 : undefined, // 70-100
      size: Math.floor(Math.random() * 5 + 1) * 1024 * 200, // 200KB - 1MB
      tags: docTags,
      url: `https://example.com/documents/doc-${i + 1}.pdf`,
    };
  });
};

const sampleDocuments = generateDocuments(12);

const meta: Meta<typeof DocumentBrowser> = {
  title: 'Components/Documents/DocumentBrowser',
  component: DocumentBrowser,
  tags: ['autodocs', 'documentation'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A document browser component that displays documents in either grid or list view with filtering and sorting capabilities.',
      },
    },
  },
  argTypes: {
    documents: {
      description: 'Array of document objects to display',
      table: {
        type: { summary: 'Document[]' },
      },
    },
    defaultView: {
      control: { type: 'select' },
      options: ['grid', 'list'],
      description: 'Default view mode',
      table: {
        defaultValue: { summary: 'grid' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
      table: {
        defaultValue: { summary: false },
      },
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    onSelect: { 
      action: 'selected',
      description: 'Callback when a document is selected',
      table: {
        type: { summary: '(document: Document) => void' },
      },
    },
    onDelete: {
      action: 'delete',
      description: 'Callback when a document is deleted',
    },
    onDownload: {
      action: 'download',
      description: 'Callback when a document is downloaded',
    },
    onViewChange: {
      action: 'viewChange',
      description: 'Callback when the view mode changes',
    },
    onSortChange: {
      action: 'sortChange',
      description: 'Callback when the sort option changes',
    },
    onFilterChange: {
      action: 'filterChange',
      description: 'Callback when filters are changed',
    },
  },
  args: {
    documents: sampleDocuments,
    defaultView: 'grid',
  },
};

export default meta;

type Story = StoryObj<typeof DocumentBrowser>;

// Basic Stories
export const Default: Story = {
  args: {
    documents: sampleDocuments.slice(0, 6),
    defaultView: 'grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a basic document browser with 6 documents in a grid view.',
      },
    },
  },
};

export const GridView: Story = {
  args: {
    documents: sampleDocuments,
    defaultView: 'grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays documents in a responsive grid layout. The grid adjusts based on screen size.',
      },
    },
  },
};

export const ListView: Story = {
  args: {
    documents: sampleDocuments,
    defaultView: 'list',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays documents in a tabular list view with sortable columns.',
      },
    },
  },
};

// State Stories
export const LoadingState: Story = {
  args: {
    documents: [],
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a loading skeleton while documents are being fetched.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    documents: [],
    error: 'Failed to load documents. Please try again later.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays an error message when document loading fails.',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    documents: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows an empty state when no documents are available.',
      },
    },
  },
};

// Interactive Story
export const Interactive: Story = {
  render: (args: any) => {
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [documents, setDocuments] = useState<Document[]>(args.documents || []);

    const handleDelete = (doc: Document) => {
      setDocuments(documents.filter(d => d.id !== doc.id));
      action('onDelete')(doc);
    };

    const handleDownload = (doc: Document) => {
      action('onDownload')(doc);
      // Simulate download
      alert(`Downloading: ${doc.title}`);
    };

    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h5">Interactive Document Browser</Typography>
          <DocumentBrowser
            {...args}
            documents={documents}
            onSelect={(doc: Document) => {
              setSelectedDoc(doc);
              action('onSelect')(doc);
            }}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onViewChange={action('onViewChange')}
            onSortChange={action('onSortChange')}
            onFilterChange={action('onFilterChange')}
          />
          
          {selectedDoc && (
            <Box sx={{ mt: 4, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>Selected Document:</Typography>
              <Box component="pre" sx={{ 
                p: 2, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                maxHeight: 300,
                overflow: 'auto'
              }}>
                {JSON.stringify(selectedDoc, null, 2)}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => handleDownload(selectedDoc)}
                >
                  Download
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={() => handleDelete(selectedDoc)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          )}
        </Stack>
      </Box>
    );
  },
};
