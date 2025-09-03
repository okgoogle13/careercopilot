import { BarChart3, FileText, Plus, X, Target, Briefcase, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { CareerCopilotLogo } from './CareerCopilotLogo';
import { cn } from './ui/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({ isOpen, onClose, activeTab: _activeTab, onTabChange }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/' },
    { id: 'documents', label: 'Documents', icon: FileText, path: '/documents' },
    { id: 'applications', label: 'Applications', icon: Briefcase, path: '/applications' },
    { id: 'analysis', label: 'ATS Analysis', icon: Target, path: '/analysis' },
    { id: 'ai-services', label: 'AI Services', icon: Sparkles, path: '/ai-services' },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    navigate(item.path);
    onTabChange?.(item.id);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out transform',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'lg:relative lg:translate-x-0' // Ensure sidebar is always visible on desktop
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CareerCopilotLogo className="text-primary-foreground" size={20} />
            </div>
            <span className="font-bold text-sidebar-foreground">
              Career Copilot
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-12 text-left ${
                    location.pathname === item.path
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                  onClick={() => handleNavigation(item)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>
    </>
  );
}
