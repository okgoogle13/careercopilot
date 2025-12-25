import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  BarChart3,
  Briefcase,
  ClipboardList,
  Sparkles,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const mainNavItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/tracker', icon: ClipboardList, label: 'Applications' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/analysis', icon: BarChart3, label: 'Analysis' },
  { path: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { path: '/ksc-generator', icon: Sparkles, label: 'KSC Generator' },
];

export function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden bg-surface-container p-3 rounded-2xl text-on-surface hover:bg-surface-container-high transition-colors"
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

      {/* Sidebar - Responsive Flex Child */}
      <aside
        className={`
          bg-surface-container-low flex flex-col z-40
          transition-all duration-300 ease-spring
          rounded-tr-xl rounded-br-xl
          border-r border-outline-variant
          
          /* Mobile: Modal drawer */
          fixed inset-y-0 left-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          w-[280px]
          
          /* Tablet: Navigation Rail */
          md:relative md:translate-x-0 md:w-[80px]
          
          /* Desktop: Standard Drawer */
          lg:w-[280px]
        `}
      >
        {/* Logo Area */}
        <div className="p-8 pb-6 md:p-4 lg:p-8 md:pb-4 lg:pb-6 flex-shrink-0 flex md:flex-col lg:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-tertiary-container text-2xl transition-transform hover:scale-110 shadow-elevation-1">
            🦄
          </div>
          <div>
            <h4 className="text-primary text-xl md:hidden lg:block font-black uppercase tracking-tight leading-none">
              Career Copilot
            </h4>
            <p className="text-on-surface-variant mt-1 md:hidden lg:block uppercase tracking-widest font-mono text-[10px]">
              AI Job Partner
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 md:px-2 lg:px-4 overflow-y-auto">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-4 px-6 py-4 mb-2 rounded-full transition-all duration-short-2 ease-spring font-bold
                  md:justify-center lg:justify-start
                  md:px-4 lg:px-6
                  ${isActive
                    ? 'bg-primary-container text-on-primary-container shadow-elevation-1 translate-x-1'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:translate-x-1'
                  }
                `}
                title={item.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="md:hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-6 m-4 bg-surface-container rounded-xl md:p-3 md:m-2 lg:p-6 lg:m-4 flex-shrink-0 border border-outline-variant">
          <div className="flex items-center gap-3 md:flex-col lg:flex-row">
            <div className="w-10 h-10 rounded-full flex-shrink-0 bg-secondary-container" />
            <div className="flex-1 md:hidden lg:block">
              <p className="text-sm text-on-surface font-bold">Nishant</p>
              <p className="text-xs text-secondary uppercase tracking-wider font-mono">
                Premium
              </p>
            </div>
          </div>
          <Link
            to="/settings"
            className="flex items-center justify-center mt-2 p-2 rounded-full hover:bg-surface-dim md:hidden lg:flex transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-on-surface-variant" />
          </Link>
        </div>
      </aside>
    </>
  );
}
