import {
  BarChart3,
  Briefcase,
  ClipboardList,
  FileText,
  FolderOpen,
  Home,
  Inbox,
  Menu,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const mainNavItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/tracker', icon: ClipboardList, label: 'Applications' },
  { path: '/documents', icon: FileText, label: 'My Documents' },
  { path: '/analysis', icon: BarChart3, label: 'ATS Score & Optimise' },
  { path: '/opportunities', icon: Briefcase, label: 'Job Scout' },
  { path: '/cover-letter-generator', icon: Sparkles, label: 'Cover Letter Genius' },
  { path: '/ksc-generator', icon: Inbox, label: 'KSC Generator' },
  { path: '/asset-library', icon: FolderOpen, label: 'Asset Library' },
];

export function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Preserve query params (especially demo mode)
  const searchParams = new URLSearchParams(location.search);
  const queryString = searchParams.toString();
  const appendQuery = queryString ? `?${queryString}` : '';

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden bg-surface-container p-3 rounded-placard text-on-surface hover:bg-surface-container-high transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - M3 Expressive Design */}
      <aside
        className={`
          bg-surface-container-low flex flex-col z-40
          transition-all duration-300
          border-r border-outline-variant

          /* Mobile: Modal drawer */
          fixed inset-y-0 left-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          w-[240px]

          /* Desktop: Standard Drawer */
          lg:relative lg:translate-x-0 lg:w-[240px]
        `}
      >
        {/* Logo Area */}
        <div className="p-6 pb-8 flex flex-col items-start">
          <div className="w-14 h-14 rounded-sentry flex items-center justify-center bg-primary-container text-3xl transition-transform hover:scale-110 shadow-lg mb-4">
            🦄
          </div>
          <h4 className="text-primary text-xl font-black uppercase tracking-tight leading-none">
            CareerCopilot
          </h4>
          <p className="text-on-surface-variant mt-1 uppercase tracking-widest font-mono text-[10px]">
            YOUR AI JOB PARTNER
          </p>
        </div>

        {/* Navigation - Figma Spec: Sage Green Pill for Active */}
        <nav className="flex-1 px-4 overflow-y-auto">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={`${item.path}${appendQuery}`}
                onClick={() => setIsMobileMenuOpen(false)}
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
                        borderRadius: 'var(--sys-shape-corner-extra-large)',
                      }
                    : {
                        borderRadius: 'var(--sys-shape-corner-large)',
                      }
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 m-4 bg-surface-container rounded-placard flex-shrink-0 border border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sentry flex-shrink-0 bg-tertiary-container" />
            <div className="flex-1">
              <p className="text-sm text-on-surface font-bold">Nishant</p>
              <p className="text-xs text-primary uppercase tracking-wider font-mono">
                PREMIUM USER
              </p>
            </div>
          </div>
          <Link
            to={`/settings${appendQuery}`}
            className="flex items-center justify-center mt-3 p-2 rounded-sentry hover:bg-surface-dim transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-on-surface-variant" />
          </Link>
        </div>
      </aside>
    </>
  );
}
