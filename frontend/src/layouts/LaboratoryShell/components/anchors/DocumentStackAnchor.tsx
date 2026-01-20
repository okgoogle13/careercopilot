import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { NorthcoteButton } from '@/components/ui/NorthcoteButton';

const DOCUMENTS = [
    { name: 'Software_Engineer_CV.pdf', size: '2.4 MB', status: 'ready' },
    { name: 'Updates_Draft_v2.docx', size: '15 KB', status: 'processing' },
];

export const DocumentStackAnchor: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-surface-laboratory-glass-low border border-white/5 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                <h3 className="font-field-note text-sm text-secondary-flannel-flower uppercase tracking-wider">
                    Evidence Locker
                </h3>
                <NorthcoteButton variant="secondary" size="sm">
                    <Plus className="w-3 h-3 mr-1" /> Add
                </NorthcoteButton>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                {DOCUMENTS.map((doc, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-primary-wattle-gold opacity-70 group-hover:opacity-100" />
                            <div>
                                <div className="text-sm text-on-surface-laboratory-parchment font-medium">
                                    {doc.name}
                                </div>
                                <div className="text-xs text-secondary-flannel-flower opacity-60">
                                    {doc.size}
                                </div>
                            </div>
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded ${doc.status === 'ready'
                                ? 'bg-status-laboratory-clinical-sage/20 text-status-laboratory-clinical-sage'
                                : 'bg-primary-wattle-gold/20 text-primary-wattle-gold'
                            }`}>
                            {doc.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
