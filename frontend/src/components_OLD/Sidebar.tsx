import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, BarChart3, Briefcase, ClipboardList, Sparkles, FolderOpen, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

const mainNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/tracker', icon: ClipboardList, label: 'Applications' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/analysis', icon: BarChart3, label: 'Analysis' },
    { path: '/opportunities', icon: Briefcase, label: 'Opportunities' },
    { path: '/ksc-generator', icon: Sparkles, label: 'KSC Generator' },
    { path: '/asset-library', icon: FolderOpen, label: 'Asset Library' },
];

export function Sidebar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden bg-card p-2 rounded-md border border-border"
            >
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            <aside className={`
        fixed left-0 top-0 h-screen bg-muted border-r border-border z-40 w-[280px]
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        flex flex-col
      `}>
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-xl">🦄</div>
                        <h1 className="font-bold text-xl tracking-tight">Career Copilot</h1>
                    </div>

                    <nav className="space-y-2">
                        {mainNavItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:bg-card hover:text-foreground'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-border">
                    <Link to="/settings" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
