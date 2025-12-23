import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center text-center px-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-900/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-xl relative z-10">
                <div className="text-[12rem] md:text-[16rem] font-extrabold text-[#D0BCFF] opacity-[0.03] select-none blur-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] pointer-events-none">
                    404
                </div>

                <div className="relative mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-white/5 rounded-full ring-1 ring-white/10 animate-pulse">
                            <Compass className="w-16 h-16 text-[#D0BCFF]" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-[#E6E1E5] mb-4">Lost in Space?</h1>
                    <p className="text-lg text-[#CAC4D0] mb-10 leading-relaxed">
                        The page you are looking for has drifted into a black hole.<br className="hidden md:block" />
                        Don't worry, we can navigate you back to safety.
                    </p>

                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#D0BCFF] text-[#381E72] font-bold text-lg hover:bg-white transition-all transform hover:scale-105 shadow-lg shadow-purple-500/20"
                    >
                        <Home className="w-5 h-5" /> Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
