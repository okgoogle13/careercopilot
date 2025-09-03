import React, { useState, useCallback, useMemo, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts';
import { Button, ThemeToggle } from './ui';
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
              flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium 
              transition-all duration-200 group hover-lift animate-fade-in
              ${
                isPrimary
                  ? isActive
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'bg-primary/90 hover:bg-primary text-primary-foreground hover:shadow-glow'
                  : isActive
                    ? 'bg-card text-card-foreground shadow-md border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }
          `}
      onClick={onMobileMenuClose}
    >
      <span className="text-lg group-hover:scale-110 transition-transform duration-200">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </NavLink>
  )
);

NavItem.displayName = 'NavItem';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick: _onMenuClick }) => {
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
        className="bg-card/80 backdrop-blur-md shadow-lg border-b border-border sticky top-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center space-x-3 group hover-lift"
              aria-label="CareerCopilot home"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-glow">
                <span
                  className="text-white font-bold text-xl"
                  aria-hidden="true"
                >
                  C
                </span>
              </div>
              <span className="gradient-text font-bold text-2xl tracking-tight">
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
              {/* Theme Toggle */}
              <ThemeToggle />

              {user && (
                <>
                  {/* User Info */}
                  <div className="hidden sm:flex items-center space-x-3 text-muted-foreground">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-md hover-lift">
                      <span className="text-sm font-semibold text-foreground">
                        {(user.displayName || user.email || 'U')
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {user.displayName || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="hover-lift animate-fade-in"
                  >
                    <span className="mr-2">👋</span>
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
