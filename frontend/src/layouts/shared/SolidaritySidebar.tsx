import React from 'react';
import {
  BarChart3,
  Briefcase,
  ClipboardList,
  FileText,
  Home,
  UserCircle,
  Settings,
  LogOut,
  X,
  Telescope,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Placard } from '@/components/ui/Placard';
import { ActionButton } from '@/components/kerala-rage/ActionButton';
import { cn } from '@/lib/utils';
import { NAVIGATION_SCHEMA } from '@/config/navigation.schema';

const iconMap: Record<string, any> = {
  'nav-dashboard': Home,
  'nav-lookout': Telescope,
  'nav-applications': ClipboardList,
  'nav-analysis': BarChart3,
  'nav-docs': FileText,
  'nav-profile': UserCircle,
};

interface SolidaritySidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

/**
 * SolidaritySidebar - KR Solidarity v6.0 Navigation Shell
 * Archetype: Scaffold (Layout Shell)
 */
export function SolidaritySidebar({
  isOpen = true,
  onClose,
  isMobileDrawer = false,
}: SolidaritySidebarProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const appendQuery = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const sidebarContent = (
    <div className="flex flex-col h-full w-full bg-charcoalBackground-base border-r border-concreteGrey-steps-1 relative overflow-hidden">
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grit-overlay grit-overlay--film-grain" />

      {/* Header / Logo */}
      <div className="p-8 flex items-center justify-between relative z-10">
        <Logo size="md" />
        {isMobileDrawer && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 text-worker-ash-base hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="px-6 pb-6 relative z-10">
        <Link to={`/apply${appendQuery}`}>
          <ActionButton
            className="w-full font-bold uppercase tracking-wider text-sm"
            label="[+ NEW APPLICATION]"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-6 space-y-2 relative z-10 overflow-y-auto">
        {NAVIGATION_SCHEMA.map((item) => {
          const isActive = location.pathname === item.route;
          const Icon = iconMap[item.id] || Home;

          return (
            <Link
              key={item.id}
              to={`${item.route}${appendQuery}`}
              onClick={isMobileDrawer ? onClose : undefined}
              className={cn(
                'group flex items-center gap-4 px-5 py-3 transition-all duration-300 relative',
                isActive
                  ? 'text-inkGold-base'
                  : 'text-worker-ash-base/60 hover:text-worker-ash-base hover:bg-white/5'
              )}
              style={{
                borderRadius: isActive
                  ? 'var(--sys-shape-blockRiot02)'
                  : 'var(--sys-shape-blockRiot01)',
                backgroundColor: isActive
                  ? 'var(--sys-color-charcoalBackground-steps-2)'
                  : 'transparent',
                border: isActive
                  ? '1px solid var(--sys-color-concreteGrey-steps-1)'
                  : '1px solid transparent',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-solidarityRed-base rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform group-hover:scale-110',
                  isActive && 'text-inkGold-base'
                )}
              />
              <span className="text-sm font-bold tracking-wide uppercase font-mono">
                {item.label}
              </span>
            </Link>
          );
        })}

        <div className="my-6 border-t border-concreteGrey-steps-1/30" />

        <Link
          to={`/settings${appendQuery}`}
          onClick={isMobileDrawer ? onClose : undefined}
          className={cn(
            'group flex items-center gap-4 px-5 py-3 transition-all duration-300 relative',
            location.pathname === '/settings'
              ? 'text-inkGold-base'
              : 'text-worker-ash-base/60 hover:text-worker-ash-base hover:bg-white/5'
          )}
          style={{
            borderRadius:
              location.pathname === '/settings'
                ? 'var(--sys-shape-blockRiot02)'
                : 'var(--sys-shape-blockRiot01)',
            backgroundColor:
              location.pathname === '/settings'
                ? 'var(--sys-color-charcoalBackground-steps-2)'
                : 'transparent',
            border:
              location.pathname === '/settings'
                ? '1px solid var(--sys-color-concreteGrey-steps-1)'
                : '1px solid transparent',
          }}
        >
          {location.pathname === '/settings' && (
            <motion.div
              layoutId="active-pill"
              className="absolute left-0 w-1 h-6 bg-solidarityRed-base rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <Settings
            className={cn(
              'w-5 h-5 transition-transform group-hover:scale-110',
              location.pathname === '/settings' && 'text-inkGold-base'
            )}
          />
          <span className="text-sm font-bold tracking-wide uppercase font-mono">Settings</span>
        </Link>
      </nav>

      {/* User Profile / Footer */}
      <div className="p-6 relative z-10">
        <Placard
          elevation="flat"
          className="bg-charcoalBackground-steps-1 border-concreteGrey-steps-0 p-4"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-march bg-solidarityRed-base/20 border border-solidarityRed-base/40 flex items-center justify-center">
              <span className="text-solidarityRed-base font-black">N</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-worker-ash-base uppercase tracking-tight truncate">
                Nishant
              </p>
              <p className="text-[10px] font-mono text-inkGold-base uppercase tracking-widest opacity-80">
                Premium Access
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/profile${appendQuery}`}
              className="flex-1 flex items-center justify-center p-2 rounded-march bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-worker-ash-base/60" />
            </Link>
            <button
              className="flex-1 flex items-center justify-center p-2 rounded-march bg-solidarityRed-base/10 hover:bg-solidarityRed-base/20 transition-colors border border-solidarityRed-base/10"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-solidarityRed-base" />
            </button>
          </div>
        </Placard>
      </div>
    </div>
  );

  if (isMobileDrawer) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={onClose}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-[101]"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside className="hidden md:flex flex-col w-[280px] h-screen sticky top-0 flex-shrink-0">
      {sidebarContent}
    </aside>
  );
}
