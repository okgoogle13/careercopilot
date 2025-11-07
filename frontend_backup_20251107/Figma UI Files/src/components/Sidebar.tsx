import { BarChart3, FileText, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { CareerCopilotLogo } from './CareerCopilotLogo';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'ats-analysis', label: 'ATS Analysis', icon: FileText },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-full flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <CareerCopilotLogo className="text-primary-foreground" size={20} />
          </div>
          <span className="font-bold text-sidebar-foreground">FML Career Copilot</span>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 text-left ${
                  activeTab === item.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
                onClick={() => onTabChange(item.id)}
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
  );
}
