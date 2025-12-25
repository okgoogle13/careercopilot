import { Plus, FileText, Search, TrendingUp, Plug } from "lucide-react";
import { motion } from "motion/react";
import plantImage from "figma:asset/9ead2d553f2080ba9012797fe1b9bb7e1eba41e3.png";

export function Dashboard() {
  const profiles = [
    { name: "Senior Software Engineer", company: "TechCorp", score: 92, status: "Excellent" },
    { name: "UX Designer", company: "DesignHub", score: 85, status: "Good" },
    { name: "Product Manager", company: "StartupXYZ", score: 78, status: "Fair" },
  ];

  const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`;

  // Bio-Glass Motion Configuration
  const glassMotion = {
    whileHover: {
      y: -4,
      scale: 1.01,
      boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.6)", // Sharper, darker shadow on lift
    },
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25, // "Heavy" glass feel
      mass: 1,
    },
  };

  return (
    <div className="p-12 max-w-7xl">
      {/* Welcome Banner - HERO CARD with Gradient + Glass Effect */}
      <div
        className="rounded-[28px] p-12 mb-8 relative overflow-hidden"
        style={{
          minHeight: "400px",
          background:
            "linear-gradient(135deg, var(--surface-container-high) 0%, var(--surface-container) 100%)",
          boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Content Layer */}
        <div className="relative z-10">
          <h1 className="mb-3 text-[4.5rem] leading-[1.1] text-[var(--on-surface)] tier-display alive-text">
            GOOD MORNING, <span className="text-[#D0BCFF]">NISHANT</span>!
          </h1>
          <p className="text-[var(--on-surface)] text-xl max-w-lg tier-body">
            You have 3 upcoming interviews this week.
          </p>
        </div>

        {/* Plant Image Background with Seamless Blend */}
        <div className="absolute bottom-0 left-0 right-0 h-[65%] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${plantImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              backgroundRepeat: "no-repeat",
              mixBlendMode: "screen",
              opacity: 0.65,
              WebkitMaskImage:
                "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 5%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.85) 25%, black 40%)",
              maskImage:
                "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 5%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.85) 25%, black 40%)",
            }}
          />
        </div>
      </div>

      {/* Stats Grid - Level 2 Filled Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-[var(--surface-container)] rounded-[28px] p-8 flex flex-col items-center justify-center relative overflow-hidden"
          {...glassMotion}
          style={{
            backgroundImage: noiseOverlay,
            boxShadow:
              "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 0 rgba(0, 0, 0, 0.2), 0 4px 24px -1px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="relative z-10 flex flex-col items-center">
            <FileText className="w-12 h-12 text-[#D0BCFF] mb-4" />
            <p className="text-7xl mb-6 text-[var(--on-surface)] tier-data">8</p>
            <p className="text-[var(--on-surface-variant)] text-[0.75rem] tier-data">
              Active Applications
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-[var(--surface-container)] rounded-[28px] p-8 flex flex-col items-center justify-center relative overflow-hidden"
          {...glassMotion}
          style={{
            backgroundImage: noiseOverlay,
            boxShadow:
              "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 0 rgba(0, 0, 0, 0.2), 0 4px 24px -1px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="relative z-10 flex flex-col items-center">
            <svg
              className="w-12 h-12 text-[var(--primary-sage)] mb-4"
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
            <p className="text-7xl mb-6 text-[var(--on-surface)] tier-data">2</p>
            <p className="text-[var(--on-surface-variant)] text-[0.75rem] tier-data">
              Offers Received
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-[var(--surface-container)] rounded-[28px] p-8 flex flex-col items-center justify-center relative overflow-hidden"
          {...glassMotion}
          style={{
            backgroundImage: noiseOverlay,
            boxShadow:
              "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 0 rgba(0, 0, 0, 0.2), 0 4px 24px -1px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="relative z-10 flex flex-col items-center">
            <TrendingUp className="w-12 h-12 text-[var(--action-terracotta)] mb-4" />
            <p className="text-7xl mb-6 text-[var(--on-surface)] tier-data">45</p>
            <p className="text-[var(--on-surface-variant)] text-[0.75rem] tier-data">Connections</p>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions - Outlined Button */}
      <div className="flex gap-4 mb-8">
        <button className="bg-black/50 backdrop-blur-[10px] text-[var(--on-surface)] border border-white/5 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)] py-4 px-8 rounded-full hover:bg-black/60 transition-all flex items-center justify-center gap-3 w-fit alive-text tier-body-strong">
          <Plus className="w-5 h-5" />
          <span>Create New Document</span>
        </button>
        <button className="bg-black/50 backdrop-blur-[10px] text-[var(--on-surface)] border border-white/5 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)] py-4 px-8 rounded-full hover:bg-black/60 transition-all tier-body alive-text">
          View Analytics
        </button>

        {/* The Gummy Bear Connect Button - Sage Flavor */}
        <motion.button
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.85, rotate: -2 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 8,
            mass: 1.2,
          }}
          className="relative overflow-hidden rounded-full px-8 py-4 font-bold text-[#141218] tier-body-strong"
          style={{
            background: "linear-gradient(180deg, #8A9A5B 0%, #6D7E44 100%)", // Sage "Flavor"
            boxShadow: `
              inset 0px 6px 4px rgba(255, 255, 255, 0.4),  /* Top High-Gloss */
              inset 0px -6px 4px rgba(0, 0, 0, 0.2),       /* Bottom Depth */
              0px 8px 20px rgba(138, 154, 91, 0.5)         /* Glowy Drop Shadow */
            `,
          }}
        >
          {/* Specular Highlight (The "Wet" look) */}
          <div className="absolute top-2 left-4 right-4 h-3 bg-white/30 rounded-full blur-[1px]" />

          <span className="relative z-10 flex items-center gap-2">
            <Plug className="w-5 h-5" strokeWidth={3} />
            CONNECT
          </span>
        </motion.button>
      </div>

      {/* ATS Profiles Grid - Level 2 Cards */}
      <div className="mb-8">
        <h3 className="mb-6 text-3xl tier-display alive-text text-[var(--on-surface)]">
          YOUR APPLICATION <span className="text-[var(--primary-sage)]">PROFILES</span>
        </h3>
        <div className="grid grid-cols-3 gap-6">
          {profiles.map((profile, idx) => (
            <motion.div
              key={idx}
              className="bg-[var(--surface-container)] rounded-[28px] p-6 relative overflow-hidden"
              {...glassMotion}
              style={{
                backgroundImage: noiseOverlay,
                backgroundSize: "150px 150px",
                backgroundBlendMode: "overlay",
                backgroundPosition: "0 0",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 0 rgba(0, 0, 0, 0.2), 0 4px 24px -1px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="relative z-10">
                <div className="mb-4">
                  <p className="text-[var(--on-surface)] mb-1 tier-body">{profile.name}</p>
                  <p className="text-[var(--on-surface-variant)] text-[0.7rem] tier-data">
                    {profile.company}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl text-[var(--primary-sage)] tier-data">{profile.score}</p>
                    <p className="text-[var(--on-surface-variant)] text-[0.7rem] tier-data">
                      ATS Score
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm tier-data ${
                      profile.score >= 90
                        ? "bg-[#8A9A5B]/20 text-[#8A9A5B]"
                        : profile.score >= 80
                          ? "bg-[#E2725B]/20 text-[#E2725B]"
                          : "bg-[#E2725B]/20 text-[#E2725B]"
                    }`}
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
