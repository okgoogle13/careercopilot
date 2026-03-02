import { motion } from 'framer-motion';
import React from 'react';
import { KeralaRageButton } from '../../../components/ui/KeralaRageButton';

export const GalleryLanding: React.FC = () => {
  return (
    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-8 relative"
        >
          {/* The Sentry: Kookaburra Mascot */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-primary-specimen-night/30 max-w-sm mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-700">
            <img
              src="/src/assets/specimens/the-sentry.png"
              alt="The Sentry - Kookaburra Mascot"
              className="w-full h-auto object-cover"
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-2xl" />
          </div>
        </motion.div>

        <span className="font-annotation text-wattle-gold tracking-[0.2em] text-sm uppercase mb-4 block">
          
        </span>
        <h1 className="font-proclamation text-6xl md:text-8xl text-parchment mb-6 leading-tight">
          Victorian
          <br />
          Naturalist
        </h1>
        <p className="font-field-note text-secondary-flannel-flower text-lg max-w-xl mx-auto mb-10 opacity-80 leading-relaxed">
          A digital cabinet of curiosities. Explore the gallery mode where organic imperfection
          meets botanical precision.
        </p>

        <div className="flex justify-center gap-4">
          <KeralaRageButton
            variant="primary"
            size="lg"
          >
            Enter Collection
          </KeralaRageButton>
        </div>
      </motion.div>
    </div>
  );
};
