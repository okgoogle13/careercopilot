import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-surface relative">
      {/* Main Flex Container */}
      <div className="relative z-10 flex flex-row min-h-screen">
        {/* Sidebar - Responsive Flex Child */}
        <Sidebar />

        {/* Main Content Area - Flex-1 fills remaining space */}
        <main className="flex-1 min-h-screen w-full overflow-x-hidden bg-surface text-on-surface">
          {children}
        </main>
      </div>
    </div>
  );
}
