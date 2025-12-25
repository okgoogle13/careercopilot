import { Plus, FileText, TrendingUp, Plug } from 'lucide-react';
import { motion } from 'framer-motion';
import plantImage from '../../assets/images/plant-banner.png';
import { StatCard } from '../../components/shared/StatCard';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Profile {
  name: string;
  company: string;
  score: number;
  status: string;
}

// ============================================================================
// MOCK DATA - Replace with API calls
// ============================================================================

const PROFILES: Profile[] = [
  { name: 'Senior Software Engineer', company: 'TechCorp', score: 92, status: 'Excellent' },
  { name: 'UX Designer', company: 'DesignHub', score: 85, status: 'Good' },
  { name: 'Product Manager', company: 'StartupXYZ', score: 78, status: 'Fair' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function Dashboard() {
  const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`;

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
        damping: 30, // Slightly more damped for UI controls
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
      {/* Welcome Banner - Hero Card */}
      <motion.div
        variants={item}
        // Using "The Gem" archetype for the Hero section to command attention
        className="rounded-gem p-8 md:p-12 mb-8 relative overflow-hidden min-h-[300px] md:min-h-[400px] bg-atmospheric-vibrant shadow-elevation-1"
      >
        {/* Content Layer */}
        <div className="relative z-10">
          <h1 className="mb-3 text-display-large leading-tight text-on-surface uppercase font-black tracking-tighter">
            GOOD MORNING, <span className="text-secondary">NISHANT</span>!
          </h1>
          <p className="text-on-surface text-body-large max-w-lg font-medium">
            You have 3 upcoming interviews this week.
          </p>
        </div>

        {/* Plant Image Background with Seamless Blend */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[65%] pointer-events-none opacity-65 mix-blend-screen"
          style={{
            backgroundImage: `url(${plantImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            WebkitMaskImage:
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 5%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.85) 25%, black 40%)',
            maskImage:
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 5%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.85) 25%, black 40%)',
          }}
        />
      </motion.div>

      {/* Stats Grid - Using StatCard Component */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={FileText}
          value="8"
          label="Active Applications"
          iconColor="text-tertiary"
        />

        <StatCard
          icon={() => (
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          )}
          value="2"
          label="Offers Received"
          iconColor="text-primary"
        />

        <StatCard
          icon={TrendingUp}
          value="45"
          label="Connections"
          iconColor="text-secondary"
        />
      </motion.div>

      {/* Quick Actions - Expressive Buttons (Pebble Shape) */}
      <motion.div variants={item} className="flex gap-4 mb-8 flex-wrap">
        {/* Glass Button */}
        <button className="bg-surface-container-high/50 backdrop-blur-md text-on-surface border border-outline-variant shadow-elevation-1 py-4 px-6 md:px-8 rounded-pebble hover:bg-surface-bright transition-all duration-short-2 ease-spring flex items-center justify-center gap-3 w-fit font-bold uppercase tracking-wider hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Create New Document</span>
          <span className="sm:hidden">New Doc</span>
        </button>

        {/* Glass Button */}
        <button className="bg-surface-container-high/50 backdrop-blur-md text-on-surface border border-outline-variant shadow-elevation-1 py-4 px-6 md:px-8 rounded-pebble hover:bg-surface-bright transition-all duration-short-2 ease-spring uppercase tracking-wider font-bold hover:scale-105 active:scale-95">
          View Analytics
        </button>

        {/* Material 3 Filled Tonal Button - FLAT */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
          }}
          className="bg-primary-container text-on-primary-container py-4 px-6 md:px-8 rounded-pebble hover:bg-primary hover:text-on-primary transition-colors font-bold uppercase tracking-wider flex items-center gap-3 shadow-elevation-2"
        >
          <Plug className="w-5 h-5" />
          <span>CONNECT</span>
        </motion.button>
      </motion.div>

      {/* ATS Profiles Grid */}
      <motion.div variants={item} className="mb-8">
        <h3 className="mb-6 text-headline-large uppercase font-black tracking-tight text-on-surface">
          YOUR APPLICATION <span className="text-secondary">PROFILES</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROFILES.map((profile, idx) => (
            <motion.div
              key={idx}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: 'var(--sys-elevation-level3)',
              }}
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 20,
              }}
              // Using "The Leaf" archetype for content cards
              className="bg-surface-container rounded-leaf p-6 relative overflow-hidden shadow-elevation-1 border border-outline-variant"
              style={{
                backgroundImage: noiseOverlay,
                backgroundSize: '150px 150px',
              }}
            >
              <div className="relative z-10">
                <div className="mb-4">
                  <p className="text-on-surface mb-1 font-bold text-title-large">{profile.name}</p>
                  <p className="text-on-surface-variant uppercase text-xs tracking-wider font-mono">
                    {profile.company}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-display-small text-primary font-mono tabular-nums">
                      {profile.score}
                    </p>
                    <p className="text-on-surface-variant uppercase text-xs tracking-wider font-mono">
                      ATS Score
                    </p>
                  </div>
                  <div
                    className={`
                    px-4 py-2 rounded-pebble uppercase text-xs tracking-wider font-mono font-bold
                    ${profile.score >= 90
                        ? 'bg-primary-container text-on-primary-container'
                        : profile.score >= 80
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-tertiary-container text-on-tertiary-container'
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
