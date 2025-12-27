import { Settings } from 'lucide-react';
import fiddleLeafFig from '../../assets/images/fiddle-leaf-fig.jpg';
import { PageHeader } from '../../components/shared/PageHeader';

export function Opportunities() {
  const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`;

  return (
    <div className="p-6 md:p-12 max-w-7xl animate-in fade-in zoom-in-95 duration-500 ease-spring">
      {/* Header */}
      <PageHeader
        title="Job Opportunities"
        highlightedWord="Opportunities"
        description="Curated opportunities that match your profile"
      />

      {/* Filter Bar Pane */}
      <div
        className="mb-8 rounded-tech p-4 flex items-center gap-4 bg-surface-container relative overflow-hidden border border-outline-variant"
        style={{
          backgroundImage: noiseOverlay,
        }}
      >
        <span className="ml-4 text-on-surface-variant text-label-medium uppercase tracking-wider font-mono">
          Quick Filters:
        </span>
        <div className="flex flex-wrap gap-3">
          {['Remote Only', 'Full-time', 'Tech Industry', 'Senior Level', '$100k+', 'Equity'].map(
            (filter) => (
              <button
                key={filter}
                className="px-6 py-2 bg-surface-dim rounded-pebble text-on-surface hover:bg-surface-bright hover:text-primary transition-all duration-short-2 ease-spring border border-transparent hover:border-primary/30 text-body-medium font-medium"
              >
                {filter}
              </button>
            )
          )}
        </div>
      </div>

      {/* Empty State - Growth Garden - HERO CARD */}
      <div
        className="rounded-gem p-16 flex flex-col items-center justify-center relative overflow-hidden shadow-elevation-1"
        style={{
          minHeight: '600px',
          backgroundColor: '#2C2C2C', // Keeping dark neutral base for the "garden" feel but could map to surface-container-lowest
          backgroundImage: noiseOverlay,
        }}
      >
        {/* Bio-Glass Frosted Edge Effect */}
        <div className="absolute inset-0 pointer-events-none rounded-gem ring-1 ring-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" />

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
              mixBlendMode: 'normal',
              opacity: 0.9,
              maskImage: 'linear-gradient(to top, black 0%, black 80%, transparent 100%)',
            }}
          />
        </div>

        {/* Text Content - Floating above plant */}
        <div className="text-center mb-8 relative z-10 bg-surface-container-low/60 backdrop-blur-md p-8 rounded-leaf border border-outline-variant shadow-elevation-2 max-w-xl">
          <h3 className="text-on-surface mb-4 text-display-small font-black uppercase tracking-tight">
            No opportunities yet
          </h3>
          <p className="text-on-surface-variant text-body-large">
            We're searching for the perfect opportunities that match your skills and preferences.
            Adjust your search filters to help us find the best matches for you.
          </p>
        </div>

        {/* Action Button - Terracotta Pill */}
        <button className="px-8 py-3 rounded-pebble hover:bg-error-container hover:text-on-error-container transition-all flex items-center gap-2 text-sm relative z-10 bg-tertiary text-on-tertiary font-bold uppercase tracking-wide shadow-lg hover:scale-105 active:scale-95 duration-300 ease-spring">
          <Settings className="w-4 h-4" />
          <span>Adjust Search Filters</span>
        </button>
      </div>
    </div>
  );
}
