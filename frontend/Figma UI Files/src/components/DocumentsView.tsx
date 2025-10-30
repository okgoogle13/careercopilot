import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface DocumentsViewProps {
  onCreateDocument?: () => void;
}

export function DocumentsView({ onCreateDocument }: DocumentsViewProps) {
  return (
    <div className="flex-1 overflow-auto" style={{ background: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="font-semibold mb-2"
              style={{ color: 'var(--on-surface)', fontSize: '2rem' }}
            >
              Documents
            </h1>
            <p style={{ color: 'var(--on-surface-variant)' }}>
              Manage your resumes, cover letters, and other career documents
            </p>
          </div>
          <Button
            onClick={onCreateDocument}
            className="transition-all duration-300"
            style={{
              background: 'var(--primary)',
              color: 'var(--on-primary)',
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>

        {/* Placeholder content */}
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed"
          style={{
            borderColor: 'rgba(167, 139, 250, 0.3)',
            background: 'rgba(30, 30, 35, 0.4)',
          }}
        >
          <div
            className="p-6 rounded-full mb-4"
            style={{
              background: 'rgba(167, 139, 250, 0.1)',
            }}
          >
            <FileText className="w-12 h-12" style={{ color: 'var(--primary)' }} />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: 'var(--on-surface)' }}>
            Documents View
          </h3>
          <p style={{ color: 'var(--on-surface-variant)' }}>
            Document creation flow will be housed here
          </p>
        </div>
      </div>
    </div>
  );
}
