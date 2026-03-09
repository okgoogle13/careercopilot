import React from 'react';
import { motion } from 'framer-motion';


export interface ProfileHeaderProps {
  /** User display name */
  name: string;
  /** Short biography / status */
  bio: string;
  /** URL for the user's portrait/avatar */
  avatarUrl?: string;
  /** Semantic identity markers */
  identityTags: string[];
  /** Optional land acknowledgment */
  landAcknowledgment?: string;
}

/**
 * ProfileHeader
 *
 * High-impact identity header for Kerala Rage.
 * Features screenprint-textured avatars and high-contrast typography.
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  bio,
  avatarUrl,
  identityTags,
  landAcknowledgment = 'Wurundjeri Woi-wurrung Country',
}) => {
  return (
    <header
      className="p-12 bg-charcoal-100 border-b border-blueprint-grey/20 relative overflow-hidden"
      role="banner"
    >
      {/* Solidarity Watermark */}
      <div className="absolute top-4 right-8 text-[10px] font-jetbrains-mono text-blueprint-grey/40 uppercase tracking-[0.4em]">
        Acknowledging: {landAcknowledgment}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Grayscale Screenprint Portrait */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-48 h-48 rounded-megaphone overflow-hidden border-2 border-blueprint-grey/30 bg-charcoal-200"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover grayscale opacity-90 mix-blend-luminosity"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-charcoal font-solidarity text-ink-gold text-4xl">
              {name.charAt(0)}
            </div>
          )}
          {/* Grain texture overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('/assets/kr-solidarity/texture/kr-solidarity__atmospheric__texture--asphalt-grain--v2.png')] mix-blend-overlay" />
        </motion.div>

        <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-[84px] leading-none font-solidarity-900 text-ink-gold tracking-tighter uppercase"
          >
            {name}
          </motion.h1>

          <p className="text-2xl font-medium text-signal-green italic tracking-tight">{bio}</p>

          <div className="flex gap-4 flex-wrap mt-4 justify-center md:justify-start">
            {identityTags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.1, skewX: -12 }}
                className="px-6 py-2 bg-signal-green/10 text-signal-green border border-signal-green/30 text-xs font-bold uppercase tracking-widest rounded-seed cursor-default"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
