import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Placard } from '../../../components/ui/Placard';
import { cn } from '../../../lib/utils';

interface AuditLogItem {
  id: string;
  timestamp: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
}

interface AuditLogListProps {
  items: AuditLogItem[];
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pass':
      return <ShieldCheck className="w-4 h-4 text-[var(--sys-color-kr-activistSmokeGreen-base)]" />;
    case 'warning':
      return <ShieldCheck className="w-4 h-4 text-[var(--sys-color-stencilYellow-base)]" />;
    case 'fail':
      return <ShieldCheck className="w-4 h-4 text-[var(--sys-color-solidarityRed-base)]" />;
    default:
      return <ShieldCheck className="w-4 h-4 text-[var(--sys-color-concreteGrey-base)]" />;
  }
};

export const AuditLogList: React.FC<AuditLogListProps> = ({ items }) => {
  return (
    <Placard
      elevation="floating"
      className="p-8 border-concrete-grey/10"
      header={
        <div className="flex items-center gap-4">
          <h2 className="font-display text-2xl font-bold text-paper-white uppercase tracking-tight">
            AUDIT <span className="text-ink-gold">TRAIL</span>
          </h2>
          <div className="flex-1 h-px bg-concrete-grey/10" />
        </div>
      }
    >
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 rounded-march border border-[var(--sys-color-concreteGrey-base)]/5 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="mt-1">{getStatusIcon(item.status)}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-ink-gold/60 uppercase">
                  {item.timestamp}
                </span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                    item.status.toLowerCase() === 'pass' &&
                      'bg-[var(--sys-color-kr-activistSmokeGreen-base)]/20 text-[var(--sys-color-kr-activistSmokeGreen-base)]',
                    item.status.toLowerCase() === 'warning' &&
                      'bg-[var(--sys-color-stencilYellow-base)]/20 text-[var(--sys-color-stencilYellow-base)]',
                    item.status.toLowerCase() === 'fail' &&
                      'bg-[var(--sys-color-solidarityRed-base)]/20 text-[var(--sys-color-solidarityRed-base)]'
                  )}
                >
                  {item.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-concrete-grey leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Placard>
  );
};
