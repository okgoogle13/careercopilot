import React, { useState } from 'react';
import {
  FileText,
  Upload,
  MoreVertical,
  FileCode,
  FileType,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { KeralaRageButton } from '@/components/ui/KeralaRageButton';

interface Document {
  id: string;
  name: string;
  type: 'resume' | 'cover-letter' | 'portfolio' | 'other';
  status: 'analyzed' | 'pending' | 'draft';
  lastModified: string;
  size: string;
  score?: number;
}

export const DocumentStack: React.FC = () => {
  // Mock Data
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Senior_Frontend_Resume_v4.pdf',
      type: 'resume',
      status: 'analyzed',
      lastModified: '2023-10-24',
      size: '2.4 MB',
      score: 72,
    },
    {
      id: '2',
      name: 'Cover_Letter_Google.docx',
      type: 'cover-letter',
      status: 'draft',
      lastModified: '2023-10-23',
      size: '14 KB',
    },
    {
      id: '3',
      name: 'Portfolio_Case_Study.pdf',
      type: 'portfolio',
      status: 'pending',
      lastModified: '2023-10-20',
      size: '15.8 MB',
    },
  ]);

  const getIcon = (type: Document['type']) => {
    switch (type) {
      case 'resume':
        return FileText;
      case 'cover-letter':
        return FileType;
      case 'portfolio':
        return FileCode;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'analyzed':
        return 'text-ink-gold';
      case 'pending':
        return 'text-secondary-flannel';
      case 'draft':
        return 'text-tertiary-solidarity';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-display-medium font-display text-on-surface-paper-white mb-2">
            Document Stack
          </h1>
          <p className="text-body-large text-secondary-flannel-dim font-primary">
            Manage your source materials. Upload resumes, cover letters, and raw career data.
          </p>
        </div>
        <KeralaRageButton
          variant="primary"
          size="md"
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </KeralaRageButton>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc) => {
          const Icon = getIcon(doc.type);
          return (
            <div
              key={doc.id}
              className="group flex items-center gap-6 p-4 rounded-megaphone transition-colors"
              style={{
                border:
                  '1px solid color-mix(in srgb, var(--kr-color-concrete-grey-steps-0) 30%, transparent)',
                backgroundColor:
                  'color-mix(in srgb, var(--kr-color-charcoal-background-steps-1) 20%, transparent)',
              }}
            >
              {/* Icon Container */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-megaphone"
                style={{
                  backgroundColor: 'var(--kr-color-charcoal-background-steps-3)',
                  border:
                    '1px solid color-mix(in srgb, var(--kr-color-concrete-grey-steps-0) 30%, transparent)',
                }}
              >
                <Icon className="w-6 h-6 text-on-surface-paper-white opacity-70" />
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-title-medium font-bold text-on-surface-paper-white truncate">
                  {doc.name}
                </h3>
                <div className="flex items-center gap-4 text-label-small text-secondary-flannel-dim mt-1 font-mono">
                  <span className="uppercase">{doc.type}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>Updated {doc.lastModified}</span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-6">
                {/* Score Badge (if applicable) */}
                {doc.score && (
                  <div className="flex flex-col items-end">
                    <div className="text-label-small uppercase text-secondary-flannel-dim font-bold">
                      ATS Score
                    </div>
                    <div
                      className={cn(
                        'text-title-large font-bold',
                        doc.score > 70 ? 'text-ink-gold' : 'text-tertiary-solidarity'
                      )}
                    >
                      {doc.score}
                    </div>
                  </div>
                )}

                {/* Status Pill */}
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-march border px-3 py-1 text-xs font-bold uppercase tracking-wider',
                    getStatusColor(doc.status),
                    doc.status === 'analyzed' && 'border-primary-ink-gold/20',
                    doc.status === 'pending' && 'border-secondary-flannel/20',
                    doc.status === 'draft' && 'border-tertiary-solidarity/20'
                  )}
                >
                  {doc.status === 'analyzed' && <CheckCircle className="w-3 h-3" />}
                  {doc.status === 'pending' && <Clock className="w-3 h-3" />}
                  {doc.status}
                </div>

                {/* Actions Menu */}
                <button
                  className="rounded-march p-2 text-secondary-flannel-dim transition-colors hover:text-on-surface-paper-white"
                  style={{ backgroundColor: 'var(--kr-color-charcoal-background-steps-3)' }}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Drop Zone — V-006 FIX: Laboratory tokens replace Gallery tokens */}
      <div
        className="p-12 flex flex-col items-center justify-center cursor-pointer transition-all rounded-megaphone hover:[border-color:var(--kr-color-ink-gold-steps-0)] hover:[background-color:var(--kr-color-charcoal-background-steps-2)]"
        style={{
          border: '2px dashed var(--kr-color-charcoal-background-steps-4)',
          backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
        }}
      >
        <Upload
          className="w-12 h-12 mb-4"
          style={{ color: 'var(--kr-color-concrete-grey-base)', opacity: 0.5 }}
        />
        <p
          className="text-title-medium font-bold"
          style={{ color: 'var(--kr-color-paper-white-base)' }}
        >
          Drag and drop files here
        </p>
        <p
          className="text-body-medium mt-2"
          style={{ color: 'var(--kr-color-concrete-grey-base)' }}
        >
          Supports PDF, DOCX, TXT (Max 10MB)
        </p>
      </div>
    </div>
  );
};
