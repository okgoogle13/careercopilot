import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { PremiumSidebar } from '@/components/PremiumSidebar';
import texturePattern from '@/assets/texture-pattern.png';

export default function MainLayout() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#141218] relative font-sans text-white">
            {/* Texture Background Layer */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage: `url(${texturePattern})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: 'auto',
                    opacity: 0.30,
                    mixBlendMode: 'overlay',
                    zIndex: 0,
                }}
            />

            {/* Premium Sidebar (Responsive via Component) */}
            <PremiumSidebar
                isOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-y-auto w-full relative z-10 transition-all duration-300 min-w-0">

                {/* Mobile Top Bar */}
                <div className="md:hidden flex items-center justify-between p-4 sticky top-0 z-30 bg-[#141218]/80 backdrop-blur-md border-b border-white/5 shrink-0">
                    <h1 className="text-xl font-bold text-[#D0BCFF]" style={{ fontFamily: 'var(--font-hero)' }}>Career Copilot</h1>
                    <button onClick={() => setMobileSidebarOpen(true)} className="p-2 text-white">
                        <Menu />
                    </button>
                </div>

                {/* Page Content */}
                <main className="flex-1 w-full overflow-y-auto">
                    <div className="mx-auto w-full h-full flex flex-col gap-8" style={{ padding: 'clamp(1rem, 3vw, 2.5rem)', maxWidth: '1440px' }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
