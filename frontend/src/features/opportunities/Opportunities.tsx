import { useState } from 'react';
import { Settings, Search, Briefcase, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { API_ENDPOINTS } from '../../config/api';

interface ScoutResponse {
  found_links: string[];
  message: string;
}

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
      setScoutMessage('Failed to scout jobs. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`;

  return (
    <div className="p-6 md:p-12 max-w-7xl animate-in fade-in zoom-in-95 duration-500 ease-spring">
      <PageHeader
        title="Job Scout"
        highlightedWord="Opportunities"
        description="Autonomous agent finding hidden jobs across the web."
      />

      {/* Scout Controls */}
      <div
        className="mb-8 rounded-tech p-6 bg-surface-container relative overflow-hidden border border-outline-variant shadow-elevation-1"
        style={{ backgroundImage: noiseOverlay }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-label-medium text-on-surface-variant font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Role / Keyword
            </label>
            <input
              type="search"
              name="jobSearch"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-surface-container-high border-outline border rounded-md p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="e.g. Software Engineer, Case Manager"
              aria-label="Job search query"
            />
          </div>

          <div className="flex-1 space-y-2 w-full">
            <label className="text-label-medium text-on-surface-variant font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-surface-container-high border-outline border rounded-md p-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="e.g. Melbourne, Australia"
            />
          </div>

          <button
            onClick={handleScout}
            disabled={isLoading}
            className={`
              h-[50px] px-8 rounded-full font-bold uppercase tracking-wide shadow-lg transition-all flex items-center gap-2
              ${isLoading ? 'bg-surface-disabled text-on-surface-disabled cursor-not-allowed' : 'bg-primary text-on-primary hover:scale-105 active:scale-95'}
            `}
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" /> Scouting...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Start Scout
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div className="space-y-4">
        {scoutMessage && (
          <p className="text-body-medium text-on-surface-variant mb-4 font-mono">
            {'>'} {scoutMessage}
          </p>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {results.map((link, index) => (
              <div
                key={index}
                className="p-6 bg-surface-container-low rounded-pebble border border-outline-variant hover:border-primary/50 transition-colors group relative overflow-hidden shadow-elevation-1 hover:shadow-elevation-2"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-title-medium font-bold text-on-surface truncate mb-1">
                  Job Match #{index + 1}
                </h3>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-body-medium hover:underline flex items-center gap-2 break-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  {link}
                </a>
                <div className="mt-3 flex gap-2">
                  <span className="text-label-small bg-surface-container-high px-2 py-1 rounded text-on-surface-variant">
                    Detected via Search
                  </span>
                  <span className="text-label-small bg-tertiary-container px-2 py-1 rounded text-on-tertiary-container">
                    Analysis Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-20 opacity-50">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-outline" />
              <p className="text-headline-small text-outline">Ready to find your next role.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
