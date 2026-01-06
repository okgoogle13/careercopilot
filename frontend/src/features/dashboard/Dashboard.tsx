import { Plus, FileText, Gift, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Profile {
  name: string;
  company: string;
  score: number;
  status: 'EXCELLENT' | 'GOOD' | 'FAIR';
}

// ============================================================================
// MOCK DATA
// ============================================================================

const PROFILES: Profile[] = [
  { name: 'Senior Software Engineer', company: 'TECHCORP', score: 92, status: 'EXCELLENT' },
  { name: 'UX Designer', company: 'DESIGNHUB', score: 85, status: 'GOOD' },
  { name: 'Product Manager', company: 'STARTUPXYZ', score: 78, status: 'FAIR' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function Dashboard() {
  // Dotted pattern for cards - Figma spec
  const dottedPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3C/svg%3E")`;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 md:p-12 max-w-7xl"
    >
      {/* Hero Banner - Figma Design with Plant Background */}
      <motion.div
        variants={item}
        className="rounded-[24px] p-8 md:p-12 mb-8 relative overflow-hidden min-h-[280px] bg-surface-container-high shadow-lg"
      >
        {/* Content Layer */}
        <div className="relative z-10">
          <h1 className="mb-3 text-[48px] md:text-[64px] leading-none text-on-surface uppercase font-black tracking-tight">
            GOOD MORNING, <span className="text-tertiary">NISHANT</span>!
          </h1>
          <p className="text-on-surface text-lg max-w-lg font-medium">
            You have 3 upcoming interviews this week.
          </p>
        </div>

        {/* Plant Background - Figma Spec */}
        <div
          className="absolute bottom-0 right-0 w-full h-[70%] opacity-40 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300'%3E%3Cellipse cx='100' cy='280' rx='60' ry='100' fill='%2385AA73' opacity='0.6'/%3E%3Cellipse cx='250' cy='270' rx='70' ry='110' fill='%236B8F5A' opacity='0.7'/%3E%3Cellipse cx='400' cy='265' rx='65' ry='105' fill='%2385AA73' opacity='0.65'/%3E%3Cellipse cx='550' cy='275' rx='55' ry='95' fill='%236B8F5A' opacity='0.6'/%3E%3Cellipse cx='700' cy='280' rx='60' ry='100' fill='%2385AA73' opacity='0.65'/%3E%3Cpath d='M100,280 Q100,200 120,150' stroke='%23527542' stroke-width='3' fill='none' opacity='0.5'/%3E%3Cpath d='M250,270 Q260,190 280,140' stroke='%233D5C2A' stroke-width='3' fill='none' opacity='0.5'/%3E%3Cpath d='M400,265 Q410,185 430,135' stroke='%23527542' stroke-width='3' fill='none' opacity='0.5'/%3E%3Cellipse cx='130' cy='160' rx='35' ry='50' fill='%2385AA73' opacity='0.4'/%3E%3Cellipse cx='290' cy='150' rx='40' ry='55' fill='%236B8F5A' opacity='0.45'/%3E%3Cellipse cx='440' cy='145' rx='38' ry='52' fill='%2385AA73' opacity='0.42'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </motion.div>

      {/* Stats Grid - Figma Dotted Pattern */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Active Applications */}
        <div
          className="bg-surface-container rounded-[24px] p-6 relative overflow-hidden shadow-md border border-outline-variant"
          style={{ backgroundImage: dottedPattern }}
        >
          <div className="relative z-10">
            <FileText className="w-12 h-12 text-tertiary mb-4" />
            <p className="text-[64px] font-black text-on-surface tabular-nums leading-none mb-2">8</p>
            <p className="text-on-surface-variant uppercase text-xs tracking-widest font-mono">
              ACTIVE APPLICATIONS
            </p>
          </div>
        </div>

        {/* Offers Received */}
        <div
          className="bg-surface-container rounded-[24px] p-6 relative overflow-hidden shadow-md border border-outline-variant"
          style={{ backgroundImage: dottedPattern }}
        >
          <div className="relative z-10">
            <Gift className="w-12 h-12 text-warning mb-4" />
            <p className="text-[64px] font-black text-on-surface tabular-nums leading-none mb-2">2</p>
            <p className="text-on-surface-variant uppercase text-xs tracking-widest font-mono">
              OFFERS RECEIVED
            </p>
          </div>
        </div>

        {/* Connections */}
        <div
          className="bg-surface-container rounded-[24px] p-6 relative overflow-hidden shadow-md border border-outline-variant"
          style={{ backgroundImage: dottedPattern }}
        >
          <div className="relative z-10">
            <TrendingUp className="w-12 h-12 text-secondary mb-4" />
            <p className="text-[64px] font-black text-on-surface tabular-nums leading-none mb-2">45</p>
            <p className="text-on-surface-variant uppercase text-xs tracking-widest font-mono">
              CONNECTIONS
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions - Figma Spec: Coral "Create" + Black "View" + Sage "Connect" */}
      <motion.div variants={item} className="flex gap-4 mb-12 flex-wrap">
        {/* Create New Document - Secondary (Coral) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-secondary-container text-on-secondary-container py-4 px-8 rounded-full hover:bg-secondary transition-colors font-bold uppercase tracking-wide flex items-center gap-3 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Document</span>
        </motion.button>

        {/* View Analytics - Neutral */}
        <button className="bg-surface-container-high text-on-surface border border-outline-variant py-4 px-8 rounded-full hover:bg-surface-bright transition-colors uppercase tracking-wide font-bold shadow-md">
          View Analytics
        </button>

        {/* CONNECT - Primary (Sage Green) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-container text-on-primary-container py-4 px-8 rounded-full hover:bg-primary transition-colors font-bold uppercase tracking-wide shadow-lg"
        >
          🔌 CONNECT
        </motion.button>
      </motion.div>

      {/* Application Profiles - Figma Spec */}
      <motion.div variants={item} className="mb-8">
        <h3 className="mb-6 text-[32px] uppercase font-black tracking-tight text-on-surface">
          YOUR APPLICATION <span className="text-primary">PROFILES</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROFILES.map((profile, idx) => (
            <motion.div
              key={idx}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 20,
              }}
              className="bg-surface-container rounded-[24px] p-6 relative overflow-hidden shadow-md border border-outline-variant"
              style={{ backgroundImage: dottedPattern }}
            >
              <div className="relative z-10">
                <div className="mb-4">
                  <p className="text-on-surface mb-1 font-bold text-lg">{profile.name}</p>
                  <p className="text-on-surface-variant uppercase text-xs tracking-wider font-mono">
                    {profile.company}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[48px] text-primary font-black tabular-nums leading-none">
                      {profile.score}
                    </p>
                    <p className="text-on-surface-variant uppercase text-xs tracking-wider font-mono">
                      ATS SCORE
                    </p>
                  </div>
                  <div
                    className={`
                      px-4 py-2 rounded-full uppercase text-xs tracking-wider font-mono font-bold
                      ${profile.status === 'EXCELLENT'
                        ? 'bg-primary-container text-on-primary-container'
                        : profile.status === 'GOOD'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-error-container text-on-error-container'
                      }
                    `}
                  >
                    {profile.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
