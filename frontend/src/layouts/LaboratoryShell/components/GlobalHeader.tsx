import React from 'react';
import { useMode } from '../../../context/ModeContext';
import { NorthcoteButton } from '../../../components/ui/NorthcoteButton';

export const GlobalHeader: React.FC = () => {
    const { mode, toggleMode } = useMode();

    return (
        <header className="h-16 border-b border-surface-laboratory-slate-smoke-highest bg-surface-laboratory-slate-smoke-high flex items-center justify-between px-6 shadow-sm z-20 relative">
            <div className="flex items-center gap-4">
                {/* Branding */}
                <div className="flex flex-col">
                    <h1 className="font-proclamation text-xl text-wattle-gold tracking-tight">
                        Northcote Curio
                    </h1>
                    <span className="text-[10px] font-annotation uppercase tracking-widest text-secondary-flannel-dim opacity-70">
                        Field Station Alpha
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Mode Toggle */}
                <div className="flex items-center gap-2 bg-surface-laboratory-slate-smoke-highest p-1 rounded-lg">
                    <button
                        onClick={() => mode !== 'gallery' && toggleMode()}
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'gallery'
                                ? 'bg-surface-gallery-eucalypt-smoke-high text-wattle-gold shadow-sm'
                                : 'text-secondary-flannel-dim hover:text-on-surface-parchment'
                            }`}
                    >
                        Gallery
                    </button>
                    <button
                        onClick={() => mode !== 'laboratory' && toggleMode()}
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'laboratory'
                                ? 'bg-surface-laboratory-slate-smoke text-wattle-gold shadow-sm'
                                : 'text-secondary-flannel-dim hover:text-on-surface-parchment'
                            }`}
                    >
                        Laboratory
                    </button>
                </div>

                {/* User / Settings Actions */}
                <NorthcoteButton variant="tertiary" size="sm">
                    Settings
                </NorthcoteButton>
            </div>
        </header>
    );
};
