import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  BarChart3,
  Briefcase,
  ClipboardList,
  Sparkles,
  FolderOpen,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const mainNavItems = [
  { path: "/dashboard", icon: Home, label: "Dashboard" },
  { path: "/tracker", icon: ClipboardList, label: "Applications" },
  { path: "/documents", icon: FileText, label: "Documents" },
  { path: "/analysis", icon: BarChart3, label: "Analysis" },
  { path: "/opportunities", icon: Briefcase, label: "Opportunities" },
  { path: "/ksc-generator", icon: Sparkles, label: "KSC Generator" },
  { path: "/asset-library", icon: FolderOpen, label: "Asset Library" },
];

const userNavItems = [{ path: "/settings", icon: Settings, label: "Settings" }];

export function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden bg-[var(--surface-container)] p-3 rounded-2xl text-[var(--on-surface)] hover:bg-[var(--surface-container-high)] transition-colors"
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
          bg-[var(--surface-container-low)] flex flex-col z-40
          transition-all duration-300 ease-in-out
          rounded-tr-[28px] rounded-br-[28px]
          
          /* Mobile: Modal drawer */
          fixed inset-y-0 left-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          w-[280px]
          
          /* Tablet: Navigation Rail */
          md:relative md:translate-x-0 md:w-[72px]
          
          /* Desktop: Standard Drawer */
          lg:w-[280px]
        `}
      >
        {/* Logo Area */}
        <div className="p-8 pb-6 md:p-4 lg:p-8 md:pb-4 lg:pb-6 flex-shrink-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center md:mx-auto lg:mx-0 bg-gradient-to-br from-[#D0BCFF] to-[#A8C5A3] transition-transform hover:scale-110">
            <span className="text-2xl">🦄</span>
          </div>
          <h4 className="mt-4 text-[#D0BCFF] text-xl md:hidden lg:block font-[800] uppercase tracking-tight">
            Career Copilot
          </h4>
          <p className="text-sm text-[#CAC4D0] mt-1 md:hidden lg:block uppercase tracking-widest font-mono text-xs">
            Your AI Job Partner
          </p>
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
                  flex items-center gap-4 px-6 py-4 mb-2 rounded-full transition-all font-medium
                  md:justify-center lg:justify-start
                  md:px-4 lg:px-6
                  ${
                    isActive
                      ? "bg-[var(--primary-sage)] text-[#1A1714]"
                      : "text-[#CAC4D0] hover:bg-[var(--surface-container)] hover:text-[#FFFFFF]"
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
        <div className="p-6 m-4 bg-[var(--surface-container)] rounded-[28px] md:p-3 md:m-2 lg:p-6 lg:m-4 flex-shrink-0">
          <div className="flex items-center gap-3 md:flex-col lg:flex-row">
            <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-[#E07A5F] to-[#D0BCFF]" />
            <div className="flex-1 md:hidden lg:block">
              <p className="text-sm text-[#E6E1E5] font-medium">Nishant</p>
              <p className="text-xs text-[#CAC4D0] uppercase tracking-wider font-mono">
                Premium User
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
