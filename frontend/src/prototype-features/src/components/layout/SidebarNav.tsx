/* eslint-disable */
import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, User, History, LogOut, Library, Image } from 'lucide-react';

type Props = {
  onLogout: () => void;
  activeTab: 'WORKSPACE' | 'PROFILE' | 'PAST' | 'STUDIO' | 'LIBRARY';
  onTabChange: (tab: 'WORKSPACE' | 'PROFILE' | 'PAST' | 'STUDIO' | 'LIBRARY') => void;
};

export function SidebarNav({ onLogout, activeTab, onTabChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-[80px] min-[600px]:top-[80px] min-[600px]:bottom-0 min-[600px]:w-[80px] min-[1200px]:w-[360px] min-[600px]:h-[calc(100vh-80px)] flex min-[600px]:flex-col z-40 border-t min-[600px]:border-t-0 min-[600px]:border-r"
      style={{
        background: 'var(--sys-color-charcoalBackground-steps-1)',
        borderColor: 'var(--sys-color-outline-variant)',
        borderRadius: 'var(--sys-shape-cutoutRiot01)',
      }}
    >
      <div className="flex-1 flex min-[600px]:flex-col p-0 min-[600px]:py-4 min-[1200px]:py-6 gap-0 min-[600px]:gap-2 overflow-x-auto min-[600px]:overflow-y-auto min-[600px]:overflow-x-hidden justify-around min-[600px]:justify-start items-center min-[1200px]:items-stretch w-full">
        {/* Prototype-only labels. Canonical runtime routing lives in the main CareerCopilot repo App.tsx and route matrix. */}
        <NavItem
          icon={<Briefcase size={24} />}
          label="WORKSPACE"
          active={activeTab === 'WORKSPACE'}
          onClick={() => onTabChange('WORKSPACE')}
        />
        <NavItem
          icon={<User size={24} />}
          label="PROFILE"
          active={activeTab === 'PROFILE'}
          onClick={() => onTabChange('PROFILE')}
        />
        <NavItem
          icon={<History size={24} />}
          label="PAST"
          active={activeTab === 'PAST'}
          onClick={() => onTabChange('PAST')}
        />
        <NavItem
          icon={<Image size={24} />}
          label="STUDIO"
          active={activeTab === 'STUDIO'}
          onClick={() => onTabChange('STUDIO')}
        />
        <NavItem
          icon={<Library size={24} />}
          label="LIBRARY"
          active={activeTab === 'LIBRARY'}
          onClick={() => onTabChange('LIBRARY')}
        />
      </div>

      <div
        className="hidden min-[600px]:flex p-4 min-[1200px]:p-6 border-t"
        style={{ borderColor: 'var(--sys-color-outline-variant)' }}
      >
        <motion.button
          onClick={onLogout}
          whileHover={{ x: 5, color: 'var(--sys-color-solidarityRed-base)' }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex flex-col min-[1200px]:flex-row items-center justify-center min-[1200px]:justify-start gap-1 min-[1200px]:gap-3 text-center min-[1200px]:text-left p-2 min-[1200px]:p-4 text-[var(--sys-color-worker-ash-base)] font-bold uppercase tracking-wider transition-colors text-[10px] min-[1200px]:text-sm"
        >
          <LogOut size={24} />
          <span className="hidden min-[1200px]:inline">Sign Out</span>
        </motion.button>
      </div>
    </nav>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col min-[1200px]:flex-row items-center justify-center min-[1200px]:justify-start gap-1 min-[1200px]:gap-4 text-center min-[1200px]:text-left p-2 min-[1200px]:px-6 min-[1200px]:py-4 transition-colors font-bold uppercase tracking-wider text-[10px] min-[1200px]:text-sm min-w-[64px] min-[600px]:min-w-0 min-[600px]:w-full min-[1200px]:w-[calc(100%-32px)] min-[1200px]:mx-4 ${
        active
          ? 'text-[var(--sys-color-paperWhite-base)]'
          : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
      }`}
    >
      {/* Active Indicator Background */}
      {active && (
        <motion.div
          layoutId="navIndicator"
          className="absolute bg-[var(--sys-color-solidarityRed-base)] -z-10 min-[1200px]:hidden"
          style={{
            borderRadius: 'var(--sys-shape-radius-full)',
            height: '32px',
            width: '64px',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {/* Drawer Full Width Indicator (CSS Override) */}
      {active && (
        <motion.div
          layoutId="navIndicatorDesktop"
          className="hidden min-[1200px]:block absolute inset-0 bg-[var(--sys-color-solidarityRed-base)] -z-10"
          style={{ borderRadius: 'var(--sys-shape-blockRiot02)' }}
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      <div className="relative z-10 flex items-center justify-center w-8 h-8 min-[1200px]:w-auto min-[1200px]:h-auto">
        {icon}
      </div>
      <span className="relative z-10 mt-1 min-[1200px]:mt-0">{label}</span>
    </button>
  );
}
