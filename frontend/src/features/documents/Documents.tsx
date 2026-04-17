import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Download, FileText, Mail, Search, ScrollText, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { PageHeader } from '../../components/shared/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { exportToPdf } from '../../utils/exportEngine';
import { useDocumentExport } from './hooks/useDocumentExport';
import type { ExportableDocument } from './services/docxExport';
import { DocumentWorkbench } from '../../screens/08_workbench/DocumentWorkbench';
import { DocumentRedlineUploadPanel } from './components/DocumentRedlineUploadPanel';
import { TrackedChangesWorkspace } from './components/TrackedChangesWorkspace';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type DocumentType = 'resume' | 'cover' | 'ksc';

export interface Document {
  id: number;
  name: string;
  type: DocumentType;
  date: string;
}

export type DocumentTab = 'all' | 'resumes' | 'covers' | 'ksc';

interface RedlineResult {
  blob: Blob;
  filename: string;
}

// ============================================================================
// MOCK DATA - Replace with API calls
// ============================================================================

const DOCUMENTS: Document[] = [
  {
    id: 1,
    name: 'Community Support Resume',
    type: 'resume',
    date: 'Updated 2 days ago',
  },
  {
    id: 2,
    name: 'Settlement Collective Letter',
    type: 'cover',
    date: 'Updated 3 days ago',
  },
  {
    id: 3,
    name: 'Youth Outreach Resume',
    type: 'resume',
    date: 'Updated 1 week ago',
  },
  {
    id: 4,
    name: 'Advocacy Lead Resume',
    type: 'resume',
    date: 'Updated 1 week ago',
  },
  {
    id: 5,
    name: 'Neighbourhood Services Letter',
    type: 'cover',
    date: 'Updated 5 days ago',
  },
  {
    id: 6,
    name: 'Rapid Response Letter',
    type: 'cover',
    date: 'Updated 2 weeks ago',
  },
  {
    id: 7,
    name: 'KSC Case - Leadership',
    type: 'ksc',
    date: 'Updated 4 days ago',
  },
  {
    id: 8,
    name: 'KSC Case - Communication',
    type: 'ksc',
    date: 'Updated 1 week ago',
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

function toExportableDocument(doc: Document): ExportableDocument {
  const fileName = `${doc.name.replace(/\s+/g, '_')}.docx`;
  if (doc.type === 'resume') {
    return { type: 'resume', fileName, title: doc.name, summary: '(Content not yet loaded)' };
  }
  if (doc.type === 'cover') {
    return {
      type: 'cover-letter',
      fileName,
      heading: doc.name,
      content: '(Content not yet loaded)',
    };
  }
  return { type: 'ksc', fileName, criterion: doc.name, content: '(Content not yet loaded)' };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Documents() {
  const [activeTab, setActiveTab] = useState<DocumentTab>('all');
  const [redlineTarget, setRedlineTarget] = useState<Document | null>(null);
  const [redlineResult, setRedlineResult] = useState<RedlineResult | null>(null);
  const { exportDocx } = useDocumentExport();

  const handleDocxExport = useCallback(
    async (doc: Document) => {
      await exportDocx(toExportableDocument(doc));
    },
    [exportDocx]
  );

  const filteredDocs = filterDocuments(DOCUMENTS, activeTab);

  const handleRedlineSuccess = (blob: Blob, filename: string) => {
    setRedlineResult({ blob, filename });
  };

  const handleOverlayClose = () => {
    setRedlineTarget(null);
    setRedlineResult(null);
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl relative animate-in fade-in zoom-in-95 duration-500 ease-spring">
      <div className="relative z-10">
        {/* Header */}
        <PageHeader
          title="Working Papers"
          highlightedWord="Papers"
          description="Keep your resumes, letters, and KSC drafts ready for the next push."
        />

        {/* Search Bar */}
        <div className="bg-surface-container-high rounded-placard p-4 mb-8 flex items-center gap-3 border border-outline-variant focus-within:border-primary focus-within:ring-2 ring-primary/20 transition-all">
          <Search className="w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search the archive..."
            className="bg-transparent flex-1 outline-none text-on-surface placeholder:text-on-surface-variant font-body"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-surface-container rounded-tech p-2 w-fit border border-outline-variant">
          <TabButton
            label="All Files"
            isActive={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          />
          <TabButton
            label="Resume Drafts"
            isActive={activeTab === 'resumes'}
            onClick={() => setActiveTab('resumes')}
          />
          <TabButton
            label="Letter Front"
            isActive={activeTab === 'covers'}
            onClick={() => setActiveTab('covers')}
          />
          <TabButton
            label="KSC Cases"
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
                onRedline={() => setRedlineTarget(doc)}
                onDocxExport={handleDocxExport}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="Your generated documents will appear here."
            description="Start with a tailored cover letter or KSC draft and we will archive it automatically."
            ctaLabel="Start with Cover Letter →"
            ctaHref="/generation"
          />
        )}
      </div>

      {/* Redline Overlay */}
      <AnimatePresence>
        {redlineTarget && (
          <motion.div
            key="redline-overlay"
            data-testid="redline-overlay"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={KrDarkSpring}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              backgroundColor: 'var(--kr-color-charcoal-background-base)',
              opacity: 0.95,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
            <div style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}>
              <DocumentWorkbench
                title="Redline Workspace"
                subtitle={redlineTarget.name}
              >
                {/* Close button */}
                <button
                  aria-label="Close redline panel"
                  onClick={handleOverlayClose}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--kr-color-worker-ash-base)',
                    zIndex: 20,
                  }}
                  data-testid="redline-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>

                {redlineResult ? (
                  <TrackedChangesWorkspace
                    blob={redlineResult.blob}
                    filename={redlineResult.filename}
                    onReset={() => setRedlineResult(null)}
                  />
                ) : (
                  <DocumentRedlineUploadPanel
                    documentId={redlineTarget.id}
                    documentName={redlineTarget.name}
                    onCancel={handleOverlayClose}
                    onSuccess={handleRedlineSuccess}
                  />
                )}
              </DocumentWorkbench>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
        px-8 py-3 transition-all duration-short-2 ease-spring font-medium text-label-large
        ${isActive ? 'rounded-strike bg-primary-container text-on-primary-container shadow-sm' : 'rounded-scaffold text-on-surface-variant hover:text-on-surface hover:bg-surface-dim'}
      `}
    >
      {label}
    </button>
  );
}

interface DocumentCardProps {
  document: Document;
  onRedline: () => void;
  onDocxExport: (doc: Document) => void;
}

function DocumentCard({ document, onRedline, onDocxExport }: DocumentCardProps) {
  const typeBadge = {
    resume: { label: 'CV', icon: FileText, iconClass: 'text-primary' },
    cover: { label: 'LETTER', icon: Mail, iconClass: 'text-secondary' },
    ksc: { label: 'KSC', icon: ScrollText, iconClass: 'text-tertiary' },
  }[document.type];
  const Icon = typeBadge.icon;
  const cardShapeClass =
    document.type === 'resume'
      ? 'rounded-placard'
      : document.type === 'cover'
        ? 'rounded-blockRiot03'
        : 'rounded-blockRiot01';

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const elementId = `document-card-${document.id}`;
      const fileName = `${document.name.replace(/\s+/g, '_')}.pdf`;
      await exportToPdf(elementId, fileName);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  const handleRedlineClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRedline();
  };

  return (
    <div
      id={`document-card-${document.id}`}
      className={`bg-surface-container-low border border-outline-variant ${cardShapeClass} p-6 hover:bg-surface-container hover:border-primary hover:scale-[1.02] hover:shadow-elevation-2 transition-all duration-medium-1 ease-spring cursor-pointer group backdrop-blur-md relative`}
    >
      <div className="w-12 h-12 bg-surface-container-high rounded-tech flex items-center justify-center mb-4 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
        <Icon className={`w-5 h-5 ${typeBadge.iconClass}`} />
      </div>
      <h4 className="text-on-surface mb-2 font-bold text-title-medium">{document.name}</h4>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Calendar className="w-4 h-4" />
          <span className="uppercase tracking-wide text-label-small font-mono">
            {document.date}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="px-2 py-1 rounded-blockRiot01 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant border border-outline-variant">
            {typeBadge.label}
          </span>
          <button
            onClick={handleRedlineClick}
            className="px-2 py-1 rounded-blockRiot01 text-xs font-medium transition-all"
            style={{
              backgroundColor: 'var(--kr-color-charcoal-background-steps-3)',
              color: 'var(--kr-color-ink-gold-base)',
              border: '1px solid var(--kr-color-ink-gold-base)',
            }}
            title="Open Redline Workspace"
            data-testid={`redline-btn-${document.id}`}
          >
            Redline
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-scaffold bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-all"
            title="Download as PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDocxExport(document);
            }}
            className="p-2 rounded-scaffold bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all"
            title="Download as DOCX"
            data-testid={`docx-btn-${document.id}`}
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
