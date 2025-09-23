import type { Meta, StoryObj } from '@storybook/react';
import { DocumentBrowser } from '../../features/documents/DocumentBrowser';
import { Document } from '../types';

// Generate sample documents
const sampleDocuments: Document[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer Resume',
    type: 'resume',
    lastModified: new Date('2023-10-15'),
    atsScore: 85,
    size: 1024 * 250, // 250KB
    tags: ['frontend', 'react', 'typescript'],
  },
  {
    id: '2',
    title: 'Cover Letter - Google',
    type: 'cover-letter',
    lastModified: new Date('2023-10-10'),
    atsScore: 92,
    size: 1024 * 180,
  },
  {
    id: '3',
    title: 'Portfolio 2023',
    type: 'portfolio',
    lastModified: new Date('2023-09-28'),
    size: 1024 * 1024 * 2, // 2MB
  },
  {
    id: '4',
    title: 'Project Proposal',
    type: 'other',
    lastModified: new Date('2023-10-01'),
    size: 1024 * 150,
  },
];

const meta: Meta<typeof DocumentBrowser> = {
  title: 'Components/Documents/DocumentBrowser',
  component: DocumentBrowser,
  tags: ['autodocs'],
  argTypes: {
    defaultView: {
      control: { type: 'select' },
      options: ['grid', 'list'],
    },
    onSelect: { action: 'selected' },
    onDelete: { action: 'deleted' },
  },
  args: {
    documents: sampleDocuments,
    defaultView: 'grid',
  },
};

export default meta;

type Story = StoryObj<typeof DocumentBrowser>;

export const GridView: Story = {
  args: {
    defaultView: 'grid',
  },
};

export const ListView: Story = {
  args: {
    defaultView: 'list',
  },
};

export const EmptyState: Story = {
  args: {
    documents: [],
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'max-w-4xl mx-auto',
  },
};

export const WithSelection: Story = {
  render: (args) => {
    const [selectedDoc, setSelectedDoc] = React.useState<string | null>(null);
    
    return (
      <div className="space-y-4">
        <DocumentBrowser
          {...args}
          documents={args.documents.map(doc => ({
            ...doc,
            isSelected: doc.id === selectedDoc,
          }))}
          onSelect={(doc) => setSelectedDoc(doc.id)}
        />
        <div className="p-4 bg-surface-container-high rounded-lg">
          <h3 className="font-medium mb-2">Selected Document:</h3>
          <pre className="text-sm text-muted-foreground">
            {selectedDoc 
              ? JSON.stringify(args.documents.find(d => d.id === selectedDoc), null, 2)
              : 'No document selected'}
          </pre>
        </div>
      </div>
    );
  },
};
