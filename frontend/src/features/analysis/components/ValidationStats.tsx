import React from 'react';
import { Placard } from '../../../components/ui/Placard';

interface ValidationStatsProps {
  passCount: number;
  reviewCount: number;
  avgConfidence: number;
}

export const ValidationStats: React.FC<ValidationStatsProps> = ({
  passCount,
  reviewCount,
  avgConfidence,
}) => {
  return (
    <section className="mb-8">
      <div className="flex flex-wrap items-center gap-12 bg-[var(--sys-color-charcoalBackground-steps-1)]/40 p-10 rounded-march border border-[var(--sys-color-concreteGrey-base)]/10 backdrop-blur-md">
        <div className="pr-8 py-2">
          <p className="text-4xl font-black text-[var(--sys-color-kr-activistSmokeGreen-base)] tracking-tighter">
            {passCount}
          </p>
          <p className="text-[10px] font-bold text-[var(--sys-color-concreteGrey-base)] uppercase tracking-widest mt-1">
            Verified
          </p>
        </div>

        <div className="px-8 border-x border-[var(--sys-color-concreteGrey-base)]/10 py-2">
          <p className="text-4xl font-black text-[var(--sys-color-stencilYellow-base)] tracking-tighter">
            {reviewCount}
          </p>
          <p className="text-[10px] font-bold text-[var(--sys-color-concreteGrey-base)] uppercase tracking-widest mt-1">
            Flagged
          </p>
        </div>

        <div className="pl-8 py-2">
          <p className="text-4xl font-black text-[var(--sys-color-inkGold-base)] tracking-tighter">
            {Math.round(avgConfidence * 100)}%
          </p>
          <p className="text-[10px] font-bold text-[var(--sys-color-concreteGrey-base)] uppercase tracking-widest mt-1">
            Confidence
          </p>
        </div>
      </div>
    </section>
  );
};
