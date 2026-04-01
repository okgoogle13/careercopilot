import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Archive,
  Briefcase,
  Award,
  Fingerprint,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Placard, Strike, StatusBadge } from '@/components/ui';
import { Scaffold } from '@/components/archetypes';
import { ProfileHeader } from '@/components/ProfileHeader';
import { EvidenceUploader } from '@/features/analysis/components/EvidenceUploader';
import ResumeUploader from '@/features/profile/components/ResumeUploader';
import { VoiceProfileManagementSection } from '@/features/profile/components/VoiceProfileManagementSection';

// Assets
const starfishCage =
  '/assets/kr-solidarity/abstract/kr-solidarity__atmospheric__texture--solidarity-chatgpt-image-f--v1.png';
const wallpaper =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';

/**
 * ProfilePage (The "Career DNA") - KR Solidarity v7.0 Gold Standard.
 *
 * Consolidates "Direct Action" (Builder) and "Reflection" (Dossier) into a single
 * high-fidelity canonical surface to eliminate architectural fluff.
 */
export const ProfilePage: React.FC = () => {
  const [careerData, setCareerData] = useState<any>(null);
  const [showBuilder, setShowBuilder] = useState(true);

  return (
    <div className="min-h-screen bg-asphalt-black relative overflow-hidden pb-12 w-full">
      {/* Background Layer */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none mix-blend-soft-light"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Hero Banner Section */}
      <div className="h-64 md:h-80 relative overflow-hidden">
        <img
          src={starfishCage}
          alt="Dossier context"
          className="w-full h-full object-cover brightness-50 contrast-125 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-asphalt-black via-asphalt-black/40 to-transparent" />

        {/* Subtle Motion Bloom */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-ink-gold/10 blur-3xl pointer-events-none"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative -mt-32 z-10 space-y-12">
        {/* Profile Identity Header */}
        <ProfileHeader
          name="Nishant Dougall"
          bio="Senior Full Stack Engineer / Metadata Architect"
          identityTags={
            careerData?.skills?.slice(0, 3) || ['React.tsx', 'Neural.sys', 'Archival.Design']
          }
          landAcknowledgment="Wurundjeri Woi-wurrung Country"
        />

        {/* SECTION 1: THE BUILDER (Direct Action) */}
        <section className="space-y-6">
          <button
            onClick={() => setShowBuilder(!showBuilder)}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-march bg-solidarity-red/20 flex items-center justify-center group-hover:bg-solidarity-red/40 transition-colors">
              <Zap className="w-5 h-5 text-solidarity-red" />
            </div>
            <h2 className="font-display text-2xl font-bold text-paper-white uppercase tracking-tighter">
              Profile <span className="text-solidarity-red">Builder</span>
            </h2>
            {showBuilder ? (
              <ChevronUp className="w-4 h-4 text-concrete-grey" />
            ) : (
              <ChevronDown className="w-4 h-4 text-concrete-grey" />
            )}
          </button>

          <AnimatePresence>
            {showBuilder && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                  <Placard
                    elevation="raised"
                    className="p-8 space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-ink-gold" />
                      <h3 className="font-mono text-[10px] font-bold text-paper-white uppercase tracking-[0.3em]">
                        Primary DNA Source
                      </h3>
                    </div>
                    <ResumeUploader onUploadSuccess={setCareerData} />
                  </Placard>

                  <Placard
                    elevation="floating"
                    className="p-8 border-concrete-grey/10"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Archive className="w-5 h-5 text-solidarity-red" />
                      <h3 className="font-mono text-[10px] font-bold text-paper-white uppercase tracking-[0.3em]">
                        Tactical Artifacts
                      </h3>
                    </div>
                    <EvidenceUploader />
                  </Placard>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* SECTION 2: THE DOSSIER (Reflection) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-concrete-grey/10">
          {/* Main Column - Career Strata */}
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-8">
              <div className="flex items-baseline gap-4">
                <h2 className="font-display text-3xl font-bold text-paper-white uppercase tracking-tight flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-ink-gold" />
                  STRATUM <span className="text-ink-gold">CHRONOLOGY</span>
                </h2>
                <div className="flex-1 h-px bg-concrete-grey/10" />
              </div>

              <div className="space-y-4">
                {careerData?.entries?.length > 0 ? (
                  careerData.entries.map((entry: any, index: number) => (
                    <TimelineItem
                      key={index}
                      role={entry.title}
                      company={entry.employer}
                      date={
                        entry.start_date
                          ? `${entry.start_date} - ${entry.end_date || 'Present'}`
                          : 'Date Unknown'
                      }
                      description={entry.description}
                    />
                  ))
                ) : (
                  <>
                    <TimelineItem
                      role="Senior Full Stack Engineer"
                      company="Tech Corp Inc."
                      date="2022 - PRESENT"
                      description="Leading the archive migration to high-fidelity synthesis models. Improved extraction throughput by 40%."
                    />
                    <TimelineItem
                      role="Metadata Architect"
                      company="StartUp Studio"
                      date="2020 - 2022"
                      description="Designed core taxonomies for career data ingestion. Managed a team of 4 application quality auditors."
                    />
                  </>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column - Traits & Filaments */}
          <div className="lg:col-span-4 space-y-8">
            <Placard
              elevation="floating"
              className="p-8 border-concrete-grey/10 bg-asphalt-black/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Fingerprint className="w-5 h-5 text-ink-gold" />
                <h3 className="font-mono text-[10px] font-bold text-paper-white uppercase tracking-[0.3em]">
                  Extracted Skills
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  careerData?.skills || [
                    'React.tsx',
                    'TypeScript',
                    'Neural.sys',
                    'Tailwind',
                    'GraphQL',
                    'Quality.Audit',
                    'Python',
                    'Archival.Design',
                  ]
                ).map((skill: string) => (
                  <div
                    key={skill}
                    className="bg-concrete-grey/5 text-concrete-grey border border-concrete-grey/20 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-march"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </Placard>

            <Placard
              elevation="floating"
              className="p-8 border-concrete-grey/10 bg-asphalt-black/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-ink-gold" />
                <h3 className="font-mono text-[10px] font-bold text-paper-white uppercase tracking-[0.3em]">
                  Validation Badges
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Badge
                  emoji="🚀"
                  title="Early Adopter"
                />
                <Badge
                  emoji="💻"
                  title="Systems Architect"
                />
                <Badge
                  emoji="🔍"
                  title="Forensic Auditor"
                />
                <Badge
                  emoji="🎓"
                  title="Scientific Lead"
                />
                <Badge
                  emoji="🤝"
                  title="Collaborative Hub"
                />
                <Badge
                  emoji="🏺"
                  title="Archivist"
                />
              </div>
            </Placard>

            <VoiceProfileManagementSection />
          </div>
        </div>
      </div>
    </div>
  );
};

function TimelineItem({
  role,
  company,
  date,
  description,
}: {
  role: string;
  company: string;
  date: string;
  description?: string;
}) {
  return (
    <Placard
      elevation="flat"
      className="p-6 border-concrete-grey/5 bg-white/5 hover:border-ink-gold/20 transition-all group overflow-hidden relative"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-ink-gold opacity-20 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-display text-xl font-bold text-paper-white uppercase tracking-tight">
          {role}
        </h3>
        <span className="font-mono text-[9px] text-ink-gold opacity-60 tracking-widest uppercase">
          {date}
        </span>
      </div>
      <p className="font-mono text-[10px] text-ink-gold uppercase tracking-[0.2em] mb-4 opacity-80">
        {company}
      </p>
      {description && (
        <p className="font-primary text-sm text-concrete-grey italic opacity-70 leading-relaxed">
          {description}
        </p>
      )}
    </Placard>
  );
}

function Badge({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div
      className="aspect-square rounded-march bg-bark-light/5 border border-concrete-grey/10 flex items-center justify-center text-2xl hover:bg-ink-gold/10 hover:border-ink-gold/30 transition-all cursor-help relative group"
      title={title}
    >
      {emoji}
      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-march bg-ink-gold opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
