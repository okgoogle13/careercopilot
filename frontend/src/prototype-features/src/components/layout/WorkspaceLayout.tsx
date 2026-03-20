/* eslint-disable */
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export function WorkspaceLayout({ children }: Props) {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 min-[600px]:px-6 min-[1200px]:px-8 py-6 min-[600px]:py-8 min-[1200px]:py-12">
      <div className="grid grid-cols-4 min-[600px]:grid-cols-8 min-[1200px]:grid-cols-12 gap-4 min-[600px]:gap-6 min-[1200px]:gap-8">
        <div className="col-span-4 min-[600px]:col-span-8 min-[1200px]:col-span-12">{children}</div>
      </div>
    </div>
  );
}
