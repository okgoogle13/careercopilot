import { Settings } from "lucide-react";
import fiddleLeafFig from "figma:asset/fe39ce67fe58579f447dbeec328e88e602a47ae3.png";

export function Opportunities() {
  const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`;

  return (
    <div className="p-12 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-2 text-[4.5rem] leading-[1.1] text-[var(--on-surface)] tier-display alive-text">
          JOB <span className="text-[#D0BCFF] font-light">OPPORTUNITIES</span>
        </h2>
        <p className="text-[var(--on-surface-variant)] tier-body">
          Curated opportunities that match your profile
        </p>
      </div>

      {/* Filter Bar Pane */}
      <div
        className="mb-8 rounded-[28px] p-4 flex items-center gap-4 bg-[var(--surface-container)] relative overflow-hidden"
        style={{
          backgroundImage: noiseOverlay,
          boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        <span className="ml-4 text-[var(--on-surface-variant)] text-sm uppercase tracking-wider tier-data">
          Quick Filters:
        </span>
        <div className="flex flex-wrap gap-3">
          {["Remote Only", "Full-time", "Tech Industry", "Senior Level", "$100k+", "Equity"].map(
            (filter) => (
              <button
                key={filter}
                className="px-6 py-2 bg-[var(--surface-dim)] rounded-full text-[var(--on-surface)] hover:bg-[var(--surface-bright)] hover:text-[#D0BCFF] transition-all border border-transparent hover:border-[#D0BCFF]/30 text-sm tier-body"
              >
                {filter}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Empty State - Growth Garden - HERO CARD */}
      <div
        className="rounded-[28px] p-16 flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          minHeight: "600px",
          backgroundColor: "#2C2C2C",
          backgroundImage: noiseOverlay,
          boxShadow:
            "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 0 rgba(0, 0, 0, 0.2), 0 0 40px rgba(0,0,0,0.2)",
        }}
      >
        {/* Bio-Glass Frosted Edge Effect */}
        <div className="absolute inset-0 pointer-events-none rounded-[28px] ring-1 ring-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" />

        {/* Fiddle Leaf Fig Centerpiece - Growing out of container */}
        <div
          className="absolute inset-0 flex items-end justify-center pointer-events-none"
          style={{
            zIndex: 1,
          }}
        >
          <img
            src={fiddleLeafFig}
            alt=""
            className="w-auto h-[550px] object-cover translate-y-12"
            style={{
              mixBlendMode: "normal",
              opacity: 0.9,
              maskImage: "linear-gradient(to top, black 0%, black 80%, transparent 100%)",
            }}
          />
        </div>

        {/* Text Content - Floating above plant */}
        <div className="text-center mb-8 relative z-10 bg-black/20 backdrop-blur-sm p-8 rounded-3xl border border-white/5">
          <h3 className="text-[var(--on-surface)] mb-4 text-4xl tier-display uppercase tracking-tight">
            No opportunities yet
          </h3>
          <p className="text-[var(--on-surface-variant)] max-w-md mx-auto tier-body">
            We're searching for the perfect opportunities that match your skills and preferences.
            Adjust your search filters to help us find the best matches for you.
          </p>
        </div>

        {/* Action Button - Terracotta Pill */}
        <button className="px-8 py-3 rounded-full hover:bg-[#ff8f75] transition-all flex items-center gap-2 text-sm relative z-10 bg-[var(--action-terracotta)] text-[#121212] tier-body-strong shadow-lg shadow-[#E2725B]/20">
          <Settings className="w-4 h-4" />
          <span>Adjust Search Filters</span>
        </button>
      </div>
    </div>
  );
}
