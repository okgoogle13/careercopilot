import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { Placard } from '../../../components/ui/Placard';
import { cn } from '../../../lib/utils';

export interface VerificationItem {
  id: string;
  field: string;
  actual: string;
  expected: string;
  status: 'match' | 'flagged' | 'mismatch';
  confidence: number;
}

interface SourceVerificationGridProps {
  items: VerificationItem[];
}

const getStatusIcon = (status: VerificationItem['status']) => {
  switch (status) {
    case 'match':
      return <ShieldCheck className="w-4 h-4 text-[var(--sys-color-kr-activistSmokeGreen-base)]" />;
    case 'flagged':
      return <AlertTriangle className="w-4 h-4 text-[var(--sys-color-stencilYellow-base)]" />;
    case 'mismatch':
      return <AlertTriangle className="w-4 h-4 text-[var(--sys-color-solidarityRed-base)]" />;
    default:
      return null;
  }
};

export const SourceVerificationGrid: React.FC<SourceVerificationGridProps> = ({
  items,
}) => {
  return (
    <Placard
      elevation="floating"
      className="p-0 overflow-hidden border-[var(--sys-color-concreteGrey-base)]/10"
      header={
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[var(--sys-color-kr-activistSmokeGreen-base)]" />
          <h3 className="text-sm font-bold tracking-tight text-[var(--sys-color-worker-ash-base)]">
            SOURCE VERIFICATION
          </h3>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--sys-color-concreteGrey-base)]/10 text-[var(--sys-color-concreteGrey-base)] uppercase tracking-widest text-[9px]">
              <th className="py-3 px-6 font-bold">Field</th>
              <th className="py-3 px-6 font-bold">Analysis</th>
              <th className="py-3 px-6 font-bold">Expected (Source)</th>
              <th className="py-3 px-6 font-bold">Status</th>
              <th className="py-3 font-bold text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sys-color-concreteGrey-base)]/5">
            {items.map((entry) => (
              <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-mono text-[var(--sys-color-inkGold-base)]">
                  {entry.field}
                </td>
                <td className="py-4 px-6 text-[var(--sys-color-worker-ash-base)] font-medium">
                  {entry.actual}
                </td>
                <td className="py-4 px-6 text-[var(--sys-color-concreteGrey-base)] italic">
                  {entry.expected}
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(entry.status)}
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                        entry.status === 'match'
                          ? 'bg-[var(--sys-color-kr-activistSmokeGreen-base)]/20 text-[var(--sys-color-kr-activistSmokeGreen-base)]'
                          : 'bg-[var(--sys-color-solidarityRed-base)]/20 text-[var(--sys-color-solidarityRed-base)]'
                      )}
                    >
                      {entry.status.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-right pr-6">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                      entry.confidence > 0.8
                        ? 'bg-[var(--sys-color-kr-activistSmokeGreen-base)]/20 text-[var(--sys-color-kr-activistSmokeGreen-base)]'
                        : entry.confidence > 0.5
                          ? 'bg-[var(--sys-color-stencilYellow-base)]/20 text-[var(--sys-color-stencilYellow-base)]'
                          : 'bg-[var(--sys-color-solidarityRed-base)]/20 text-[var(--sys-color-solidarityRed-base)]'
                    )}
                  >
                    {Math.round(entry.confidence * 100)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Placard>
  );
};
