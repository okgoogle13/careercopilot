import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, BarChart3, Briefcase, ClipboardList, Sparkles, FolderOpen, Settings, User, LogOut } from 'lucide-react';

const mainNavItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/tracker', icon: ClipboardList, label: 'Applications' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/analysis', icon: BarChart3, label: 'Analysis' },
  { path: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { path: '/ksc-generator', icon: Sparkles, label: 'KSC Generator' },
  { path: '/asset-library', icon: FolderOpen, label: 'Asset Library' },
];

const userNavItems = [
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside 
      className="fixed left-0 top-0 h-screen w-[280px] bg-[#1D1B20] flex flex-col"
      style={{ 
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
        borderTopRightRadius: '28px',
        borderBottomRightRadius: '28px'
      }}
    >
      {/* Logo Area */}
      <div className="p-8 pb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#D0BCFF] to-[#A8C5A3] rounded-full flex items-center justify-center">
          <span className="text-2xl">🦄</span>
        </div>
        <h4 className="mt-4 text-[#D0BCFF] tier-hero text-xl">Career Copilot</h4>
        <p className="text-sm text-[#CAC4D0] mt-1 tier-data tracking-widest">Your AI Job Partner</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-4 px-6 py-4 mb-2 rounded-full transition-all tier-human
                ${isActive 
                  ? 'bg-[#A8C5A3] text-[#141218] font-medium' 
                  : 'text-[#CAC4D0] hover:bg-[#2B2930] hover:text-[#FFFFFF]'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile - Level 2 */}
      <div className="p-6 m-4 bg-[#25232A] rounded-[28px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#E07A5F] to-[#D0BCFF] rounded-full" />
          <div className="flex-1">
            <p className="text-sm text-[#E6E1E5] tier-human font-medium">Nishant</p>
            <p className="text-xs text-[#CAC4D0] tier-data">Premium User</p>
          </div>
        </div>
      </div>
    </aside>
  );
}