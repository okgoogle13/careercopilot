import { Briefcase, Calendar, MapPin, Mail, Link as LinkIcon, Edit3 } from 'lucide-react';

export function ProfileView() {
    return (
        <div className="max-w-5xl mx-auto pb-12 w-full">
            {/* Banner */}
            <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-r from-[#21005D] to-[#381E72] overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 bg-[url('/texture-pattern.png')] opacity-30 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141218] via-transparent to-transparent opacity-60" />
            </div>

            <div className="px-4 md:px-8 relative -mt-16 md:-mt-24 z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#141218] bg-gradient-to-br from-[#E07A5F] to-[#D0BCFF] shadow-2xl flex items-center justify-center text-4xl transform transition-transform hover:scale-105 cursor-pointer">
                        🧑‍💻
                    </div>
                    <div className="flex-1 pb-2 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#E6E1E5] mb-2 tracking-tight">Nishant J.</h1>
                        <p className="text-lg text-[#D0BCFF] font-medium tracking-wide">Senior Full Stack Engineer</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-[#CAC4D0] text-sm">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#8A9A5B]" /> San Francisco, CA</span>
                            <span className="flex items-center gap-1"><Mail className="w-4 h-4 text-[#8A9A5B]" /> nishant@example.com</span>
                            <span className="flex items-center gap-1"><LinkIcon className="w-4 h-4 text-[#8A9A5B]" /> github.com/nishant</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-[#D0BCFF] text-[#381E72] px-6 py-2.5 rounded-full font-bold hover:bg-[#E8DEF8] transition-all shadow-md active:scale-95">
                        <Edit3 className="w-4 h-4" /> Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column - Timeline */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-[var(--surface-container)] rounded-3xl p-8 border border-white/5 shadow-sm">
                            <h2 className="text-xl font-bold text-[#E6E1E5] mb-6 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#8A9A5B]" /> Experience
                            </h2>

                            <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#49454F]">
                                <TimelineItem
                                    role="Senior Frontend Engineer"
                                    company="Tech Corp Inc."
                                    date="2022 - Present"
                                    description="Leading the frontend architecture migration to React 18 and Next.js. Improved performance by 40%."
                                />
                                <TimelineItem
                                    role="Software Developer"
                                    company="StartUp Studio"
                                    date="2020 - 2022"
                                    description="Built and shipped 3 major products. Managed a team of 4 junior developers."
                                />
                                <TimelineItem
                                    role="Junior Developer"
                                    company="Web Solutions"
                                    date="2018 - 2020"
                                    description="Full stack development using MERN stack. Implemented CI/CD pipelines."
                                />
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Column - Skills & Badges */}
                    <div className="space-y-6">
                        <div className="bg-[var(--surface-container)] rounded-3xl p-6 border border-white/5 shadow-sm">
                            <h3 className="text-lg font-bold text-[#E6E1E5] mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {['React', 'TypeScript', 'Node.js', 'Tailwind', 'GraphQL', 'AWS', 'Python', 'Figma', 'PostgreSQL'].map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-[#1E1E1E] rounded-lg text-sm text-[#D0BCFF] font-mono border border-white/5 hover:border-[#D0BCFF]/50 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[var(--surface-container)] rounded-3xl p-6 border border-white/5 shadow-sm">
                            <h3 className="text-lg font-bold text-[#E6E1E5] mb-4">Badges</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <Badge title="Early Adopter" emoji="🚀" bg="from-amber-500/20 to-orange-500/20" border="border-amber-500/30" />
                                <Badge title="Code Ninja" emoji="💻" bg="from-blue-500/20 to-indigo-500/20" border="border-blue-500/30" />
                                <Badge title="Bug Hunter" emoji="🐛" bg="from-emerald-500/20 to-green-500/20" border="border-emerald-500/30" />
                                <Badge title="Mentor" emoji="🎓" bg="from-purple-500/20 to-pink-500/20" border="border-purple-500/30" />
                                <Badge title="Writer" emoji="✍️" bg="from-rose-500/20 to-red-500/20" border="border-rose-500/30" />
                                <Badge title="Team Player" emoji="🤝" bg="from-cyan-500/20 to-teal-500/20" border="border-cyan-500/30" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ role, company, date, description }: { role: string, company: string, date: string, description: string }) {
    return (
        <div className="pl-8 relative group">
            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#141218] border-2 border-[#8A9A5B] group-hover:bg-[#8A9A5B] transition-colors" />
            <h3 className="text-lg font-bold text-[#E6E1E5]">{role}</h3>
            <div className="flex items-center gap-2 text-sm text-[#CAC4D0] mb-2">
                <span className="font-semibold">{company}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {date}</span>
            </div>
            <p className="text-[#CAC4D0] leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
}

function Badge({ title, emoji, bg, border }: { title: string, emoji: string, bg: string, border: string }) {
    return (
        <div
            className={`aspect-square rounded-2xl bg-gradient-to-br ${bg} border ${border} flex items-center justify-center text-3xl hover:scale-110 transition-transform cursor-help`}
            title={title}
        >
            {emoji}
        </div>
    );
}
