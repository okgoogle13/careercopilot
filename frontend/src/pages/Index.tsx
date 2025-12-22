import React from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Search, TrendingUp, Plug } from 'lucide-react';
import plantImage from '@/assets/dashboard-plant.png';

export default function Dashboard() {
    const profiles = [
        { name: 'Senior Software Engineer', company: 'TechCorp', score: 92, status: 'Excellent' },
        { name: 'UX Designer', company: 'DesignHub', score: 85, status: 'Good' },
        { name: 'Product Manager', company: 'StartupXYZ', score: 78, status: 'Fair' },
    ];

    const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`;

    const glassMotion = {
        whileHover: {
            y: -4,
            scale: 1.01,
            boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.6)"
        },
        transition: { type: "spring", stiffness: 200, damping: 25, mass: 1 }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-full">
            {/* 1. Welcome Banner - HERO */}
            <div
                className="rounded-[28px] p-8 md:p-12 relative overflow-hidden flex flex-col justify-end w-full aspect-[4/3] md:aspect-[2/1] lg:aspect-[2.4/1] min-h-[20rem]"
                style={{
                    background: 'linear-gradient(135deg, #2B2930 0%, #211F26 100%)',
                    boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
                }}
            >
                <div className="relative z-10 mt-auto">
                    <h1 className="mb-2 text-5xl md:text-7xl lg:text-8xl leading-tight text-white font-black tracking-tight w-full break-words" style={{ fontFamily: 'var(--font-hero, sans-serif)' }}>
                        GOOD MORNING, <span className="text-[#D0BCFF] block md:inline">NISHANT</span>!
                    </h1>
                    <p className="text-white text-lg md:text-xl opacity-90 max-w-2xl">You have 3 upcoming interviews this week.</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[80%] pointer-events-none">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${plantImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center bottom',
                            backgroundRepeat: 'no-repeat',
                            mixBlendMode: 'screen',
                            opacity: 0.85,
                            maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
                        }}
                    />
                </div>
            </div>

            {/* 2. Stats Grid - Adjusted Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {/* Active Apps - Takes 2 cols */}
                <motion.div
                    className="md:col-span-2 bg-[#211F26] rounded-[28px] p-6 md:p-8 flex flex-row items-center justify-between relative overflow-hidden min-h-[10rem] md:min-h-[12rem]"
                    {...glassMotion}
                    style={{ backgroundImage: noiseOverlay, boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' }}
                >
                    <div className="relative z-10">
                        <p className="text-6xl md:text-7xl text-white font-mono font-medium leading-none">8</p>
                        <p className="text-[#CAC4D0] text-xs uppercase tracking-wider font-bold mt-2">Active Applications</p>
                    </div>
                    <FileText className="w-12 h-12 md:w-16 md:h-16 text-[#D0BCFF] opacity-80 shrink-0" />
                </motion.div>

                {/* Offers - Compact */}
                <motion.div
                    className="bg-[#211F26] rounded-[28px] p-5 flex flex-col items-center justify-center relative overflow-hidden min-h-[9rem] md:min-h-[10rem]"
                    {...glassMotion}
                    style={{ backgroundImage: noiseOverlay, boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' }}
                >
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-[#8A9A5B] mb-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    <p className="text-2xl md:text-3xl text-white font-mono font-medium mb-1">2</p>
                    <p className="text-[#CAC4D0] text-[0.65rem] uppercase tracking-wider font-bold text-center">Offers Received</p>
                </motion.div>

                {/* Connections - Compact */}
                <motion.div
                    className="bg-[#211F26] rounded-[28px] p-5 flex flex-col items-center justify-center relative overflow-hidden min-h-[9rem] md:min-h-[10rem]"
                    {...glassMotion}
                    style={{ backgroundImage: noiseOverlay, boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' }}
                >
                    <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-[#E2725B] mb-2 shrink-0" />
                    <p className="text-2xl md:text-3xl text-white font-mono font-medium mb-1">45</p>
                    <p className="text-[#CAC4D0] text-[0.65rem] uppercase tracking-wider font-bold text-center">Connections</p>
                </motion.div>
            </div>

            {/* 3. Global Actions Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none bg-[#383838] hover:bg-[#444] text-[#E3E3E3] h-12 px-6 rounded-full transition-colors flex items-center justify-center gap-2 font-semibold text-sm tracking-tight w-full sm:w-auto">
                        <Plus className="w-4 h-4 shrink-0" />
                        <span>Create Document</span>
                    </button>
                    <button className="flex-1 md:flex-none bg-[#383838] hover:bg-[#444] text-[#E3E3E3] h-12 px-6 rounded-full transition-colors font-medium text-sm w-full sm:w-auto">
                        Analytics
                    </button>
                </div>

                <div className="w-full md:w-auto">
                    <button
                        className="w-full md:w-auto bg-[#8A9A5B] hover:bg-[#9AB367] text-[#141218] h-12 px-8 rounded-full transition-colors flex items-center justify-center gap-2 font-bold shadow-lg shadow-[#8A9A5B]/10"
                    >
                        <Plug className="w-4 h-4 shrink-0" strokeWidth={3} />
                        <span>CONNECT</span>
                    </button>
                </div>
            </div>

            {/* 4. Profiles Section */}
            <div className="w-full">
                <h3 className="mb-6 text-xl md:text-2xl font-bold text-white tracking-tight uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8A9A5B]"></span>
                    Application Profiles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {profiles.map((profile, idx) => (
                        <div
                            key={idx}
                            className="group bg-[#211F26] hover:bg-[#2B2930] transition-colors rounded-[24px] p-6 border border-white/5 relative overflow-hidden h-full flex flex-col justify-between"
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{
                                    background: 'radial-gradient(circle at center, rgba(138, 154, 91, 0.15), transparent 70%)'
                                }}
                            />

                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="min-w-0">
                                        <h4 className="text-white font-semibold text-lg leading-tight mb-1 truncate">{profile.name}</h4>
                                        <p className="text-[#CAC4D0] text-xs font-bold tracking-wider uppercase opacity-70 truncate">{profile.company}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${profile.score >= 90 ? 'bg-[#8A9A5B]/20 text-[#8A9A5B]' : 'bg-[#E2725B]/20 text-[#E2725B]'
                                        }`}>
                                        {profile.status}
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 w-full my-1" />

                                <div className="flex items-end justify-between">
                                    <p className="text-[#CAC4D0] text-xs">Relevance Score</p>
                                    <p className="text-2xl text-white font-mono font-bold">{profile.score}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
