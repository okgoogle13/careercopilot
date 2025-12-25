import { useState } from 'react';
import { Search, FileText, Calendar, Download } from 'lucide-react';
import { exportToPdf } from '../../utils/exportEngine';
import snakePlant from '../../assets/images/snake-plant.png';
import { PageHeader } from '../../components/shared/PageHeader';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type DocumentType = 'resume' | 'cover' | 'ksc';

export interface Document {
  id: number;
  name: string;
  type: DocumentType;
  date: string;
  icon: string;
}

export type DocumentTab = 'all' | 'resumes' | 'covers' | 'ksc';

// ============================================================================
// MOCK DATA - Replace with API calls
// ============================================================================

const DOCUMENTS: Document[] = [
  {
    id: 1,
    name: 'Software Engineer Resume',
    type: 'resume',
    date: 'Updated 2 days ago',
    icon: '📄',
  },
  {
    id: 2,
    name: 'Cover Letter - TechCorp',
    type: 'cover',
    date: 'Updated 3 days ago',
    icon: '📝',
  },
  {
    id: 3,
    name: 'UX Designer Resume',
    type: 'resume',
    date: 'Updated 1 week ago',
    icon: '📄',
  },
  {
    id: 4,
    name: 'Product Manager Resume',
    type: 'resume',
    date: 'Updated 1 week ago',
    icon: '📄',
  },
  {
    id: 5,
    name: 'Cover Letter - DesignHub',
    type: 'cover',
    date: 'Updated 5 days ago',
    icon: '📝',
  },
  {
    id: 6,
    name: 'Generic Cover Letter',
    type: 'cover',
    date: 'Updated 2 weeks ago',
    icon: '📝',
  },
  {
    id: 7,
    name: 'KSC Response - Leadership',
    type: 'ksc',
    date: 'Updated 4 days ago',
    icon: '📋',
  },
  {
    id: 8,
    name: 'KSC Response - Communication',
    type: 'ksc',
    date: 'Updated 1 week ago',
    icon: '📋',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function filterDocuments(documents: Document[], tab: DocumentTab): Document[] {
  if (tab === 'all') return documents;

  const typeMap: Record<Exclude<DocumentTab, 'all'>, DocumentType> = {
    resumes: 'resume',
    covers: 'cover',
    ksc: 'ksc',
  };

  return documents.filter((doc) => doc.type === typeMap[tab as keyof typeof typeMap]);
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Documents() {
  const [activeTab, setActiveTab] = useState<DocumentTab>('all');
  const filteredDocs = filterDocuments(DOCUMENTS, activeTab);

  return (
    <div className="p-6 md:p-12 max-w-7xl relative animate-in fade-in zoom-in-95 duration-500 ease-spring">
      {/* Snake Plant Decoration - Bottom Right Corner */}
      <div className="fixed bottom-0 right-0 pointer-events-none w-[380px] z-[1] opacity-55">
        <img
          src={snakePlant}
          alt=""
          className="w-full h-auto mix-blend-screen"
          style={{
            WebkitMaskImage:
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)',
            maskImage:
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <PageHeader
          title="Your Documents"
          highlightedWord="Documents"
          description="Manage your career documents and generate tailored versions"
        />

        {/* Search Bar */}
        <div className="bg-surface-container-high rounded-pebble p-4 mb-8 flex items-center gap-3 border border-outline-variant focus-within:border-primary focus-within:ring-2 ring-primary/20 transition-all">
          <Search className="w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search documents..."
            className="bg-transparent flex-1 outline-none text-on-surface placeholder:text-on-surface-variant font-body"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-surface-container rounded-tech p-2 w-fit border border-outline-variant">
          <TabButton
            label="All"
            isActive={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          />
          <TabButton
            label="Resumes"
            isActive={activeTab === 'resumes'}
            onClick={() => setActiveTab('resumes')}
          />
          <TabButton
            label="Cover Letters"
            isActive={activeTab === 'covers'}
            onClick={() => setActiveTab('covers')}
          />
          <TabButton
            label="KSC Responses"
            isActive={activeTab === 'ksc'}
            onClick={() => setActiveTab('ksc')}
          />
        </div>

        {/* Documents Grid */}
        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-8 py-3 rounded-pebble transition-all duration-short-2 ease-spring font-medium text-label-large
        ${isActive ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-dim'}
      `}
    >
      {label}
    </button>
  );
}

interface DocumentCardProps {
  document: Document;
}

function DocumentCard({ document }: DocumentCardProps) {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Generate unique ID for the document card
      const elementId = `document-card-${document.id}`;
      const fileName = `${document.name.replace(/\s+/g, '_')}.pdf`;
      await exportToPdf(elementId, fileName);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  return (
    <div
      id={`document-card-${document.id}`}
      className="bg-surface-container-low border border-outline-variant rounded-leaf p-6 hover:bg-surface-container hover:border-primary hover:scale-[1.02] hover:shadow-elevation-2 transition-all duration-medium-1 ease-spring cursor-pointer group backdrop-blur-md relative"
    >
      <div className="w-12 h-12 bg-surface-container-high rounded-tech flex items-center justify-center text-2xl mb-4 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
        {document.icon}
      </div>
      <h4 className="text-on-surface mb-2 font-bold text-title-medium">{document.name}</h4>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Calendar className="w-4 h-4" />
          <span className="uppercase tracking-wide text-label-small font-mono">{document.date}</span>
        </div>
        <button
          onClick={handleDownload}
          className="p-2 rounded-pebble bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-all opacity-0 group-hover:opacity-100"
          title="Download as PDF"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-container rounded-leaf p-16 flex flex-col items-center justify-center border border-dashed border-outline">
      <FileText className="w-16 h-16 text-outline mb-4" />
      <p className="text-on-surface-variant text-center text-body-large">No documents found in this category</p>
    </div>
  );
}
