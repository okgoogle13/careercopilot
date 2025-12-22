import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, BarChart3, Briefcase, ClipboardList, Sparkles, FolderOpen, Settings, X, Menu } from 'lucide-react';
import { useEffect } from 'react';

const mainNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/tracker', icon: ClipboardList, label: 'Applications' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/analysis', icon: BarChart3, label: 'Analysis' },
    { path: '/opportunities', icon: Briefcase, label: 'Opportunities' },
    { path: '/ksc-generator', icon: Sparkles, label: 'KSC Generator' },
    { path: '/asset-library', icon: FolderOpen, label: 'Asset Library' },
];

interface PremiumSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function PremiumSidebar({ isOpen = false, onClose }: PremiumSidebarProps) {
    const location = useLocation();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        if (onClose) {
            onClose();
        }
    }, [location.pathname]);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    /* BASE: Fixed-Fluid Behavior */
                    fixed top-0 bottom-0 left-0 z-50
                    bg-[#1D1B20] flex flex-col transition-all duration-300
                    border-r border-white/5 shadow-2xl
                    shrink-0
                    
                    /* MOBILE: Modal Drawer (Off-canvas by default) */
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    
                    /* DESKTOP: Static Sidebar (Side-by-side) */
                    md:static md:translate-x-0 md:h-full md:z-0
                    
                    /* WIDTH: Fixed 280px */
                    w-[280px] md:w-[280px] lg:w-[280px]
                    
                    /* BORDERS: Clean up rounding */
                    rounded-r-[28px] md:rounded-r-none
                `}
            >
                {/* Mobile Close Button */}
                <div className="absolute top-4 right-4 md:hidden">
                    <button onClick={onClose} className="p-2 text-white/60 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Logo Area */}
                <div className="p-6 flex flex-col items-center lg:items-start lg:p-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D0BCFF] to-[#A8C5A3] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-2xl">🦄</span>
                    </div>
                    {/* Text hidden on tablet, visible on desktop/mobile-drawer */}
                    <div className="mt-4 text-center lg:text-left md:hidden lg:block">
                        <h4 className="text-[#D0BCFF] tier-hero text-xl font-bold whitespace-nowrap">Career Copilot</h4>
                        <p className="text-sm text-[#CAC4D0] mt-1 tier-data tracking-widest uppercase text-[0.65rem]">Your AI Job Partner</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 lg:px-4 overflow-y-auto overflow-x-hidden flex flex-col gap-4 py-4">
                    {mainNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    group flex items-center gap-4 px-0 py-3 rounded-full transition-all relative
                                    justify-center lg:justify-start lg:px-6
                                    ${isActive
                                        ? 'bg-[#A8C5A3] text-[#141218]'
                                        : 'text-[#CAC4D0] hover:bg-[#2B2930] hover:text-[#FFFFFF]'
                                    }
                                `}
                                title={item.label}
                            >
                                <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-[#141218]' : ''}`} />
                                <span className="font-medium whitespace-nowrap md:hidden lg:block tier-human text-sm">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 mx-2 mb-6 bg-[#25232A] rounded-[28px] md:mx-1 lg:mx-4 border border-white/5">
                    <div className="flex items-center gap-4 justify-center lg:justify-start">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#E07A5F] to-[#D0BCFF] rounded-full shrink-0 shadow-lg" />
                        <div className="hidden lg:flex flex-col min-w-0">
                            <p className="text-sm text-[#E6E1E5] tier-human font-bold leading-tight">Nishant</p>
                            <p className="text-[0.65rem] text-[#A8C5A3] tier-data uppercase tracking-widest mt-0.5">Premium User</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
