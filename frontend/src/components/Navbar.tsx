import React, { useState, useCallback, useMemo, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts';
import { Button } from './ui';
import SkipLink from './ui/SkipLink';
import toast from 'react-hot-toast';

// Memoized NavItem component
interface NavItemProps {
  to: string;
  label: string;
  icon: string;
  isPrimary?: boolean;
  onMobileMenuClose: () => void;
}

const NavItem = memo<NavItemProps>(
  ({ to, label, icon, isPrimary = false, onMobileMenuClose }) => (
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }) => `
              flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isPrimary
                  ? isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  : isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }
          `}
      onClick={onMobileMenuClose}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
);

NavItem.displayName = 'NavItem';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to log out');
    }
  }, [logout]);

  const navigationItems = useMemo(
    () => [
      { to: '/', label: 'Dashboard', icon: '📊' },
      { to: '/documents', label: 'Documents', icon: '📄' },
      { to: '/opportunities', label: 'Jobs', icon: '💼' },
      { to: '/ksc-generator', label: 'KSC Builder', icon: '🔧' },
      { to: '/analysis', label: 'AI Insights', icon: '🧠', isPrimary: true },
      { to: '/settings', label: 'Settings', icon: '⚙️' },
    ],
    []
  );

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <nav
        className="bg-gray-800 shadow-lg"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center space-x-2"
              aria-label="CareerCopilot home"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span
                  className="text-white font-bold text-lg"
                  aria-hidden="true"
                >
                  C
                </span>
              </div>
              <span className="text-white font-bold text-xl">
                CareerCopilot
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigationItems.map(item => (
                <NavItem
                  key={item.to}
                  {...item}
                  onMobileMenuClose={handleMobileMenuClose}
                />
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  {/* User Info */}
                  <div className="hidden sm:flex items-center space-x-3 text-gray-300">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {(user.displayName || user.email || 'U')
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm">
                      {user.displayName || user.email}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <Button variant="destructive" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div
              id="mobile-menu"
              className="md:hidden py-4 border-t border-gray-700"
            >
              <div className="flex flex-col space-y-2">
                {navigationItems.map(item => (
                  <NavItem
                    key={item.to}
                    {...item}
                    onMobileMenuClose={handleMobileMenuClose}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;