import { Plus, FileText, TrendingUp, Plug } from "lucide-react";
import { motion } from "motion/react";
import plantImage from "../assets/images/plant-banner.png";
import { StatCard } from "./shared/StatCard";

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
  { name: "Senior Software Engineer", company: "TechCorp", score: 92, status: "Excellent" },
  { name: "UX Designer", company: "DesignHub", score: 85, status: "Good" },
  { name: "Product Manager", company: "StartupXYZ", score: 78, status: "Fair" },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function Dashboard() {
  const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`;

  return (
    <div className="p-6 md:p-12 max-w-7xl">
      {/* Welcome Banner - Hero Card */}
      <div className="rounded-[28px] p-8 md:p-12 mb-8 relative overflow-hidden min-h-[300px] md:min-h-[400px] bg-gradient-to-br from-[var(--surface-container-high)] to-[var(--surface-container)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
        {/* Content Layer */}
        <div className="relative z-10">
          <h1 className="mb-3 text-[2.5rem] md:text-[4.5rem] leading-[1.1] text-[var(--on-surface)] uppercase font-[800] tracking-tight">
            GOOD MORNING, <span className="text-[#D0BCFF]">NISHANT</span>!
          </h1>
          <p className="text-[var(--on-surface)] text-lg md:text-xl max-w-lg">
            You have 3 upcoming interviews this week.
          </p>
        </div>

        {/* Plant Image Background with Seamless Blend */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[65%] pointer-events-none opacity-65 mix-blend-screen"
          style={{
            backgroundImage: `url(${plantImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 5%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.85) 25%, black 40%)",
            maskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 5%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.85) 25%, black 40%)",
          }}
        />
      </div>

      {/* Stats Grid - Using StatCard Component */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={FileText}
          value="8"
          label="Active Applications"
          iconColor="text-[#D0BCFF]"
        />

        <StatCard
          icon={() => (
            <svg
              className="w-12 h-12 text-[var(--primary-sage)]"
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
          iconColor="text-[var(--primary-sage)]"
        />

        <StatCard
          icon={TrendingUp}
          value="45"
          label="Connections"
          iconColor="text-[var(--action-terracotta)]"
        />
      </div>

      {/* Quick Actions - M3 Flat Buttons */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {/* Glass Button */}
        <button className="bg-black/50 backdrop-blur-[10px] text-[var(--on-surface)] border border-white/5 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)] py-4 px-6 md:px-8 rounded-full hover:bg-black/60 transition-all flex items-center justify-center gap-3 w-fit font-medium uppercase tracking-wider">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Create New Document</span>
          <span className="sm:hidden">New Doc</span>
        </button>

        {/* Glass Button */}
        <button className="bg-black/50 backdrop-blur-[10px] text-[var(--on-surface)] border border-white/5 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)] py-4 px-6 md:px-8 rounded-full hover:bg-black/60 transition-all uppercase tracking-wider font-medium">
          View Analytics
        </button>

        {/* Material 3 Filled Tonal Button - FLAT */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
          className="bg-[var(--surface-container-high)] text-[var(--primary-sage)] py-4 px-6 md:px-8 rounded-full hover:bg-[var(--surface-bright)] transition-colors font-semibold uppercase tracking-wider flex items-center gap-3"
        >
          <Plug className="w-5 h-5" />
          <span>CONNECT</span>
        </motion.button>
      </div>

      {/* ATS Profiles Grid */}
      <div className="mb-8">
        <h3 className="mb-6 text-2xl md:text-3xl uppercase font-[800] tracking-tight text-[var(--on-surface)]">
          YOUR APPLICATION <span className="text-[var(--primary-sage)]">PROFILES</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROFILES.map((profile, idx) => (
            <motion.div
              key={idx}
              whileHover={{
                y: -4,
                scale: 1.01,
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.6)",
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                mass: 1,
              }}
              className="bg-[var(--surface-container)] rounded-[28px] p-6 relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-1px_0_0_rgba(0,0,0,0.2),0_4px_24px_-1px_rgba(0,0,0,0.2)]"
              style={{
                backgroundImage: noiseOverlay,
                backgroundSize: "150px 150px",
              }}
            >
              <div className="relative z-10">
                <div className="mb-4">
                  <p className="text-[var(--on-surface)] mb-1 font-medium">{profile.name}</p>
                  <p className="text-[var(--on-surface-variant)] uppercase text-xs tracking-wider font-mono">
                    {profile.company}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl text-[var(--primary-sage)] font-mono tabular-nums">
                      {profile.score}
                    </p>
                    <p className="text-[var(--on-surface-variant)] uppercase text-xs tracking-wider font-mono">
                      ATS Score
                    </p>
                  </div>
                  <div
                    className={`
                    px-4 py-2 rounded-full uppercase text-xs tracking-wider font-mono
                    ${
                      profile.score >= 90
                        ? "bg-[#8A9A5B]/20 text-[#8A9A5B]"
                        : profile.score >= 80
                          ? "bg-[#E2725B]/20 text-[#E2725B]"
                          : "bg-[#E2725B]/20 text-[#E2725B]"
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
      </div>
    </div>
  );
}
