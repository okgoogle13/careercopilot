import React from 'react';
import { KeralaRageButton } from '../../../components/ui/KeralaRageButton';

import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_SCHEMA } from '../../../config/navigation.schema';

export const NavRail: React.FC = () => {
    const location = useLocation();
    const navItems = NAVIGATION_SCHEMA.filter(item =>
        item.modeAvailability === 'KrDark' || item.modeAvailability === 'both'
    );

    return (
        <nav className="w-16 h-full border-r border-surface-KrDark-slate-smoke-highest bg-surface-KrDark-slate-smoke-high flex flex-col items-center py-4 gap-4 z-30 relative">
            {/* Tool Icons Placeholder */}
            <div className="flex flex-col gap-3 w-full px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname + location.search === item.route;
                    return (
                        <Link key={item.id} to={item.route} className="w-full">
                            <KeralaRageButton
                                variant={isActive ? "secondary" : "tertiary"}
                                size="sm"
                                className="w-full !px-0 flex justify-center text-xs"
                                title={item.label}
                            >
                                {item.label.substring(0, 2).toUpperCase()}
                            </KeralaRageButton>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto mb-4">
                <div className="w-8 h-8 rounded-full bg-surface-KrDark-slate-smoke-highest border border-surface-KrDark-slate-smoke-highest" />
            </div>
        </nav>
    );
};
