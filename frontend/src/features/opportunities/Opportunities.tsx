import { Pebble, Placard } from '@/components/ui';
import { JobList } from '@/components/JobList';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Compass, ExternalLink, MapPin, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { API_ENDPOINTS } from '@/config/api';

// Assets
const sentryKrShiva =
  '/assets/kr-solidarity/abstract/kr-solidarity__atmospheric__texture--solidarity-chatgpt-image-f--v1.png';
const wallpaper =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';

interface ScoutResponse {
  found_links: string[];
  message: string;
}

/**
 * The Sentry Lookout (Opportunity Feed)
 *
 * V3.1 KrDark Mode implementation.
 * An atmospheric lookout point where the "KrShiva" (autonomous agent)
 * reports back with found opportunities.
 */
export function Opportunities() {
  const [query, setQuery] = useState('Social Worker');
  const [location, setLocation] = useState('Melbourne');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [scoutMessage, setScoutMessage] = useState('');

  const handleScout = async () => {
    setIsLoading(true);
    setScoutMessage('');
    setResults([]);

    try {
      const response = await fetch(API_ENDPOINTS.jobScoutSearch, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, location }),
      });

      if (!response.ok) {
        throw new Error('Scout failed');
      }

      const data: ScoutResponse = await response.json();
      setResults(data.found_links);
      setScoutMessage(data.message);
    } catch (error) {
      console.error(error);
      setScoutMessage(
        'The Sentry reports an error in the transmission. Ensure the KrDark backend is active.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-asphalt-black relative overflow-hidden pb-12 w-full">
      {/* Visual Stagecraft: Atmospheric Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${wallpaper})`, backgroundSize: '400px' }}
      />

      {/* Sentry Mascot: The KrShiva Lookout */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none z-0 overflow-hidden opacity-30 select-none">
        <motion.img
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 0.3 }}
          src={sentryKrShiva}
          alt=""
          className="h-full w-full object-contain object-right-top grayscale brightness-125"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-asphalt-black" />
      </div>

      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto">
        <PageHeader
          title="The Sentry"
          highlightedWord="Lookout"
          description="High-altitude reconnaissance for hidden career paths."
        />

        {/* Lookout Controls: The Search Deck */}
        <Placard className="mb-12 p-8 border-concrete-grey/10 bg-asphalt-black/40 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            <div className="flex-1 space-y-3 w-full">
              <label className="text-xs font-mono text-ink-gold uppercase tracking-[0.3em] flex items-center gap-2">
                <Compass className="w-3 h-3" /> Target Trajectory
              </label>
              <div className="relative">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-bark-light/5 border-b border-concrete-grey/20 font-primary text-xl text-paper-white p-3 focus:border-ink-gold outline-none transition-all placeholder:text-concrete-grey/30"
                  placeholder="e.g. SOFTWARE ARCHITECT"
                />
              </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <label className="text-xs font-mono text-ink-gold uppercase tracking-[0.3em] flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Geographical Node
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-bark-light/5 border-b border-concrete-grey/20 font-primary text-xl text-paper-white p-3 focus:border-ink-gold outline-none transition-all placeholder:text-concrete-grey/30"
                placeholder="e.g. MELBOURNE, VIC"
              />
            </div>

            <Pebble
              onClick={handleScout}
              disabled={isLoading}
              variant="primary"
              size="lg"
              className="px-12 font-bold uppercase tracking-widest min-w-[240px]"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" /> DISPATCHING...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" /> BEGIN SCOUT
                </>
              )}
            </Pebble>
          </div>
        </Placard>

        {/* Scouting Intelligence: The Feed */}
        <div className="space-y-6">
          <AnimatePresence>
            {scoutMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 text-[10px] font-mono text-concrete-grey border-l-2 border-ink-gold pl-4 py-2 bg-ink-gold/5"
              >
                <div className="w-2 h-2 rounded-march bg-ink-gold animate-pulse" />
                <span className="uppercase tracking-[0.2em]">
                  {'>'} SCOUT DISPATCH: {scoutMessage}
                </span>
              </motion.div>
            )}

            {results.length > 0 ? (
              <JobList
                jobs={results.map((link, index) => ({
                  id: `node-0${index + 1}`,
                  title: 'Opportunity Match Potential',
                  location: 'Found via Search',
                  salary: 'Analysis Recommended',
                  tags: ['High Match', 'Scout Dispatch'],
                }))}
                onJobSelect={(id) => {
                  const index = parseInt(id.replace('node-0', '')) - 1;
                  window.open(results[index], '_blank');
                }}
                isLoading={isLoading}
              />
            ) : (
              !isLoading && (
                <div className="space-y-6">
                  <div className="text-center py-12 opacity-70 flex flex-col items-center">
                    <Compass className="w-24 h-24 mb-6 text-concrete-grey animate-pulse" />
                    <p className="font-display text-2xl text-paper-white uppercase tracking-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]">
                      Lookout Deck Clear
                    </p>
                    <p className="font-mono text-xs text-concrete-grey-light uppercase tracking-[0.4em] mt-2">
                      Awaiting Target Dispatches
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Placard className="p-6 bg-ink-gold/10 border border-ink-gold/25 shadow-glow-gold">
                      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-gold mb-3">
                        Dispatch Prep
                      </p>
                      <p className="font-primary text-concrete-grey">
                        Refine trajectory keywords with role seniority, service domain, and contract
                        type for stronger scout precision.
                      </p>
                    </Placard>

                    <Placard className="p-6 bg-asphalt-black/30 border border-concrete-grey/15">
                      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-gold mb-3">
                        Signal Coverage
                      </p>
                      <p className="font-primary text-concrete-grey">
                        Keep location broad first, then narrow to metro nodes after initial
                        high-match results appear.
                      </p>
                    </Placard>

                    <Placard className="p-6 bg-asphalt-black/30 border border-concrete-grey/15">
                      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-gold mb-3">
                        Tactical Next Step
                      </p>
                      <p className="font-primary text-concrete-grey">
                        Run KSC and cover-letter generators against top 3 matches to keep
                        application velocity high.
                      </p>
                    </Placard>
                  </div>
                </div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
