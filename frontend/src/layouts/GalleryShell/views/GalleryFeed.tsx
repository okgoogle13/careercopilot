import { Pebble } from '@/components/ui';
import { GlassLeafCard } from '@/features/gallery/GlassLeafCard';
import { useGalleryData } from '@/hooks/useGalleryData';
import { motion } from 'framer-motion';
import { Briefcase, Sparkles, TrendingUp } from 'lucide-react';
import React from 'react';

export const GalleryFeed: React.FC = () => {
  const { feed, isLoading } = useGalleryData();

  const getIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Briefcase className="w-5 h-5" />;
      case 'insight':
        return <Sparkles className="w-5 h-5" />;
      case 'alert':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="relative z-20 w-full h-full p-8 max-w-5xl mx-auto mt-10 overflow-y-auto pb-20 no-scrollbar">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-baseline justify-between mb-8">
          <div className="flex items-baseline gap-4">
            <h2 className="text-bloom-ultra text-3xl">Opportunity Feed</h2>
            <span className="text-curator-annotation hidden md:inline-block">
              → explore your future
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-gallery-alive-green animate-pulse" />
            <div className="text-secondary-flannel-dim font-annotation text-xs tracking-widest">
              LIVE FEED
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading
            ? /* Skeletons */
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 bg-surface-asphalt-black-light border border-secondary-flannel-dim/20 rounded-[var(--radius-stone)] animate-pulse"
                />
              ))
            : feed.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <GlassLeafCard className="flex items-start gap-6 group">
                    {/* Icon / Avatar Area */}
                    <div className="shrink-0 relative">
                      <div className="w-12 h-12 rounded-full bg-surface-gallery-glass-medium border border-white/10 flex items-center justify-center text-wattle-gold">
                        {getIcon(item.type)}
                      </div>
                      {/* Decorative connect line */}
                      {idx !== feed.length - 1 && (
                        <div className="absolute top-12 left-6 w-px h-24 bg-gradient-to-b from-primary-wattle-gold/30 to-transparent -z-10" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-bloom-gallery text-xl transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm font-annotation text-secondary-concrete-grey mt-1">
                            {item.timestamp} • {item.meta?.company || 'System Insight'}
                          </p>
                        </div>
                        {item.meta?.matchScore && (
                          <div className="text-right">
                            <div className="text-2xl font-proclamation text-wattle-gold shadow-wattle-offset">
                              {item.meta.matchScore}%
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-secondary-flannel-dim">
                              Match
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="mt-3 text-secondary-flannel-dim font-body leading-relaxed max-w-2xl">
                        {item.description}
                      </p>

                      <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Pebble
                          variant="secondary"
                          size="sm"
                        >
                          Dismiss
                        </Pebble>
                        <Pebble
                          variant="primary"
                          size="sm"
                        >
                          Investigate
                        </Pebble>
                      </div>
                    </div>

                    {/* Decorative Specimen Asset Injection (Randomized for demo) */}
                    {idx % 2 === 0 && (
                      <div className="absolute -right-8 -top-8 w-32 h-32 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700 mix-blend-overlay">
                        <img
                          src="/src/assets/specimens/leaf-fern.png"
                          alt=""
                          className="w-full h-full object-contain transform rotate-12"
                        />
                      </div>
                    )}
                    {idx % 2 !== 0 && (
                      <div className="absolute -right-4 bottom-4 w-24 h-24 opacity-5 pointer-events-none group-hover:opacity-15 transition-opacity duration-700 mix-blend-overlay">
                        <img
                          src="/src/assets/specimens/beetle-scarab.png"
                          alt=""
                          className="w-full h-full object-contain transform -rotate-12"
                        />
                      </div>
                    )}
                  </GlassLeafCard>
                </motion.div>
              ))}
        </div>
      </motion.div>
    </div>
  );
};
