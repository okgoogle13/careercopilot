import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { KeralaRageButton } from '@/components/ui/KeralaRageButton';

const DOCUMENTS = [
  { name: 'Software_Engineer_CV.pdf', size: '2.4 MB', status: 'ready' },
  { name: 'Updates_Draft_v2.docx', size: '15 KB', status: 'processing' },
];

export const DocumentStackAnchor: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-surface-KrDark-glass-low border border-white/5 rounded-pebble p-4 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
        <h3 className="font-primary text-sm text-secondary-concrete-grey uppercase tracking-wider">
          Evidence Locker
        </h3>
        <KeralaRageButton
          variant="secondary"
          size="sm"
        >
          <Plus className="w-3 h-3 mr-1" /> Add
        </KeralaRageButton>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {DOCUMENTS.map((doc, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-ink-gold opacity-70 group-hover:opacity-100" />
              <div>
                <div className="text-sm text-on-surface-KrDark-paper-white font-medium">
                  {doc.name}
                </div>
                <div className="text-xs text-secondary-concrete-grey opacity-60">{doc.size}</div>
              </div>
            </div>
            <div
              className={`text-xs px-2 py-0.5 rounded ${
                doc.status === 'ready'
                  ? 'bg-status-KrDark-clinical-sage/20 text-status-KrDark-clinical-sage'
                  : 'bg-ink-gold/20 text-ink-gold'
              }`}
            >
              {doc.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
