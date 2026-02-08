import { Pebble, StatusBadge, Stone } from '@/components/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Compass, ExternalLink, MapPin, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { API_ENDPOINTS } from '../../config/api';

// Assets
import sentrykr-shiva from '../../assets/kr-motifs/sentry_kr-shiva.png';
import wallpaper from '../../assets/textures/wallpaper.png';

interface ScoutResponse {
  found_links: string[];
  message: string;
}

/**
 * The Sentry Lookout (Opportunity Feed)
 *
 * V3.1 kr-dark Mode implementation.
 * An atmospheric lookout point where the "kr-shiva" (autonomous agent)
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
        'The Sentry reports an error in the transmission. Ensure the kr-dark backend is active.'
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

      {/* Sentry Mascot: The kr-shiva Lookout */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none z-0 overflow-hidden opacity-30 select-none font-bloom">
        <motion.img
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 0.3 }}
          src={sentrykr-shiva}
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
        <Stone
          mode="kr-dark"
          elevation="raised"
          className="mb-12 p-8 border-concrete-grey/10 bg-asphalt-black/40 backdrop-blur-md"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            <div className="flex-1 space-y-3 w-full">
              <label className="text-xs font-annotation text-wattle-gold uppercase tracking-[0.3em] flex items-center gap-2">
                <Compass className="w-3 h-3" /> Target Trajectory
              </label>
              <div className="relative">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-bark-light/5 border-b border-concrete-grey/20 font-bloom text-xl text-paper-white p-3 focus:border-wattle-gold outline-none transition-all placeholder:text-concrete-grey/30"
                  placeholder="e.g. SOFTWARE ARCHITECT"
                />
              </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <label className="text-xs font-annotation text-wattle-gold uppercase tracking-[0.3em] flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Geographical Node
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-bark-light/5 border-b border-concrete-grey/20 font-bloom text-xl text-paper-white p-3 focus:border-wattle-gold outline-none transition-all placeholder:text-concrete-grey/30"
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
        </Stone>

        {/* Scouting Intelligence: The Feed */}
        <div className="space-y-6">
          <AnimatePresence>
            {scoutMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 text-[10px] font-mono text-concrete-grey border-l-2 border-wattle-gold pl-4 py-2 bg-wattle-gold/5"
              >
                <div className="w-2 h-2 rounded-full bg-wattle-gold animate-pulse" />
                <span className="uppercase tracking-[0.2em]">
                  {'>'} SCOUT DISPATCH: {scoutMessage}
                </span>
              </motion.div>
            )}

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Stone
                      mode="kr-dark"
                      elevation="floating"
                      className="p-8 group hover:border-wattle-gold/40 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <Briefcase className="w-8 h-8 text-wattle-gold" />
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <StatusBadge
                            label="HIGH MATCH"
                            variant="success"
                            showDot
                          />
                          <span className="font-annotation text-[9px] text-concrete-grey uppercase tracking-[0.2em]">
                            NODE_0{index + 1}
                          </span>
                        </div>

                        <h3 className="font-bloom text-2xl font-black text-paper-white uppercase leading-tight group-hover:text-wattle-gold transition-colors">
                          Opportunity Match Potential
                        </h3>

                        <div className="flex items-center gap-2 text-xs font-mono text-concrete-grey/60 break-all bg-asphalt-black/40 p-3 rounded border border-concrete-grey/10">
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-wattle-gold truncate"
                          >
                            {link}
                          </a>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <div className="text-[9px] bg-bark-light/10 text-concrete-grey px-2 py-1 border border-concrete-grey/10 uppercase tracking-widest">
                            Found via Search
                          </div>
                          <div className="text-[9px] bg-wattle-gold/10 text-wattle-gold px-2 py-1 border border-wattle-gold/20 uppercase tracking-widest">
                            Analysis Recommended
                          </div>
                        </div>
                      </div>
                    </Stone>
                  </motion.div>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-32 opacity-20 flex flex-col items-center">
                  <Compass className="w-24 h-24 mb-6 text-concrete-grey animate-pulse" />
                  <p className="font-bloom text-2xl text-paper-white uppercase tracking-tighter">
                    Lookout Deck Clear
                  </p>
                  <p className="font-annotation text-xs text-concrete-grey uppercase tracking-[0.4em] mt-2">
                    Awaiting Target Dispatches
                  </p>
                </div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
