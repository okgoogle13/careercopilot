import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Shield, Globe } from 'lucide-react';

export function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen text-gray-200 font-sans">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none blur-3xl" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm shadow-xl animate-fade-in-up">
                        <Sparkles className="w-4 h-4 text-[#D0BCFF]" />
                        <span className="text-sm font-medium text-[#E6E1E5]">AI-Powered Career Acceleration</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white pb-2 drop-shadow-sm">
                        Supercharge Your <br />
                        <span className="bg-gradient-to-r from-[#D0BCFF] to-[#8A9A5B] bg-clip-text text-transparent">Career Journey</span>
                    </h1>

                    <p className="text-xl text-[#CAC4D0] mb-10 max-w-2xl mx-auto leading-relaxed">
                        Resume optimization, cover letter generation, and application tracking.
                        All powered by advanced AI to land your dream job faster.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 rounded-[12px] bg-[#D0BCFF] text-[#141218] font-bold text-lg hover:bg-white transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-purple-500/20"
                        >
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 rounded-[12px] bg-white/5 text-white border border-white/10 font-medium text-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-black/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Everything you need to succeed</h2>
                        <p className="text-[#CAC4D0]">Powerful tools designed for the modern job seeker.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-[#E07A5F]" />}
                            title="Instant Optimization"
                            description="Tailor your resume to any job description in seconds using our AI engine. Stand out from the stack."
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-[#8A9A5B]" />}
                            title="Application Tracking"
                            description="Keep track of every application, interview, and offer in one secure place. Never miss a follow-up."
                        />
                        <FeatureCard
                            icon={<Globe className="w-8 h-8 text-[#D0BCFF]" />}
                            title="Market Insights"
                            description="Get real-time feedback on your skills and how they match market demands. Stay ahead of the curve."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-12 border-t border-white/5 bg-[#141218]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[#938F99]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D0BCFF] to-[#A8C5A3] flex items-center justify-center text-xs">🦄</div>
                        <span className="font-semibold text-white">CareerCopilot</span>
                    </div>
                    <p>© 2025 CareerCopilot. All rights reserved.</p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-[12px] bg-[var(--surface-container)] border border-white/5 hover:border-[#D0BCFF]/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="mb-6 p-4 rounded-2xl bg-[#1E1E1E] w-fit group-hover:scale-110 transition-transform duration-300 shadow-inner">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-[#CAC4D0] leading-relaxed">{description}</p>
        </div>
    );
}
