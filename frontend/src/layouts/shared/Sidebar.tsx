import {
  BarChart3,
  Briefcase,
  ClipboardList,
  FileText,
  Home,
  Settings,
  UserCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

const mainNavItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/opportunities', icon: Briefcase, label: 'Jobs' },
  { path: '/applications', icon: ClipboardList, label: 'Applications' },
  { path: '/analysis', icon: BarChart3, label: 'Analysis' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/profile', icon: UserCircle, label: 'Profile' },
];

export function Sidebar() {
  const location = useLocation();

  // Preserve query params (especially demo mode)
  const searchParams = new URLSearchParams(location.search);
  const queryString = searchParams.toString();
  const appendQuery = queryString ? `?${queryString}` : '';

  return (
    <aside
      style={{
        width: '240px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--sys-color-surface-container-low, #1D1B18)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        borderRight: '1px solid var(--sys-color-outline-variant, #4D4639)',
      }}
    >
      {/* Logo Area */}
      <div className="p-6 pb-8">
        <Logo size="md" />
      </div>

      {/* Navigation - Figma Spec: Sage Green Pill for Active */}
      <nav className="flex-1 px-4 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.04, x: 6 }}
              transition={KrDarkSpring}
            >
              <Link
                to={`${item.path}${appendQuery}`}
                className={`
                  flex items-center gap-3 px-4 py-3 mb-2 transition-all duration-200 font-medium
                  ${
                    isActive
                      ? 'shadow-md'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }
                `}
                title={item.label}
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--sys-color-nav-active-container)',
                        color: 'var(--sys-color-on-nav-active)',
                        borderRadius: 'var(--sys-shape-blockRiot02)',
                      }
                    : {
                        borderRadius: 'var(--sys-shape-blockRiot01)',
                      }
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 m-4 bg-surface-container rounded-placard flex-shrink-0 border border-outline-variant">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-tertiary-container text-on-tertiary-container font-black text-sm"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            N
          </div>
          <div className="flex-1">
            <p className="text-sm text-on-surface font-bold">Nishant</p>
            <p className="text-xs text-primary uppercase tracking-wider font-mono">PREMIUM USER</p>
          </div>
        </div>
        <Link
          to={`/settings${appendQuery}`}
          className="flex items-center justify-center mt-3 p-2 rounded-march hover:bg-surface-dim transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-on-surface-variant" />
        </Link>
      </div>
    </aside>
  );
}
