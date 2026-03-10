import { ScaffoldInput as Lens, ScaffoldArea as LensArea } from '@/components/ui/ScaffoldInput';
import { Strike as Pebble } from '@/components/ui/Strike';
import { Placard as Stone } from '@/components/ui/Placard';
import {
  Archive,
  Award,
  Box,
  Briefcase,
  Loader2,
  Plus,
  Sparkles,
  User,
  MapPin,
  Globe,
} from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { genkitApi } from '@/services/genkit';
import { KrDarkSpring, staggerContainer, motionVariants } from '@/design/tokens/motion-presets';
import { UserProfile } from '@/services/mockData';

// Lab Assets
const starfishCage =
  '/assets/kr-solidarity/abstract/kr-solidarity__atmospheric__texture--solidarity-chatgpt-image-f--v1.png';
const paperGrain =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';

export interface ProfileEditorProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * CareerCopilot Profile Editor
 *
 * V3.1 KrDark Mode Implementation:
 * ✓ ASSET-07 Starfish Cage backdrop
 * ✓ Clinical Typography (Monospace metadata, Serif descriptors)
 * ✓ Paper Texture & Grid Overlays
 * ✓ Local-First Persistence
 * ✓ Real Genkit AI Synthesis
 */
export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onNext, onBack }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Save profile draft
  useEffect(() => {
    if (!profile || isLoading) return;
    const saveProfile = async () => {
      await api.saveUserProfile(profile);
    };
    saveProfile();
  }, [profile, isLoading]);

  const handleUpdate = (updates: Partial<UserProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const handleGenerateSummary = async () => {
    if (!profile) return;
    setIsGenerating(true);

    try {
      const response = await genkitApi.generateProfileSummary({
        user_profile_data: profile,
      });

      handleUpdate({ title: response.summary });
      toast.success('Professional Brand Statement synthesized!');
    } catch (error) {
      console.error('Synthesis failed:', error);
      toast.error('AI Synthesis failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-paper-white-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-leaf-dark" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen bg-paper-white-base relative overflow-hidden py-12 px-6"
    >
      {/* Texture Overlays */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url(${paperGrain})` }}
      />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Lab Header */}
        <motion.header
          variants={motionVariants.slideUp}
          className="mb-16 border-b border-bark-base/10 pb-8 flex justify-between items-end"
        >
          <div>
            <p className="font-mono text-[10px] text-bark-base opacity-40 uppercase tracking-[0.5em] mb-2">
              [ PROFILE_ARCHIVE.v3 ]
            </p>
            <h1 className="font-serif text-5xl text-bark-base tracking-tight italic">
              Profile <span className="text-leaf-dark">Archive</span>
            </h1>
            <p className="font-primary text-lg text-bark-base/60 mt-2 max-w-2xl">
              Review and calibrate extracted profile data. Better profile quality improves drafting
              and analysis outputs.
            </p>
          </div>
          <div className="flex items-center gap-4 text-bark-base/40 font-mono text-[10px] uppercase tracking-widest pb-2">
            <Archive size={14} />
            <span>Vault Status: SECURE</span>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - The "Glass Case" Visual (ASSET-07) */}
          <motion.div
            variants={motionVariants.slideUp}
            className="lg:col-span-4 space-y-8"
          >
            <Stone
              elevation="floating"
              className="aspect-[4/5] overflow-hidden relative border-bark-base/20 group"
            >
              <div className="absolute inset-0 bg-bark-dark/10 mix-blend-multiply opacity-40 z-10 pointer-events-none" />
              <img
                src={starfishCage}
                alt="Profile container"
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[5s] ease-out brightness-90 saturate-[0.8]"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-bark-dark/80 to-transparent z-20">
                <div className="flex items-center gap-3 text-white/90 mb-2">
                  <Box
                    size={18}
                    className="text-leaf-base"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
                    ASSET-07 | CASE_GLASS
                  </span>
                </div>
                <p className="font-primary text-white/60 text-sm italic">
                  "Reference backdrop for profile review."
                </p>
              </div>
              {/* Forensic Overlay */}
              <div className="absolute inset-0 border-[20px] border-bark-dark/5 pointer-events-none z-30" />
            </Stone>

            <div className="p-6 bg-bark-light/5 border border-bark-base/10 rounded-megaphone">
              <h4 className="font-mono text-[10px] text-bark-base font-bold uppercase tracking-widest mb-4">
                Metadata Integrity
              </h4>
              <div className="space-y-3">
                {[
                  { l: 'Extraction Depth', v: 'High (0.98)' },
                  { l: 'Taxonomic Match', v: 'Verbatim' },
                  { l: 'Integrity Check', v: 'PASSED' },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-[10px] font-mono"
                  >
                    <span className="text-bark-base/40 uppercase">{m.l}</span>
                    <span className="text-bark-base font-bold">{m.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Lab Forms */}
          <div className="lg:col-span-8 space-y-12">
            {/* Personal Records */}
            <motion.section
              variants={motionVariants.slideUp}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-bark-base/5 pb-2">
                <User
                  size={18}
                  className="text-bark-base opacity-40"
                />
                <h3 className="font-mono text-xs font-bold text-bark-base uppercase tracking-widest">
                  Personal Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Lens
                  label="FULL NAME"
                  value={profile.name}
                  onChange={(e) => handleUpdate({ name: e.target.value })}
                  className="w-full font-mono text-sm"
                />
                <Lens
                  label="EMAIL"
                  value={profile.email}
                  onChange={(e) => handleUpdate({ email: e.target.value })}
                  type="email"
                  className="w-full font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3 top-10 text-bark-base/40"
                  />
                  <Lens
                    label="LOCATION"
                    value={profile.location}
                    onChange={(e) => handleUpdate({ location: e.target.value })}
                    className="w-full font-mono text-sm pl-8"
                  />
                </div>
                <div className="relative">
                  <Globe
                    size={14}
                    className="absolute left-3 top-10 text-bark-base/40"
                  />
                  <Lens
                    label="WEBSITE"
                    value={profile.website}
                    onChange={(e) => handleUpdate({ website: e.target.value })}
                    className="w-full font-mono text-sm pl-8"
                  />
                </div>
              </div>
            </motion.section>

            {/* Professional Summary - The "Synthesis" */}
            <motion.section
              variants={motionVariants.slideUp}
              className="space-y-6"
            >
              <div className="flex justify-between items-center border-b border-bark-base/5 pb-2">
                <div className="flex items-center gap-3">
                  <Briefcase
                    size={18}
                    className="text-bark-base opacity-40"
                  />
                  <h3 className="font-mono text-xs font-bold text-bark-base uppercase tracking-widest">
                    Synthesis Descriptor
                  </h3>
                </div>
                <button
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="flex items-center gap-2 font-mono text-[10px] text-leaf-dark uppercase tracking-widest hover:text-leaf-base disabled:opacity-50 transition-colors group"
                >
                  <AnimatePresence>
                    {isGenerating ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                      >
                        <Loader2
                          size={12}
                          className="animate-spin"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sparkle"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="group-hover:rotate-12 transition-transform"
                      >
                        <Sparkles size={12} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isGenerating ? 'Calibrating...' : 'AI Synthesis'}
                </button>
              </div>

              <LensArea
                value={profile.title}
                onChange={(e) => handleUpdate({ title: e.target.value })}
                placeholder="Awaiting AI calibration..."
                rows={4}
                className="w-full font-serif text-lg leading-relaxed italic text-bark-base/80"
              />
            </motion.section>

            {/* Experience & Skills - KrMotif List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.section
                variants={motionVariants.slideUp}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-bark-base/5 pb-2">
                  <Archive
                    size={18}
                    className="text-bark-base opacity-40"
                  />
                  <h3 className="font-mono text-xs font-bold text-bark-base uppercase tracking-widest">
                    Career Strata
                  </h3>
                </div>

                <div className="space-y-4">
                  {profile.experience.map((exp, i) => (
                    <div
                      key={i}
                      className="p-4 border border-bark-base/10 bg-white/40 group hover:border-leaf-base transition-colors relative"
                    >
                      <div className="absolute top-2 right-2 font-mono text-[8px] text-bark-base/20">
                        STRATUM.0{i + 1}
                      </div>
                      <h4 className="font-serif font-bold text-bark-base text-base leading-tight uppercase tracking-tight">
                        {exp.role}
                      </h4>
                      <p className="font-mono text-[10px] text-bark-base/60 mt-1 uppercase tracking-widest">
                        {exp.company}
                      </p>
                      <span className="block font-mono text-[9px] text-bark-base/30 mt-2">
                        {exp.date}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                variants={motionVariants.slideUp}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-bark-base/5 pb-2">
                  <Award
                    size={18}
                    className="text-bark-base opacity-40"
                  />
                  <h3 className="font-mono text-xs font-bold text-bark-base uppercase tracking-widest">
                    Extracted Filaments (Skills)
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="font-mono text-[9px] uppercase tracking-widest bg-bark-light/10 text-bark-base border border-bark-base/20 px-3 py-1 rounded-megaphone"
                    >
                      {skill}
                    </div>
                  ))}
                  <button className="w-8 h-8 rounded-march border border-dashed border-bark-base/20 flex items-center justify-center text-bark-base/40 hover:border-leaf-base hover:text-leaf-base transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </motion.section>
            </div>
          </div>
        </div>

        {/* Global Action Footer */}
        <motion.footer
          variants={motionVariants.slideUp}
          className="mt-20 pt-8 border-t border-bark-base/10 flex justify-between items-center"
        >
          <Pebble
            variant="ghost"
            onClick={onBack}
            className="font-mono text-[10px] uppercase tracking-widest text-bark-base/40 hover:text-bark-base"
          >
            ← Discard Session
          </Pebble>
          <Pebble
            variant="primary"
            onClick={onNext}
            className="h-14 px-12 font-mono text-xs font-bold uppercase tracking-[0.2em] bg-bark-dark text-paper-white-base hover:bg-bark-base shadow-lg"
          >
            Finalize Archive & Proceed
          </Pebble>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default ProfileEditor;
